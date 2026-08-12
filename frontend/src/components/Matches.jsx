import Window from "./Window"
import Footer from "./Footer"
import ShowMatch from "./ShowMatch"
import matches from '../data/matches.json'
import teams from '../data/teams.json'
import metadata from '../data/metadata.json'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from "react"
import { useDocumentTitle } from "../hooks/useDocumentTitle"
import { useTranslation } from "react-i18next"

/**
 * Función que gestiona el click de los botones que permiten el cambio entre jornadas.
 * @param {number} matchDay Número de la jornada que se está mostrando
 * @param {function} setMatchDay Función que cambia el estado de la jornada que se muestra.
 * @param {function} setMatchesToShow Función que cambia los partidos que se muestran al usuario.
 * @param {boolean} addDay Booleano que permite determinar si se buscará en la jornada anterior o posterior.
 */
function handleClick(matchDay, setMatchDay, addDay){
    const newMatchDay = addDay ? matchDay + 1 : matchDay - 1
    if("matchDay" + newMatchDay in matches){
        setMatchDay(newMatchDay)
    }     
}

/**
 * Componente que permite mostrar la pantalla con los partidos disputados cada jornada.
 * @example <Matches/>
 */
export default function Matches() {

    // Creamos el objeto para cambiar de idioma
    const { t } = useTranslation()

    // Ponemos el title de la pestaña
    useDocumentTitle(t('matches.title'))

    // Definimos los estados necesarios para mostrar los partidos
    const [matchDay, setMatchDay] = useState(metadata.actualMatchDay)

    // Retornamos el componente
    return (
        <>
            <h1 className="text-xl md:text-3xl xl:text-4xl text-center font-bold mt-6">{t('matches.title')}</h1>
            <Window extraStyles="md:ml-6 md:mr-6 md:rounded-3xl">
                <nav className="flex justify-center gap-x-4 lg:text-2xl mb-3 md:mb-5">
                        <button className={matchDay == 1 ? "hidden" : ""} onClick={() => handleClick(matchDay, setMatchDay, false)}><i className="bi bi-chevron-double-left"></i></button>
                        <p className="font-bold text-principal">{t('matches.matchDay')} {matchDay}</p>
                        <button className={matchDay == 38 ? "hidden" : ""} onClick={() => handleClick(matchDay, setMatchDay, true)}><i className="bi bi-chevron-double-right"></i></button>
                </nav>
                <section className="grid grid-cols-1 md:grid-rows-5 md:grid-cols-[50%_50%] md:grid-flow-col gap-x-2 gap-y-2">
                    {matches['matchDay' + matchDay].map((match, index) => {

                        // Revisamos el resultado del partido
                        const scoreHome = match.score.home != null ? match.score.home : ''
                        const scoreAway = match.score.away != null ? match.score.away : ''

                        const matchData = {
                            'dateTime': match.datetime,
                            'homeTeam': teams[match.homeTeamId].name,
                            'homeTeamTla': teams[match.homeTeamId].tla,
                            'awayTeam': teams[match.awayTeamId].name,
                            'awayTeamTla': teams[match.awayTeamId].tla,
                            'homeTeamDesign': teams[match.homeTeamId].crest,
                            'awayTeamDesign': teams[match.awayTeamId].crest,
                            'score': scoreHome + '-' + scoreAway
                        }

                        return <ShowMatch key={index} matchInfo={matchData}/>
                    })}
                </section>
            </Window>
        </>
    )
}