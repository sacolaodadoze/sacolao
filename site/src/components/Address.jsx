import { LANG } from "../constants/languages.js";
import { useForm, Controller, useFormContext } from "react-hook-form";
/* import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../forms/customerForm.js"; */
import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  Box,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { apiFetch } from "../api/apiFetch";
import { useState, useEffect } from "react";

export function Address({
  control,
  setValue,
  watch /* , showNotification  */,
}) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadcep, setLoadCep] = useState(false);

  const stateValue = watch("state");

  const getAddress = async (cep) => {
    setLoadCep(true);
    try {
      const response = await apiFetch(`/api/store/address/${cep}`);
      const data = await response.json();
      // console.log("GetCep", response);
      if (data.erro) {
        throw new Error("CEP invalido");
      }

      //console.log("Address", data);
      setValue("street", data.logradouro);

      // setValue(`state_${tab_name}`, data.uf);
      setValue("state", data.uf, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      await getCities(data.uf);
      setValue("city", data.localidade);
    } catch (error) {
      console.log(error.message);
      //showNotification(error.message || "Error ao trazer o endereço", "error");
    } finally {
      setLoadCep(false);
    }
  };
  //console.log("WATCH state_1:", watch("state_1"));
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await apiFetch("/api/store/states/");
        if (!response.ok) {
          throw new Error("Error ao trazer endereço");
        }
        const data = await response.json();
        //console.log("Stad", data);
        setStates(data);
        // console.log("Stad", data);
      } catch (error) {
        /* showNotification(
          error.message || "Error ao trazer os estados",
          "error",
        ); */
      }
    };
    fetchStatus();
  }, []);

  const getCities = async (uf) => {
    setLoadingCities(true);
    try {
      const response = await apiFetch(`/api/store/cities/${uf}`);
      if (!response.ok) {
        throw new Error("Error ao trazer as cidades");
      }
      const data = await response.json();
      //console.log("Cities", data);
      setCities(data);
    } catch (error) {
      console.error(error);
      setCities([]);
      // showNotification(error.message || "Error ao trazer as cidades", "error");
    } finally {
      setLoadingCities(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* CEP */}
        <Box
          sx={{
            width: { xs: "100%", md: "calc(25% - 8px)", gap: 2 },
          }}
        >
          <Controller
            name="cep"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={LANG.RATEDELIVERY.CEP}
                fullWidth
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // solo números
                  field.onChange(value);
                  if (value.length === 8) {
                    getAddress(value);
                  }

                  if (value.length < 8) {
                    setValue("street", "");
                    setValue("state", "");
                    setValue("city", "");
                    setCities([]);
                  }
                }}
                InputProps={{
                  endAdornment: loadcep && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "calc(75% - 8px)", gap: 2 },
          }}
        >
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={LANG.RATEDELIVERY.STREET}
                fullWidth
                InputLabelProps={{ shrink: !!field.value }}
              />
            )}
          />
        </Box>
        {/* NUMERO */}
        <Box
          sx={{
            width: { xs: "100%", md: "calc(20% - 8px)", gap: 2 },
          }}
        >
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={LANG.RATEDELIVERY.NUMBER}
                fullWidth
              />
            )}
          />
        </Box>

        {/* State */}
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "calc(20% - 8px)",
              gap: 2,
            },
          }}
        >
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <FormControl sx={{ width: "100%" }}>
                <InputLabel>{LANG.RATEDELIVERY.STATE}</InputLabel>

                <Select
                  {...field}
                  label={LANG.RATEDELIVERY.STATE}
                  labelId="state-label"
                  value={field.value ?? ""}
                  // InputLabelProps={{ shrink: !!field.value }}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    getCities(e.target.value);
                  }}
                  MenuProps={{
                    disablePortal: true,
                  }}
                >
                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.sigla}>
                      {state.sigla}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>

        {/* City */}
        <Box
          sx={{
            width: { xs: "100%", md: "calc(36% - 8px)", gap: 2 },
          }}
        >
          <Controller
            name="city"
            control={control}
            disabled={!stateValue || loadingCities}
            render={({ field }) => (
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="city-label">
                  {LANG.RATEDELIVERY.CITY}
                </InputLabel>

                <Select
                  {...field}
                  label={LANG.RATEDELIVERY.CITY}
                  labelId="city-label"
                  value={field.value ?? ""}
                  InputLabelProps={{ shrink: !!field.value }}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    //getCities(e.target.value);
                  }}
                  MenuProps={{
                    disablePortal: true,
                  }}
                >
                  {cities.map((citie) => (
                    <MenuItem key={citie.id} value={citie.nome}>
                      {citie.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>
      </Box>
    </>
  );
}
