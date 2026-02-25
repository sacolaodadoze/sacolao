import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import { useNotification } from "../context/NotificationContext.jsx"; //msg de info
import { LANG } from "../constants/languages.js";
import { schema } from "../../forms/orderEditForm.js";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
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

export default function EditOrder({
  open,
  setOpen,
  order,
  getOrders,
  paymentTypes,
  entries,
}) {
  const { showNotification } = useNotification();
  const [orders, setOrders] = useState([]); //update la order actuaçizada si recargar toda la tabla

  const {
    control,
    handleSubmit,
    reset,
    watch,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: order?.id || null,
      customer_id: "",
      name: "",
      items: "",
      payment_types_id: "",
      entry_id: "",
      details: "",
      observations: "",
      scheduled: false,
      delivery_date: "",
      delivery_hour: "",
      pickup: false,
      paid: false,
      taxa: false,
    },
  });
  const horaFormateada = order.delivery_hour?.substring(0, 5);
  useEffect(() => {
    if (order) {
      reset({
        id: order.id,
        customer_id: order.customer_id,
        name: order.customer?.name,
        items: order.items,
        payment_types_id: order.payment_types_id,
        entry_id: order.entry_id,
        details: order.detail?.description || "",
        observations: order.customer?.observation?.content || "",
        scheduled: order.delivery_hour && order.delivery_date ? true : false,
        delivery_date: order.delivery_date || "",
        delivery_hour: horaFormateada || "",
        pickup: order.pickup,
        paid: order.paid,
        taxa: order.taxa,
      });
    }
  }, [order, reset]);

  const agendado = watch("scheduled");

  useEffect(() => {
    if (!agendado) {
      setValue("delivery_date", "");
      setValue("delivery_hour", "");
    }
  }, [agendado]);

  const onSubmit = async (data) => {
    //const payload = order?.id ? { ...data, id: order.id } : data;
    data.customerChanged = false; //obrigatorio, significa que não tem mudanças o cliente

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
      getOrders();

      if (!res.ok) {
        throw new Error(result.message || "Erro ao criar pedido");
      }

      showNotification("Pedido mudado com sucesso", "success");

      //TODO ver si imprimo aqui
      // Activamos impresión
      // setShouldPrint(true);

      //GetOrder();

      console.log("Guardado:", result);
      setOpen(false);
    } catch (error) {
      console.log("ERRORES:", error);
      showNotification(error.message || "Erro ao criar pedido", "error");
    }
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        setOpen(false);
      }}
    >
      <DialogTitle>{LANG.EDITORDER.WEDIT}</DialogTitle>
      <DialogContent
        dividers
        sx={{
          paddingTop: 3,
          paddingBottom: 3,
        }}
      >
        {order && (
          <form style={{ width: "100%", gap: 2 }}>
            <Stack spacing={3}>
              <TextField
                label="Cliente"
                value={order.customer?.name || ""}
                fullWidth
                disabled
              />

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
                <Box
                  sx={{ width: { xs: "100%", md: "calc(50% - 8px)", gap: 2 } }}
                >
                  <Controller
                    name="payment_types_id"
                    control={control}
                    render={({ field }) => (
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="payment-label">
                          Forma de Pagamento
                        </InputLabel>

                        <Select
                          {...field}
                          labelId="payment-label"
                          label="Forma de Pagamento"
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
                    render={({ field }) => (
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="entry-label">
                          Entrada do pedido
                        </InputLabel>

                        <Select
                          {...field}
                          labelId="entry-label"
                          label="Entrada del pedido"
                          fullWidth
                          error={!!errors?.entry_id}
                          helperText={errors?.entry_id?.message}
                        >
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
                  defaultValue={order?.customer?.observation?.content || ""}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Observaçoes do cliente"
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
                        <Checkbox
                          {...field}
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
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
                      //  defaultValue={order.delivery_date || ""}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          value={field.value ?? ""}
                          label="Data de retirada"
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
                      control={control}
                      // defaultValue={order.delivery_hour || ""}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          value={field.value ?? ""}
                          type="time"
                          label="Hora"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          error={!!errors?.delivery_hour}
                          helperText={errors?.delivery_hour?.message}
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
                <Box sx={{ width: { xs: "100%", md: "calc(33% - 8px)" } }}>
                  <Controller
                    name="pickup"
                    control={control}
                    defaultValue={order.pickup}
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
                <Box sx={{ width: { xs: "100%", md: "calc(32% - 8px)" } }}>
                  <Controller
                    name="paid"
                    control={control}
                    defaultValue={order.paid}
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
                {/* Taxa entrega */}
                <Box sx={{ width: { xs: "100%", md: "calc(33% - 8px)" } }}>
                  <Controller
                    name="taxa"
                    control={control}
                    defaultValue={order.taxa}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox {...field} checked={field.value || false} />
                        }
                        label="Taxa de pago "
                        sx={{ width: "100%" }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Stack>
            <input type="hidden" value={order?.id} {...register("id")} />
          </form>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Salvar mudanças
        </Button>
      </DialogActions>
    </Dialog>
  );
}
