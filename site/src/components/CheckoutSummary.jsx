import { Paper, Typography, Divider, Box, Button, Alert } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useContext } from "react";

import { useCart } from "../context/CartContext.jsx";
import {
  calculateEstimatedDelivery,
  CalculateScheduleDelivery,
} from "../utils/deliveryUtils";
import { SettingsContext } from "../context/SettingsContext.jsx";
import { useDeliverySlots } from "../hooks/useDeliverySlots";
import { useWatch } from "react-hook-form";

export function CheckoutSummary({ checkoutError }) {
  const { settings } = useContext(SettingsContext);
  //console.log( settings.is_closed,checkoutError);
  const { settingsDelivery } = useDeliverySlots();
  // console.log("Sumary",settingsDelivery);

  const {
    watch,
    setValue,
    control,
    formState: { isSubmitting },
  } = useFormContext();

  const { cartItems } = useCart();

  const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const delivery = 5; // luego vendrá de la BD

  const total = subtotal + delivery;

  const scheduled = watch("scheduled");
  const deliveryDate = watch("delivery_date");
  const deliveryHour = watch("delivery_hour");
  const deliveryType = useWatch({ control, name: "deliveryType" });
  //console.log(deliveryType);

  /* const prevision = checkoutError
    ? ""
    : deliveryType === "pickup"
      ? calculateEstimatedPickup(settings)
      : scheduled && deliveryDate && deliveryHour
        ? CalculateScheduleDelivery(
            deliveryHour,
            deliveryDate,
            settingsDelivery,
            settings.is_closed,
          )
        : calculateEstimatedDelivery(settings); */
  const prevision = checkoutError
    ? ""
    : scheduled && deliveryDate && deliveryHour
      ? CalculateScheduleDelivery(
          deliveryHour,
          deliveryDate,
          settingsDelivery,
          settings.is_closed,
        )
      : calculateEstimatedDelivery(settings, deliveryType === "pickup");

  // console.log("previson",prevision)

  return (
    <>
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          position: "sticky",
          top: 20,
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          Resumo
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            mb: 1,
            alignItems: "center",
          }}
        >
          <Typography color="text.secondary">Itens</Typography>

          <Typography fontWeight={600}>{items}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            mb: 1,
            alignItems: "center",
          }}
        >
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography>R$ {subtotal.toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            mb: 1,
            alignItems: "center",
          }}
        >
          <Typography color="text.secondary">Entrega</Typography>
          <Typography>{/* R$ {delivery.toFixed(2)} */}</Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            mb: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Total
          </Typography>

          <Typography variant="h6" fontWeight={700} color="success.main">
            R$ {total.toFixed(2)}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            mb: 1,
            alignItems: "center",
          }}
        >
          <Typography color="text.secondary">
            {deliveryType === "pickup"
              ? "Retirada a partir das"
              : "Previsão de entrega"}
          </Typography>
          <Typography>
            {" "}
            <strong>
              {deliveryType === "pickup"
                ? prevision.split(" ").pop()
                : prevision}
            </strong>
          </Typography>
        </Box>

        {checkoutError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {checkoutError}
          </Alert>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="contained"
          fullWidth
          size="large"
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 700,
            backgroundColor: "var(--primary)",
          }}
        >
          Finalizar Pedido
        </Button>
        {/*   <Typography variant="h6" fontWeight={700} mb={3}>
          Horário
        </Typography>
        <p style={{ textDecoration: "solid" }}>Segunda-feira a Sexta-feira</p>
        <p>
          {settings.weekday_open_morning} às {settings.weekday_close_morning} -{" "}
          {settings.weekday_open_afternoon} às{" "}
          {settings.weekday_close_afternoon}
        </p>
        <p style={{ textDecoration: "solid" }}>Sábado</p>
        <p>
          {settings.saturday_open} às {settings.saturday_close}
        </p>
        <p style={{ textDecoration: "solid" }}>Domingos e Feriados</p>
        <p>
          {settings.sunday_open} às {settings.sunday_close}
        </p> */}
      </Paper>
    </>
  );
}
