import { NavLink } from "react-router-dom"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

/**
 * Función que maneja el evento de cambio de idioma de la aplicación.
 * @param {string} language Idioma seleccionado
 */
function handleChange(language) {
    i18next.changeLanguage(language);
    localStorage.setItem('lang', language)
}

/**
 * Componente que permite mostrar un selector para cambiar el idioma.
 * @example <LanguageSelector/>
 */
function LanguageSelector() {

    // Creamos el objeto para cambiar de idioma
    const { t } = useTranslation();

    // Definimos las opciones del selector
    const options = {
        'es': 'Español',
        'en': 'English'
    }

    // Retornamos el componente
    return (
        <select className="py-3 md:py-0" value={t.language} defaultValue={localStorage.getItem('lang')} onChange={(e) => handleChange(e.target.value)}>
            {Object.entries(options).map(([value, text], index) => <option key={index} value={value}>{text}</option>)}
        </select>
    );
}

/**
 * Componente que muestra la barra de navegación de la aplicación.
 * @example <Navbar/>
 */
export default function Navbar() {

    // Estado para controlar si se debe mostrar o no el botón de desplegar menú (en móvil)
    const [isOpen, setIsOpen] = useState(false);

    // Creamos el objeto para cambiar de idioma
    const { t } = useTranslation()

    // Objeto que contiene las rutas y nombres o funciones de los textos que se muestran
    const routes = {
        '/': 'LaLigaTracker',
        '/standings': 'standing',
        '/matches': 'matches',
        '/calculator': 'calculator'
    }

    // Retornamos el componente
    return (
        <nav className="bg-principal text-base md:text-lg lg:text-xl text-white p-5 flex items-center flex-wrap gap-x-7 gap-y-3">
            <div className="w-full">
                <div className="hidden md:flex gap-6">
                    {Object.entries(routes).map(([route, text], index) => <NavLink key={index} to={route} className={({ isActive }) => isActive ? "font-black" : ""} onClick={() => setIsOpen(false)}>{text != 'LaLigaTracker' ? t(text + '.title') : text}</NavLink>)}
                    <LanguageSelector />
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-2xl" aria-label="Abrir menú">
                    {isOpen ? "✕" : "☰"}
                </button>
                {isOpen && (
                    <div className="block md:hidden">
                        <div className="flex flex-col px-4 items-center">
                            {Object.entries(routes).map(([route, text], index) => <NavLink key={index} to={route} className={({ isActive }) => isActive ? "font-black py-3" : "py-3"} onClick={() => setIsOpen(false)}>{text != 'LaLigaTracker' ? t(text + '.title') : text}</NavLink>)}
                            <LanguageSelector/>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}