import { useEffect, useState, useContext } from "react";
import React from "react";
import {
  TextField,
  Stack,
  Box,
  Button,
  CircularProgress,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { settingsSchema } from "../../../forms/deliveryForm.js";

import { apiFetch } from "../../../api/apiFetch.js";

import { LANG } from "../../constants/languages.js";

import { useNotification } from "../../context/NotificationContext.jsx";
import {Loader} from "./Loader.jsx";

export function DeliverySettingsForm() {
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
      weekday_delivery_open_morning: "",
      weekday_delivery_close_morning: "",

      weekday_delivery_open_afternoon: "",
      weekday_delivery_close_afternoon: "",
      saturday_open_delivery: "",
      saturday_close_delivery: "",

      minimum_schedule_minutes: "",
      minimum_hour_to_schedule_same_day: "",
      delivery_window_minutes: "",
      same_day_delivery: "",
      allow_holiday_delivery: "",
      max_schedule_days: "",
    },
  });

  // LOAD SETTINGS

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);

      try {
        const res = await apiFetch("/api/delivery-settings");
        const response = await res.json();
       // console.log(response);

        if (response) {
          const data = Array.isArray(response) ? response[0] : response;
          const formattedData = {
            ...data,
            minimum_schedule_minutes:
              data.minimum_schedule_minutes?.slice(0, 2) || "",
            minimum_hour_to_schedule_same_day:
              data.minimum_hour_to_schedule_same_day?.slice(0, 5) || "",
          };

          reset(formattedData);

          /* reset(data[0]); */
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
    console.log(data);
    setLoadingSave(true);

    try {
      await apiFetch("/sanctum/csrf-cookie");

      await apiFetch("/api/delivery-settings", {
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

  const renderCheckbox = (name, label) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          sx={{
            ml: 0,
          }}
          control={
            <Checkbox
              checked={field.value || false}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          }
          label={label}
        />
      )}
    />
  );
 // console.log(errors);
  return (
    <form /* onSubmit={handleSubmit(onSubmit)} */>
      <Stack spacing={3}>
        {/* <Typography variant="h6">Informações do negócio</Typography>*/}

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
              "weekday_delivery_open_morning",
              LANG.SETTINGS.WEEKDAY_OPEN_MORNING,
              "time",
            )}

            {renderTextField(
              "weekday_delivery_close_morning",
              LANG.SETTINGS.WEEKDAY_CLOSE_MORNING,
              "time",
            )}

            {renderTextField(
              "weekday_delivery_open_afternoon",
              LANG.SETTINGS.WEEKDAY_OPEN_AFTERNOON,
              "time",
            )}

            {renderTextField(
              "weekday_delivery_close_afternoon",
              LANG.SETTINGS.WEEKDAY_CLOSE_AFTERNOON,
              "time",
            )}

            {renderTextField(
              "saturday_open_delivery",
              LANG.SETTINGS.SATURDAY_OPEN,
              "time",
            )}

            {renderTextField(
              "saturday_close_delivery",
              LANG.SETTINGS.SATURDAY_CLOSE,
              "time",
            )}
          </Box>
        </Box>

        {/* Configurações */}
        <Typography variant="h6">{LANG.SETTINGS.OTHER}</Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mt: 2,
            alignItems: "flex-start",
          }}
        >
          {renderTextField(
            "minimum_schedule_minutes",
            LANG.DELIVERYSETTINGS.MINIMUM_SCHEDULE_MINUTES, 
            "number",
          )}
          {renderTextField(
            "minimum_hour_to_schedule_same_day",
            LANG.DELIVERYSETTINGS.MINIMUM_HOUR_TO_SCHEDULE_SAME_DAY,
            "time",
          )}
          {renderTextField(
            "delivery_window_minutes",
            LANG.DELIVERYSETTINGS.DELIVERY_WINDOW_MINUTES,
            "number",
          )}
          {renderTextField(
            "max_schedule_days",
            LANG.DELIVERYSETTINGS.MAX_SCHEDULE_DAYS,
            "number",
          )}
          
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: {
                xs: "100%",
                md: "calc(50% - 8px)",
              },
            }}
          >
            {renderCheckbox(
              "same_day_delivery",
            LANG.DELIVERYSETTINGS.DELIVERY_SAME_DAY,
            )}
          </Box>

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "calc(50% - 8px)",
              },
            }}
          >
            {renderCheckbox(
              "allow_holiday_delivery",
              LANG.DELIVERYSETTINGS.DELIVERY_HOLIDAY,
            )}
          </Box>
        </Box>

        {/* BUTTON */}

        <Button
          type="submit"
          variant="contained"
          /*   disabled={loadingSave} */
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
