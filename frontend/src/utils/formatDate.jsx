import { useTranslation } from "react-i18next"
import i18next from "i18next";

/**
 * Función que permite formatear una fecha para obtener los datos que necesitamos.
 * @param {string} originalDate Fecha a formatear.
 * @returns Fecha formateada.
 */
export function formatDate(originalDate) {
    return new Intl.DateTimeFormat(i18next.language == 'es' ? 'es-ES' : 'en-GB', {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(originalDate));
}