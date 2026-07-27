import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/apiFetch.js";
import { useCallback, useMemo } from "react";

export function useDeliverySlots() {
  const fetchDeliverySettings = async () => {
    const res = await apiFetch("/api/store/delivery-settings");
    const data = await res.json();
    return data;
  };

  const { data: settings, isLoading } = useQuery({
    queryKey: ["delivery-settings"],
    queryFn: fetchDeliverySettings,
    staleTime: Infinity,
  });

  // días disponibles para agendar
  const availableDates = useMemo(() => {
    if (!settings) return [];

    const today = new Date();
    const dates = [];

    for (let i = 0; i <= settings.max_schedule_days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayOfWeek = date.getDay(); // 0=domingo, 6=sábado
      const isToday = i === 0;
      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;

      if (isSunday) continue;
      if (isSaturday && !settings.saturday_open_delivery) continue;
      if (isToday && !settings.same_day_delivery) continue;

      // const dateKey = date.toISOString().split("T")[0];
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");

      const dateKey = `${y}-${m}-${d}`;

      dates.push({
        dateKey,
        label: date.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
        }),
      });
    }
    
    return dates;
  }, [settings]);

  // valida si una hora está dentro del horario del negocio para una fecha dada
  const isValidHour = useCallback(
    (dateStr, hourStr) => {
      if (!settings || !dateStr || !hourStr) return false;

      const date = new Date(dateStr + "T00:00:00");
      const dayOfWeek = date.getDay();
      const isSaturday = dayOfWeek === 6;
      const isToday = dateStr === new Date().toISOString().split("T")[0];

      const [h, m] = hourStr.split(":").map(Number);
      const hourMins = h * 60 + m;
      const endMins = hourMins + settings.delivery_window_minutes; //  hora fin del delivery

      // verificar hora límite para mismo día
      if (isToday) {
        const now = new Date();
        const nowMins =
          now.getHours() * 60 +
          now.getMinutes() +
          settings.minimum_schedule_minutes;
        if (hourMins < nowMins) return false;

        if (settings.minimum_hour_to_schedule_same_day) {
          const [lh, lm] = settings.minimum_hour_to_schedule_same_day
            .split(":")
            .map(Number);
          if (hourMins > lh * 60 + lm) return false;
        }
      }

      // verifica si la hora de inicio Y la hora fin caben dentro del rango
      const inRange = (open, close) => {
        if (!open || !close) return false;
        const [oh, om] = open.split(":").map(Number);
        const [ch, cm] = close.split(":").map(Number);
        const openMins = oh * 60 + om;
        const closeMins = ch * 60 + cm;

        //  la hora de inicio tiene que ser >= apertura
        // Y la hora de fin (hora + window) tiene que ser <= cierre
        return hourMins >= openMins && endMins <= closeMins;
      };

      if (isSaturday) {
        return inRange(
          settings.saturday_open_delivery,
          settings.saturday_close_delivery,
        );
      }

      // día de semana — válido si cabe en mañana O en tarde
      return (
        inRange(
          settings.weekday_delivery_open_morning,
          settings.weekday_delivery_close_morning,
        ) ||
        inRange(
          settings.weekday_delivery_open_afternoon,
          settings.weekday_delivery_close_afternoon,
        )
      );
    },
    [settings],
  );

  // calcula la hora estimada de entrega
  /*   const getEstimatedHour = useCallback((hourStr) => {
    if (!hourStr || !settings?.delivery_window_minutes) return null;

    const [h, m] = hourStr.split(":").map(Number);
    const total  = h * 60 + m + settings.delivery_window_minutes;
    const eh     = String(Math.floor(total / 60)).padStart(2, "0");
    const em     = String(total % 60).padStart(2, "0");
    return `${eh}:${em}`;
  }, [settings]); */

  /*  const getEstimatedHour = useCallback((dateStr, hourStr) => {
   console.log("getEstimatedHour llamado con:", dateStr, hourStr); 
  console.log("settings:", settings); 
  if (!hourStr || !settings) return null;

  const [h, m]   = hourStr.split(":").map(Number);
  const hourMins = h * 60 + m;
  const endMins  = hourMins + settings.delivery_window_minutes;

  const toTime = (mins) => {
    const hh = String(Math.floor(mins / 60)).padStart(2, "0");
    const mm  = String(mins % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const inRange = (open, close) => {
    if (!open || !close) return false;
    const [oh, om] = open.split(":").map(Number);
    const [ch, cm] = close.split(":").map(Number);
    return hourMins >= oh * 60 + om && endMins <= ch * 60 + cm;
  };

  // si está dentro del horario de mañana → suma window a la hora elegida
  if (inRange(settings.weekday_delivery_open_morning, settings.weekday_delivery_close_morning)) {
    return toTime(endMins);
  }

  // si está dentro del horario de tarde → suma window a la hora elegida
  if (inRange(settings.weekday_delivery_open_afternoon, settings.weekday_delivery_close_afternoon)) {
    return toTime(endMins);
  }

  // si está fuera de ambos períodos pero hay tarde disponible
  // → estimado es weekday_delivery_open_afternoon + delivery_window_minutes
  if (settings.weekday_delivery_open_afternoon) {
    const [ah, am] = settings.weekday_delivery_open_afternoon.split(":").map(Number);
    const afternoonMins = ah * 60 + am + settings.delivery_window_minutes;
    return toTime(afternoonMins);
  }

  return null;
}, [settings]); */

  const slotsByDate = useMemo(() => {
    if (!settings) return {};

    const result = {};

    availableDates.forEach(({ dateKey }) => {
      const date = new Date(dateKey + "T00:00:00");
      const dayOfWeek = date.getDay();
      const isSaturday = dayOfWeek === 6;

      const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
      const isToday = dateKey === today;

      const now = isToday ? new Date() : null;

      const slots = [];

      const generateSlots = (open, close) => {
        if (!open || !close) return;

        const [oh, om] = open.split(":").map(Number);
        const [ch, cm] = close.split(":").map(Number);
        const openMins = oh * 60 + om;
        const closeMins = ch * 60 + cm;

        const nowMins = now
          ? now.getHours() * 60 +
            now.getMinutes() +
             Number(settings.minimum_schedule_minutes)//settings.minimum_schedule_minutes
          : 0;

        for (
          let t = openMins;
          t + settings.delivery_window_minutes <= closeMins;
          t += settings.delivery_window_minutes
        ) {
           if (now && t < nowMins) continue;

          if (isToday && settings.minimum_hour_to_schedule_same_day) {
            const [lh, lm] = settings.minimum_hour_to_schedule_same_day
              .split(":")
              .map(Number);
            if (t > lh * 60 + lm) continue;
          }

          const h = String(Math.floor(t / 60)).padStart(2, "0");
          const m = String(t % 60).padStart(2, "0");
          const et = t + settings.delivery_window_minutes;
          const eh = String(Math.floor(et / 60)).padStart(2, "0");
          const em = String(et % 60).padStart(2, "0");

          slots.push({
            value: `${h}:${m}`,
            label: `${h}:${m} - ${eh}:${em}`,
          });
        }
      };

      if (isSaturday) {
        generateSlots(
          settings.saturday_open_delivery,
          settings.saturday_close_delivery,
        );
      } else {
        generateSlots(
          settings.weekday_delivery_open_morning,
          settings.weekday_delivery_close_morning,
        );
        generateSlots(
          settings.weekday_delivery_open_afternoon,
          settings.weekday_delivery_close_afternoon,
        );
      }
      
      if (slots.length > 0) result[dateKey] = slots;
    });

    return result;
  }, [settings, availableDates]);

  return {
    isLoading,
    availableDates,
    slotsByDate,
    isValidHour,
    settingsDelivery: settings /* getEstimatedHour */,
  };
}
