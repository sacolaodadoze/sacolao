import Swal from 'sweetalert2';

// Configuramos el diseño base para todo el proyecto
export const showAlert = ({
    title = '',
    text = '',
    icon = 'info',// 'success', 'error', 'warning', 'info', 'question'
    confirmButtonText = 'Aceptar',
    confirmButtonColor = '#3085d6',
    showConfirmButton = true,
    allowOutsideClick = true,
    autoClose = false,
    showLoading = false,
}) => {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
        confirmButtonColor,
        showConfirmButton,
        allowOutsideClick,
        // Si autoClose es true, ponemos 3000ms. Si es false, ponemos undefined (sin tiempo)
        timer: autoClose ? 2000 : undefined,
        
        // Muestra la barrita de progreso solo si hay temporizador
        timerProgressBar: autoClose,
        // Si mandamos showLoading en true, activamos el spinner
        willOpen: () => {
            if (showLoading) {
                Swal.showLoading();
            }
        }
    });
};


//sale pequenno en la esquina de arriba a la derecha
/* 
       Swal.fire({
    toast: true,
    position: 'top-end', // Esquina superior derecha
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    icon: 'success',
    title: 'Archivo subido correctamente',
    background: '#e6fffa',
}); */