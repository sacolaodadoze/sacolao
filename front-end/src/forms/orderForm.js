import { string, z } from "zod";
import { LANG } from "../assets/constants/languages";
export const schema = z
  .object({
    //Customer
    customer_id: z.number(),
    document: z.string().optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    cep: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),

    //order
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
    rate_id:z.coerce.number().optional(),
    //created_by:z.string(),
    
  }) //Validar fecha y hr si esta agendado
  .superRefine((data, ctx) => {
    if (data.scheduled) {
      if (!data.delivery_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["delivery_date"],
          message: LANG.CREATEORDER.VALIDATION_DATE,
        });
      }
      if (!data.delivery_hour) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["delivery_hour"],
          message: LANG.CREATEORDER.VALIDATION_HOUR,
        });
      }
    }
  });
