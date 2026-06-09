import { string, z } from "zod";
import { LANG } from "../assets/constants/languages";
export const schema = z.object({
  name: z.string().min(2, LANG.GLOBAL.REQUIRED),
  slug: z.string().min(2, LANG.GLOBAL.REQUIRED),
  position: z.coerce.number().min(1, LANG.GLOBAL.REQUIRED),
  active: z.boolean().default(true),
  image: z.string().nullable().optional(),
});
