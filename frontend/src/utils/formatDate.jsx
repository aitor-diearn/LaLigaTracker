/**
 * Función que permite formatear una fecha para obtener los datos que necesitamos.
 * @param {string} originalDate Fecha a formatear.
 * @returns Fecha formateada.
 */
export function formatDate(originalDate) {
    return new Intl.DateTimeFormat(undefined, {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(originalDate));
}