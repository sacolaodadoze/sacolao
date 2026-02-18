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
  console.log(order);
  const { showNotification } = useNotification();

  const {
    control,
    handleSubmit,
    reset,
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

  /*   useEffect(() => {
  if (order) {
    reset({
      payment_types_id: Number(order.payment_types_id),
    });
  }
}, [order, reset]); */

 /*  const handleClose = () => {
    setOpen(false);
  }; */

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
      <DialogTitle>{LANG.ORDERSLIST.WCREATE}</DialogTitle>
      <DialogContent>
        {order && (
          <form style={{ width: "100%", gap: 2 }}>
            <TextField
              label="Cliente"
              value={order.customer?.name || ""}
              fullWidth
              disabled
            />
            <Stack spacing={3}>
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
            </Stack>
          </form>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={()=>setOpen(false)}>Cancelar</Button>
        <Button variant="contained">Guardar cambios</Button>
      </DialogActions>
    </Dialog>
  );
}
