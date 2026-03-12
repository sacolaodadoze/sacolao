import React, { useEffect, useRef } from "react";
import "./PrintOrder.css";

const PrintOrder = ({ order, shouldPrint,printWindowRef /* , onPrinted */ }) => {
  //console.log("order",order,"shouldPrint:", shouldPrint,printWindowRef)
 
 // const printWindowRef = useRef(null);
 const itemsFormatted =
  (order.items || "")
    .match(/(?:\d+(?:[.,]\d+)?|\d+\/\d+)[a-zA-Z]*\s[a-zA-Z].*?(?=\s(?:\d+(?:[.,]\d+)?|\d+\/\d+)[a-zA-Z]*\s[a-zA-Z]|$)/g)
    ?.map((item) => `<div class="row"><span>${item.trim()}</span></div>`)
    .join("") || "";

  const hourToUse = order.delivery_hour
    ? `<strong>HR:</strong>${order.delivery_hour}`
    : "";
  const dateToUse = order.delivery_date
    ? `${formatDate(order.delivery_date)} ${hourToUse}`
    : formatDate(order.created_at);

  useEffect(() => {
    if (!order || shouldPrint === 0 || !printWindowRef.current) return;
   

    // Esperamos que React haya renderizado el ticket
    // const timer = setTimeout(() => {
    // Abrimos una nueva ventana para imprimir

    // abrir ventana solo si no existe
   /*  if (!printWindowRef.current || printWindowRef.current.closed) {
      printWindowRef.current = window.open(
        "",
        "PRINT",
        "width=400,height=600,top=100,left=100,toolbar=no,menubar=no",
      );
    } */
    const printWindow = printWindowRef.current;
    // const printWindow = window.open("", "PRINT", "height=600,width=400");

    //const printWindow = window.open("", "_blank");

    if (!printWindow){
      //  console.error("No se pudo abrir la ventana de impresión. Verifica que los pop-ups no estén bloqueados.");
         return; // si el navegador bloquea popup
    }

    printWindow.document.open();
    printWindow.document.write(`
          <html>
            <head>
            <style>
                 body {
                 width: 100%;
                max-width: 80mm;
                margin: 0;
                padding: 5px;
                box-sizing: border-box;
                font-family: monospace;
                font-size: 14px; /* tamaño legible */
                line-height: 1.4; 
                                }
                .center { text-align: center; }
                .bold { font-weight: bold; }
                .divider { border-top: 1px dashed black; margin: 5px 0; }

                /* filas para etiquetas y valores */
                .row { display: flex; align-items: flex-start; margin-bottom: 2px; }
                .row strong {
                  display: inline-block;
                  width: 35mm;         /* ancho fijo para etiquetas */
                  text-align: left;
                  box-sizing: border-box;
                  white-space: nowrap;
                  overflow: hidden;                  
                }
                .row span {
                  flex: 1;              /* ocupa el resto del espacio */
                  white-space: pre-wrap; /* permite saltos de línea */
                }

                /* Pedido: etiqueta al lado de items */
                .div-pedido {
                  display: flex;
                  align-items: flex-start;
                  margin-bottom: 1px;
                }
                .div-pedido > div:first-child {
                  display: inline-block;               
                  font-weight: bold;     
                           
                }
                .div-pedido > div:last-child {
                  flex: 1;
                   font-size: 14px;
                     margin-left: -0mm;
                }
                .item span {
                  display: block;       /* cada item en su propia línea */
                }

                @page {
                  size: 80mm auto;
                  margin: 0;
                }
              </style>
            </head>
            <body>
              <div class="left bold">PEDIDO:  ${order.number}</div>
              <div class="divider"></div>             

              <div><strong>ENTREGAR EM:</strong> ${dateToUse}</div>

              <div><strong>NOME:</strong>${order.customer.name.toUpperCase()}</div>              

              <div><strong>TEL:</strong> ${order.customer.phones[0]?.number}</div>

              <div><strong>BAIRRO:</strong> ${order.customer.addresses[0]?.neighborhood}</div>

              <div class="divider"></div>

              <div><strong>Horario Pedido:</strong>${formatDateTime(order.created_at)}</div>              

              <div><strong >Forma Pagmto :</strong> ${order.payment?.name}</div> 

             ${order.detail ? `<div><strong>DET:</strong>${order.detail.description}</div>` : ""}         

              ${order.customer.observation ? `<div><strong>OBS:</strong>${order.customer.observation.content}</div>` : ""}  
            
               ${order.rate ? `<div><strong>Taxa de entrega:</strong>${order.rate.rate}</div>` : ""}             
              

             <div class="divider"></div>
              <div class="div-pedido">
                 <div><strong>Pedido:</strong></div> 
                 <div>${itemsFormatted}</div>
             </div>
            
             
            </body>
          </html>
        `);
    //detail.description
    printWindow.document.close();

  //  printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
   // };

    //onPrinted(); // reset estado
    // }, 200);
    // return () => clearTimeout(timer);
    // }
  }, [order, shouldPrint]);

  return null; // no necesita renderizar nada en el DOM principal/*  */
};

const formatDate = (date) => new Date(date).toLocaleDateString("pt-BR");

const formatDateTime = (date) => {
  if (!date) return "";

  const cleanDate = date.replace(".000000", ""); // elimina microsegundos si existen
  const d = new Date(cleanDate);

  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default PrintOrder;
