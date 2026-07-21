// Definimos las funciones de los diversos patrones
const PATTERN_RENDERERS = {
    solid: renderSolidPattern,
    vertical: renderVerticalPattern,
    horizontal: renderHorizontalPattern,
    diagonal: renderDiagonalPattern,
    quarters: renderQuartersPattern,
};

/**
 * Función que permite crear el render de un escudo con patrón sólido.
 * @param {number} width Altura del escudo.
 * @param {number} height Anchura del escudo.
 * @param {string} principal Color del escudo.
 * @returns Diseño del escudo deseado.
 */
function renderSolidPattern(width, height, principal){
    return <rect width={width} height={height} fill={principal}/>;
}

/**
 * Función que permite crear el render de un escudo con rayas verticales.
 * @param {number} width Altura del escudo.
 * @param {number} height Anchura del escudo.
 * @param {string} principal Color principal del escudo.
 * @param {string} secondary Color secundario del escudo.
 * @param {Array[Number]} stripeSizes Array con los tamaños de las diversas líneas.
 * @returns Diseño del escudo deseado.
 */
function renderVerticalPattern(width, height, principal, secondary, stripeSizes){

    const total = stripeSizes.reduce((sum, value) => sum + value, 0);

    // Definimos la posición del eje x donde se dibujarán las rayas
    let x = 0;

    // Retornamos las rayas verticales creadas
    return (
        <>
            {stripeSizes.map((value, index) => {
                const stripeWidth = (value / total) * width;

                const rect = (
                <rect
                    key={index}
                    x={x}
                    y={0}
                    width={stripeWidth}
                    height={height}
                    fill={index % 2 === 0 ? principal : secondary}
                />
                );

                x += stripeWidth;

                return rect;
            })}
        </>
    );
}

/**
 * Función que permite crear el render de un escudo con rayas horizontales.
 * @param {number} width Altura del escudo.
 * @param {number} height Anchura del escudo.
 * @param {string} principal Color principal del escudo.
 * @param {string} secondary Color secundario del escudo.
 * @param {Array[Number]} stripeSizes Array con los tamaños de las diversas líneas.
 * @returns Diseño del escudo deseado.
 */
function renderHorizontalPattern(width, height, principal, secondary, stripeSizes){

    const total = stripeSizes.reduce((sum, value) => sum + value, 0);

    // Definimos la posición del eje x donde se dibujarán las rayas
    let y = 0;

    // Retornamos las rayas verticales creadas
    return (
        <>
            {stripeSizes.map((value, index) => {
            const stripeHeight = (value / total) * height;

            const rect = (
            <rect
                key={index}
                x={0}
                y={y}
                width={width}
                height={stripeHeight}
                fill={index % 2 === 0 ? principal : secondary}
            />
            );

            y += stripeHeight;

            return rect;
        })}
        </>
    );
}

/**
 * Función que permite crear un escudo con 2 colores de forma diagonal.
 * @param {number} width Altura del escudo.
 * @param {number} height Anchura del escudo.
 * @param {string} principal Color principal del escudo.
 * @param {string} secondary Color secundario del escudo.
 * @returns Diseño del escudo deseado.
 */
function renderDiagonalPattern(width, height, principal, secondary){
    return (
        <>
            <rect
                width={width}
                height={height}
                fill={principal}
            />

            <polygon
                points={`0,0 ${width},0 0,${height}`}
                fill={secondary}
            />
        </>
    );
}

/**
 * Función que permite crear un escudo con cuadrados, parecidos a los de la equipación croata.
 * @param {number} width Altura del escudo.
 * @param {number} height Anchura del escudo.
 * @param {string} principal Color principal del escudo.
 * @param {string} secondary Color secundario del escudo.
 * @returns Diseño del escudo deseado.
 */
function renderQuartersPattern(width, height, principal, secondary){
    return (
        <>
            <rect
                x={0}
                y={0}
                width={width / 2}
                height={height / 2}
                fill={principal}
            />

            <rect
                x={width / 2}
                y={0}
                width={width / 2}
                height={height / 2}
                fill={secondary}
            />

            <rect
                x={0}
                y={height / 2}
                width={width / 2}
                height={height / 2}
                fill={secondary}
            />

            <rect
                x={width / 2}
                y={height / 2}
                width={width / 2}
                height={height / 2}
                fill={principal}
            />
        </>
    );
}

/**
 * Componente que permite la creación de los escudos de los equipos. Los escudos, por defecto, se crean con un tamaño de 50x50, pero puede modificarse dicho tamaño mediante CSS.
 * @param {Object} props.design Diseño del escudo: Colores principal y secundario, patrón y medida de las líneas.
 * @param {number} props.extraStyles Estilos extra que se añadirán al svg que muestra el escudo. Por defecto, tiene una cadena vacía como valor por defecto.
 * @example <Crest design={principal: '#FFFFFF', secondary: '#000000', pattern: 'vertical', stripeSizes: '[20, 10, 20]'} extraStyles="w-10 h-10"/> 
 */
export default function Crest({ design, extraStyles = "" }) {

    // Definimos las constantes de todos los escudos
    const borderColor = '#000'                                                // Color del borde
    const width = 50                                                          // Ancho del escudo
    const height = 50                                                         // Alto del escudo
    const borderWidth = 2                                                     // Borde del escudo
    const radius = Math.min(width, height) / 2 - borderWidth;                 // Radio del escudo
    const {principal, secondary,  pattern, stripeSizes} = design              // Diseño del escudo a realizar
    const renderPattern = PATTERN_RENDERERS[pattern] ?? renderSolidPattern;   // Función que creará el escudo

    // Creamos el escudo
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className={"inline-block " + extraStyles}
        >
            <defs>
                <clipPath id="crestClip">
                    <circle
                        cx={width / 2}
                        cy={height / 2}
                        r={radius}
                    />
                </clipPath>
            </defs>

            <g clipPath="url(#crestClip)">
                {renderPattern(
                    width,
                    height,
                    principal,
                    secondary,
                    stripeSizes,
                )}
            </g>

            <circle
                cx={width / 2}
                cy={height / 2}
                r={radius}
                fill="none"
                stroke={borderColor}
                strokeWidth={borderWidth}
            />
        </svg>
    );
}