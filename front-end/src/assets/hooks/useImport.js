import { useState } from "react";
import Swal from "sweetalert2";
import { showAlert } from "../helpers/alertHelper.js";

export const useImport = () => { 
  const [isProcessing, setIsProcessing] = useState(false);

  const importArchive = async (e, selectedImport, fileInputRef) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setIsProcessing(true); // Iniciamos estado de carga

    // Mostrar Alerta de Procesamiento
    showAlert({
      title: "Upload e processamento...",
      text: "Estamos validando e inserindo os dados. Por favor, aguarde.",
      allowOutsideClick: false,
      showConfirmButton: false, // Ocultamos el botón
      showLoading: true, // Activa el spinner
    });

    const formData = new FormData();
    formData.append("archivo_csv", archivo);
    formData.append("id_import", selectedImport);

    try {
      const response = await fetch("http://localhost:8000/api/import", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      //Si todo sale bien, actualizamos la alerta a "Éxito"
      showAlert({
        icon: "success",
        title: "Importação concluída",
        text: "As inscrições foram processadas com sucesso.",
        confirmButtonText: "OK",
        allowOutsideClick: true,
        autoClose: true,
        confirmButtonColor: "#28a745",
      });
    } catch (error) {
      showAlert({
        icon: "error",
        title: "Falha na importação",
        text:
          error.response?.data?.message ||
          "Ocorreu um erro ao processar o arquivo.",
        confirmButtonText: "OK",
        allowOutsideClick: true,
        autoClose: true,
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsProcessing(false); // Finalizamos estado de carga
      // Reset para permitir seleccionar el mismo archivo después
      e.target.value = "";
      fileInputRef.current.value = ""; // Limpa a referencia física do input file         
    }
  };
  return {
    importArchive
    /* isProcessing,
    setIsProcessing, */
      
  };
};
