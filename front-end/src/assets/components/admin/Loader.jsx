import { Box, CircularProgress, Typography } from "@mui/material";

export function Loader({ text = "Carregando..." }) {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />

      <Typography variant="body2">{text}</Typography>
    </Box>
  );
}
