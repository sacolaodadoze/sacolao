import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/apiFetch";
import { GoogleLoginButton } from "../components/GoogleLoginButton.jsx";

const loginSchema = z.object({
  email:    z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res  = await apiFetch("/api/customer/login", {
        method: "POST",
        body:   JSON.stringify(data),
      });

      const json = await res.json();
     
      if (!res.ok) {
        setError("root", { message: json.message ?? "Credenciales incorrectas" });
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
      }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 3 }}
      >
        <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
          Entrar
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
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

          {/* error general del servidor */}
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
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Entrar"}
          
          </Button>
            <GoogleLoginButton />

          <Typography textAlign="center" fontSize="0.85rem">
            Não tem conta?{" "}
            <Link to="/register" style={{ color: "var(--primary)" }}>
              Criar conta
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}