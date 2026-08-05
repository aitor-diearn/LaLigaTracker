import Window from "./Window"
import metadata from '../data/metadata.json'
import { formatDate } from "../utils/formatDate"

/**
 * Componente que muestra el footer de la página.
 * @example <Footer/>
 */
export default function Footer() {
    return (
        <footer className="bg-secondary">
            <Window>
                <p className="font-black text-xl md:text-2xl lg:text-4xl mb-4 md:mb-6">Aviso legal</p>
                <p>Este proyecto ha sido desarrollado con fines exclusivamente educativos y como parte de un portfolio personal. No tiene ánimo de lucro.</p>
                <p>Los datos deportivos mostrados en la aplicación se obtienen a través de la API de <a href="https://www.football-data.org/">football-data.org</a> y se utilizan de acuerdo con sus condiciones de uso.</p>
                <p>Los nombres de los clubes, competiciones, escudos, logotipos y demás marcas mencionadas o mostradas en la aplicación pertenecen a sus respectivos propietarios y se utilizan únicamente con fines identificativos.</p>
                <p>Este proyecto no está afiliado, patrocinado ni respaldado por <a href="https://www.football-data.org/">football-data.org</a>, LaLiga, los clubes participantes ni ninguna otra entidad deportiva.</p>
                <p>Información de la liga actualizada a {formatDate(metadata.lastUpdate)}
                </p>
            </Window>
        </footer>
    )
}