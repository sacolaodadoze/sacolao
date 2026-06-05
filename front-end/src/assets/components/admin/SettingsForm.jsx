import { useEffect, useState, useContext } from "react";

import React from "react";

import {
  TextField,
  Stack,
  Box,
  Button,
  CircularProgress,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { settingsSchema } from "../../../forms/settingsForm.js";

import { apiFetch } from "../../../api/apiFetch.js";
import { LANG } from "../../constants/languages.js";

import { useNotification } from "../../context/NotificationContext.jsx";
import { Loader } from "./Loader.jsx";

export function SettingsForm() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingsSchema),

    defaultValues: {
      business_name: "",

      phone: "",

      secondary_phone: "",

      whatsapp: "",

      instagram: "",

      facebook: "",

      address: "",

      city: "",

      state: "",

      google_maps_url: "",
      weekday_open_morning: "",
      weekday_close_morning: "",
      weekday_open_afternoon: "",
      weekday_close_afternoon: "",
      saturday_open: "",
      saturday_close: "",
      sunday_open: "",
      sunday_close: "",

      info: "",
      delivery_time: "",
      free_rate: "",
      is_closed: false,

      whatsapp_default_message: "",
    },
  });

  // LOAD SETTINGS

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/api/settings");       
        const response = await res.json();
        //console.log(response);
        if (response) {
          const data = Array.isArray(response) ? response[0] : response;

          const formattedData = {
            ...data,

            weekday_open_morning: data.weekday_open_morning?.slice(0, 5) || "",

            weekday_close_morning:
              data.weekday_close_morning?.slice(0, 5) || "",

            weekday_open_afternoon:
              data.weekday_open_afternoon?.slice(0, 5) || "",

            weekday_close_afternoon:
              data.weekday_close_afternoon?.slice(0, 5) || "",

            saturday_open: data.saturday_open?.slice(0, 5) || "",

            saturday_close: data.saturday_close?.slice(0, 5) || "",

            sunday_open: data.sunday_open?.slice(0, 5) || "",

            sunday_close: data.sunday_close?.slice(0, 5) || "",
          };

          reset(formattedData);
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
    console.info(data);
    setLoadingSave(true);

    try {
      /*      await apiFetch("/sanctum/csrf-cookie"); */

      await apiFetch("/api/settings", {
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

  const renderTextField = (
    name,
    label,
    type = "text",
    multiline = false,
    rows = 1,
  ) => (
    <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value ?? ""}
            label={label}
            type={type}
            multiline={multiline}
            rows={rows}
            fullWidth
            InputLabelProps={type === "time" ? { shrink: true } : undefined}
            error={!!errors[name]}
            helperText={errors[name]?.message}
          />
        )}
      />
    </Box>
  );

  return (
    <form /* onSubmit={handleSubmit(onSubmit)} */>
      <Stack spacing={3}>
        {/* NEGÓCIO */}

        <Box>
          <Typography variant="h6">{LANG.SETTINGS.BUSINESS}</Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
            }}
          >
            {renderTextField("business_name", LANG.SETTINGS.BUSINESS)}

            {renderTextField("phone", LANG.SETTINGS.PHONE)}

            {renderTextField("secondary_phone", LANG.SETTINGS.SECONDARY_PHONE)}

            {renderTextField("whatsapp", LANG.SETTINGS.WHATSAPP)}
          </Box>
        </Box>

        {/* REDES */}

        <Box>
          <Typography variant="h6">{LANG.SETTINGS.SOCIAL}</Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
            }}
          >
            {renderTextField("instagram", LANG.SETTINGS.INSTAGRAM)}

            {renderTextField("facebook", LANG.SETTINGS.FACEBOOK)}
          </Box>
        </Box>

        {/* ENDEREÇO */}

        <Box>
          <Typography variant="h6">{LANG.SETTINGS.ADDRESS}</Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
            }}
          >
            {renderTextField("address", LANG.SETTINGS.STREET)}

            {renderTextField("city", LANG.SETTINGS.CITY)}

            {renderTextField("state", LANG.SETTINGS.STATE)}
            {renderTextField("google_maps_url", LANG.SETTINGS.GOOGLE_MAPS_URL)}
          </Box>
        </Box>

        {/* HORÁRIOS */}

        <Box>
          <Typography variant="h6">{LANG.SETTINGS.HOURS}</Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
            }}
          >
            {renderTextField(
              "weekday_open_morning",
              LANG.SETTINGS.WEEKDAY_OPEN_MORNING,
              "time",
            )}

            {renderTextField(
              "weekday_close_morning",
              LANG.SETTINGS.WEEKDAY_CLOSE_MORNING,
              "time",
            )}

            {renderTextField(
              "weekday_open_afternoon",
              LANG.SETTINGS.WEEKDAY_OPEN_AFTERNOON,
              "time",
            )}

            {renderTextField(
              "weekday_close_afternoon",
              LANG.SETTINGS.WEEKDAY_CLOSE_AFTERNOON,
              "time",
            )}

            {renderTextField(
              "saturday_open",
              LANG.SETTINGS.SATURDAY_OPEN,
              "time",
            )}
            {renderTextField(
              "saturday_close",
              LANG.SETTINGS.SATURDAY_CLOSE,
              "time",
            )}

            {renderTextField("sunday_open", LANG.SETTINGS.SUNDAY_OPEN, "time")}

            {renderTextField(
              "sunday_close",
              LANG.SETTINGS.SUNDAY_CLOSE,
              "time",
            )}
          </Box>
        </Box>

        {/* Otras Informações */}

        <Box>
          <Typography variant="h6">{LANG.SETTINGS.OTHER}</Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
            }}
          >
            {renderTextField("info", LANG.SETTINGS.INFOSEARCH, "text", true, 1)}

            {renderTextField(
              "delivery_time",
              LANG.SETTINGS.DELIVERYTIME,
              "text",
              true,
              1,
            )}
            {renderTextField(
              "free_rate",
              LANG.SETTINGS.FREE_RATE,
              "text",
              true,
              1,
            )}
            <Controller
              name="is_closed"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label={LANG.SETTINGS.CLOSED}
                />
              )}
            />
          </Box>
        </Box>

        {/* WHATSAPP */}

        <Box>
          <Typography variant="h6">Mensagem padrão WhatsApp</Typography>

          <Box sx={{ mt: 2 }}>
            <Controller
              name="whatsapp_default_message"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mensagem automática para WhatsApp, saludos, promos..."
                  multiline
                  rows={1}
                  fullWidth
                />
              )}
            />
          </Box>
        </Box>

        {/* BUTTON */}

        <Button
          type="submit"
          variant="contained"
          disabled={loadingSave}
          onClick={handleSubmit(onSubmit)}
        >
          {loadingSave ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            LANG.GLOBAL.SAVECONF
          )}
        </Button>
      </Stack>
    </form>
  );
}
