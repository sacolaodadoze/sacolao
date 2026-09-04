import { Box, Typography } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", px: 3, py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Política de Privacidade
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Última atualização: [DATA]
      </Typography>

      {/* Pegá acá el contenido del .md, sección por sección, con <Typography variant="h6"> para cada título */}
    </Box>
  );
}