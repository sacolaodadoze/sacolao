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
    items: z.string().min(1, LANG.GLOBAL.REQUIRED),

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
    payment_types_id: z.coerce.number().min(1, LANG.GLOBAL.REQUIRED),
    details: z.string().optional(),
    deliveryType: z.enum(["delivery", "pickup"]),
    scheduled: z.boolean().default(false),
    delivery_date: z.string().optional(),
    delivery_hour: z.string().optional(),
    substitution_preference: z.enum(["similar", "contact", "remove"], {
      message: "Selecione uma opção",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.scheduled) {
      if (!data.delivery_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione uma data",
          path: ["delivery_date"],
        });
      }
      if (!data.delivery_hour) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecione um horário",
          path: ["delivery_hour"],
        });
      }
    }
  });
