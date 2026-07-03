import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack,
  Badge,
  Drawer,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem.jsx";

/* ─────────────────────────────────────────────
   CartDrawer — panel lateral
───────────────────────────────────────────── */
export function CartDrawer({ open, onClose, totalItems }) {
  const cartContext = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout");
  };

  const { cartItems = [], updateQuantity, removeFromCart } = useCart();
  // console.log("cartItems",cartItems);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cantItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  // const shipping = subtotal > 200 ? 0 : 15;
  //const total = subtotal /* + shipping */;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 9999 }}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 420 },
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* ── Header ── */}

      <Box
        className="cart-header"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "var(--primary)",
          color: "var(--surface)",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1rem" }}>
            Seu carrinho
          </Typography>
          <ShoppingCartIcon fontSize="small" />
          <Badge
            badgeContent={totalItems}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "var(--surface)",
                color: "var(--primary)",
                ml: 0.5,
              },
            }}
          />
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ color: "var(--surface)" }} />
        </IconButton>
      </Box>

      {/* ── Items (scrollable) ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3 }}>
        {cartItems.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              py: 6,
              color: "text.secondary",
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 56, opacity: 0.2 }} />
            <Typography variant="body2">|Seu carrinho está vacío</Typography>
          </Box>
        ) : (
          cartItems.map((item, idx) => (
            <Box key={item.id}>
              <CartItem
                item={item}
                /* onQtyChange={updateQuantity}
                onRemove={removeFromCart} */
              />
              {idx < cartItems.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Box>

      {/* ── Footer con resumen ── */}
      {cartItems.length > 0 && (
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "background.default",
          }}
        >
          {/* Subtotal */}
          <Stack spacing={1} mb={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Itens
              </Typography>
              <Typography variant="body2">{cantItems}</Typography>
            </Box>
            {/*   <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Envío
              </Typography>
              <Typography
                variant="body2"
                color={shipping === 0 ? "success.main" : "inherit"}
              >
                {shipping === 0 ? "Gratis 🎉" : `$${shipping.toFixed(2)}`}
              </Typography>
            </Box>
            {shipping > 0 && (
              <Typography variant="caption" color="text.secondary">
                Envío gratis comprando más de $200
              </Typography>
            )} */}
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* Total */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}
          >
            <Typography fontWeight={700}>Total</Typography>
            <Typography fontWeight={700}>${total.toFixed(2)}</Typography>
          </Box>

          {/* CTA */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleCheckout}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
              backgroundColor: "var(--accent-orange)",
            }}
          >
            Finalizar Compra
          </Button>
          <Button
            variant="text"
            fullWidth
            size="small"
            onClick={onClose}
            sx={{ mt: 1, textTransform: "none", color: "text.secondary" }}
          >
            Seguir comprando
          </Button>
        </Box>
      )}
    </Drawer>
  );
}

/* ─────────────────────────────────────────────
   Demo wrapper — muestra el botón para abrirlo
───────────────────────────────────────────── */
export default function App() {
  const [openCart, setOpenCart] = useState(false);

  return (
    <Box sx={{ p: 4 }}>
      <Button
        variant="contained"
        onClick={() => setOpenCart(true)}
        startIcon={<ShoppingCartIcon />}
      >
        Abrir carrito
      </Button>

      {/* Así lo integras en tu layout real: */}
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </Box>
  );
}
