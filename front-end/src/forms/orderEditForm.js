import { z } from "zod";
import { LANG } from "../assets/constants/languages";

export const schema = z
  .object({
    customer_id: z.coerce.number(),

    // SOLO MOSTRAR nombre (sin validarlo)
    name: z.string().optional(),

    // Order
    items: z.string().min(1, LANG.CREATEORDER.REQUIRED),
    payment_types_id: z.coerce.number().min(1, LANG.CREATEORDER.REQUIRED),
    entry_id: z.coerce.number().min(1, LANG.CREATEORDER.REQUIRED),
    details: z.string().optional(),
    observations: z.string().optional(),
    scheduled: z.boolean().optional(),
    delivery_date: z.string().optional(),
    delivery_hour: z.string().optional(),
    pickup: z.boolean().optional(),
    paid: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.scheduled) {
      if (!data.delivery_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["delivery_date"],
          message: "La fecha es obligatoria si está agendado",
        });
      }
      if (!data.delivery_hour) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["delivery_hour"],
          message: "La hora es obligatoria si está agendado",
        });
      }
    }
  });
