import { z } from "zod";
import { LANG } from "../assets/constants/languages";

export const settingsSchema = z.object({
  business_name: z.string().min(2, "Nome obrigatório"),
  phone: z.string().optional(),
  whatsapp: z.string().min(5, "WhatsApp obrigatório"),
  address: z.string().min(7, "Endereço obrigatório"),

  instagram: z.string().optional(),
  facebook:z.string().optional().nullable(),

  google_maps_url: z.string().optional(),
  weekday_open_morning: z.string().optional(),
  weekday_close_morning: z.string().optional(),
  weekday_open_afternoon: z.string().optional(),
  weekday_close_afternoon: z.string().optional(),
  saturday_open: z.string().optional(),
  saturday_close: z.string().optional(),
  sunday_open: z.string().optional(),
  sunday_close: z.string().optional(),

  info: z.string().optional(),
  delivery_time: z.string().optional(),
  free_rate: z.string().optional(),
  is_closed: z.boolean().optional(),

  whatsapp_default_message: z.string().optional(),
});
