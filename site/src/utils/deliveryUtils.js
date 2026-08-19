export function calculateEstimatedDelivery(settings, isPickup = false) {
  const timeStr = isPickup ? settings?.pickup_time : settings?.delivery_time;
  if (!settings || !timeStr) return null;

  const now = new Date();
  now.setDate(20); //cambiar el dia del mes
  now.setHours(11, 0, 0, 0); // para probar manualmente

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const deliveryTime = parseInt(timeStr.split(":")[0], 10);

  const toTime = (mins) => {
    const hh = String(Math.floor(mins / 60)).padStart(2, "0");
    const mm = String(mins % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const toMins = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  //Saber si es feriado
  const todayKey = (() => {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  })();

  const holidaySet = new Set(
    (settings.holiday_dates || "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean),
  );

  const isHoliday = holidaySet.has(todayKey);

  const dayOfWeek = now.getDay();
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0 || isHoliday;
 

  let openMorning, closeMorning, openAfternoon, closeAfternoon;

  if (settings.is_closed) {
    openMorning = toMins(settings.weekday_open_morning);
    return `Amanhã até as ${toTime(openMorning + deliveryTime)}`;
  }

  if (isSaturday) {
    openMorning = toMins(settings.saturday_open);
    closeMorning = toMins(settings.saturday_close);
    openAfternoon = null;
    closeAfternoon = null;
  } else if (isSunday) {
    //  también cubre feriado  
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
      // domingo/feriado/sábado sin tarde → no hay más turno hoy, pasa a mañana
      return `Amanhã até as ${toTime(openMorning + deliveryTime)}`;
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
      return `Amanhã até as ${toTime(openMorning + deliveryTime)}`;
    }
    return `Até as ${toTime(estimated)}`;
  }

  // 5. después del cierre
  if (openMorning) {
    return `Amanhã até as ${toTime(openMorning + deliveryTime)}`;
  }

  return null;
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
) {
  if (!data.scheduled && data.deliveryType !== "pickup") {
    const estimatedAt = calculateEstimatedDelivery(settings);
    order.confirmation = {
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
    order.confirmation = {
      scheduled: true,
      date: data.delivery_date,
      hourStart: data.delivery_hour,
      hourEnd: estimatedAt,
    };
  }

  if (data.deliveryType === "pickup") {
    const estimatedAt = calculateEstimatedDelivery(settings, data.deliveryType);
    order.confirmation = {
      deliveryType: "pickup",
      estimatedAt: estimatedAt ?? "",
    };
  }

  return order;
}
