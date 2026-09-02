// ---------- Helpers compartidos ----------
 
function toMins(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}
 
function toTime(mins) {
  const hh = String(Math.floor(mins / 60)).padStart(2, "0");
  const mm = String(mins % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}
 
function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
 
function isHoliday(settings, date) {
  const holidaySet = new Set(
    (settings.holiday_dates || "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean),
  );
  return holidaySet.has(dateKey(date));
}
 
// ---------- Resolución de horario/día (espejo de DeliverySlotService.php) ----------
 
function getScheduleForDate(settings, date) {
  const holiday = isHoliday(settings, date);
  const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado
 
  // Domingo real: nunca hay entregas
  if (dayOfWeek === 0 && !holiday) {
    return { type: "closed" };
  }
 
  // Feriado: SÍ hay entregas, con horario de domingo
  if (holiday) {
    return {
      type: "single",
      open: settings.sunday_open,
      close: settings.sunday_close,
    };
  }
 
  if (dayOfWeek === 6) {
    return {
      type: "single",
      open: settings.saturday_open,
      close: settings.saturday_close,
    };
  }
 
  return {
    type: "split",
    openMorning: settings.weekday_open_morning,
    closeMorning: settings.weekday_close_morning,
    openAfternoon: settings.weekday_open_afternoon,
    closeAfternoon: settings.weekday_close_afternoon,
  };
}
 
function isDayOpen(settings, date) {
  const schedule = getScheduleForDate(settings, date);
 
  if (schedule.type === "closed") return false;
 
  if (schedule.type === "single") {
    return !!schedule.open && !!schedule.close;
  }
 
  return !!schedule.openMorning && !!schedule.closeMorning;
}
 
/**
 * Busca el próximo día (a partir de mañana) en que el negocio abre.
 * Devuelve { date, schedule }.
 */
function nextOpenDay(settings, fromDate) {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + 1);
 
  for (let i = 0; i < 14; i++) {
    if (isDayOpen(settings, date)) {
      return { date, schedule: getScheduleForDate(settings, date) };
    }
    date.setDate(date.getDate() + 1);
  }
 
  // fallback de seguridad
  return { date, schedule: getScheduleForDate(settings, date) };
}
 
/**
 * Devuelve { mins, label } del próximo día hábil:
 * - mins: hora de apertura de ese día, en minutos.
 * - label: "Amanhã" si el día resuelto es literalmente mañana,
 *          o el nombre del día (ej. "Segunda-feira, 31/08") si se saltearon días.
 */
function getNextOpenInfo(settings, fromDate) {
  const { date, schedule } = nextOpenDay(settings, fromDate);
 
  const mins =
    schedule.type === "single" ? toMins(schedule.open) : toMins(schedule.openMorning);
 
  const tomorrow = new Date(fromDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isLiterallyTomorrow = dateKey(date) === dateKey(tomorrow);
 
  const label = isLiterallyTomorrow
    ? "Amanhã"
    : date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      });
 
  return { mins, label };
}
 
// ---------- Estimativa de entrega ----------
 
