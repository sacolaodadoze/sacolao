import { useState, useEffect, useRef } from "react";
import { LANG } from "../constants/languages.js";
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
import { useNotification } from "../context/NotificationContext.jsx"; //msg de info

import { zodResolver } from "@hookform/resolvers/zod"; //validaciones
import { schema } from "../../forms/orderForm.js";
import PrintOrder from "./PrintOrder.jsx";

export default function CreateOrder({
  open,
  setOpen,
  getOrders,
  paymentTypes,
  entries,
}) {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reason ,
    formState: { errors, isValid }, //disabled save
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange", //disabled save
    defaultValues: {
      customer_id: "", // id que enviarás al backend
      // document: null,
      items: "",
      pickup: false,
      paid: false,
      payment_types_id: "",
      entry_id: "",
      observations: "",
      details: "",
      scheduled: false,
      delivery_date: "",
      delivery_hour: "",
      phone: "",
      //Endereço
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    shouldUnregister: false, // mantiene todos los campos aunque estén ocultos
  });

  const { showNotification } = useNotification();
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef();
  const firstInputRef = useRef(null)
  const [customerSelected, setcustomerSelected] = useState(null); //al seleccionar el cliente
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  //Saber si cambio los datos de cliente

  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({}); //saber si cambio los datos del cliente

  const [order, setOrder] = useState([]);
  const [shouldPrint, setShouldPrint] = useState(false); //print

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

  const normalize = (v) => {
    if (v === null || v === undefined || v === "null" || v === "-") {
      return "";
    }
    return String(v).trim();
  };

  const onSubmit = async (data) => {
   // console.log(data);

    const original = formData; // objeto traído del backend
    const current = data; // datos del formulario

    const customerChanged =
      normalize(current.phone) !== normalize(original.phones?.[0]?.number) ||
      normalize(current.cep) !== normalize(original.addresses?.[0]?.cep) ||
      normalize(current.street) !==
        normalize(original.addresses?.[0]?.street) ||
      normalize(current.number) !==
        normalize(original.addresses?.[0]?.number) ||
      normalize(current.complement) !==
        normalize(original.addresses?.[0]?.complement) ||
      normalize(current.neighborhood) !==
        normalize(original.addresses?.[0]?.neighborhood) ||
      normalize(current.city) !== normalize(original.addresses?.[0]?.city) ||
      normalize(current.state) !== normalize(original.addresses?.[0]?.state);

    data.customerChanged = customerChanged;
    console.log(customerChanged);

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
      console.log(result);
      setOrder(result);
         
        // Activamos impresión
      setShouldPrint(true);
      showNotification("Pedido criado com sucesso", "success");    

      getOrders();
      setcustomerSelected(null);
      console.log("Guardado:", result);
      setOpen(false);
    } catch (error) {
      console.log("ERRORES:", errors);
      showNotification("Erro ao criar pedido", { error });
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

 // Espera un tick para que el DOM exista, para poner el focus
    useEffect(() => {
    if (open) {     
      firstInputRef.current.focus();        
    }
  }, [open]);

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
                  inputRef={firstInputRef}
                  loading={loading}
                  value={customerSelected}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                  onInputChange={(event, value,reason) => {
                      if (reason !== "input") return; //El usuario está escribiendo en el teclado
                    if (value.length < 3) {
                      setCustomer([]);
                      return;
                    }
                    clearTimeout(debounceRef.current); //cada vez que el user escribe cancelamos el timeout anterior

                    debounceRef.current = setTimeout(() => {
                      //con debounce se hace 1 sola peticion, cuando el usuario deja de escribir
                      setLoading(true);
                      searchCustomer(value).finally(() => setLoading(false));
                    }, 300); //Espera 300 ms y luego ejecuta searchCustomer
                  }}
                  //TODO carga dos veces la peticion de buscar cliente
                  onChange={(event, customer) => {
                    if (!customer) return;                  
                    setcustomerSelected(customer);
                    setValue("customer_id", customer.id);
                    setLoading(false);

                    setValue("document", customer.document ?? "");
                    setValue("name", customer.name ?? "");
                    setValue("phone", customer.phones[0]?.number ?? "");
                    setValue("cep", customer.addresses[0]?.cep ?? "");
                    setValue("street", customer.addresses[0]?.street ?? "");
                    setValue("number", customer.addresses[0]?.number ?? "");
                    setValue("complement",customer.addresses[0]?.complement ?? "");
                    setValue("neighborhood",customer.addresses[0]?.neighborhood ?? "");
                    setValue("city", customer.addresses[0]?.city ?? "");
                    setValue("state", customer.addresses[0]?.state ?? "");

                    setFormData(customer);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pesquisar cliente"
                      inputRef={firstInputRef} 
                      fullWidth
                      disabled={loading}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading && <CircularProgress size={30} />}
                            {/* TODO ,quitar el cargar */}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  /*  //TODO  ponerle una lupa al buscar
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
                    ["document", "CPF/CNPJ"],
                    ["name", "Nome"],
                    ["phone", "Telefone"],
                    ["cep", "CEP"],
                    ["street", "Rua"],
                    ["number", "Número"],
                    ["complement", "Complemento"],
                    ["neighborhood", "Bairro"],
                    ["city", "Cidade"],
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
                          <TextField
                            {...field}
                            label={label}
                            fullWidth
                            value={field.value || "-"}
                            /*  error={!!errors.order?.items}
                          helperText={errors.order?.items?.message}*/
                            onChange={(e) => {
                              const value =
                                e.target.value === "-" ? "" : e.target.value;
                              field.onChange(value); //guardamos "" en vez de "-"
                            }}
                          />
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
          <SectionCollapse
            title="Dados do pedido"
            defaultOpen={true}
            open={Boolean(customerSelected?.id)} //no funciona
          >
            <Stack spacing={3}>
              {/* ITEMS DEL PEDIDO */}
              <Grid item xs={12}>
                <Controller
                  name="items"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Itens do pedido"
                      multiline
                      rows={4}
                      fullWidth
                      error={!!errors?.items}
                      helperText={errors?.items?.message}
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
                    name="payment_types_id"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <FormControl
                        sx={{ width: "100%" }}
                        error={!!errors?.payment_types_id}
                        helperText={errors?.payment_types_id?.message}
                      >
                        <InputLabel id="payment-label">
                          Forma de Pagamento
                        </InputLabel>

                        <Select
                          {...field}
                          labelId="payment-label"                          
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
                    defaultValue=""
                    render={({ field }) => (
                      <FormControl
                        sx={{ width: "100%" }}
                        error={!!errors?.entry_id}
                        helperText={errors?.entry_id?.message}
                      >
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
                      label="Detalhes do pedido"
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
                      label="Observações do cliente"
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
                  //defaultValue=false,
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox {...field} checked={field.value || false} />
                      }
                      label="Agendado"
                    />
                  )}
                />

                {agendado && (
                  <>
                    {/* FECHA */}
                    <Controller
                      name="delivery_date"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Data de entrega"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }} // para que la etiqueta no se superponga
                        />
                      )}
                    />

                    {/* HORA */}
                    <Controller
                      name="delivery_hour"
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
                        sx={{ width: "100%" }}
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
                        sx={{ width: "100%" }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Stack>
          </SectionCollapse>
        </Stack>
        <DialogActions>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            {/* </Button><Button type="submit" variant="contained" disabled={!isValid}> */}
            Salvar pedido
          </Button>
        </DialogActions>
      </form>
      <PrintOrder
        order={order}       
        shouldPrint={shouldPrint}
        onPrinted={() => setShouldPrint(false)}
      />
    </>
  );
}
