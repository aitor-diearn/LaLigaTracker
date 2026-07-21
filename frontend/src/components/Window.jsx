/**
 * Componente que muestra una ventana con fondo blanco para mostrar información en ella.
 * @param {string} props.children Contenido que se mostrará dentro de la ventana.
 * @param {string} props.extraStyles Estilos extra que se añadirán a la ventana diseñada. Por defecto, tiene como valor una cadena vacía
 * @example <Window extraStyles="md:rounded-3xl">Hello World!</Window>
 */
export default function Window({ children, extraStyles = "" }) {
    return (
        <article className={"bg-white mt-6 p-7 text-center text-sm md:text-base lg:text-lg " + extraStyles}>
            {children}
        </article>
    )
}