import { use, useContext } from "react";
import { ur } from "zod/v4/locales";
import { apiFetch } from "../api/apiFetch.js";
import React from "react";
import { LANG } from "../assets/constants/languages.js";
import Swal from "sweetalert2";

export const insertVuupt = async (params, showNotification) => {
  console.log("Vuupt params:", params);
  Swal.fire({
    toast: true,
    position: "top-end",
    title:LANG.VUUPT.INSERTING,
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
    //si no esta el cliente
    if (/* data.data.length === 0 ||  */ !response.ok) {
      console.log("Response", response.ok);

      const res = await apiFetch("/api/vuupt/customers", {
        method: "POST",
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error(LANG.VUUPT.CUSTOMERCREATEDFAIL);
      }
      const resultAddCustomer = await res.json();
      console.log("Cliente criado no Vuupt:", resultAddCustomer.customer);
      data = resultAddCustomer.customer;
    } else {
      const responseData = await response.json();
      console.log(
        "Cliente por codigo:",
        responseData,
        "Longitud",
        responseData.data.length,
      );
      data = responseData.data[0];
    }

    console.log("Datos a insertar en Vuupt:", data);

    //Insertar pedido no Vuupt
    const bodyData = { ...(data || {}), ...params };

    const insert = await apiFetch("/api/insert", {
      method: "POST",
      body: JSON.stringify(bodyData),
    });

    console.log("Inserción en Vuupt:", insert);
    if (!insert.ok) {
      throw new Error(LANG.VUUPT.CREATEDFAIL);
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
