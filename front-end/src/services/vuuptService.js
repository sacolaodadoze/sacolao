import { use, useContext } from "react";
import { ur } from "zod/v4/locales";
import { apiFetch } from "../api/apiFetch.js";
import React from "react";
import { LANG } from "../assets/constants/languages.js";
import Swal from "sweetalert2";
//import { useNotification } from "../assets/context/NotificationContext.jsx";

export const insertVuupt = async (params, showNotification) => {
  // const { showNotification } = useContext(useNotification);
  console.log("Vuupt:", params);
  //Obeter longitude y latitude  do cliente no Vuupt
  try {
    const response = await apiFetch(
      `/api/data?customer_code=${params.customer_code}`,
    );
    const data = await response.json();

    //console.log("Cliente por codigo:", data, "Status", data.status);
    if (!data.ok || data.status === 404) {
      //si no esta el cliente
     // console.log("Error al obtener datos del Vuupt:", data.message);
      // if (data.data.length === 0) {
      const res = await apiFetch("/api/vuupt/customers", {
        method: "POST",
        body: JSON.stringify(params),
      });
      const resultAddCustomer = await res.json();

      //console.log("Cliente criado no Vuupt:", resultAddCustomer);
      if (!resultAddCustomer.ok) {
        throw new Error(LANG.VUUPT.CUSTOMERCREATEDFAIL);
      }
      data = resultAddCustomer;
      console.log("Data al insertar el cleinte",data) //ver como sale data para asignarlo debajo "data.data[0]"
    }

    //Insertar pedido no Vuupt
    const bodyData = { ...data.data[0], ...params };

    // console.log("Datos a insertar en Vuupt:", bodyData);
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
    showNotification(LANG.VUUPT.CREATEDSUCCESS, "success");
  } catch (error) {
    showNotification(error.message || LANG.VUUPT.CREATEDFAIL, "error");
    console.error("Error en insertVuupt:", error.message);
    //throw error; // Re-lanzar el error para que el componente pueda manejarlo
  }
};
