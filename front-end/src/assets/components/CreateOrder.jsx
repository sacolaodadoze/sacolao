import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  DialogActions,
  TextField,
  Grid,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Box,
  CircularProgress,
} from "@mui/material";
import { SectionCollapse } from "./SectionCollapse.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

export default function CreateOrder({ open, setOpen, orders }) {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      customer_id: null, // id que enviarás al backend
      document: null,
      pickup: false,
      paid: false,
      scheduled: null,
      // nombre: "",
      phone: "",
      //Endereço
      cep: "null",
      street: "null",
      number: "null",
      complement: "null",
      neighborhood: "null",
      city: "",
      state: "",
    },
  });

  const { showNotification } = useNotification();
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [entries, setEntries] = useState([]);
  const debounceRef = useRef();
  const [customerSelected, setcustomerSelected] = useState(null); //al seleccionar el cliente

  const getPaymets = () => {
    fetch("http://localhost:8000/api/payments")
      .then((response) => response.json())
      .then((data) => {
        setPaymentTypes(data); // Guardamos os dados das ordenes
      })
      .catch((error) => {
        console.error("Error al traer los tipos de pagamentos:", error); //todo: manejar error
      });
  };

  const getEntries = () => {
    fetch("http://localhost:8000/api/entries")
      .then((response) => response.json())
      .then((data) => {
        setEntries(data); // Guardamos os dados das ordenes
      })
      .catch((error) => {
        console.error("Error al traer los tipos de entrada:", error); //todo: manejar error
      });
  };

  useEffect(() => {
    const initialize = async () => {
      // Ejecuta ambas peticiones al mismo tiempo
      await Promise.all([getPaymets(), getEntries()]);
    };
    initialize();
  }, []);

  //Pesquisar cliente
  const searchCustomer = async (texto) => {
    if (!texto || texto.length < 2) {
      setCustomer([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/customers/search?search=${texto}`,
      );

      const data = await res.json();
      setCustomer(data);
      //setCustomer(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const agendado = watch("scheduled");

  const onSubmit = async (data) => {
    console.log("PEDIDO:", data);
    setOpen(false);
    try {
      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      showNotification("Pedido criado com sucesso", "success");
      orders();
      customerSelected=null;
      console.log("Guardado:", result);
    } catch (error) {
      showNotification("Erro ao criar pedido", "error");
     setcustomerSelected(null);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setcustomerSelected(null);
  };

  const handleCustomer = (customer) => {
    setCustomer(customer);
    if (customer) {
      Object.keys(customer).forEach((key) => {
        setValue(key, customer[key]);
      });
    }
  };

  return (
    <>
      <form style={{ width: "100%", gap: 2 }}>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <Controller
              name="customer_id"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={customer}
                  loading={loading}
                  value={field.value || null}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                  onInputChange={(event, value) => {
                    if (value.length < 3) {
                      setCustomer([]);
                      return;
                    }

                    clearTimeout(debounceRef.current); //cada vez que el user escribe cancelamos el timeout anterior
                    debounceRef.current = setTimeout(() => {
                      //con debounce se hace 1 sola peticion, cuando el usuario deja de escribir
                      searchCustomer(value);
                    }, 300); //Espera 300 ms y luego ejecuta searchCustomer
                  }}
                  onChange={(event, customer) => {
                    if (!customer) return;
                    setcustomerSelected(customer.id);
                    setValue("customer_id", customer.id);
                    console.log(customer.id);
                    setLoading(false);

                    setValue("document", customer.document ?? "-");
                    setValue("name", customer.name ?? "");
                    setValue("phone", customer.phones[0]?.number ?? "-");
                    setValue("cep", customer.addresses[0]?.cep ?? "-");
                    setValue("street", customer.addresses[0]?.street ?? "-");
                    setValue("number", customer.addresses[0]?.number ?? "");
                    setValue(
                      "complement",
                      customer.addresses[0]?.complement ?? "-",
                    );
                    setValue(
                      "neighborhood",
                      customer.addresses[0]?.neighborhood ?? "-",
                    );
                    setValue("city", customer.addresses[0]?.city ?? "");
                    setValue("state", customer.addresses[0]?.state ?? "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pesquisar cliente"
                      fullWidth
                      disabled={loading}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading && <CircularProgress size={30} />}
                            {/* todo ,quitar el cargar */}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  /*  //todo  ponerle una lupa al buscar
                 InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
              */
                />
              )}
            />
          </Stack>

          {/* DATOS DEL CLIENTE */}
          {/*  <SectionCollapse title="Datos del cliente" defaultOpen={true} > */}
          <Stack spacing={2}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {customerSelected && (
                <>
                  {[
                    ["document", "CPF"],
                    ["name", "Nombre"],
                    ["phone", "Teléfono"],
                    ["cep", "CEP"],
                    ["street", "Calle"],
                    ["number", "Número"],
                    ["complement", "Complemento"],
                    ["neighborhood", "Barrio"],
                    ["city", "Ciudad"],
                    ["state", "Estado"],
                  ].map(([name, label]) => (
                    <Box
                      key={name}
                      sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}
                    >
                      <Controller
                        name={name}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label={label} fullWidth />
                        )}
                      />
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Stack>
          {/*  </SectionCollapse> */}

          {/* SECCIÓN: DATOS DD PEDIDO */}
          <SectionCollapse title="Dados do pedido" defaultOpen={false} setOpen={!!customerSelected}>
            <Stack spacing={3}>
              {/* ITEMS DEL PEDIDO */}
              <Grid item xs={12}>
                <Controller
                  name="items"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Itens do pedido"
                      multiline
                      rows={4}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {/* TIPO DE PAGO */}
                <Box
                  sx={{ width: { xs: "100%", md: "calc(50% - 8px)", gap: 2 } }}
                >
                  <Controller
                    name="payment_types_id" // 👈 usa el nombre correcto
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="payment-label">
                          Forma do Pagamento
                        </InputLabel>

                        <Select
                          {...field}
                          labelId="payment-label"
                          label="Forma do Pagamento"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          {paymentTypes.map((payment) => (
                            <MenuItem key={payment.id} value={payment.id}>
                              {payment.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Box>

                {/* ENTRADA DEL PEDIDO */}
                <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
                  <Controller
                    name="entry_id"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Entrada do pedido</InputLabel>
                        <Select {...field} label="Entrada del pedido" fullWidth>
                          {entries.map((entry) => (
                            <MenuItem key={entry.id} value={entry.id}>
                              {entry.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Box>
              </Box>

              {/* Detalhes */}
              <Grid item xs={12}>
                <Controller
                  name="details"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Detalhes"
                      multiline
                      rows={2}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              {/* Observaciones */}
              <Grid item xs={12}>
                <Controller
                  name="observations"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Observaçoes"
                      multiline
                      rows={2}
                      fullWidth
                    />
                  )}
                />
              </Grid>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 2,
                  alignItems: "center",
                }}
              >
                {/* AGENDADO */}
                <Controller
                  name="scheduled"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox {...field} checked={field.value || null} />
                      }
                      label="Agendado"
                    />
                  )}
                />

                {agendado && (
                  <>
                    {/* FECHA */}
                    <Controller
                      name="fechaRecogida"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Data de retirada"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }} // para que la etiqueta no se superponga
                        />
                      )}
                    />

                    {/* HORA */}
                    <Controller
                      name="horaRecogida"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          label="Hora"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "flex-end",
                }}
              >
                {/* Recogida */}
                <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
                  <Controller
                    name="pickup"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox {...field} checked={field.value || false} />
                        }
                        label="Retirada "
                        fullWidth
                      />
                    )}
                  />
                </Box>

                {/* Pago */}
                <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
                  <Controller
                    name="paid"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox {...field} checked={field.value || false} />
                        }
                        label="Pago "
                        fullWidth
                      />
                    )}
                  />
                </Box>
              </Box>
            </Stack>
          </SectionCollapse>
        </Stack>
      </form>

      <DialogActions>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Guardar pedido
        </Button>
      </DialogActions>
    </>
  );
}
