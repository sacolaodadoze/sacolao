import { Paper, Typography, Divider, Box, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { useCart } from "../context/CartContext.jsx";

export function CheckoutSummary() {
  const {
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

  return (
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
        <Typography>R$ {delivery.toFixed(2)}</Typography>
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
    </Paper>
  );
}
