import { useState } from "react";
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
