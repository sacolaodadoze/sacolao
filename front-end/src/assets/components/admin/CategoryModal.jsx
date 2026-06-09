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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Loader } from "./Loader.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";
import { LANG } from "../../constants/languages.js";
import { zodResolver } from "@hookform/resolvers/zod"; //validaciones
import { schema } from "../../../forms/categoriesForm.js";

export function CategoryModal({ open, onClose, onSubmit, initialData = null }) {
  //console.log("initialData:", initialData);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      position: initialData?.position || 0,
      active: initialData?.active ?? true,
      image: initialData?.image || "",
    },
  });

  const slugify = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        slug: "",
        position: 0,
        active: true,
        image: "",
      });
    }
  }, [open, initialData, reset]);

  const submit = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? LANG.CATEGORIES.WEDIT : LANG.CATEGORIES.WADD}
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
              <TextField
                {...field}
                value={field.value ?? ""}
                label={LANG.CATEGORIES.NAME}
                fullWidth
                onChange={(e) => {
                  field.onChange(e);
                  setValue("slug", slugify(e.target.value));
                }}
              />
            )}
          />

          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label={LANG.CATEGORIES.SLUG}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                //helperText="Ex: frutas"
              />
            )}
          />

          <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label={LANG.CATEGORIES.ORDER}
                type="number"
                fullWidth
              />
            )}
          />

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label={LANG.CATEGORIES.IMAGE}
                fullWidth
              />
            )}
          />

          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value ?? false}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label={LANG.CATEGORIES.ACTIVE}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{LANG.GLOBAL.CANCEL}</Button>

        <Button
          variant="contained"
          onClick={handleSubmit(submit)}
          disabled={!isValid}
        >
          {LANG.GLOBAL.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
