import { NavLink } from "react-router-dom"
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
        <select value={t.language} defaultValue={localStorage.getItem('lang')} onChange={(e) => handleChange(e.target.value)}>
            {Object.entries(options).map(([value, text], index) => <option key={index} value={value}>{text}</option>)}
        </select>
    );
}

/**
 * Componente que muestra la barra de navegación de la aplicación.
 * @example <Navbar/>
 */
export default function Navbar() {

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
            {Object.entries(routes).map(([route, text], index) => <NavLink key={index} to={route} className={({ isActive }) => isActive ? "font-black" : ""}>{text != 'LaLigaTracker' ? t(text + '.title') : text}</NavLink>)}
            <LanguageSelector />
        </nav>
    )
}