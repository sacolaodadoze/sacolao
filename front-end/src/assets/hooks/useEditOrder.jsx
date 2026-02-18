import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import { useNotification } from "../context/NotificationContext.jsx"; //msg de info
import { schema } from "../../forms/orderEditForm.js";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DialogActions,
  TextField,
  Grid,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Box,
  CircularProgress,
} from "@mui/material";

export function useEditOrder(order,orders) {
  console.log(order);
  const { showNotification } = useNotification();

  /* const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      customer_id: order.customer_id,
      name: order.customer?.name,
      items: order.items,
      payment_types_id: order.payment_types_id,
      entry_id: order.entry_id,
      details: order.details,
      observations: order.observations,
      scheduled: order.scheduled,
      delivery_date: order.delivery_date || "",
      delivery_hour: order.delivery_hour || "",
      pickup: order.pickup,
      paid: order.paid,
    },
  }); */

  return (
    <>
      <form style={{ width: "100%", gap: 2 }}>
        <TextField
          label="Cliente"
         // value={order?.customer?.name || ""}
          fullWidth
          disabled
        />
      </form>
    </>
  );
}
