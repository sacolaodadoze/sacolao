import { useState, useEffect, useRef, useContext } from "react";
import { LANG } from "../constants/languages.js";
import { useForm, Controller } from "react-hook-form";
import { apiFetch } from "../../api/apiFetch.js";
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
import { AuthContext } from "../context/AuthContext.jsx";
import { set } from "zod";
import React from "react";

export default function CreateOrder({
  open,
  setOpen,
  getOrders,
  paymentTypes,
  entries,
  rates,
}) {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reason,
    reset,
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
      rate_id: null,
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
  const firstInputRef = useRef(null);
  const [customerSelected, setcustomerSelected] = useState(null); //al seleccionar el cliente

  const [loadingSave, setLoadingSave] = useState(false); //estado para mostrar el spinner al guardar el pedido
  //Saber si cambio los datos de cliente

  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({}); //saber si cambio los datos del cliente

  const [order, setOrder] = useState([]);
  const [shouldPrint, setShouldPrint] = useState(0); //print

  const { user } = useContext(AuthContext);
  const printWindowRef = useRef(null);

  //Pesquisar cliente
  const searchCustomer = async (texto) => {
    if (!texto || texto.length < 2) {
      setCustomer([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch(`/api/customers/search?search=${texto}`);

      const data = await res.json();
      setCustomer(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const agendado = watch("scheduled");
  useEffect(() => {
    if (!agendado) {
      setValue("delivery_date", "");
      setValue("delivery_hour", "");
    }
  }, [agendado]);

  const normalize = (v) => {
    if (v === null || v === undefined || v === "null" || v === "-") {
      return "";
    }
    return String(v).trim();
  };

  const onSubmit = async (data) => {
    setLoadingSave(true);
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
    if (data.rate_id === 0) {
      data.rate_id = null;
    }
    data.created_by = user.name;

    //Formato de los items del pedido
    const itemstWithSeparator = data.items.split("\n").join("||");
    data.items = itemstWithSeparator;

    try {
      await apiFetch("/sanctum/csrf-cookie");

      const res = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await res.json();

      //Print
      const orderPrint = await apiFetch(`/api/orders/${result.id}`);

      if (!orderPrint.ok) {
        showNotification(LANG.ORDERSLIST.ERROROREDR, "error");
        return;
      }
      const resultToPrint = await orderPrint.json();
      // console.log("To print:", resultToPrint);

      setOrder(resultToPrint);
      //  console.log("O print:", resultToPrint);
      //setShouldPrint(null); // Activamos impresión

      setLoadingSave(false);
      showNotification(LANG.CREATEORDER.CREATEDSUCC, "success");
      await getOrders();
      setOpen(false);
      /*  printWindowRef.current = window.open(
        "",
        "PRINT",
        "width=1000,height=600,top=100,left=100,toolbar=no,menubar=no",
      );
      setShouldPrint((prev) => prev + 1); */

      setTimeout(() => {
        printWindowRef.current = window.open(
          "",
          "PRINT",
          "width=1000,height=600,top=100,left=100",
        );

        setShouldPrint((prev) => prev + 1);
      }, 100);

      setcustomerSelected(null);
      console.log("Guardado:", result);
    } catch (error) {
      setLoadingSave(false);
      showNotification(error.message || "Erro ao criar pedido", "error");
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
                  loading={loading}
                  value={customerSelected}
                  getOptionLabel={(option) => option?.name || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                  onInputChange={(event, value, reason) => {
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
                    if (!customer) {
                      setcustomerSelected(null);
                      reset();
                      setValue("observations", "");
                      return;
                    }
                    setcustomerSelected(customer);
                    setValue("customer_id", customer.id);
                    setLoading(false);

                    setValue("document", customer.document ?? "");
                    setValue("name", customer.name ?? "");
                    setValue("phone", customer.phones[0]?.number ?? "");
                    setValue("cep", customer.addresses[0]?.cep ?? "");
                    setValue("street", customer.addresses[0]?.street ?? "");
                    setValue("number", customer.addresses[0]?.number ?? "");
                    setValue(
                      "complement",
                      customer.addresses[0]?.complement ?? "",
                    );
                    setValue(
                      "neighborhood",
                      customer.addresses[0]?.neighborhood ?? "",
                    );
                    setValue("city", customer.addresses[0]?.city ?? "");
                    setValue("state", customer.addresses[0]?.state ?? "");

                    setValue(
                      "observations",
                      customer.observation?.content ?? "",
                    );

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
                    ["document", LANG.CREATEORDER.DOCUMENT],
                    ["name", LANG.CREATEORDER.NOME],
                    ["phone", LANG.CREATEORDER.TELEFONE],
                    ["cep", LANG.CREATEORDER.CEP],
                    ["street", LANG.CREATEORDER.STREET],
                    ["number", LANG.CREATEORDER.NUMBER],
                    ["complement", LANG.CREATEORDER.COMPLEMENT],
                    ["neighborhood", LANG.CREATEORDER.NEIGHBORHOOD],
                    ["city", LANG.CREATEORDER.CITY],
                    ["state", LANG.CREATEORDER.STATE],
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
                            value={field.value || " "}
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
            title={LANG.CREATEORDER.TITLECOLLAPSE}
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
                      label={LANG.CREATEORDER.ITEMS}
                      required
                      sx={{
                        "& .MuiFormLabel-asterisk": {
                          color: "red",
                        },
                      }}
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
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel
                          id="payment-label"
                          required
                          sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}
                        >
                          {LANG.CREATEORDER.PAYMENT}
                        </InputLabel>

                        <Select
                          {...field}
                          label={LANG.CREATEORDER.PAYMENT}
                          labelId="payment-label"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={!!errors?.payment_types_id}
                          helperText={errors?.payment_types_id?.message}
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
                    rules={{ required: "Campo obligatorio" }}
                    defaultValue=""
                    render={({ field }) => (
                      <FormControl
                        sx={{ width: "100%" }}
                        required
                        error={!!errors?.entry_id}
                      >
                        <InputLabel
                          id="entry-label"
                          required
                          sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}
                        >
                          {LANG.CREATEORDER.ENTRY}
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="entry-label"
                          label={LANG.CREATEORDER.ENTRY}
                          fullWidth
                        >
                          {entries.map((entry) => (
                            <MenuItem key={entry.id} value={entry.id}>
                              {entry.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors?.entry_id && (
                          <FormHelperText>
                            {errors.entry_id?.message}
                          </FormHelperText>
                        )}
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
                      label={LANG.CREATEORDER.DETAIL}
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
                      label={LANG.CREATEORDER.OBSERVATION}
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
                    md: "0.5fr 1fr 1fr",
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
                        <Checkbox {...field} checked={field.value || false} />
                      }
                      label={LANG.CREATEORDER.SCHEDULED}
                    />
                  )}
                />

                {/* {agendado && ( */}
                <>
                  {/* FECHA */}
                  <Controller
                    name="delivery_date"
                    disabled={!agendado}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={LANG.CREATEORDER.DELIVERYDATE}
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }} // para que la etiqueta no se superponga
                        error={!!errors?.delivery_date}
                        helperText={errors?.delivery_date?.message}
                      />
                    )}
                  />

                  {/* HORA */}
                  <Controller
                    name="delivery_hour"
                    disabled={!agendado}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="time"
                        label={LANG.CREATEORDER.DELIVERYHOUR}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors?.delivery_hour}
                        helperText={errors?.delivery_hour?.message}
                      />
                    )}
                  />
                </>
                {/*    )} */}
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
                <Box sx={{ width: { xs: "100%", md: "calc(25% - 8px)" } }}>
                  <Controller
                    name="pickup"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox {...field} checked={field.value || false} />
                        }
                        label={LANG.CREATEORDER.PICKUP}
                        sx={{ width: "100%" }}
                      />
                    )}
                  />
                </Box>
                {/* Taxa entrega */}
                <Box sx={{ width: { xs: "100%", md: "calc(37% - 8px)" } }}>
                  <Controller
                    name="rate_id"
                    control={control}
                    render={({ field }) => (
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="taxa-label">
                          {LANG.CREATEORDER.RATE}
                        </InputLabel>

                        <Select
                          {...field}
                          label={LANG.CREATEORDER.RATE}
                          labelId="taxa-label"
                          value={field.value ?? null}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        >
                          {rates.map((rate) => (
                            <MenuItem key={rate.id} value={rate.id}>
                              {rate.rate}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Box>
                {/* Pago */}
                <Box sx={{ width: { xs: "100%", md: "calc(33% - 8px)" } }}>
                  <Controller
                    name="paid"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox {...field} checked={field.value || false} />
                        }
                        label={LANG.CREATEORDER.PAID}
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
            disabled={!isValid || loadingSave}
          >
            {/* </Button><Button type="submit" variant="contained" disabled={!isValid}> */}
            {loadingSave ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Salvar pedido"
            )}
          </Button>
        </DialogActions>
      </form>
      <PrintOrder
        order={order}
        shouldPrint={shouldPrint}
        printWindowRef={printWindowRef}
        // onPrinted={() => setShouldPrint(false)}
      />
    </>
  );
}
