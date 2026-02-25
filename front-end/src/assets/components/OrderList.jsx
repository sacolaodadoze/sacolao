import { useEffect, useState, useId, useRef } from "react";
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

  //Paginado
  const [currentPage, setCurrentPage] = useState(1);
  // const [lastPage, setLastPage] = useState(1); //
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  const statusId = useId();
  const fetchStatus = () => {
    fetch("http://localhost:8000/api/status")
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
     const response= await fetch(
        `http://localhost:8000/api/orders?search=${encodeURIComponent(search ?? "")}&perPage=${perPage}&page=${currentPage}`,
      );
     
      if (!response.ok) {
        throw new Error("Error al traer las órdenes"); // lanza error si status no es 2xx
      }
     
      const data = await response.json();
      setOrders(data.data); // Guardamos os dados das ordenes
      setCurrentPage(data.current_page);
      setTotal(data.total);     

      if (data.data.length === 0) {
        showNotification(LANG.ORDERSLIST.NOSHOW, "warning");
      }
    } catch (error) {     
      showNotification(error.message ||LANG.ORDERSLIST.ERROROREDR , "error");
    
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymets = () => {
    fetch("http://localhost:8000/api/payments")
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        setPaymentTypes(data);
      })
      .catch((error) => {       
         showNotification(error.message || LANG.ORDERSLIST.ERRORPAYMENTS, "error");
      });
  };

  const getEntries = () => {
    fetch("http://localhost:8000/api/entries")
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        setEntries(data);
      })
      .catch((error) => {
       showNotification(error.message || LANG.ORDERSLIST.ERRORENTRIES, "error");       
      });
  };

  useEffect(() => {
    const inicializarSistema = async () => {
      // Ejecuta ambas peticiones al mismo tiempo
      await Promise.all([
        getOrders(search, perPage, currentPage),
        getPaymets(),
        getEntries(),
        fetchStatus(),
      ]);      
    };
    inicializarSistema();
  }, []);

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
          style={{ position: "relative", width: "86%", paddingRight: "30px" }}
        >
          <input
            type="text"
            className="search-input"
            placeholder={LANG.ORDERSLIST.SEARCH}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%" }}
          />
          {/* TODO ver como coloco la x de cerrar  */}
          {/*  {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
               // right: "0px",
                left:"0px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "16px",
                width: "100%", // ocupa todo el ancho del div
              //  paddingLeft: "900px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          )} */}
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
            disableGutters
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
        onPageChange={
          (event, currentPage) => setCurrentPage(currentPage + 1)         
        }
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
