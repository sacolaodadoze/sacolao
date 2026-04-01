import { useState, useEffect, useContext } from "react";
import {
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import React from "react";
import { apiFetch } from "../../api/apiFetch";
import { useNotification } from "../context/NotificationContext";
import Swal from "sweetalert2";
import { LANG } from "../constants/languages";
import { TrashIcon, EyeIcon } from "./Icons";

export function Pdf({ show, onClose }) {
  const [pdfList, setPdfList] = useState([]);
  const { showNotification } = useNotification();
  const [confirmFile, setConfirmFile] = useState(null);

  // Cargar PDFs al abrir modal
  const getPdf = async (texto) => {
    try {
      const res = await apiFetch("/api/customer/pdfs");    
      if (!res.ok) throw new Error("Error en la petición");
      const data = await res.json();    
      setPdfList(data);
    } catch (error) {
      console.error("Error al trazer os PDFS", error);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    if (show) getPdf();
  }, [show]);

  const openPdf = (file) => {    
    window.open(
      `http://localhost:8000/customer/pdf?file=${encodeURIComponent(file)}`,
    );
  };

  const deletePdf = async (file) => {
    try {
      const res = await apiFetch("/api/customer/pdf", {
        method: "DELETE",
        body: JSON.stringify({ file }),
      });
      const data = await res.json();
      console.log(data);

      // actualizar lista (quitar el eliminado)
      setPdfList((prev) => prev.filter((f) => f !== file));
      showNotification(LANG.DELETEPDF.NOTIFICATIONS_PDF_DELETED, "success");
    } catch (error) {
      console.error("Error eliminando PDF:", error);
      showNotification(error.message || LANG.GLOBAL.CONNECTION, "error");
    }
  };

  if (!show) return null;

  return (
    <>
      <Dialog
        open={show}
        fullWidth
        maxWidth="sm"
        scroll="paper"
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
          setOpen(false);
        }}
        disablePortal
      >
        <DialogTitle>
          {"PDFs com dados do cliente a inserir" /* LANG.EDITORDER.WEDIT */}
        </DialogTitle>
        <DialogContent>
          {pdfList.length === 0 && <p>Não tem clientes a inserir.</p>}
          <ul>
            {pdfList.map((file) => (
              <li key={file}>
                {file.split("/").pop()}
                <button className="btn-action" onClick={() => openPdf(file)}>
                  <EyeIcon />
                </button>
                <button
                  className="btn-action btn-del"
                  onClick={() => setConfirmFile(file)}
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>OK</Button>
        </DialogActions>
      </Dialog>
      
      {/* //Delete */}
      <Dialog open={!!confirmFile} onClose={() => setConfirmFile(null)}>
        <DialogTitle>¿Eliminar PDF?</DialogTitle>
        <DialogContent>Esta acción no se puede deshacer</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmFile(null)}>Cancelar</Button>
          <Button
            color="error"
            onClick={async () => {
              await deletePdf(confirmFile);
              setConfirmFile(null);
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
