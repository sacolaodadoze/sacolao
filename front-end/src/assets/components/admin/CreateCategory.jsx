import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { useEffect,useState } from "react";
import { use } from "react";

import { Controller, useForm } from "react-hook-form";
import {Loader} from "./Loader.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";

export function CreateCategory({
  open,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      position: initialData?.position || 0,
      active: initialData?.active ?? true,
      image: initialData?.image || "",
    },
  });


  const submit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? "Editar categoria" : "Nova categoria"}
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
          }}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Nome" fullWidth />
            )}
          />

          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Slug"
                fullWidth
                helperText="Ex: frutas"
              />
            )}
          />

          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Ordem" type="number" fullWidth />
            )}
          />

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Imagem (URL)" fullWidth />
            )}
          />

          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Categoria ativa"
              />
            )}
          />
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
