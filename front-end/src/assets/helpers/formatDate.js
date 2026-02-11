export const formatDate = (dateString) => {
  if (!dateString) return "---";

  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date).replace(',', ''); // Quitamos la coma que JS pone por defecto
};