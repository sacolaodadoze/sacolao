import React, { use, useEffect, useId, useState } from "react";
import { TrashIcon, EditIcon } from "./Icons";
import { formatDate } from "../helpers/formatDate.js";
import { OrdersTableSkeleton } from "./OrdersTableSkeleton.jsx";

export function OrderTable({ orders, isLoading }) {
  const statusTableId = useId();
  const [opciones, setOpciones] = useState([]); // Estado para los datos de la DB
  // const [isLoading, setIsLoading] = useState(false); //cargar order

  /*   useEffect(() => {
    fetch("http://localhost:8000/api/status")
      .then((response) => response.json())
      .then((data) => {
        setOpciones(data); // Guardamos os dados dos estados
      })
      .catch((error) => {
        console.error("Error al traer datos:", error); //todo: manejar error
      });
  }, []); */

  const setEstatus = (newStatus) => {
    console.log("Nuevo estado seleccionado:", newStatus);
    // Aquí puedes agregar la lógica para actualizar el estado del pedido en el backend si es necesario
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th style={{ width: "97px" }}>No.</th>
            <th>Data</th>
            <th>Cliente</th>
            <th>Endereço</th>
            <th style={{ width: "165px" }}>Estado</th>
            <th style={{ width: "155px" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <OrdersTableSkeleton rows={6} />
          ) : (
            orders.map((order, index) => (
              <tr key={order.id}>
                {/* 1. Numeradas */}
                <td className="col-number">
                  <strong>#{index + 1}</strong>
                </td>
                {/* 2. Data */}
                <td>{formatDate(order.created_at)}</td>

                {/* 3. Dato anidado del Cliente */}
                <td>{order.customer?.name || "Consumidor Final"}</td>

                {/* 4. Dato anidado del Cliente,endereco:rua,numero,bairro */}
                <td>
                  {(() => {
                    const addr = order.customer?.addresses[0];

                    if (!addr) return "Sem endereço";

                    return `${addr.neighborhood ?? ""}, ${addr.street ?? ""}, ${addr.numero ?? "S/N"},${addr.city ?? ""}`;
                  })()}
                </td>

                {/* 5. Estado */}
                <td>
                  {order.status.name}
                  {/*    <select                 
                  className="filter-select"
                  id={statusTableId}
                  value={order.status_id}
                  onChange={(e) => setEstatus(e.target.value)}
                >
                  {opciones.map((opcion) => (
                    <option key={opcion.id} value={opcion.id}>
                      {opcion.name}
                    </option>
                  ))}
                </select> */}
                </td>

                {/* 5. Columna de acciones*/}
                <td>
                  <button
                    className="btn-action btn-edit"
                    onClick={() => console.log(order)}
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="btn-action btn-del"
                    onClick={() => console.log(order)}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
