import React from "react";
import { useNotification } from "../context/NotificationContext.jsx"; //msg de info
import { LANG } from "../constants/languages.js";
import { schema } from "../../forms/customerForm.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiFetch } from "../../api/apiFetch.js";

import {
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Box,
  CircularProgress,
  FormHelperText,
  Tabs,
  Tab,
} from "@mui/material";
import { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { Address } from "./Address.jsx";

export default function CreateCustomer({ open, setOpen, onCustomerCreated }) {
  const { showNotification } = useNotification();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    register,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      customer_type: 1,
      cep_1: "",
      number_1: "",
      street_1: "",
      neighborhood_1: "",
      complement_1: "",
      city_1: "",
      state_1: "",

      cep_2: "",
      number_2: "",
      street_2: "",
      neighborhood_2: "",
      complement_2: "",
      city_2: "",
      state_2: "",
      observations: "",
    },
  });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    console.log("Data", data);
    try {
      // await apiFetch("/sanctum/csrf-cookie");
      const res = await apiFetch("/api/customers", {
        method: "POST",
        body: JSON.stringify(data),
      });
      console.log("Res", res);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || LANG.CREATECUSTOMER.FAILCUSTOMER);
      }
      const result = await res.json();
      console.log("cliente:", result);
      onCustomerCreated(result.data);
      showNotification(LANG.CREATECUSTOMER.CUSTOMERSUCCESS, "success");
      setSaving(false);
    } catch (error) {
      console.log("error:", error);
      showNotification(
        error.message || LANG.CREATECUSTOMER.FAILCUSTOMER,
        "error",
      );
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        setOpen(false);
      }}
    >
      <DialogTitle>{LANG.CREATECUSTOMER.WIND}</DialogTitle>
      <DialogContent
        dividers
        sx={{
          paddingTop: 3,
          paddingBottom: 3,
        }}
      >
        <FormProvider>
          <form
            id="customer-form"
            style={{ width: "100%", gap: 2 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={3}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {/* 1era linea */}
                <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
                  <Controller
                    name="customer_type"
                    control={control}
                    defaultValue={1}
                    render={({ field }) => (
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="customer_type">
                          {LANG.CREATECUSTOMER.TYPE}
                        </InputLabel>
                        <Select
                          {...field}
                          label={LANG.CREATECUSTOMER.TYPE}
                          labelId="customer_type"
                          value={field.value || " "}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          <MenuItem value={1}>
                            {LANG.CREATECUSTOMER.FIS}
                          </MenuItem>
                          <MenuItem value={2}>
                            {LANG.CREATECUSTOMER.JUR}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Box>
                <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
                  <Controller
                    name="document"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={LANG.CREATEORDER.DOCUMENT}
                        required
                        sx={{
                          "& .MuiFormLabel-asterisk": {
                            color: "red",
                          },
                        }}
                        fullWidth
                        /*  error={!!errors?.items}
                      helperText={errors?.items?.message} */
                      />
                    )}
                  />
                </Box>
                {/* Segunda linea */}
                {/*  <Stack spacing={3}> */}
                {/* <Grid item xs={12}> */}
                <Controller
                  name="name"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={LANG.CREATEORDER.NOME}
                      required
                      sx={{
                        "& .MuiFormLabel-asterisk": {
                          color: "red",
                        },
                      }}
                      fullWidth
                      error={!!errors?.items}
                      helperText={errors?.items?.message}
                    />
                  )}
                />
                {/* </Grid> */}
                {/* </Stack> */}
                {/* 3 linea */}
                <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
                  <Controller
                    name="phone_p"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={LANG.CREATECUSTOMER.PHONE_P}
                        required
                        sx={{
                          "& .MuiFormLabel-asterisk": {
                            color: "red",
                          },
                        }}
                        fullWidth
                        error={!!errors?.items}
                        helperText={errors?.items?.message}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ width: { xs: "100%", md: "calc(50% - 8px)" } }}>
                  <Controller
                    name="phone_s"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={LANG.CREATECUSTOMER.PHONE_S}
                        fullWidth
                        /*  error={!!errors?.items}
                      helperText={errors?.items?.message} */
                      />
                    )}
                  />
                </Box>
                {/* 4ta linea */}
                <Controller
                  name="observations"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={LANG.CREATECUSTOMER.OBSERVATION}
                      multiline
                      rows={2}
                      fullWidth
                    />
                  )}
                />
                <Tabs value={tab} onChange={handleChangeTab}>
                  <Tab label="Endereço principal" />
                  <Tab label="Endereço secundario" />
                </Tabs>
                {/* {tab === 0 && <Address tab_name="1" showNotification={showNotification}/>} {/*enderco_primario */}
                {/*  {tab === 1 && <Address tab_name="2" showNotification={showNotification}/>}  */}

                <Box hidden={tab !== 0}>
                  <Address
                    tab_name="1"
                    control={control}
                    setValue={setValue}
                    watch={watch}
                    showNotification={showNotification}
                  />
                </Box>

                <Box hidden={tab !== 1}>
                  <Address
                    tab_name="2"
                    control={control}
                    setValue={setValue}
                    watch={watch}
                    showNotification={showNotification}
                  />
                </Box>
              </Box>
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          type="submit"
          form="customer-form"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || saving}
        >
          {saving ? <CircularProgress size={20} /> : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
