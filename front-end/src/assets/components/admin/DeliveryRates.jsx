import { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
/* import { TrashIcon, EditIcon } from "../Icons"; */
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { apiFetch } from "../../../api/apiFetch.js";
import { LANG } from "../../constants/languages.js";
/* import { settingsSchema } from "../../../forms/rateSettingsForm.js" */
import { Loader } from "./Loader.jsx";
import AddIcon from "@mui/icons-material/Add";

import { useNotification } from "../../context/NotificationContext.jsx";

export function DeliveryRatesForm() {
  const { showNotification } = useNotification();
  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      rates: [
        {
          min_distance: 0,
          max_distance: 1.5,
          minimum_order: 60,
          delivery_fee: 0,
        },
      ],
    },
  });

  // ARRAY DINÁMICO
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "rates",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);

      try {
        const res = await apiFetch("/api/delivery-rates");

        const data = await res.json();
        // console.log(data);

        if (data) {
          replace(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [reset]);

  // SAVE
  const onSubmit = async (data) => {
    console.log(data.rates);
    setLoadingSave(true);

    try {
      await apiFetch("/sanctum/csrf-cookie");

      await apiFetch("/api/delivery-rates", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      showNotification(LANG.GLOBAL.CONF, "success");
    } catch (error) {
      showNotification(LANG.GLOBAL.ERRORCONF, "error");
      console.error(error);
    } finally {
      setLoadingSave(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Typography variant="h5" className="page-title">
          Taxas de entrega
        </Typography>
        {/* ADD */}
        <Button
          variant="outlined"
          size="small"
          sx={{
            alignSelf: "flex-end",
            borderColor: "#f97316",
            color: "#f97316",
            borderRadius: "12px",
            "&:hover": {
              backgroundColor: "#f97316",
              color: "#fff",
              opacity: 0.9,
            },
          }}
          onClick={() =>
            append({
              min_distance: 0,
              max_distance: "",
              minimum_order: 0,
              delivery_fee: 0,
            })
          }
        >
          <AddIcon fontSize="small" /> {LANG.RATES.TAXA}
        </Button>

        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              padding: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
              }}
            >
              {/* DISTÂNCIA INICIAL */}

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "calc(25% - 8px)",
                  },
                }}
              >
                <Controller
                  name={`rates.${index}.min_distance`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={LANG.RATES.INITIALDISTANCE}
                      type="number"
                      fullWidth
                    />
                  )}
                />
              </Box>

              {/* DISTÂNCIA FINAL */}

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "calc(25% - 8px)",
                  },
                }}
              >
                <Controller
                  name={`rates.${index}.max_distance`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={LANG.RATES.FINALDISTANCE}
                      type="number"
                      fullWidth
                    />
                  )}
                />
              </Box>

              {/* PEDIDO MÍNIMO */}

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "calc(25% - 8px)",
                  },
                }}
              >
                <Controller
                  name={`rates.${index}.minimum_order`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={LANG.RATES.MINORDER}
                      type="number"
                      fullWidth
                    />
                  )}
                />
              </Box>

              {/* TAXA */}

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "calc(20% - 8px)",
                  },
                }}
              >
                <Controller
                  name={`rates.${index}.delivery_fee`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={LANG.RATES.TAXA}
                      type="number"
                      fullWidth
                    />
                  )}
                />
              </Box>

              {/* DELETE */}

              <IconButton color="error" onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        {/* SAVE */}

        <Button type="submit" variant="contained" disabled={loadingSave}>
          {loadingSave ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Salvar taxa"
          )}
        </Button>
      </Stack>
    </form>
  );
}
