import {
  Paper,
  Typography,
  Divider,
  Box,
  Button,
  Alert,  
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/apiFetch.js";

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

  const scheduled = watch("scheduled");
  const deliveryDate = watch("delivery_date");
  const deliveryHour = watch("delivery_hour");
  const deliveryType = useWatch({ control, name: "deliveryType" });

  const street = useWatch({ control, name: "street" });
  const number = useWatch({ control, name: "number" });
  const city = useWatch({ control, name: "city" });
  const state = useWatch({ control, name: "state" });
  const cep = useWatch({ control, name: "cep" });

  /*   const totalOrder = cartItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  ); */

  const { data: rateData, isLoading: isLoadingRate } = useQuery({
    queryKey: ["rate", cep, street, number, city, state, subtotal],
    queryFn: async () => {
      if (!street || !city || !state) return null;
      const res = await apiFetch("/api/store/calculate-rate", {
        method: "POST",
        body: JSON.stringify({
          cep,
          street,
          number,
          city,
          state,
          order_total: subtotal,
        }),
      });
      return res.json();
    },
    enabled: deliveryType !== "pickup" && !!street && !!city && !!state, //  solo si es delivery y hay dirección
    staleTime: 0, // 0 porque el total puede cambiar si el cliente modifica el carrito
  });

  const deliveryFee = parseFloat(rateData?.delivery_fee ?? 0);
  const total = subtotal + deliveryFee;

  // console.log(rateData);

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
          {/* <Typography color="text.secondary">Entrega</Typography> */}
          <Typography>{/* R$ {delivery.toFixed(2)} */}</Typography>
          {deliveryType !== "pickup" && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Taxa de entrega</Typography>

              {isLoadingRate && (
                <Typography variant="body2">Calculando...</Typography>
              )}

              {rateData?.out_of_range && (
                <Typography color="error">
                  Endereço fora da área de entrega
                </Typography>
              )}

              {rateData?.rate && (
                <>
                  {!rateData.meets_minimum && (
                    <Typography
                      variant="caption"
                      color="warning.main"
                      sx={{ display: "block" }}
                    >
                      Pedido mínimo para taxa reduzida: R${" "}
                      {Number(rateData.rate.minimum_order).toFixed(2)}
                    </Typography>
                  )}
                  <Typography>
                    {Number(rateData.delivery_fee) === 0 // 👈 delivery_fee directo, no rate.delivery_fee
                      ? "Entrega grátis 🎉"
                      : `R$ ${Number(rateData.delivery_fee).toFixed(2)}`}{" "}
                    ({rateData.distance} km)
                  </Typography>
                </>
              )}
            </>
          )}
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
       {/*  <Dialog open={!!scheduleConfirmation} onClose={onCancelSchedule}>
          <DialogTitle>Confirmar horário de entrega</DialogTitle>
          <DialogContent>
            <Typography>{scheduleConfirmation?.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancelSchedule}>Cancelar</Button>
            <Button variant="contained" onClick={onConfirmSchedule}>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog> */}
      </Paper>
    </>
  );
}
