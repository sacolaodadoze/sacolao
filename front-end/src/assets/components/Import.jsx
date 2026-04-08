import React, { useRef, useState, useId } from "react";
import { LANG } from "../constants/languages.js";

import { showAlert } from "../helpers/alertHelper.js";
import { useImport } from "../hooks/useImport.js";
import { Tooltip } from "@mui/material";
import { Pdf } from "./Pdf.jsx";

export function Import() {
  // Referencia para conectar el Select con el Input de archivo
  const fileInputRef = useRef(null);
  const [selected, setSelected] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const importId = useId(); //ID unico para el select
  const { importArchive } = useImport(); //hook para el import
  const [showModal, setShowModal] = useState(false);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelected("");

    if (value === "customer") {
      setIsProcessing(true);
      fileInputRef.current.click(); // Simula un clic en el input oculto para abrir la ventana del sistema
      setIsProcessing(false);
    }
    if (value === "pdf") {
      setShowModal(true);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <select
        className="submenu-select"
        //todo ,ver si uso el Useid
        id={importId}
        value={selected}
        onChange={handleSelectChange} /* {(e) => {
            const value = e.target.value;
            setSelected(value); //  SOLO visual
            handleSelectChange(value); //  lógica real           
            setTimeout(() => setSelected(""), 0);
          }} */
        disabled={isProcessing} // Deshabilita el select mientras se procesa la acción
        // className={isProcessing ? "opacity-50 cursor-not-allowed" : ""}
      >
        <option value="">{LANG.IMPORT.ACTIONS}</option>
        <option value="customer">{LANG.IMPORT.CLIENTES}</option>
        <option value="pdf">{LANG.IMPORT.PDF}</option>
        {/*   <option value="products">{LANG.IMPORT.PRODUCTS}</option> */}
      </select>

      {/*  Este input hace el trabajo pero no se ve  */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv"
        onChange={(e) => importArchive(e, /* selectedImport, */ fileInputRef)}
      />

      <Pdf show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
