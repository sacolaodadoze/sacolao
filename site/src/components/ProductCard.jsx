import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { useCart } from "../context/CartContext.jsx";

export function ProductCard({ product }) {
  

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: 220,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
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
        </Box>

        <img
          src={product.image || "/images/no-image.png"}
          /*  alt={product.name} */
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            minHeight: 60,
            fontSize: "1rem",
          }}
        >
          {product.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {product.category?.name || "Sem categoria"}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: 700,
          }}
        >
          R$ {Number(product.price).toFixed(2)}
          {product.unit === "KG" ? "/kg" : ""}
        </Typography>
      </CardContent>

      {/* <CardActions>
        <Button variant="contained" fullWidth disabled={product.stock <= 0}>
          {product.stock > 0 ? "Adicionar" : "Indisponível"}
        </Button>
      </CardActions> */}
      <CardActions>
        {quantity > 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: 1,
              width: "100%",
            }}
          >
            <IconButton
              size="small"
              onClick={() => updateQuantity(product.id, -1)}
            >
              <RemoveIcon sx={{ fontSize: 14 }} />
            </IconButton>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
              {quantity} {product.unit === "KG" ? "kg" : "unid"}
            </Typography>
            <IconButton
              size="small"
              onClick={() => updateQuantity(product.id, 1)}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="contained"
            fullWidth
            disabled={product.stock <= 0}
            onClick={() => addToCart(product)} // 👈 este era el único cambio en el botón que ya tenías
          >
            {product.stock > 0 ? "Adicionar" : "Indisponível"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
