import { Box, Paper, Typography, Divider } from "@mui/material";
import { useCart } from "../context/CartContext.jsx";
import CartItem from "./CartItem.jsx";

export  function CheckoutProducts() {
  const { cartItems } = useCart();
  //console.log(cartItems);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        mb: 4,
      }}
    >
    {/*   <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        🛒 Seu Pedido ({cartItems.length} produtos)
      </Typography> */}

      {cartItems.length === 0 ? (
        <Typography color="text.secondary">
          Seu carrinho está vazio.
        </Typography>
      ) : (
        cartItems.map((item, index) => (
          <Box key={item.id}>
            <CartItem
              item={item}
              checkout={true}
            />

            {index < cartItems.length - 1 && (
              <Divider sx={{ my: 2 }} />
            )}
          </Box>
        ))
      )}
    </Paper>
  );
}