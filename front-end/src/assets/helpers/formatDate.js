export const formatDate = (dateString) => {
  //  console.log(dateString);
  if (!dateString) return "---";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(",", ""); // Quitamos la coma que JS pone por defecto
};

export const formatDeliveryDateTime = (delivery_date, delivery_hour) => {
  if (!delivery_date || !delivery_hour) return "---";

  const [year, month, day] = delivery_date.split("-");
  const [hour, minute] = delivery_hour.split(":");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(/\./g, "")
    .replace(/\sde\s/g, " ")
    .replace(",", "");
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day); // mes es 0-indexed

  return date
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    .replace(".", ""); // pt-BR agrega un punto después del mes abreviado (ej: "26 ago."), lo sacamos
};
