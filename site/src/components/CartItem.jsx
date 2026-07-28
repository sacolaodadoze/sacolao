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
  Tooltip,
} from "@mui/material";
//import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function CartItem({ item, checkout = false }) {
  const cartContext = useCart();

  const { updateQuantity, removeFromCart } = useCart();
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        py: 0.8,
        alignItems: "flex-start",
      }}
    >
      {/* Imagen */}
      <Tooltip
        title={item.name || ""}
        arrow
        slotProps={{
          popper: {
            sx: {
              zIndex: (theme) => theme.zIndex.drawer + 99999999,
            },
          },
        }}
      >
        <Box
          component="img"
          src={item.image || "/images/no-image.png"}
          /*   alt={item.name} */
          sx={{
            /*  width: 72,
          height: 90, */
            width: checkout ? 70 : 62,
            height: checkout ? 70 : 60,
            objectFit: "cover",
            borderRadius: 1,
            flexShrink: 0,
          }}
        />
      </Tooltip>
      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          /*  variant="body2" */
          variant={checkout ? "h6" : "body1"}
          fontWeight={600}
          noWrap
          sx={{ fontSize: "0.85rem" }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 1 }}
        >
          {item.variant}
        </Typography>

        {/* Qty controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              width: "fit-content",
            }}
          >
            <IconButton
              size="small"
              onClick={() => updateQuantity(item.id, -1)}
              disabled={item.quantity <= 1}
              sx={{ p: 0.5 }}
            >
              <RemoveIcon sx={{ fontSize: 14 }} />
            </IconButton>
            <Typography
              sx={{ px: 1.5, fontSize: "0.8rem", userSelect: "none" }}
            >
              {item.quantity}
            </Typography>
            <IconButton
              size="small"
              onClick={() => updateQuantity(item.id, 1)}
              sx={{ p: 0.5 }}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
            /{item.unit}
          </Typography>
        </Box>
      </Box>

      {/* Precio + eliminar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 1,
        }}
      >
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{ fontSize: "0.85rem" }}
        >
          ${(item.price * item.quantity).toFixed(2)}
        </Typography>
        <IconButton
          size="small"
          onClick={() => removeFromCart(item.id)}
          sx={{ color: "text.disabled" }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
