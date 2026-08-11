import { string, z } from "zod";
import { LANG } from "../assets/constants/languages";
export const schema = z
  .object({
    category_id: z.string().min(1, LANG.GLOBAL.REQUIRED),
    average_weight: z.number().optional(),
  })
  //Validar peso medio si la unidad es KG
  .superRefine((data, ctx) => {
    if (data.unit === "KG") {
      if (!data.average_weight) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["average_weight"],
          message: LANG.PRODUCTS.MSGVALIDATION,
        });
      }     
    }
  });