export function calculateEstimatedDelivery(settings, isPickup = false) {
  const timeStr = isPickup ? settings?.pickup_time : settings?.delivery_time;
  if (!settings || !timeStr) return null;
 
  const now = new Date();
  //now.setDate(29);
 now.setHours(8, 0, 0, 0);
 
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const deliveryTime = parseInt(timeStr.split(":")[0], 10);
 
  const holiday = isHoliday(settings, now);
  const dayOfWeek = now.getDay();
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0 && !holiday; // domingo real, nunca feriado
 
  let openMorning, closeMorning, openAfternoon, closeAfternoon;
 
  if (isSunday) {
    const { mins, label } = getNextOpenInfo(settings, now);
    return `Não há entregas no dia de hoje, ${label.toLowerCase()} até as ${toTime(mins + deliveryTime)}`;
  }
 
  if (settings.is_closed) {
    const { mins, label } = getNextOpenInfo(settings, now);
    return `${label} até as ${toTime(mins + deliveryTime)}`;
  }
 
  if (isSaturday) {
    openMorning = toMins(settings.saturday_open);
    closeMorning = toMins(settings.saturday_close);
    openAfternoon = null;
    closeAfternoon = null;
  } else if (holiday) {
    // feriado: SÍ hay entregas, usando el horario de domingo
    openMorning = toMins(settings.sunday_open);
    closeMorning = toMins(settings.sunday_close);
    openAfternoon = null;
    closeAfternoon = null;
  } else {
    openMorning = toMins(settings.weekday_open_morning);
    closeMorning = toMins(settings.weekday_close_morning);
    openAfternoon = toMins(settings.weekday_open_afternoon);
    closeAfternoon = toMins(settings.weekday_close_afternoon);
  }
 
  // 1. antes de la apertura de mañana
  if (openMorning && nowMins < openMorning) {
    return `Fechado por hoje amanhã até as ${toTime(openMorning + deliveryTime)}`;
  }
 
  // 2. dentro del horario de mañana
  if (
    openMorning &&
    closeMorning &&
    nowMins >= openMorning &&
    nowMins < closeMorning
  ) {
    const estimated = nowMins + deliveryTime;
 
    if (estimated > closeMorning) {
      if (openAfternoon) {
        // día de semana: se pasa a la tarde
        return toTime(openAfternoon + deliveryTime);
      }
      // domingo/feriado/sábado sin tarde → no hay más turno hoy, pasa al próximo día hábil
      const { mins, label } = getNextOpenInfo(settings, now);
      return `${label} até as ${toTime(mins + deliveryTime)}`;
    }
 
    return toTime(estimated);
  }
 
  // 3. entre cierre mañana y apertura tarde
  if (
    closeMorning &&
    openAfternoon &&
    nowMins >= closeMorning &&
    nowMins < openAfternoon
  ) {
    return `Até as ${toTime(openAfternoon + deliveryTime)}`;
  }
 
  // 4. dentro del horario de tarde
  if (
    openAfternoon &&
    closeAfternoon &&
    nowMins >= openAfternoon &&
    nowMins < closeAfternoon
  ) {
    const estimated = nowMins + deliveryTime;
    if (estimated > closeAfternoon) {
      const { mins, label } = getNextOpenInfo(settings, now);
      return `${label} até as ${toTime(mins + deliveryTime)}`;
    }
    return `Até as ${toTime(estimated)}`;
  }
 
  // 5. después del cierre
  {
    const { mins, label } = getNextOpenInfo(settings, now);
    return `${label} até as ${toTime(mins + deliveryTime)}`;
  }
}
 
// hora de inicio elegida + delivery_window_minutes = hora estimada fin
export function CalculateScheduleDelivery(
  deliveryHour,
  deliveryDate,
  settingsDelivery,
  isClosed,
) {
  const now = new Date();
 
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
 
  if (isClosed && deliveryDate === today) {
    return "Não é possível realizar entregas para hoje";
  }
 
  const dateText = new Date(deliveryDate + "T00:00:00").toLocaleDateString(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
    },
  );
 
  const [h, m] = deliveryHour.split(":").map(Number);
  const deliveryWindow = Number(settingsDelivery.delivery_window_minutes);
  const endMins = h * 60 + m + deliveryWindow;
 
  const eh = String(Math.floor(endMins / 60)).padStart(2, "0");
  const em = String(endMins % 60).padStart(2, "0");
 
  return `Até às ${eh}:${em}`;
}
 

export function buildOrderConfirmation(
  order,
  data,
  settings,
  settingsDelivery,
  summary
) {

  let confirmation = {};

  if (!data.scheduled && data.deliveryType !== "pickup") {
    const estimatedAt = calculateEstimatedDelivery(settings);
    confirmation = {
      scheduled: false,
      estimatedAt: estimatedAt ?? "",
    };
  }

  if (data.scheduled) {
    const estimatedAt = CalculateScheduleDelivery(
      data.delivery_hour,
      data.delivery_date,
      settingsDelivery,
    );
    confirmation = {
      scheduled: true,
      date: data.delivery_date,
      hourStart: data.delivery_hour,
      hourEnd: estimatedAt,
    };
  }

  if (data.deliveryType === "pickup") {
    const estimatedAt = calculateEstimatedDelivery(settings, data.deliveryType);
    confirmation = {
      deliveryType: "pickup",
      estimatedAt: estimatedAt ?? "",
    };
  }

    confirmation.summary = {
    items: data.items,
    subtotal: summary.subtotal,
    deliveryFee: summary.deliveryFee,
    total: summary.total,
    rate: summary.rateData ?? null,
    pickup: data.deliveryType === "pickup",
  }; 

  order.confirmation = confirmation;

  return order;
}
