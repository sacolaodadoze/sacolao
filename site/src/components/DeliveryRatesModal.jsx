import { useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/apiFetch.js";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
//import { useNotification } from "../context/NotificationContext.jsx"; // ajustá el path real
import { Address } from "./Address.jsx";

export function DeliveryRatesModal({ open, onClose }) {
  // const { showNotification } = useNotification();

  const { control, setValue, watch, reset } = useForm({
    defaultValues: {
      cep: "",
      street: "",
      number: "",
     /*  complement_rate: "",
      neighborhood_rate: "", */
      city: "",
      state: "",
    },
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: rates, isLoading: loadingRates } = useQuery({
    queryKey: ["delivery-rates"],
    queryFn: () => apiFetch("/api/store/delivery-rates").then((r) => r.json()),
    enabled: open,
    staleTime: Infinity,
  });

  const handleCheck = async () => {
    const values = {
      cep: watch("cep"),
      street: watch("street"),
      number: watch("number"),
      city: watch("city"),
      state: watch("state"),
    };

    if (!values.street || !values.city || !values.state) {
      setError("Preencha ao menos rua, cidade e estado");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await apiFetch("/api/store/calculate-rate", {
        method: "POST",
        body: JSON.stringify({ ...values, order_total: 0 }),
      });
      const data = await res.json();

      if (data.out_of_range) {
        setError("Endereço fora da área de entrega");
      } else {
        setResult(data);
      }
    } catch (e) {
      setError("Erro ao calcular a taxa");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset(); // limpia el form al cerrar
    setResult(null);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth  sx={{ zIndex: 99999999999 }}>
      <DialogTitle>Taxa de entrega</DialogTitle>

      <DialogContent>
        <Typography variant="subtitle2" gutterBottom>
          Tabela de valores por distância
        </Typography>

        {loadingRates ? (
          <CircularProgress size={24} />
        ) : (
          <Table size="small" sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>Distância</TableCell>
                <TableCell align="right">Taxa</TableCell>
                <TableCell align="right">Pedido mínimo p/ grátis</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rates?.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>
                    {rate.max_distance
                      ? `${Number(rate.min_distance).toFixed(1)} - ${Number(rate.max_distance).toFixed(1)} km`
                      : `Acima de ${Number(rate.min_distance).toFixed(1)} km`}
                  </TableCell>
                  <TableCell align="right">
                    {rate.free_delivery
                      ? "Grátis"
                      : `R$ ${Number(rate.delivery_fee).toFixed(2)}`}
                  </TableCell>
                  <TableCell align="right">
                    {Number(rate.minimum_order) > 0
                      ? `R$ ${Number(rate.minimum_order).toFixed(2)}`
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" gutterBottom>
          Ou consulte pelo seu endereço
        </Typography>

        <Address         
          control={control}
          setValue={setValue}
          watch={watch}
          /*  showNotification={showNotification} */
        />

        <Button
          variant="contained"
          onClick={handleCheck}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={20} /> : "Consultar"}
        </Button>

        {error && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Sua taxa de entrega:{" "}
            <strong>
              {Number(result.delivery_fee) === 0
                ? "Grátis 🎉"
                : `R$ ${Number(result.delivery_fee).toFixed(2)}`}
            </strong>{" "}
            ({result.distance} km)
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
