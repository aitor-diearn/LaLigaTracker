import { Link } from "react-router-dom"

/**
 * Componente que muestra un botón con un texto en él.
 * @param {string} props.text Texto del botón. 
 * @param {string} props.route Ruta a la que te redirigirá el botón. Por defecto, redirige a la página principal ('/').
 * @example <Button text='Pulse aquí'/>
 */
export default function Button({ text, route = '/' }) {
    return (
        <Link to={route}>
            <button className="bg-principal rounded-4xl pt-1 md:pt-2 pb-1 md:pb-2 text-white min-w-35 lg:min-w-45 m-2 md:m-3">{text}</button>
        </Link>
    )
}