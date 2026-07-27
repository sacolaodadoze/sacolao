import { apiFetch } from "../api/apiFetch.js";
import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../components/Loader.jsx";

export const SettingsContext = createContext();
/*useEffect(() => {
    const loadSettings = async () => {     
      try {
        const res = await apiFetch("/api/store/settings");
        const data = await res.json();
       // console.log(data);
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
       
      }
    }/* ;
    loadSettings();
  }, []); */

const fetchSettings = async () => {
  const res = await apiFetch("/api/store/settings");
  const data = await res.json();

  return data;
};

export function SettingsProvider({ children }) {
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["store-settings"],
    queryFn: fetchSettings,
    staleTime: Infinity,
  });
  if (isLoading) {
    return <Loader />;
  }
  return (
    <SettingsContext.Provider value={{ settings, isLoading, error }}>
      {children}
    </SettingsContext.Provider>
  );
}
