import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import { useNotification } from "../context/NotificationContext.jsx"; //msg de info
import { LANG } from "../constants/languages.js";
import { schema } from "../../forms/orderEditForm.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "../../api/apiFetch.js";
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
  Box,
  CircularProgress,
  FormHelperText,
} from "@mui/material";

export default function EditOrder({
  open,
  setOpen,
  order,
  getOrders,
  paymentTypes,
  entries,
  rates,
}) {
  // console.log("EditOrder  order:", order, "setOpen:", setOpen);
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
      rate_id: "",
    },
  });
  const [saving, setSaving] = useState(false);
  const horaFormateada = order.delivery_hour?.substring(0, 5);
  useEffect(() => {
    if (order) {
      reset({
        id: order.id,
        customer_id: order.customer_id,
        name: order.customer?.name,
        items: order.items?.split("||").join("\n") || "", // convertir de nuevo a formato multilinea para el textarea
        payment_types_id: order.payment_types_id,
        entry_id: order.entry_id,
        details: order.detail?.description || "",
        observations: order.customer?.observation?.content || "",
        scheduled: order.delivery_hour && order.delivery_date ? true : false,
        delivery_date: order.delivery_date || "",
        delivery_hour: horaFormateada || "",
        pickup: order.pickup,
        paid: order.paid,
        rate_id: order.rate_id || "",
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
    data.customerChanged = false; //obrigatorio, significa que não tem mudanças o cliente
    if (data.rate_id === 0) {
      data.rate_id = null;
    }
    //Formato de los items del pedido
    const itemstWithSeparator = data.items.split("\n").join("||");
    data.items = itemstWithSeparator;
    try {
      setSaving(true);
      const res = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(result.message || LANG.EDITORDER.ERRORUPD, "error");
      }

      const result = await res.json();
      console.info("edit", result);

      getOrders();
      setSaving(false);
      showNotification(LANG.EDITORDER.SUCCESSUPD, "success");

      setOpen(false);
    } catch (error) {
      console.error("Error", error.message);
      showNotification(error.message || LANG.EDITORDER.ERRORUPD, "error");
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
                      label={LANG.CREATEORDER.ITEMS}
                      required
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
                        <InputLabel id="payment-label" required>
                          {LANG.CREATEORDER.PAYMENT}
                        </InputLabel>

                        <Select
                          {...field}
                          labelId="payment-label"
                          label={LANG.CREATEORDER.PAYMENT}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={!!errors?.payment_types_id}
                          // helperText={errors?.payment_types_id?.message}
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
                    // rules={{ required: "Campo obligatorio" }}
                    render={({ field }) => (
                      <FormControl
                        sx={{ width: "100%" }}
                        required
                        error={!!errors?.entry_id}
                      >
                        <InputLabel id="entry-label" required>
                          {LANG.CREATEORDER.ENTRY}
                        </InputLabel>

                        <Select
                          {...field}
                          labelId="entry-label"
                          label={LANG.CREATEORDER.ENTRY}
                          fullWidth
                          // error={!!errors?.entry_id}
                          //  helperText={errors?.entry_id?.message}
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
                  defaultValue={order?.customer?.observation?.content || ""}
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
                        <Checkbox
                          {...field}
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label={LANG.CREATEORDER.SCHEDULED}
                    />
                  )}
                />

                {/*   {agendado && ( */}
                <>
                  {/* FECHA */}
                  <Controller
                    name="delivery_date"
                    disabled={!agendado}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
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
                    // defaultValue={order.delivery_hour || ""}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
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
                {/*  )} */}
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
                <Box sx={{ width: { xs: "100%", md: "calc(24% - 8px)" } }}>
                  <Controller
                    name="pickup"
                    control={control}
                    defaultValue={order.pickup}
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
                        <InputLabel id="rate-label">
                          {LANG.CREATEORDER.RATE}
                        </InputLabel>

                        <Select
                          {...field}
                          labelId="rate-label"
                          label={LANG.CREATEORDER.RATE}
                          fullWidth
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
                        label={LANG.CREATEORDER.PAID}
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
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || saving}
        >
          {saving ? <CircularProgress size={20} /> : "Salvar mudanças"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
