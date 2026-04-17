import { useState } from "react";
import { showAlert } from "../helpers/alertHelper.js";
import { apiFetch } from "../../api/apiFetch.js";

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
    console.log(formData)

    try {
      const response = await apiFetch("/api/import", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        console.info(response.message)
        throw new Error("error"); // lanza error si status no es 200
      }

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
        autoClose: false,
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsProcessing(false); // Finalizamos estado de carga
      // Reset para permitir seleccionar el mismo archivo después
      e.target.value = "";
      fileInputRef.value = ""; // Limpa a referencia física do input file
    }
  };
  return {
    importArchive,
    /* isProcessing,
    setIsProcessing, */
  };
};
