import React, { useRef, useState, useId } from "react";
import { LANG } from "../constants/languages.js";

import { showAlert } from "../helpers/alertHelper.js";
import { useImport } from "../hooks/useImport.js";
import { Tooltip } from "@mui/material";

export function Import() {
  // Referencia para conectar el Select con el Input de archivo
  const fileInputRef = useRef(null);
  const [selectedImport, setSelectedImport] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const importId = useId(); //ID unico para el select
  const { importArchive } = useImport(); //hook para el import

  const handleSelectChange = (e) => {
    setIsProcessing(true);
    const valor = e.target.value;
    if (valor) {
      setSelectedImport(valor);
      // Simula un clic en el input oculto para abrir la ventana del sistema
      fileInputRef.current.click();
      e.target.value = ""; // Reset del select para permitir seleccionar la misma opción otra vez
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
        <Tooltip title={LANG.IMPORT.TOOLTSELECT}>
      <select
        className="submenu-select"
        //todo ,ver si uso el Useid
        id={importId}
        onChange={handleSelectChange}
        disabled={isProcessing} // Deshabilita el select mientras se procesa la acción
        // className={isProcessing ? "opacity-50 cursor-not-allowed" : ""}
      >
        <option value="">{LANG.IMPORT.ACTIONS}</option>
        <option value="customer">{LANG.IMPORT.CLIENTES}</option>
        <option value="products">{LANG.IMPORT.PRODUCTS}</option>
      </select>
      </Tooltip>

     {/*  Este input hace el trabajo pero no se ve  */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv"
        onChange={(e) => importArchive(e, selectedImport, fileInputRef)}
      />
    </div>
  );
}

