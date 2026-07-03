import { apiFetch } from "../api/apiFetch.js";
import { createContext, useState, useEffect } from "react";

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {     
      try {
        const res = await apiFetch("/api/store/settings");
        const data = await res.json();
       // console.log(data);
        if (data) {
          setSettings(data[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
       
      }
    };
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
