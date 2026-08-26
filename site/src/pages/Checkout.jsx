import React from "react";
import { useEffect, useState, useContext } from "react";

import { useForm, Controller, FormProvider } from "react-hook-form";
import { CheckoutProducts } from "../components/CheckoutProducts.jsx";
import { CheckoutForm } from "../components/CheckoutForm.jsx";
import { CheckoutSummary } from "../components/CheckoutSummary.jsx";
import { Grid, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { SettingsContext } from "../context/SettingsContext.jsx";
import { useDeliverySlots } from "../hooks/useDeliverySlots";
import logo from "../../../front-end/src/assets/img/logo.png";
import Footer from "../components/Footer.jsx";
//import Swal from "sweetalert2";
//import { LANG } from "../constants/languages.js";

import { apiFetch } from "../api/apiFetch.js";

import { zodResolver } from "@hookform/resolvers/zod"; //validaciones
import { checkoutSchema } from "../forms/checkoutForm.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  calculateEstimatedDelivery,
  CalculateScheduleDelivery,
  buildOrderConfirmation,
} from "../utils/deliveryUtils";

export default function Checkout() {
  const { customer } = useAuth();

  const navigate = useNavigate();
  const primaryAddress = customer?.addresses?.find((a) => a.is_primary === 1);
  const primaryPhone = customer?.phones?.find((p) => p.type === 1);
  const secundaryPhone = customer?.phones?.find((p) => p.type === 2);

  const { cartItems, clearCart } = useCart();
  const [paymentTypes, setPaymentTypes] = useState([]);
  const { settings } = useContext(SettingsContext);
  const { settingsDelivery } = useDeliverySlots();

  const [checkoutError, setCheckoutError] = useState("");

  /* const [scheduleConfirmation, setScheduleConfirmation] = useState(null); 
  const [pendingOrderData, setPendingOrderData] = useState(null);*/

  const loadPaymentTypes = () => {
    apiFetch("/api/store/payments")
      .then((response) => {
        if (response.ok) {
          // throw new Error(LANG.ORDERSLIST.ERRORPAYMENTS);
          return response.json();
        }
      })
      .then((data) => {
        //console.info(data);
        setPaymentTypes(data);
      })
      .catch((error) => {
        console.error(error.message || "Error ao trazer os payments");
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
      // name: "",
      // phone: "",
      // phoneS: "",
      deliveryType: "delivery",
      paid: false,

      //Endereço
      /*  cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "", */
      name: customer?.name ?? "",
      phone: primaryPhone?.number ?? "",
      phoneS: secundaryPhone?.number ?? "",
      street: primaryAddress?.street ?? "",
      number: primaryAddress?.number ?? "",
      neighborhood: primaryAddress?.neighborhood ?? "",
      city: primaryAddress?.city ?? "",
      state: primaryAddress?.state ?? "",
      cep: primaryAddress?.cep ?? "",
      complement: primaryAddress?.complement ?? "",

      payment_types_id: "",

      scheduled: false,
      delivery_date: "",
      delivery_hour: "",

      observations: "",
      substitution_preference: "",
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
    //console.log(errors);
  };

  /* const onSubmit = async (data) => {
    try {
      const pickup = data.deliveryType === "delivery" ? false : true;

      const orderData = {
        ...data,
        pickup,
      };
      const now = new Date();

      const res = await apiFetch("/api/store/order", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData.error);
        throw new Error(
          errorData.error || responseData.message || "Erro ao criar pedido",
        );
      }

      // respuesta del backend
      const order = await res.json();

      if (order.requires_confirmation) {
        setScheduleConfirmation(responseData); // data para mostrar el diálogo
        setPendingOrderData(orderData); //data para reenviarlo si confirma
        return null;
      }

      // si no es un pedido agendado
      if (!data.scheduled) {
        const estimatedAt = calculateEstimatedDelivery(settings);

        // console.log(estimatedAt);

        order.confirmation = {
          scheduled: false,
          estimatedAt: estimatedAt ?? "",
        };
      }

      if (data.scheduled) {
        const estimatedAt = CalculateScheduleDelivery(
          data.delivery_hour,
          data.delivery_date,
          settingsDelivery,
        );

        order.confirmation = {
          scheduled: true,
          date: data.delivery_date,
          hourStart: data.delivery_hour,
          hourEnd: estimatedAt,
        };
      }
      if (data.deliveryType === "pickup") {
        const estimatedAt = calculateEstimatedDelivery(
          settings,
          data.deliveryType,
        );

        order.confirmation = {
          deliveryType: "pickup",
          estimatedAt: estimatedAt ?? "",
        };
      }

      clearCart();

      navigate("/order-confirmation", {
        state: { order },
      });
    } catch (error) {
      console.error(error);
      setCheckoutError(error.message);
    }
  }; */

  async function submitOrder(payload) {
    const res = await apiFetch("/api/store/order", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error(
        responseData.error || responseData.message || "Erro ao criar pedido",
      );
    }

  /*   if (responseData.requires_confirmation) {
      setScheduleConfirmation(responseData);
      setPendingOrderData(payload);
      return null;
    } */

    return responseData;
  }

  const onSubmit = async (data) => {
    try {
      const pickup = data.deliveryType === "delivery" ? false : true;
      const orderData = { ...data, pickup };

      const order = await submitOrder(orderData);
      if (!order) return;

      buildOrderConfirmation(order, data, settings, settingsDelivery);
      clearCart();
      navigate("/order-confirmation", { state: { order } });
    } catch (error) {
      console.error(error);
      setCheckoutError(error.message);
    }
  };

/*   function handleConfirmSchedule() {
    submitOrder({ ...pendingOrderData, confirm_schedule_change: true })
      .then((order) => {
        if (!order) return;

        buildOrderConfirmation(
          order,
          pendingOrderData,
          settings,
          settingsDelivery,
        );
        setScheduleConfirmation(null);
        setPendingOrderData(null);
        clearCart();
        navigate("/order-confirmation", { state: { order } });
      })
      .catch((error) => {
        console.error(error);
        setCheckoutError(error.message);
        setScheduleConfirmation(null);
      });
  }

  function handleCancelSchedule() {
    setScheduleConfirmation(null);
    setPendingOrderData(null);
  } */

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
          <Link to="/">
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
          </Link>

          <Box>
            <Typography
              variant="h4"
              fontWeight={350}
              sx={{ color: "var(--primary)" }}
            >
              Sacolão da Doze
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
          Confira seu pedido
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
                <CheckoutSummary
                  checkoutError={checkoutError}
                  /*scheduleConfirmation={scheduleConfirmation}
                   onConfirmSchedule={handleConfirmSchedule} 
                  onCancelSchedule={handleCancelSchedule}*/
                />
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </Box>
      <Footer />
    </>
  );
}
