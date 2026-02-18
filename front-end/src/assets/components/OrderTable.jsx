import React, { use, useEffect, useId, useState } from "react";
import { TrashIcon, EditIcon } from "./Icons";
import { formatDate } from "../helpers/formatDate.js";
import { OrdersTableSkeleton } from "./OrdersTableSkeleton.jsx";
import { useDeleteOrder } from "../hooks/useDeleteOrder.jsx";
import { useEditOrder } from "../hooks/useEditOrder.jsx";
import EditOrder from "./EditOrder.jsx";

export function OrderTable({ orders, getOrders,paymentTypes,entries, isLoading }) {
  const statusTableId = useId();
  const [opciones, setOpciones] = useState([]); // Estado para los datos de la DB
  const { deleteOrder } = useDeleteOrder();
  const [openEdit, setOpenEdit] = useState(false);
  const [orderSelected, setOrderSelected] = useState([]);
  // const [isLoading, setIsLoading] = useState(false); //cargar order

  const handleDelete = async (order_id) => {
    const success = await deleteOrder(order_id, orders);
    if (success) {
      getOrders(); // recargar lista de pedidos
    }
  };

  const handleEdit = async (order) => {
    console.log(order);
    setOrderSelected(order);
    setOpenEdit(true);   
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th style={{ width: "97px" }}>No.</th>
            <th style={{ width: "130px" }}>Data</th>
            <th>Cliente</th>
            <th>Endereço</th>
            {/*   <th style={{ width: "165px" }}>Estado</th> */}
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
                {/*  <td>
                  {order.status.name} */}

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
                {/*  </td> */}

                {/* 5. Columna de acciones*/}
                <td>
                  <button
                    className="btn-action btn-edit"
                    onClick={() => handleEdit(order)}
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="btn-action btn-del"
                    onClick={() => handleDelete(order.id)}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
       <EditOrder open={openEdit} setOpen={setOpenEdit} order={orderSelected} paymentTypes={paymentTypes} entries={entries} />;
    </div>
  );
}
