import React, {
  use,
  useEffect,
  useId,
  useState,
  useContext,
  useRef,
} from "react";
import { TrashIcon, EditIcon, PrintIcon } from "./Icons";
import { Tooltip, CircularProgress } from "@mui/material";
import { formatDate } from "../helpers/formatDate.js";
import { OrdersTableSkeleton } from "./OrdersTableSkeleton.jsx";
import { useDeleteOrder } from "../hooks/useDeleteOrder.jsx";
import { useEditOrder } from "../hooks/useEditOrder.jsx";
import EditOrder from "./EditOrder.jsx";
import PrintOrder from "./PrintOrder.jsx";
import {} from "../context/AuthContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import { LANG } from "../constants/languages.js";
import { apiFetch } from "../../api/apiFetch.js";
import { set } from "zod";

export function OrderTable({
  orders,
  getOrders,
  paymentTypes,
  entries,
  rates,
  isLoading,
  currentPage,
  perPage,
}) {
  const statusTableId = useId();
  const [opciones, setOpciones] = useState([]); // Estado para los datos de la DB
  const { deleteOrder } = useDeleteOrder();
  const [openEdit, setOpenEdit] = useState(false);
  const [orderSelected, setOrderSelected] = useState([]);
  const [shouldPrint, setShouldPrint] = useState(0);
  const [editing, setEditing] = useState(null);
  const [printing, setPrinting] = useState(null);
  const { showNotification } = useNotification();
  const { user, hasAnyRole } = useContext(AuthContext);
  const printWindowRef = useRef(null);

  const handleDelete = async (order_id) => {
    if (!hasAnyRole(["admin"])) {
      showNotification(LANG.DELETEORDER.UNAUTHORIZED, "warning");
      return;
    }
    const success = await deleteOrder(order_id, orders);
    if (success) {
      getOrders();
    }
  };

  const handlePrint = async (id) => {
    setPrinting(id);
    try {
      // abrir ventana DESDE EL CLICK
      printWindowRef.current = window.open(
        "",
        "PRINT",
        "width=1000,height=600,top=100,left=100,toolbar=no,menubar=no",
      );

      const res = await apiFetch(`/api/orders/${id}`);

      if (!res.ok) {
        showNotification(LANG.ORDERSLIST.ERROROREDR, "error");
        return;
      }

      const data = await res.json();

      setOrderSelected(data);
      setShouldPrint((prev) => prev + 1);
    } catch (error) {
      showNotification("Error al imprimir", "error");
    } finally {
      setPrinting(null);
    }
  };

  useEffect(() => {
    console.log("shouldPrint padre:", shouldPrint);
  }, [shouldPrint]);

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {/*    <th style={{ width: "95px" }}></th> */}
            <th style={{ width: "127px" }}>No.</th>
            <th style={{ width: "135px" }}>Data</th>
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
                      onClick={() => handleEdit(order.id)}
                    >
                      {editing === order.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <EditIcon />
                      )}
                    </button>
                  </Tooltip>

                  <Tooltip title="Imprimir pedido">
                    <button
                      className="btn-action"
                      onClick={() => handlePrint(order.id)}
                    >
                      {printing === order.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <PrintIcon />
                      )}
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
        rates={rates}
      />
      {/*   {orderSelected && ( */}
      <PrintOrder
        order={orderSelected}
        shouldPrint={shouldPrint}
        printWindowRef={printWindowRef}
        //  onPrinted={() => setShouldPrint(0)}
      />
      {/*  )} */}
    </div>
  );
}
