import { z } from "zod";
import { LANG } from "../assets/constants/languages";

export const settingsSchema = z.object({ 
  weekday_delivery_open_morning: z.string().optional(),

  weekday_delivery_close_morning: z.string().optional(),

  weekday_delivery_open_afternoon: z.string().optional(),

  weekday_delivery_close_afternoon: z.string().optional(),

  saturday_open_delivery: z.string().optional(),

  saturday_close_delivery: z.string().optional(),

  minimum_schedule_minutes: z.coerce.number(),
  minimum_hour_to_schedule_same_day: z.string().optional().nullable(),
  delivery_window_minutes:  z.coerce.number(),
  same_day_delivery:z.boolean().optional(),
  allow_holiday_delivery: z.boolean().optional(),
  max_schedule_days: z.coerce.number(),
});
