import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HomeIcon from "@mui/icons-material/Home";

import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LineWeight } from "@mui/icons-material";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.order) return <Navigate to="/" replace />;

  const order = state.order;
  const itemsList = order.items?.split("\n") ?? [];

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4, px: 2 }}>
      <Card elevation={3}>
        <CardContent>
          {/* header */}
          <Box textAlign="center" mb={3}>
            <CheckCircleIcon color="success" sx={{ fontSize: 70 }} />
            <Typography variant="h4" fontWeight="bold" mt={2}>
              Pedido realizado!
            </Typography>
            <Typography color="text.secondary">
              Recebemos seu pedido e já estamos preparando tudo.
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* info do pedido */}
          <Typography variant="h6" gutterBottom>
            Informações do pedido
          </Typography>
          <Typography>
            <strong>Pedido:</strong> {order.number ?? order.id}
          </Typography>
          <Typography>
            <strong>Cliente:</strong> {order.customer?.name}
          </Typography>
          <Typography>
            <strong>Telefone:</strong>{" "}
            {order.customer?.phones?.[0]?.number ?? "Não informado"}
          </Typography>
          <Typography>
            <strong>Pagamento:</strong> {order.payment?.name}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* produtos */}
          <Typography variant="h6" gutterBottom>
            Itens do pedido
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {itemsList.map((item, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography>•</Typography>
                <Typography>{item}</Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* entrega */}
          <Typography variant="h6" gutterBottom>
            Entrega
          </Typography>
          {order.pickup ? (
            <Box display="flex" gap={1} alignItems="center">
              <StoreIcon color="success" />
              <Typography>Retirada na loja</Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center"}}>
                <HomeIcon color="success" />
                <Typography>
                  {order.customer?.addresses?.[0]?.street},{" "}
                  {order.customer?.addresses?.[0]?.number}
                  {order.customer?.addresses?.[0]?.complement &&
                    ` - ${order.customer?.addresses?.[0]?.complement}`}
                </Typography>
              </Box>
              <Typography sx={{ ml: 4 }}>
                {order.customer?.addresses?.[0]?.neighborhood}
              </Typography>
              <Typography sx={{ ml: 4 }}>
                {order.customer?.addresses?.[0]?.city} -{" "}
                {order.customer?.addresses?.[0]?.state}
              </Typography>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          {/* horário */}
          <Typography variant="h6" gutterBottom>
            Horário
          </Typography>
          {/* Agendado */}
          {order.confirmation.scheduled ? (
            <>
              <Box
                sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}
              >
                <EventIcon color="success" />
                <Typography /* sx={{fontStyle:strong}} */>
                  {new Date(
                    order.confirmation.date + "T00:00:00",
                  ).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <AccessTimeIcon color="success" />
                <Typography>
                 Seu pedido chegará até as: {/* {order.confirmation.hourStart} -  */}<strong>{order.confirmation.hourEnd}</strong>
                </Typography>
              </Box>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <LocalShippingIcon color="success" />
              <Typography>
                Previsão de entrega:{" "}
                Até ás <strong>{order.confirmation.estimatedAt}</strong>
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={() => navigate("/")}
            >
              Voltar às compras
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
