import React, { use, useEffect, useId, useState, useContext } from "react";
import { TrashIcon, EditIcon, PrintIcon } from "./Icons";
import { Tooltip } from "@mui/material";
import { formatDate } from "../helpers/formatDate.js";
import { OrdersTableSkeleton } from "./OrdersTableSkeleton.jsx";
import { useDeleteOrder } from "../hooks/useDeleteOrder.jsx";
import { useEditOrder } from "../hooks/useEditOrder.jsx";
import EditOrder from "./EditOrder.jsx";
import PrintOrder from "./PrintOrder.jsx";
import {} from "../context/AuthContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

export function OrderTable({
  orders,
  getOrders,
  paymentTypes,
  entries,
  isLoading,
  currentPage,
  perPage,
}) {
  const statusTableId = useId();
  const [opciones, setOpciones] = useState([]); // Estado para los datos de la DB
  const { deleteOrder } = useDeleteOrder();
  const [openEdit, setOpenEdit] = useState(false);
  const [orderSelected, setOrderSelected] = useState([]);
  const [shouldPrint, setShouldPrint] = useState(false);
  const { showNotification } = useNotification();
  const { user, hasAnyRole } = useContext(AuthContext);
  console.log(hasAnyRole(["admin"]));
  const handleDelete = async (order_id) => {
    if (!hasAnyRole(["admin"])) {
      showNotification("No tienes permiso para eliminar pedidos", "warning");
      return;
    }
    const success = await deleteOrder(order_id, orders);
    if (success) {
      getOrders();
    }
  };

  const handleEdit = async (order) => {
    setOrderSelected(order);
    setOpenEdit(true);
  };

  const handlePrint = async (order) => {
    // console.log(order);
    setOrderSelected(order);
    setShouldPrint(true);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {/*    <th style={{ width: "95px" }}></th> */}
            <th style={{ width: "127px" }}>No.</th>
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
                {/*  <td className="col-number">
                  {" "}
                  {(currentPage - 1) * perPage + index + 1}{" "}
                </td> */}

                {/* 2. Number */}
                <td>{order.number}</td>

                {/* 3. Data */}
                <td>{formatDate(order.created_at)}</td>

                {/* 4. Dato anidado del Cliente */}
                <td>{order.customer?.name || "Consumidor Final"}</td>

                {/* 5. Dato anidado del Cliente,endereco:rua,numero,bairro */}
                <td>
                  {(() => {
                    const addr = order.customer?.addresses[0];

                    if (!addr) return "Sem endereço";

                    return `${addr.neighborhood ?? ""}, ${addr.street ?? ""}, ${addr.numero ?? "S/N"},${addr.city ?? ""}`;
                  })()}
                </td>

                {/* 6. Estado */}
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

                {/* 7. Columna de acciones*/}
                <td>
                  <Tooltip title="Alterar pedido">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEdit(order)}
                    >
                      <EditIcon />
                    </button>
                  </Tooltip>

                  <Tooltip title="Imprimir pedido">
                    <button
                      className="btn-action"
                      onClick={() => handlePrint(order)}
                    >
                      <PrintIcon />
                    </button>
                  </Tooltip>
                  <Tooltip title="Excluir  pedido">
                    <button
                      onClick={() => handleDelete(order.id)}
                      disabled={!hasAnyRole(["admin"])}
                      className="btn-action btn-del"
                    >
                      <TrashIcon />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <EditOrder
        open={openEdit}
        setOpen={setOpenEdit}
        order={orderSelected}
        getOrders={getOrders}
        paymentTypes={paymentTypes}
        entries={entries}
      />
      {orderSelected && (
        <PrintOrder
          order={orderSelected}
          shouldPrint={shouldPrint}
          onPrinted={() => setShouldPrint(false)}
        />
      )}
    </div>
  );
}
