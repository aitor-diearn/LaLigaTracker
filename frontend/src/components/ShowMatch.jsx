import Crest from './Crest'
import { formatDate } from "../utils/formatDate"

/**
 * Componente que permite mostrar la información de un partido concreto.
 * @param {Object} props.matchInfo Objeto con la información del partido. Debe contener las siguientes claves:
 * - dateTime: Fecha y hora del partido.
 * - homeTeam: Nombre del equipo local.
 * - homeTeamTla: Abreviatura del equipo local.
 * - homeTeamDesign: Diseño del escudo local.
 * - awayTeam: Nombre del equipo visitante.
 * - awayTeamTla: Abreviatura del equipo visitante.
 * - awayTeamDesign: Diseño del escudo visitante.
 * - score: Marcador del partido.
 * @param {Boolean} props.fullScreen Booleano que permite determinar si el partido se mostrará en una ventana que ocupa toda la pantalla o no. Por defecto, tiene el valor true.
 * @example <ShowMatch matchInfo={{...}} fullScreen={false}/> 
 */
export default function ShowMatch({ matchInfo, fullScreen = true }) {

    const teamsNamesStyles = fullScreen ? "lg" : "xl"

    return (
        <article className="flex justify-center items-center gap-x-4">
            <p className="basis-25 md:basis-35 xl:basis-50">{formatDate(matchInfo.dateTime)}</p>
            <Crest design={matchInfo.homeTeamDesign} extraStyles="shrink-0 w-7 h-7 md:w-9 md:h-9 lg:w-11 lg:h-11"/>
            <p className="basis-25 md:basis-40 lg:basis-90 xl:basis-110">
                <span className={"inline-block " + teamsNamesStyles + ":hidden"}>{matchInfo.homeTeamTla}</span>
                <span className={"hidden " + teamsNamesStyles + ":inline-block"}>{matchInfo.homeTeam}</span>
                <span className="pl-2 pr-2">{matchInfo.score}</span>
                <span className={"inline-block " + teamsNamesStyles + ":hidden"}>{matchInfo.awayTeamTla}</span>
                <span className={"hidden " + teamsNamesStyles + ":inline-block"}>{matchInfo.awayTeam}</span>
            </p>
            <Crest design={matchInfo.awayTeamDesign} extraStyles="shrink-0 w-7 h-7 md:w-9 md:h-9 lg:w-11 lg:h-11"/>
        </article>
    )
}