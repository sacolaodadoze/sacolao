import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "../context/CartContext";

export function ProductModal({ product, open, onClose }) {
  // console.log(product);
  const { cartItems, addToCart, updateQuantity } = useCart();

  if (!product) return null;

  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity ?? 0;
  const outOfStock = Number(product.stock) <= 0;

  const price = product.unit === "KG" ? product.price_per_unit : product.price;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={window.innerWidth < 600} //  en móvil ocupa toda la pantalla
      sx={{ zIndex: 99999999999 }}
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 }, // sin borderRadius en móvil
          margin: { xs: 0, sm: 2 }, // sin margen en móvil
          maxHeight: { xs: "100%", sm: "90vh" }, // altura completa en móvil
        },
      }}
    >
      {/* botón cerrar */}
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>

      {/* imagen */}
      <Box
        sx={{
          height: 280,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <img
          src={product.image || "/no-image.png"}
          alt={product.name}
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
        />
      </Box>

      <DialogContent sx={{ overflowY: "auto" }}>
        {" "}
        {/* scroll si el contenido es largo */}
        {/* chips */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          {product.featured && <Chip size="small" label="⭐ Destaque" />}
          {product.promotion && (
            <Chip size="small" color="error" label="🔥 Promoção" />
          )}
          {product.new_product && (
            <Chip size="small" color="success" label="🆕 Novo" />
          )}
          {product.week_offer && (
            <Chip size="small" color="warning" label="🥩 Oferta" />
          )}
          {outOfStock && (
            <Chip size="small" color="default" label="Indisponível" />
          )}
        </Box>
        {/* nombre */}
        <Typography variant="h5" className="product-title">
          {product.name}
        </Typography>
        {/* categoría */}
        {product.category?.name && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: 1 }}
          >
            {product.category.name}
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        {/* descripción */}
        {product.description && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {product.description}
          </Typography>
        )}
        {/* precio */}
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}>
          <Typography variant="h5" className="product-price">
            R${" "}
            {new Intl.NumberFormat("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(price)}
            {/* {Number(product.price).toFixed(2)} */}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
            {product.unit === "KG" ? "/ kg" : "/ unidade"}
          </Typography> */}
        </Box>
        {/* precio por unidad si existe */}
        {/*  {product.price_per_unit && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            R$ {Number(product.price_per_unit).toFixed(2)} / unidade
          </Typography>
        )} */}
        <Divider sx={{ my: 2 }} />
        {/* controles */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {quantity > 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid",
                borderColor: "primary.main",
                borderRadius: 2,
              }}
            >
              <IconButton
                size="small"
                onClick={() => updateQuantity(product.id, -1)}
              >
                <RemoveIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Typography sx={{ px: 2, fontWeight: 600 }}>
                {quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => updateQuantity(product.id, 1)}
              >
                <AddIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          ) : (
            <IconButton
              onClick={() => addToCart(product)}
              disabled={outOfStock}
              sx={{
                bgcolor: "accent.yellow",
                backgroundColor: "#f5c518",
                borderRadius: 2,
                px: 3,
                py: 1,
                "&:hover": { backgroundColor: "#f28c28", color: "white" },
              }}
            >
              <AddIcon />
              <Typography sx={{ ml: 1, fontWeight: 600 }}>Adicionar</Typography>
            </IconButton>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
