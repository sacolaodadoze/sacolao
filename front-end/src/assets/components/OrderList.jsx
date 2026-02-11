import { useEffect, useState, useId, useRef } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { LANG } from "../constants/languages.js";
import { Import } from "./Import.jsx";
import { OrderTable } from "./OrderTable.jsx";
import CreateOrder from "./CreateOrder.jsx";

export function OrderList() {
  const [opciones, setOpciones] = useState([]); // Estado para los datos de la DB
  const [selectedEstatus, setSelectedEstatus] = useState(""); // Estado para el valor seleccionado
  const [orders, setOrders] = useState([]); // Estado para los pedidos
  const [isLoading, setIsLoading] = useState(false); //cargar order
  const [open, setOpen] = useState(false); //modal de criar pedidos

  const statusId = useId();

  const fetchStatus = () => {
    fetch("http://localhost:8000/api/status")
      .then((response) => response.json())
      .then((data) => {
        setOpciones(data); // Guardamos os dados dos estados
      })
      .catch((error) => {
        console.error("Error al traer datos:", error); //todo: manejar error
      });
  };

  const getOrders = () => {
    setIsLoading(true);  
    fetch("http://localhost:8000/api/orders")
      .then((response) => response.json())
      .then((data) => {
        setOrders(data); // Guardamos os dados das ordenes
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al traer pedidos:", error); //todo: manejar error
         setIsLoading(false);
      })
  };

  useEffect(() => {
    const inicializarSistema = async () => {
      // Ejecuta ambas peticiones al mismo tiempo
      await Promise.all([getOrders(), fetchStatus()]);
      // console.log("Sistema listo y datos cargados");
    };
    inicializarSistema();
  }, []);

  return (
    <main class="main-container">
      <div className="page-header">
        <h1 className="page-title">{LANG.ORDERSLIST.TITLE}</h1>
      </div>

      <div className="controls-row">
        <input
          type="text"
          className="search-input"
          placeholder={LANG.ORDERSLIST.SEARCH}
        />
        <select
          className="filter-select"
          id={statusId}
          value={selectedEstatus}
          onChange={(e) => setSelectedEstatus(e.target.value)}
        >
          <option value="all">{LANG.ORDERSLIST.STATUS}</option>
          {opciones.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.name}
            </option>
          ))}
        </select>
        <button
          id="btn-add-listato"
          className="btn-add"
          onClick={() => setOpen(true)}
        >
          <span>+ {LANG.ORDERSLIST.CREATE}</span>
        </button>

        <Dialog
          open={open}
          onClose={(event, reason) => {
            if (reason === "backdropClick") return;
            setOpen(false);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {LANG.ORDERSLIST.WCREATE}
            {/*  <IconButton
              aria-label="cerrar"
              onClick={() => setOpen(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton> */}
          </DialogTitle>
          <DialogContent
            disableGutters
            sx={{
              width: "100%",
              boxSizing: "border-box",
              display: "block",
            }}
          >
            <CreateOrder open={open} setOpen={setOpen} orders={getOrders} />
          </DialogContent>
        </Dialog>
      </div>
      <OrderTable orders={orders} isLoading={isLoading}/>
    </main>
  );
}
