import { useState, useMemo, useEffect } from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NoteAltIcon from "@mui/icons-material/NoteAlt";

import { useWatch, useFormContext, Controller } from "react-hook-form";
/*  import { LANG } from "../../../front-end/src/assets/constants/languages";  */

import { useDeliverySlots } from "../hooks/useDeliverySlots";
import { Switch, MenuItem, Select, InputLabel } from "@mui/material";
import { apiFetch } from "../api/apiFetch";

function ScheduleSection() {
  const {
    control,
    resetField,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();
  const { isValidHour, availableDates, slotsByDate } = useDeliverySlots();

  const scheduled = useWatch({ control, name: "scheduled" });
  const deliveryDate = useWatch({ control, name: "delivery_date" });
  const deliveryHour = useWatch({ control, name: "delivery_hour" });

  return (
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <CalendarMonthIcon sx={{ color: "var(--primary)" }} fontSize="large" />
        <Typography variant="h5" fontWeight={700} mb={2}>
          {/*  📅 */} Agendamento
        </Typography>
      </Box>
      <Controller
        name="scheduled"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={!!field.value}
                onChange={(e) => {
                  const checked = e.target.checked;
                  field.onChange(e.target.checked);

                  if (!checked) {
                    resetField("delivery_date");
                    resetField("delivery_hour");
                  }
                }}
              />
            }
            label="Quero agendar meu pedido"
          />
        )}
      />

      {scheduled && (
        <Grid container spacing={2} mt={1}>
          {/* fecha */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="delivery_date"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.delivery_date}>
                  <InputLabel>Data</InputLabel>
                  <Select {...field} label="Data" value={field.value ?? ""}>
                    {availableDates.map(({ dateKey, label }) => (
                      <MenuItem key={dateKey} value={dateKey}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors.delivery_date?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          {/* hora libre */}
          {/* hora por slots */}
          {deliveryDate && slotsByDate[deliveryDate] && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="delivery_hour"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.delivery_hour}>
                    <InputLabel>Horário</InputLabel>
                    <Select
                      {...field}
                      label="Horário"
                      value={field.value ?? ""}
                    >
                      {slotsByDate[deliveryDate].map((slot) => (
                        <MenuItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.delivery_hour?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
          )}

          {/* estimado — solo si hay hora seleccionada */}
          {/* {estimatedHour && (
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  p: 1.5,
                  bgcolor: "success.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "success.200",
                }}
              >
                🕐 Previsão de entrega: até às <strong>{estimatedHour}</strong>
              </Typography>
            </Grid>
          )} */}
        </Grid>
      )}
    </Paper>
  );
}

export function CheckoutForm({ paymentTypes }) {
 
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

   const needsDocument = useWatch({ control, name: "needs_document" });

  const renderTextField = ({
    name,
    label,
    type = "text",
    multiline = false,
    rows = 1,
    required = false,
    xs = 12,
    md = 6,
  }) => (
    <Grid size={{ xs, md }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={label}
            type={type}
            required={required}
            multiline={multiline}
            rows={rows}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            InputLabelProps={type === "time" ? { shrink: true } : undefined}
          />
        )}
      />
    </Grid>
  );

  return (
    <>
      {/* Datos del cliente */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <PersonIcon sx={{ color: "var(--primary)" }} fontSize="large" />

          <Typography variant="h5" fontWeight={700}>
            Dados do Cliente
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {renderTextField({
            name: "name",
            label: "Nome",
            required: true,
            md: 12,
          })}

          {renderTextField({
            name: "phone",
            label: "Telefone principal",
            required: true,
            md: 6,
          })}

          {renderTextField({
            name: "phoneS",
            label: "Telefone secundário",
            md: 6,
          })}

          {/* solo aparece si el cliente no tenía documento guardado */}
          {needsDocument &&
            renderTextField({
              name: "document",
              label: "CPF/CNPJ",
              required: true,
              md: 12,
            })}

        </Grid>
      </Paper>

      {/* Entrega */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <LocalShippingIcon
            /* color="primary" */ fontSize="large"
            sx={{ color: "var(--primary)" }}
          />
          <Typography variant="h5" fontWeight={700} mb={3}>
            {/* 🚚 */} Entrega
          </Typography>
        </Box>

        <Controller
          name="deliveryType"
          control={control}
          render={({ field }) => (
            <>
              <RadioGroup {...field}>
                <FormControlLabel
                  value="delivery"
                  control={<Radio />}
                  label="Entrega"
                />
                <FormControlLabel
                  value="pickup"
                  control={<Radio />}
                  label="Retirar na Loja"
                />
              </RadioGroup>
              {errors.deliveryType && (
                <FormHelperText error>
                  {errors.deliveryType.message}
                </FormHelperText>
              )}
            </>
          )}
        />

        <Grid container spacing={2} mt={1}>
          {renderTextField({
            name: "cep",
            label: "CEP",
            md: 3,
          })}

          {renderTextField({
            name: "street",
            label: "Rua",
            
            md: 7,
          })}

          {renderTextField({
            name: "number",
            label: "Número",           
            md: 2,
          })}

          {renderTextField({
            name: "complement",
            label: "Complemento",
            md: 12,
          })}

          {renderTextField({
            name: "neighborhood",
            label: "Bairro",
            md: 6,
          })}

          {renderTextField({
            name: "city",
            label: "Cidade",            
            md: 3,
          })}

          {renderTextField({
            name: "state",
            label: "Estado",           
            md: 3,
          })}
        </Grid>
      </Paper>

      {/* Pago */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <PaymentIcon sx={{ color: "var(--primary)" }} fontSize="large" />
          <Typography variant="h5" fontWeight={700} mb={3}>
            {/*  💳  */}Forma de Pagamento
            <Box
              component="span"
              sx={{
                color: "error.main",
                fontWeight: 700,
              }}
            >
              {"*"}
            </Box>
          </Typography>
        </Box>

        <Controller
          name="payment_types_id"
          control={control}
          defaultValue=""
          rules={{ required: "Selecione uma forma de pagamento" }}
          render={({ field }) => (
            <FormControl
              error={!!errors.payment_types_id}
              sx={{ width: "100%" }}
            >
              <FormLabel
              /* required
                sx={{
                  mb: 2,
                  "& .MuiFormLabel-asterisk": {
                    color: "red",
                  },
                }} */
              >
                {/*  {LANG.CREATEORDER.PAYMENT} */}
              </FormLabel>

              <RadioGroup
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <Grid container spacing={1}>
                  {paymentTypes.map((payment) => (
                    <Grid key={payment.id} size={{ xs: 6 }}>
                      <FormControlLabel
                        value={payment.id}
                        control={<Radio />}
                        label={payment.name}
                      />
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>

              <FormHelperText>
                {errors.payment_types_id?.message}
              </FormHelperText>
            </FormControl>
          )}
        />

        {/* <TextField
          fullWidth
          label="Troco para"
          sx={{ mt: 2 }}
        /> */}
      </Paper>
      <ScheduleSection control={control} errors={errors} />

      {/* Detalhes */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <NoteAltIcon sx={{ color: "var(--primary)" }} fontSize="large" />
          <Typography variant="h5" fontWeight={700} mb={3}>
            {/*  📝 */} Detalhes
          </Typography>
        </Box>
        <Controller
          name="details"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="Alguma observação sobre seu pedido..." /* {LANG.CREATEORDER.OBSERVATION} */
              multiline
              rows={2}
              fullWidth
            />
          )}
        />
      </Paper>

      {/* Substituiciones */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Caso algum produto esteja indisponível, como você prefere que
          procedamos
          <Box
            component="span"
            sx={{
              color: "error.main",
              fontWeight: 700,
            }}
          >
            {"*"}
          </Box>
        </Typography>

        <Controller
          name="substitution_preference"
          control={control}
          defaultValue="contact"
          render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error}>
              <RadioGroup {...field}>
                <FormControlLabel
                  value="similar"
                  control={<Radio />}
                  label="Substituir por um similar."
                />

                <FormControlLabel
                  value="contact"
                  control={<Radio />}
                  label="Entrar em contato antes de substituir."
                />

                <FormControlLabel
                  value="remove"
                  control={<Radio />}
                  label="Remover o produto do pedido."
                />
              </RadioGroup>

              <FormHelperText>{fieldState.error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Paper>
    </>
  );
}
