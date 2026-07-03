import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LANG } from "../../../front-end/src/assets/constants/languages";

export const checkoutSchema = z
  .object({
   /*   items: z
      .array(
        z.object({
          id: z.string(),
          quantity: z.number(),
           price: z.coerce.number(),
        }),
      )
      .min(1, "El carrito no puede estar vacío"),  */
     items: z.string().min(1, "Obliga"/* LANG.CREATEORDER.REQUIRED */),

    name: z.string().optional(),
    phone: z.string().optional(),
    phoneS: z.string().optional(),
    cep: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    payment_types_id: z.coerce.number().min(1, "Obligatorio"),
    details: z.string().optional(),
    deliveryType: z.enum(["delivery", "pickup"]), 
  })
  /* .refine(
    (data) => {
      if (data.deliveryType === "delivery") {
        return !!data.street && !!data.number && !!data.state && !!data.city;
      }
      return true;
    },
    { message: "Dirección requerida para Entrega", path: ["street"] },
  ); */
  .superRefine((data, ctx) => {
  if (data.deliveryType === "delivery") {
    if (!data.street) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Calle requerida", path: ["street"] });
    if (!data.number) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Número requerido", path: ["number"] });
    if (!data.state) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Estado requerido", path: ["state"] });
    if (!data.city) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ciudad requerida", path: ["city"] });
  }
});
