import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";

export function ProductModal({ open, onClose, onSubmit, product = null }) {
  //  console.log(product);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      featured: false,
      promotion: false,
      new_product: false,
      week_offer: false,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        featured: product.featured ?? false,
        promotion: product.promotion ?? false,
        new_product: product.new_product ?? false,
        week_offer: product.week_offer ?? false,
        image: product.image || "",
      });
    }
  }, [product, reset]);

  const submit = (data) => {
    onSubmit(data);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Configuração do Produto</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Dados do Hiper
          </Typography>

          <Divider />

          <TextField
            label="Nome"
            value={product.name || ""}
            disabled
            fullWidth
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 2,
            }}
          >
            <TextField label="Código" value={product.code || ""} disabled />

            <TextField
              label="Categoria"
              value={product.category?.name || "Não definida"}
              disabled
              fullWidth
            />

            <TextField
              label="Peso Médio"
              value={product.average_weight || ""}
              disabled
            />
          </Box>

          <TextField
            label="Descrição"
            value={product.description || "Não definida"}
            disabled
            fullWidth
            rows={3}
          />
          <Divider sx={{ my: 1 }} />
        </Box>

        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0 }}>
          Configuração do Site
        </Typography>
        <Box
          sx={{
            display: "flex",
            // justifyContent: "space-between",
            alignItems: "center",
            gap: 4,
            mt: 1,
          }}
        >
          {/* CHECKBOXES */}
          <Box sx={{ display: "flex", flexDirection: "column",   width: 390 }}>
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="⭐ Produto destaque"
                />
              )}
            />

            <Controller
              name="promotion"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="🔥 Promoção"
                />
              )}
            />

            <Controller
              name="new_product"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="🆕 Novidade"
                />
              )}
            />

            <Controller
              name="week_offer"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="🥩 Oferta da Semana"
                />
              )}
            />
          </Box>

          <Box
            sx={{
              width: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Imagem do Produto
            </Typography>

            <img
              src={product.image || "/no-image.png"}
              alt={product.name}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "contain",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>

        <Button variant="contained" onClick={handleSubmit(submit)}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
