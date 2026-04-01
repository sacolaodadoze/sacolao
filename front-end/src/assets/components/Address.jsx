import { LANG } from "../constants/languages.js";
import { useForm, Controller, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../forms/customerForm.js";
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
import { apiFetch } from "../../api/apiFetch.js";
import { useState, useEffect } from "react";

export function Address({ tab_name, control, setValue,watch, showNotification }) {
  //console.log("tab_name", tab_name);
  /* const {
    //control,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      [`cep_${tab_name}`]: "",
      [`street_${tab_name}`]: "",
      [`number_${tab_name}`]: "",
      [`complement_${tab_name}`]: "",
      [`neighborhood_${tab_name}`]: "",
      [`state_${tab_name}`]: "",
      [`city_${tab_name}`]: "",
    },
  });  */

  //const { control, setValue } = useFormContext();
  // const [address, setAddress] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadcep, setLoadCep] = useState(false);

  /*  useEffect(() => {
    if (`cep_${tab_name}`===null) {
      reset({
     // [`cep_${tab_name}`]: "",
      [`street_${tab_name}`]: "",
      [`number_${tab_name}`]: "",
      [`complement_${tab_name}`]: "",
      [`neighborhood_${tab_name}`]: "",
      [`state_${tab_name}`]: "",
      [`city_${tab_name}`]: "",
      });
   }
  }, [loadcep]); */
  const stateValue = watch(`state_${tab_name}`);

  const getAddress = async (cep) => {
    setLoadCep(true);
    try {
      const response = await apiFetch(`/api/address/${cep}`);
      const data = await response.json();
      console.log("GetCep", response);
      if (data.erro) {
        throw new Error("CEP invalido");
      }

      console.log("Address", data);
      setValue(`street_${tab_name}`, data.logradouro);
      setValue(`neighborhood_${tab_name}`, data.bairro);
      setValue(`complement_${tab_name}`, data.complemento);

      // setValue(`state_${tab_name}`, data.uf);
      setValue(`state_${tab_name}`, data.uf, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      await getCities(data.uf);
      setValue(`city_${tab_name}`, data.localidade);
    } catch (error) {
      console.log(error.message);
      showNotification(error.message || "Error ao trazer o endereço", "error");
    } finally {
      setLoadCep(false);
    }
  };
//console.log("WATCH state_1:", watch("state_1"));
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await apiFetch("/api/states/");
        if (!response.ok) {
          throw new Error("Error ao trazer endereço");
        }
        const data = await response.json();
        console.log("Stad", data);
        setStates(data);
        // console.log("Stad", data);
      } catch (error) {
        showNotification(
          error.message || "Error ao trazer os estados",
          "error",
        );
      }
    };
    fetchStatus();
  }, []);

  const getCities = async (uf) => {
    console.info(uf);
    // try {
    const response = await apiFetch(`/api/cities/${uf}`);
    if (!response.ok) {
      throw new Error("Error ao trazer as cidades");
    }
    const data = await response.json();
    console.log("Cities", data);
    setCities(data);

    /* } catch (error) {
      showNotification(error.message || "Error ao trazer as cidades", "error");
    } */
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
            name={`cep_${tab_name}`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={LANG.CREATEORDER.CEP}
                fullWidth
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // solo números
                  field.onChange(value);
                  if (value.length === 8) {
                    getAddress(value);
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
            name={`street_${tab_name}`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={LANG.CREATECUSTOMER.ADDRESS}
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
            name={`number_${tab_name}`}
            control={control}
            render={({ field }) => (
              <TextField {...field} label={LANG.CREATEORDER.NUMBER} fullWidth />
            )}
          />
        </Box>

        {/* COMPLEMENTO */}
        <Box
          sx={{
            width: { xs: "100%", md: "calc(80% - 8px)", gap: 2 },
          }}
        >
          <Controller
            name={`complement_${tab_name}`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={LANG.CREATEORDER.COMPLEMENT}
                fullWidth
              />
            )}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Bairro */}
          <Box
            sx={{
              width: { xs: "100%", md: "calc(42.5% - 8px)", gap: 2 },
            }}
          >
            <Controller
              name={`neighborhood_${tab_name}`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={LANG.CREATEORDER.NEIGHBORHOOD}
                  fullWidth
                  InputLabelProps={{ shrink: !!field.value }}
                />
              )}
            />
          </Box>

          {/* State */}
          <Box
            sx={{
              width: { xs: "100%", md: "calc(20% - 8px)", gap: 2 },
            }}
          >
            <Controller
              name={`state_${tab_name}`}
              control={control}
              render={({ field }) => (
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id={`state-label-${tab_name}`}>
                    {LANG.CREATEORDER.STATE}
                  </InputLabel>

                  <Select
                    {...field}
                    label={LANG.CREATEORDER.STATE}
                    labelId={`state-label-${tab_name}`}
                    value={field.value ?? ""}
                    // InputLabelProps={{ shrink: !!field.value }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      getCities(e.target.value);
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
              name={`city_${tab_name}`}
              control={control}
              render={({ field }) => (
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id={`city-label-${tab_name}`}>
                    {LANG.CREATEORDER.CITY}
                  </InputLabel>

                  <Select
                    {...field}
                    label={LANG.CREATEORDER.PAYMENT}
                   labelId={`city-label-${tab_name}`}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      //getCities(e.target.value);
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
      </Box>
    </>
  );
}
