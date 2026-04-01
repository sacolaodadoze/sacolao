import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { createPortal } from "react-dom";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleClose = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {createPortal(
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            zIndex: (theme) => theme.zIndex.modal + 1000, // Asegura que el Snackbar esté por encima de otros modales
          }}
        >
          <Alert
            onClose={handleClose}
            severity={notification.severity}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>,
        document.body,
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
