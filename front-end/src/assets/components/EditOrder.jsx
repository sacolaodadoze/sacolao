import { useEffect } from "react";
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
  paymentTypes,
  entries,
}) {
  // console.log(order);
  const { showNotification } = useNotification();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      customer_id: order.customer_id,
      name: order.customer?.name,
      items: order.items,
      payment_types_id: order.payment_types_id,
      entry_id: order.entry_id,
      details: order.details,
      observations: order.observations,
      scheduled: order.scheduled,
      delivery_date: order.delivery_date || "",
      delivery_hour: order.delivery_hour || "",
      pickup: order.pickup,
      paid: order.paid,
    },
  });

  const agendado = watch("scheduled");

  return (
    <Dialog
      open={open}
      //onClose={handleClose}
      fullWidth
      maxWidth="sm"
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        setOpen(false);
      }}
    >
      <DialogTitle>{LANG.EDITORDER.WEDIT}</DialogTitle>
      <DialogContent
        class
        style={{
          paddingTop: "24px", // espacio arriba del primer input
          paddingBottom: "24px",
          maxHeight: "400px",
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
                  // defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Itens do pedido"
                      value={order.items || ""}
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
                    defaultValue={order?.payment_types_id || ""}
                    render={({ field }) => (
                      <FormControl
                        sx={{ width: "100%" }}
                        error={!!errors?.payment_types_id}
                        helperText={errors?.payment_types_id?.message}
                      >
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
                    defaultValue={order?.entry_id || ""}
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
                      label="Detalhes"
                      value={order.details || ""}
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
                      value={order.observations || ""}
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
                          label="Data de retirada"
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
          </form>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button variant="contained">Salvar mudanças</Button>
      </DialogActions>
    </Dialog>
  );
}
