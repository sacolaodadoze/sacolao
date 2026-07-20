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

import { useWatch, useFormContext, Controller } from "react-hook-form";
/*  import { LANG } from "../../../front-end/src/assets/constants/languages";  */

import { useDeliverySlots } from "../hooks/useDeliverySlots";
import { Switch, MenuItem, Select, InputLabel } from "@mui/material";
import { apiFetch } from "../api/apiFetch";

/* function ScheduleSection({ control, errors }) {
  const { availableDates, slotsByDate, isLoading } = useDeliverySlots();

  const scheduled    = useWatch({ control, name: "scheduled" });
  const selectedDate = useWatch({ control, name: "delivery_date" });

  return (
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        📅 Agendamento
      </Typography>

      {/* toggle conectado al form 
      <Controller
        name="scheduled"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={!!field.value}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                }}
              />
            }
            label="Quero agendar meu pedido"
          />
        )}
      />

      {scheduled && !isLoading && (
        <Grid container spacing={2} mt={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="delivery_date"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.delivery_date}>
                  <InputLabel>Data</InputLabel>
                  <Select {...field} label="Data" value={field.value ?? ""}>
                    {availableDates.map(({ date, dateKey }) => (
                      <MenuItem key={dateKey} value={dateKey}>
                        {date.toLocaleDateString("pt-BR", {
                          weekday: "long",
                          day:     "2-digit",
                          month:   "2-digit",
                        })}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.delivery_date?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          {selectedDate && slotsByDate[selectedDate] && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="delivery_hour"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.delivery_hour}>
                    <InputLabel>Horário</InputLabel>
                    <Select {...field} label="Horário" value={field.value ?? ""}>
                      {slotsByDate[selectedDate].map((slot) => (
                        <MenuItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.delivery_hour?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
          )}
        </Grid>
      )}
    </Paper>
  );
} */
function ScheduleSection() {
  const {
    control,
    resetField,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();
  const { isValidHour, availableDates, slotsByDate } =
    useDeliverySlots();

  const scheduled = useWatch({ control, name: "scheduled" });
  const deliveryDate = useWatch({ control, name: "delivery_date" });
  const deliveryHour = useWatch({ control, name: "delivery_hour" });

  return (
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        📅 Agendamento
      </Typography>

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
        <Typography variant="h5" fontWeight={700} mb={3}>
          👤 Dados do Cliente
        </Typography>

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
        </Grid>
      </Paper>

      {/* Entrega */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          🚚 Entrega
        </Typography>

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
            required: true,
            md: 7,
          })}

          {renderTextField({
            name: "number",
            label: "Número",
            required: true,
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
        <Typography variant="h5" fontWeight={700} mb={3}>
          💳 Forma de Pagamento
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
      {/*       <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Agendamento
        </Typography>
        <Grid container spacing={2}>
         
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="delivery_date"
              //disabled={!agendado}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Data" 
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }} // para que la etiqueta no se superponga
                  error={!!errors?.delivery_date}
                  helperText={errors?.delivery_date?.message}
                />
              )}
            />
          </Grid>

        
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="delivery_hour"
              // disabled={!agendado}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="time"
                  label="Hora" 
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors?.delivery_hour}
                  helperText={errors?.delivery_hour?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper> */}
      <ScheduleSection control={control} errors={errors} />

      {/* Observaciones */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          📝 Detalhes
        </Typography>

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

        {/*  <TextField
          name: "state",
          fullWidth
          multiline
          rows={4}
          placeholder="Alguma observação sobre seu pedido..."
        /> */}
      </Paper>
    </>
  );
}
