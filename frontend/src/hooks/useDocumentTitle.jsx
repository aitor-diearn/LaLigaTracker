import { useEffect } from "react";

/**
 * Función que permite modificar el title de una pestaña.
 * @param {string} title Title de la pestaña.
 */
export function useDocumentTitle(title){
    useEffect(() => {document.title = title + " | LaLigaTracker"}, [title])
}