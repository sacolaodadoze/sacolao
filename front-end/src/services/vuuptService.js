import { use, useContext } from "react";
import { ur } from "zod/v4/locales";
import { apiFetch } from "../api/apiFetch.js";
import React from "react";
import { LANG } from "../assets/constants/languages.js";
import Swal from "sweetalert2";

const normalizeAddress = (address) => {
  if (!address) return "";

  return address
    .toLowerCase()
    .normalize("NFD") // elimina acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\bav\b/g, "avenida")
    .replace(/\br\b/g, "rua")
    .replace(/\bdr\b/g, "doutor")
    .replace(/[^a-z0-9\s]/g, "") // elimina símbolos
    .replace(/\s+/g, " ") // espacios múltiples → uno
    .trim();
};

const hasAddressChanged = (sistema, complementSis, vuupt, complementVuupt) => {
  const addressChanged = normalizeAddress(sistema) !== normalizeAddress(vuupt);

  const complementChanged =
    normalizeAddress(complementSis) !== normalizeAddress(complementVuupt);
  console.log("Endereços sistema:", sistema, "Endereços vuupt:", vuupt);
  return addressChanged || complementChanged;
};

export const insertVuupt = async (params, showNotification) => {
  console.log("Vuupt params:", params);
  Swal.fire({
    toast: true,
    position: "top-end",
    title: LANG.VUUPT.INSERTING,
    didOpen: () => {
      Swal.showLoading();
    },
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  //Obeter longitude y latitude  do cliente no Vuupt
  try {
    const response = await apiFetch(
      `/api/data?customer_code=${params.customer_code}`,
    );
    console.log("Get geopoint", response);
    let data;

    //Insertar si no esta o cliente
    if (/* data.data.length === 0 ||  */ !response.ok) {
      console.log("Insertar cliente,response:", response.ok);

      const res = await apiFetch("/api/vuupt/customers", {
        method: "POST",
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Erro ao inserir cliente no Vuupt",
        );
      }
      const resultAddCustomer = await res.json();
      console.log("Cliente criado no Vuupt:", resultAddCustomer.customer);
      data = resultAddCustomer.customer;

      /////////////////
    } else {
      const responseData = await response.json();
      console.log("Cliente por codigo:", responseData.data);

      //Comprobar endereço
      let sistema = params.address;
      let vuupt = responseData.data[0].address;
      const changed = hasAddressChanged(
        sistema,
        params.complement,
        vuupt,
        responseData.data[0].address_complement,
      );

      console.log("Si, cambió:", changed);
      if (changed) {
        const windVuupt = await Swal.fire({
          title: LANG.VUUPT.CHANGEADDRESS,
          text: LANG.VUUPT.TEXTADDR,
          icon: "info",
          showCancelButton: true,
          confirmButtonText: LANG.VUUPT.CONFIRM,
          cancelButtonText: LANG.GLOBAL.CANCEL,
          allowOutsideClick: false,
        });
        if (windVuupt.isConfirmed) {
          //Update endereço no Vuupt
          /* const res = await apiFetch(
            `/api/vuupt/customers/${responseData.data[0].id}`,
            {
              method: "PUT",
              body: JSON.stringify(params),
            },
          );
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              errorData.message || "Error ao actualizar cliente no Vuupt",
            );
          }
          const responseUpdate = await res.json();
          console.log("Cliente update:", responseUpdate);
          data = responseUpdate.customer; */
          data = responseData.data[0];
          Swal.fire({
            toast: true,
            position: "top-end",
            title: LANG.VUUPT.INSERTING,
            didOpen: () => {
              Swal.showLoading();
            },
            showConfirmButton: false,
            allowOutsideClick: false,
          });
        }
        ///////////////////
      } else {
        data = responseData.data[0];
      }
    }

    console.log("Datos a insertar en Vuupt:", data);

    //Insertar pedido no Vuupt
    const bodyData = { ...params, ...(data || {}) };

    const insert = await apiFetch("/api/insert", {
      method: "POST",
      body: JSON.stringify(bodyData),
    });

    if (!insert.ok) {
      const errorData = await insert.json();
      throw new Error(errorData.message || LANG.VUUPT.CREATEDFAIL);
    }

    const insertResult = await insert.json();
    console.log("Pedido insertado en Vuupt:", insertResult);
    Swal.close();

    showNotification(LANG.VUUPT.CREATEDSUCCESS, "success");
  } catch (error) {
    showNotification(error.message || LANG.VUUPT.CREATEDFAIL, "error");
    console.error("Error en insertVuupt:", error.message);
    //throw error; // Re-lanzar el error para que el componente pueda manejarlo
  }
};
