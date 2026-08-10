import { NavLink } from "react-router-dom"

/**
 * Componente que muestra la barra de navegación de la aplicación.
 * @example <Navbar/>
 */
export default function Navbar(){

    const routes = {
        '/': 'LaLigaTracker',
        '/standings': 'Clasificación',
        '/matches': 'Partidos',
        '/calculator': 'Calculadora'
    }
    
    return (
        <nav className="bg-principal text-base md:text-lg lg:text-xl text-white p-5 flex items-center flex-wrap gap-x-7 gap-y-3">
            {Object.entries(routes).map(([route, text], index) => <NavLink key={index} to={route} className={({isActive}) => isActive ? "font-black" : ""}>{text}</NavLink>)}
        </nav>
    )
}