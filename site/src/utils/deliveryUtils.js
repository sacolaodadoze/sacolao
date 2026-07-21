export function calculateEstimatedDelivery(settings) {
  if (!settings || !settings.delivery_time) return null;

  const now = new Date();
  now.setHours(12, 0, 0, 0);

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const deliveryTime = parseInt(settings.delivery_time.split(":")[0], 10);
  // console.log("Delivery time",deliveryTime);

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

  const dayOfWeek = now.getDay();
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0;

  let openMorning, closeMorning, openAfternoon, closeAfternoon;

  if (isSaturday) {
    openMorning = toMins(settings.saturday_open);
    closeMorning = toMins(settings.saturday_close);
    openAfternoon = null;
    closeAfternoon = null;
  } else if (isSunday) {
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

  // 1. antes de la apertura de mañana → apertura mañana + delivery_time
  if (openMorning && nowMins < openMorning) {
    return toTime(openMorning + deliveryTime);
  }

  // 2. dentro del horario de mañana → hora actual + delivery_time
  if (
    openMorning &&
    closeMorning &&
    nowMins >= openMorning &&
    nowMins < closeMorning
  ) {
    const estimated = nowMins + deliveryTime;
    // si el estimado pasa el cierre de mañana pero hay tarde → apertura tarde + delivery_time
    if (estimated > closeMorning && openAfternoon) {
      return toTime(openAfternoon + deliveryTime);
    }
    return toTime(estimated);
  }

  // 3. entre cierre mañana y apertura tarde (cerrado ahora) → apertura tarde + delivery_time
  if (
    closeMorning &&
    openAfternoon &&
    nowMins >= closeMorning &&
    nowMins < openAfternoon
  ) {
    return toTime(openAfternoon + deliveryTime);
  }

  // 4. dentro del horario de tarde → hora actual + delivery_time
  if (
    openAfternoon &&
    closeAfternoon &&
    nowMins >= openAfternoon &&
    nowMins < closeAfternoon
  ) {
    const estimated = nowMins + deliveryTime;
    if (estimated > closeAfternoon) {
      return openMorning
        ? `Amanhã até as ${toTime(openMorning + deliveryTime)}`
        : null;
    } // pasa el cierre

    return toTime(estimated);
    //return toTime(openMorning + deliveryTime);
  }
  // 5. después del cierre de tarde (o después del cierre único) → mañana apertura + delivery_time
  if (openMorning) {
    return `Amanhã até as ${toTime(openMorning + deliveryTime)}`;
    // return toTime(openMorning + deliveryTime);
  }
  return null;
}

  // hora de inicio elegida + delivery_window_minutes = hora estimada fin
export function CalculateScheduleDelivery(deliveryHour,settingsDelivery) { 
  const [h, m] = deliveryHour.split(":").map(Number);

  const endMins = h * 60 + m + settingsDelivery.delivery_window_minutes;

  const eh = String(Math.floor(endMins / 60)).padStart(2, "0");
  const em = String(endMins % 60).padStart(2, "0");
  console.log(eh , em);
  return `${eh}:${em}`;
}
