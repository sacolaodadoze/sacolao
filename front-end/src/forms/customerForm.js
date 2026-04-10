import { string, z } from "zod";
import { LANG } from "../assets/constants/languages";
export const schema = z.object({
  customer_type: z.coerce.number().min(1, LANG.GLOBAL.REQUIRED),
  document: z.string().min(11, LANG.GLOBAL.REQUIRED),
  name: z.string().min(3, LANG.GLOBAL.REQUIRED),
  phone_p: z.string().min(11, LANG.GLOBAL.REQUIRED),
  phone_s: z.string().optional(),
  observations: z.string().optional(),
  cep_1: z.string().optional(),
  cep_2: z.string().optional(),
  street_1: z.string().optional(),
  street_2: z.string().optional(),
  number_1: z.string().optional(),
  number_2: z.string().optional(),
  complement_1: z.string().optional(),
  complement_2: z.string().optional(),
  neighborhood_1: z.string().optional(),
  neighborhood_2: z.string().optional(),
  city_1: z.string().optional(),
  state_1: z.string().optional(),
  city_2: z.string().optional(),
  state_2: z.string().optional(),
});
