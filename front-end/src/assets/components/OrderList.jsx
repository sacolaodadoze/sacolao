import { useEffect, useState, useId, useRef,useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TablePagination,
} from "@mui/material";
import { LANG } from "../constants/languages.js";
import { Import } from "./Import.jsx";
import { OrderTable } from "./OrderTable.jsx";
import CreateOrder from "./CreateOrder.jsx";
import { useNotification } from "../context/NotificationContext.jsx"; //msg de info
import { apiFetch } from "../../api/apiFetch.js";
import { AuthContext } from "../context/AuthContext";

export function OrderList() {
  const [opciones, setOpciones] = useState([]); // Estado para los datos de la DB
  const [selectedEstatus, setSelectedEstatus] = useState(""); // Estado para el valor seleccionado
  const [orders, setOrders] = useState([]); // Estado para los pedidos
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false); //cargar order
  const [open, setOpen] = useState(false); //modal de criar pedidos
  const [search, setSearch] = useState("");
  const { showNotification } = useNotification();
   const { user } = useContext(AuthContext);

  //Paginado
  const [currentPage, setCurrentPage] = useState(1);
  // const [lastPage, setLastPage] = useState(1); //
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  const statusId = useId();
  const fetchStatus = () => {
    apiFetch("/api/status")
      .then((response) => response.json())
      .then((data) => {
        setOpciones(data); // Guardamos os dados dos estados
      })
      //todo manejar msg error
      .catch((error) => {
        console.error("Error al traer datos:", error); //todo: manejar error
      });
  };
  //TODO cuando vaya a hacer el pedido
  /*   useEffect(() => {
    fetch("http://localhost:8000/api/status")
      .then((response) => response.json())
      .then((data) => {
        setOpciones(data); // Guardamos os dados dos estados
      })
      .catch((error) => {
        console.error("Error al traer datos:", error); //todo: manejar error
      });
  }, []); 

  const setEstatus = (newStatus) => {
    console.log("Nuevo estado seleccionado:", newStatus);
    // Aquí puedes agregar la lógica para actualizar el estado del pedido en el backend si es necesario
  };
  */

  const getOrders = async (search = "", perPage = 20, currentPage = 1) => {  
    setIsLoading(true);
    try {
      const response = await apiFetch(
        `/api/orders?search=${encodeURIComponent(search ?? "")}&perPage=${perPage}&page=${currentPage}`,
      );

      if (!response.ok) {
        throw new Error(LANG.ORDERSLIST.ERROROREDR); // lanza error si status no es 200
      }

      const data = await response.json();
      setOrders(data.data); // Guardamos os dados das ordenes
      setCurrentPage(data.current_page);
      setTotal(data.total);

      if (data.data.length === 0) {
        showNotification(LANG.ORDERSLIST.NOSHOW, "warning");
      }
    } catch (error) {
      showNotification(error.message || LANG.ORDERSLIST.ERROROREDR, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymets = () => {
    apiFetch("/api/payments")
      .then((response) => {
        if (!response.ok) {
          throw new Error(LANG.ORDERSLIST.ERRORPAYMENTS);
        }
        return response.json();
      })
      .then((data) => {
        setPaymentTypes(data);
      })
      .catch((error) => {
        showNotification(
          error.message || LANG.ORDERSLIST.ERRORPAYMENTS,
          "error",
        );
      });
  };

  const getEntries = () => {
    apiFetch("/api/entries")
      .then((response) => {
        if (!response.ok) {
          throw new Error(LANG.ORDERSLIST.ERRORENTRIES);
        }
        return response.json();
      })
      .then((data) => {
        setEntries(data);
      })
      .catch((error) => {
        showNotification(
          error.message || LANG.ORDERSLIST.ERRORENTRIES,
          "error",
        );
      });
  };

  useEffect(() => {
      if (!user) return; // solo si hay usuario logueado
    const inicializarSistema = async () => {
      // Ejecuta ambas peticiones al mismo tiempo
      await Promise.all([
        getOrders(search, perPage, currentPage),
        getPaymets(),
        getEntries(),
        // fetchStatus(),
      ]);
    };
    inicializarSistema();
  }, [user]);

  //Busqueda
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === "" || search.trim().length >= 3) {
        getOrders(search, perPage, currentPage);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, perPage, currentPage]);

  return (
    <main class="main-container">
      <div className="page-header">
        <h1 className="page-title">{LANG.ORDERSLIST.TITLE}</h1>
      </div>

      <div className="controls-row">
        {/*  <input
          type="text"
          className="search-input"
          placeholder={LANG.ORDERSLIST.SEARCH}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}

        <div
          className="search-wrapper"
          // style={{ position: "relative", width: "86%", paddingRight: "30px" }}
          style={{
            position: "relative",
            width: "100%", // ocupa todo el ancho del contenedor
          }}
        >
          <input
            type="text"
            className="search-input"
            placeholder={LANG.ORDERSLIST.SEARCH}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              paddingRight: "30px", // espacio para la X
            }}
          />
          
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "8px", // pegado al borde derecho
                top: "50%", // centrado vertical
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: "1",
                padding: "0",
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/*  <select
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
        </select> */}
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
            style={{
              paddingTop: "24px", // espacio arriba del primer input
              paddingBottom: "24px",
              maxHeight: "400px",
            }}
            sx={{
              width: "100%",
              boxSizing: "border-box",
              display: "block",
            }}
          >
            <CreateOrder
              open={open}
              setOpen={setOpen}
              getOrders={getOrders}
              paymentTypes={paymentTypes}
              entries={entries}
            />
          </DialogContent>
        </Dialog>
      </div>
      <OrderTable
        orders={orders}
        getOrders={getOrders}
        paymentTypes={paymentTypes}
        entries={entries}
        isLoading={isLoading}
        currentPage={currentPage}
        perPage={perPage}
      />

      <TablePagination
        component="div"
        labelRowsPerPage={LANG.ORDERSLIST.PERPAGE}
        count={total}
        page={currentPage - 1} // MUI base 0
        rowsPerPage={perPage}
        onPageChange={(event, currentPage) => setCurrentPage(currentPage + 1)}
        onRowsPerPageChange={(event) => {
          const newPerPage = parseInt(event.target.value, 10);
          setPerPage(newPerPage);
          setCurrentPage(1);
        }}
        rowsPerPageOptions={[5, 10, 20, 50]}
      />
    </main>
  );
}
