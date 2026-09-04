import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LANG } from "../../../front-end/src/assets/constants/languages";
import { validarDocumento, validarTelefone } from "../utils/validations.js";

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

    name: z.string().min(1, "Nome é obrigatório"),
    phone: z.string().min(1, "Telefone é obrigatório").refine(validarTelefone, {
      message: "Telefone inválido",
    }),
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
    document: z.string().optional() 
    .refine(
        (value) => {
          // Si no hay documento, lo dejamos pasar.
          if (!value || value.trim() === "") {
            return true;
          }

          return validarDocumento(value);
        },
        {
          message: "Documento inválido",
        },
      ),
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

    //  documento obligatorio solo si el cliente no lo tenía guardado
    if (
      data.needs_document &&
      (!data.document || data.document.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Documento é obrigatório",
        path: ["document"],
      });
    }

    if (data.deliveryType !== "pickup") {
      if (!data.street) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Rua é obrigatória",
          path: ["street"],
        });
      }
      if (!data.city) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Cidade é obrigatória",
          path: ["city"],
        });
      }
      if (!data.state) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Estado é obrigatório",
          path: ["state"],
        });
      }
    }
  });
