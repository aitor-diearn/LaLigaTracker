import Window from "./Window"
import metadata from '../data/metadata.json'
import { formatDate } from "../utils/formatDate"
import { useTranslation, Trans } from "react-i18next"

/**
 * Componente que muestra el footer de la página.
 * @example <Footer/>
 */
export default function Footer() {

    // Creamos el objeto para cambiar de idioma
    const { t } = useTranslation();

    // Retornamos el componente
    return (
        <footer className="bg-secondary">
            <Window>
                <p className="font-black text-xl md:text-2xl lg:text-4xl mb-4 md:mb-6">{t('footer.title')}</p>
                {[1, 2, 3, 4, 5].map((number, index) => <p key={index} ><Trans i18nKey={"footer.part" + number} components={[
                    <a href="https://www.football-data.org/"/>
                ]}/> {number == 5 ? formatDate(metadata.lastUpdate) : ''}</p>)}
            </Window>
        </footer>
    )
}