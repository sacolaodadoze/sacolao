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

  //Busqueda
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Si está vacío → trae todo
      if (search.trim() === "") {
        getOrders(perPage, currentPage);
        return;
      }

      // Si tiene 3 o más caracteres → buscar
      if (search.trim().length >= 3) {
        getOrders(perPage, currentPage);
      }
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const getOrders = (search, perPage, currentPage) => {
    setIsLoading(true);
    fetch(
      `http://localhost:8000/api/orders?search=${encodeURIComponent(search ?? "")}&perPage=${perPage}&page=${currentPage}`,
    )
      .then((response) => response.json())
      .then((data) => {
        setOrders(data.data); // Guardamos os dados das ordenes
        setCurrentPage(data.current_page);
        setTotal(data.total);
        setIsLoading(false);
        console.log(data);
      })

      .catch((error) => {
        console.error("Error al traer pedidos:", error); //todo: manejar error
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getOrders(search, perPage, currentPage);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const getPaymets = () => {
    fetch("http://localhost:8000/api/payments")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al traer los tipos de entrada");
        }
        return response.json();
      })
      .then((data) => {
        setPaymentTypes(data);
      })
      .catch((error) => {
        console.error("Error al traer los tipos de pagamentos:", error); //TODO: manejar error
      });
  };

  const getEntries = () => {
    fetch("http://localhost:8000/api/entries")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al traer los tipos de entrada");
        }
        return response.json();
      })
      .then((data) => {
        setEntries(data);
      })
      .catch((error) => {
        showNotification("Erro ao criar pedido", { error });
        console.error("Error al traer los tipos de entrada:", error);
      });
  };

  useEffect(() => {
    const inicializarSistema = async () => {
      // Ejecuta ambas peticiones al mismo tiempo
      await Promise.all([
        // getOrders(perPage,currentPage),
        getPaymets(),
        getEntries(),
        fetchStatus(),
      ]);
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
        labelRowsPerPage="Quantidade por página: "
        count={total}
        page={currentPage - 1} // MUI base 0
        rowsPerPage={perPage}
        onPageChange={(event, currentPage) =>
          getOrders(search, perPage, currentPage + 1)
        }
        onRowsPerPageChange={(event) => {
          const newPerPage = parseInt(event.target.value, 10);
          setPerPage(newPerPage);
          setCurrentPage(1);
          getOrders(search, newPerPage, 1);
        }}
        rowsPerPageOptions={[5, 10, 20, 50]}
      />
    </main>
  );
}
