import React, {
  use,
  useEffect,
  useId,
  useState,
  useContext,
  useRef,
} from "react";
import { TrashIcon /* EditIcon,  PrintIcon */ } from "./Icons";
import { Tooltip, CircularProgress, Chip, IconButton } from "@mui/material";
import { Edit, Print, DeleteOutlined } from "@mui/icons-material";
//import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from "@mui/icons-material/Delete";
//import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { formatDate, formatDeliveryDateTime , formatDateShort} from "../helpers/formatDate.js";
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

  const handleEdit = async (id) => {
    setEditing(id);

    try {
      const res = await apiFetch(`/api/orders/${id}`);

      if (!res.ok) {
        showNotification(LANG.ORDERSLIST.ERROROREDR, "error");
        return;
      }
      const data = await res.json();
      setOrderSelected(data);
      setOpenEdit(true);
    } catch (error) {
      //showNotification("Error ao encontrar o pedido", "error");
      console.error("Error ao encontrar o pedido", error.message);
    } finally {
      setEditing(null);
      //setOpenEdit(false);
    }
  };

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
            <th style={{ width: "165px" }}>Estado</th>
            <th style={{ width: "152px" }}>Agendado</th>
            <th style={{ width: "152px" }}>Entrega</th>
            <th style={{ width: "61px", textAlign: "center" }}>Ret</th>
            <th style={{ width: "180px", textAlign: "center" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <OrdersTableSkeleton rows={8} />
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
                <td>{order.status.name}</td>

                {/* Agendado  */}
                <td>
                  {order.delivery_date
                    ? formatDeliveryDateTime(
                        order.delivery_date,
                        order.delivery_hour,
                      )
                    : ""}
                </td>

                {/* Entrega */}
                <td>
                  {(() => {
                    if (order.scheduled) return ""; // ya se muestra en la columna Agendado
                    if (!order.delivery_date) return "";

                    const createdDateKey = order.created_at.split("T")[0];
                    const isDifferentDay =
                      order.delivery_date !== createdDateKey;                   

                    if (!isDifferentDay) return "";
                     return formatDateShort(order.delivery_date);                    
                  })()}
                </td>

                {/*  */}
                <td style={{ textAlign: "right" }}>
                  {order.pickup ? (
                    <Chip label="✓" color="warning" size="small" />
                  ) : (
                    ""
                  )}
                </td>

                {/* 7. Columna de acciones*/}
                <td style={{ textAlign: "right" }}>
                  <Tooltip title="Alterar pedido">
                    <IconButton
                      color="action"
                      size="small"
                      sx={{
                        //color: "#64748b",
                        "&:hover": {
                          backgroundColor: "#14532d",
                          color: "#fff",
                        },
                      }}
                      /*  className="btn-action btn-edit" */
                      onClick={() => handleEdit(order.id)}
                    >
                      {editing === order.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Edit />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Imprimir pedido">
                    <IconButton
                      /* className="btn-action" */
                      onClick={() => handlePrint(order.id)}
                    >
                      {printing === order.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Print />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir  pedido">
                    <IconButton
                      onClick={() => handleDelete(order.id)}
                      disabled={!hasAnyRole(["admin"])}
                      /*  className="btn-action btn-del" */
                    >
                      <DeleteOutlined />
                    </IconButton>

                    {/*   <IconButton color="error" onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton> */}
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
