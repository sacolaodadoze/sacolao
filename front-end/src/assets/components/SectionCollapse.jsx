import { useState } from "react";
import {
  Paper,
  Typography,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";

export function SectionCollapse({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        mb: 3,
      }}
    >
      {/* HEADER */}
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Typography variant="h6">
          {title}
        </Typography>

        <IconButton size="small">
          <Typography
            sx={{
              fontSize: 16,
              transition: "transform 0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </Typography>
        </IconButton>
      </Box>

      {/* CONTENIDO */}
      <Collapse in={open} timeout="auto">
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Paper>
  );
}


