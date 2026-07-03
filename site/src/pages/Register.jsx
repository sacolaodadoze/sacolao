// src/pages/Register.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/apiFetch";

const registerSchema = z
  .object({
    name:                  z.string().min(1, "Nome requerido"),
    email:                 z.string().email("Email inválido"),
    password:              z.string().min(6, "Mínimo 6 caracteres"),
    password_confirmation: z.string().min(1, "Confirmá la contraseña"),
    phone:                 z.string().min(8, "Teléfono inválido"),
    // dirección — opcional en el registro, se puede completar después
    street:                z.string().optional(),
    number:                z.string().optional(),
    neighborhood:          z.string().optional(),
    city:                  z.string().optional(),
    state:                 z.string().optional(),
    cep:                   z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path:    ["password_confirmation"],
  });

export default function Register() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res  = await apiFetch("/api/customer/register", {
        method: "POST",
        body:   JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        // errores de validación de Laravel
        if (json.errors) {
          Object.entries(json.errors).forEach(([field, messages]) => {
            setError(field, { message: messages[0] });
          });
          return;
        }
        setError("root", { message: json.message ?? "Error al registrarse" });
        return;
      }

      login(json.customer, json.token);
      navigate("/");
    } catch (err) {
      setError("root", { message: "Error de conexión, intentá de nuevo" });
    }
  };

  return (
    <Box
      sx={{
        minHeight:      "100vh",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        background:     "var(--background, #f8fafc)",
        py:             4,
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: 480, borderRadius: 3 }}
      >
        <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
          Criar conta
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* datos personales */}
          <TextField
            label="Nome completo"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

          <TextField
            label="Telefone"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            fullWidth
          />

          <TextField
            label="Senha"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
          />

          <TextField
            label="Confirmar senha"
            type="password"
            {...register("password_confirmation")}
            error={!!errors.password_confirmation}
            helperText={errors.password_confirmation?.message}
            fullWidth
          />

          {/* dirección */}
          <Divider sx={{ my: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Endereço de entrega (opcional)
            </Typography>
          </Divider>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Rua"
              {...register("street")}
              error={!!errors.street}
              helperText={errors.street?.message}
              fullWidth
            />
            <TextField
              label="Número"
              {...register("number")}
              error={!!errors.number}
              helperText={errors.number?.message}
              sx={{ width: 120 }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Bairro"
              {...register("neighborhood")}
              error={!!errors.neighborhood}
              helperText={errors.neighborhood?.message}
              fullWidth
            />
            <TextField
              label="CEP"
              {...register("cep")}
              error={!!errors.cep}
              helperText={errors.cep?.message}
              sx={{ width: 140 }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Cidade"
              {...register("city")}
              error={!!errors.city}
              helperText={errors.city?.message}
              fullWidth
            />
            <TextField
              label="Estado"
              {...register("state")}
              error={!!errors.state}
              helperText={errors.state?.message}
              sx={{ width: 120 }}
            />
          </Box>

          {/* error general */}
          {errors.root && (
            <Typography color="error" fontSize="0.85rem">
              {errors.root.message}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 1, py: 1.5 }}
          >
            {isSubmitting ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Criar conta"
            )}
          </Button>

          <Typography textAlign="center" fontSize="0.85rem">
            Já tem conta?{" "}
            <Link to="/login" style={{ color: "var(--primary)" }}>
              Entrar
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}