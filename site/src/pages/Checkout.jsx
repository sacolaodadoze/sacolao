import { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { CheckoutProducts } from "../components/CheckoutProducts.jsx";
import { CheckoutForm } from "../components/CheckoutForm.jsx";
import { CheckoutSummary } from "../components/CheckoutSummary.jsx";
import { Grid, Box, Typography } from "@mui/material";
import logo from "../../../front-end/src/assets/img/logo.png";

import { apiFetch } from "../../../front-end/src/api/apiFetch";

import { zodResolver } from "@hookform/resolvers/zod"; //validaciones
import { checkoutSchema } from "../forms/checkoutForm.js";
import { useCart } from "../context/CartContext.jsx";
import React from "react";

export default function Checkout() {
  const { cartItems } = useCart();
  const [paymentTypes, setPaymentTypes] = useState([]);

  const loadPaymentTypes = () => {
    apiFetch("/api/store/payments")
      .then((response) => {
        if (response.ok) {
          // throw new Error(LANG.ORDERSLIST.ERRORPAYMENTS);
          return response.json();
        }
      })
      .then((data) => {
        console.info(data);
        setPaymentTypes(data);
      })
      .catch((error) => {
        console.error(error.message || "Error al traer los payments");
      });
  };

  useEffect(() => {
    loadPaymentTypes();
  }, []);

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: {
      items: "",
      name: "",
      phoneP: "",
      phoneS: "",
      deliveryType: "delivery",
      paid: false,

      //Endereço
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",

      scheduled: false,
      delivery_date: "",
      delivery_hour: "",

      payment_types_id: "",

      observations: "",
    },
  });

  // sincroniza el carrito con el form cada vez que cambia
  useEffect(() => {
    methods.setValue(
      "items",
      cartItems.map((item) => `${item.quantity} ${item.name}`).join("\n"),
    );
  }, [cartItems, methods]);

  //console.log(methods.watch("items"));

  const onError = (errors) => {
    console.log(errors);
  };

  const onSubmit = async (data) => {
    const pickup = data.deliveryType == "delivery" ? false : true;
    const order = {
      ...data,
      pickup,
    };
    /*    const order = {
    ...data,
    items: cartItems
      .map(item => `${item.quantity} ${item.name}`)
      .join("\n"),
  }; */
    console.log("All", order);
    const res = await apiFetch("/api/store/order", {
      method: "POST",
      body: JSON.stringify(order),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Erro ao criar pedido");
    }
    const result = await res.json();
    console.log("Respuesta al crear pedido:", result);
  };

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          mb: 4,
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            px: 3,
            py: 3,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="logo"
            sx={{
              width: 75,
              height: 75,
              objectFit: "contain",
            }}
          />

          <Box>
            <Typography
              variant="h3"
              fontWeight={200}
              sx={{ color: "var(--primary)" }}
            >
              Sacolão
            </Typography>

            {/*  <Typography color="text.secondary">
              Finalize seu pedido de forma rápida e segura.
            </Typography> */}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: 3,
        }}
      >
        {/* Título */}
        <Typography
          variant="h4"
          fontWeight={700}
          mb={10} /* sx={{color: "var(--text-muted)"}} */
        >
          Seu carrinho ou  Confira seu pedido
        </Typography>

        {/* Contenido */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
            <Grid container spacing={3} sx={{ mt: 5 }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <CheckoutProducts />
                <CheckoutForm paymentTypes={paymentTypes} />
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <CheckoutSummary />
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
    </>
  );
}
