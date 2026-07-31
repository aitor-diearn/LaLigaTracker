import Window from "./Window"
import Button from "./Button"
import ShowMatch from "./ShowMatch"
import Crest from "./Crest"
import standings from '../data/standings.json'
import matches from '../data/matches.json'
import teams from '../data/teams.json'
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/**
 * Función que permite obtener los partidos que se mostrarán en su respectiva sección.
 * @param {Array} matchesToShow Array que se llenará con los partidos.
 * @param {Object} matches Objeto con todos los partidos disputados.
 * @param {Object} teams Objeto con todos los datos de los equipos.
 * @param {String} status Estado del partido: planificado (scheduled) o finalizado (finished).
 */
function getMatchesToShow(matchesToShow, matches, teams, status) {

    // Dependiendo del status, el bucle se hará del 1º partido al último o inverso
    for (let i = status == 'scheduled' ? 1 : 38; status == 'scheduled' ? i <= 38 : i >= 1; status == 'scheduled' ? i++ : i--) {

        // Revisamos que no haya ya 30 partidos introducidos para tener suficientes para mostrar
        if (matchesToShow.length >= 30) {
            break;
        }

        // Obtenemos los partidos a mostrar de la jornada que se está revisando
        const matchesToAdd = matches['matchDay' + i].filter(match => match.status == status).map(match => {

            // Revisamos el resultado del partido
            const scoreHome = match.score.home != null ? match.score.home : ''
            const scoreAway = match.score.away != null ? match.score.away : ''

            // Retornamos el objeto con los datos necesarios para mostrarse posteriormente
            return {
                'dateTime': match.datetime,
                'homeTeam': teams[match.homeTeamId].name,
                'homeTeamTla': teams[match.homeTeamId].tla,
                'awayTeam': teams[match.awayTeamId].name,
                'awayTeamTla': teams[match.awayTeamId].tla,
                'homeTeamDesign': teams[match.homeTeamId].crest,
                'awayTeamDesign': teams[match.awayTeamId].crest,
                'score': scoreHome + '-' + scoreAway
            }
        })

        // Añadimos los partidos al array indicado
        for (let m of matchesToAdd) {
            matchesToShow.push(m)
        }

        // Ordenamos los partidos para que aparezcan siempre los más antiguos primero, y evitar problemas con los aplazados
        matchesToShow.sort((a, b) => status == 'scheduled' ? new Date(a.dateTime) > new Date(b.dateTime) : new Date(a.dateTime) < new Date(b.dateTime) 
        )
    }
}

/**
 * Componente principal, que muestra la pantalla principal de la aplicación.
 * @example <Home/>
 */
export default function Home() {

    // Ponemos el title de la pestaña
    useDocumentTitle('Principal')

    // Límites de los equipos que se mostrarán en la clasificación, y del número de partidos mostrados
    const limitTeamsStanding = 10
    const limitMatchesShown = 10

    // Generamos el array de los partidos a mostrar
    const matchesToShow = []
    for(let t of ['scheduled', 'finished']){
        getMatchesToShow(matchesToShow, matches, teams, t)
    }

    // Generamos el código del componente que se mostrará al usuario
    return (
        <>
            <Window>
                <p className="font-black md:text-2xl lg:text-4xl mb-4 md:mb-6">LaLigaTracker</p>
                <p>Aplicación no oficial de datos de la liga española.</p>
            </Window>
            <section className="md:ml-6 md:mr-6 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Window extraStyles="md:rounded-3xl">
                    <p className="font-black md:text-2xl lg:text-4xl mb-4 md:mb-6">Ranking</p>
                    <table className="w-full table-auto border-separate border-spacing-y-1.5">
                        <thead>
                            <tr>
                                {['#', 'Equipo', 'PJ', 'DG', 'Pts.'].map((text, index) => <td key={index}>{text}</td>)}
                            </tr>
                        </thead>
                        <tbody>
                            {standings['general'].map((s, index) => {
                                if(index < limitTeamsStanding){

                                    // Determinamos el valor del borde que se mostrará al usuario
                                    let borderColor = "border-transparent"
                                    if(index < 4){
                                        borderColor = "border-champions-league"
                                    }else if(index < 5){
                                        borderColor = "border-europa-league"
                                    }else if(index < 6){
                                        borderColor = "border-conference-league"
                                    }else if(index >= standings['general'].length - 3){
                                        borderColor = "border-relegation"
                                    }

                                    // Retornamos la fila
                                    return (
                                         <tr key={index}>
                                            <td className={"border-l-4 " + borderColor}>{index + 1}.</td>
                                            <td className="text-left">
                                                <div className="flex items-center">
                                                    <Crest design={teams[s.teamId].crest} extraStyles="shrink-0 w-7 h-7 md:w-9 md:h-9 lg:w-11 lg:h-11" />
                                                    <span className="inline-block sm:hidden md:inline-block lg:hidden pl-3">{teams[s.teamId].tla}</span>
                                                    <span className="hidden sm:inline-block md:hidden lg:inline-block pl-3">{teams[s.teamId].name}</span>
                                                </div>
                                            </td>
                                            <td>{s.matches.win + s.matches.draw + s.matches.lose}</td>
                                            <td>{s.goals.for - s.goals.against}</td>
                                            <td>{s.points}</td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                    <Button text="Ver más" route="/standings"/>
                </Window>
                <Window extraStyles="md:rounded-3xl">
                    <p className="font-black md:text-2xl lg:text-4xl mb-4 md:mb-6">Próximos partidos</p>
                    <article className="flex flex-col gap-y-1 md:gap-y-2">
                        {matchesToShow.map((match, index) => {

                            // Mostramos solo un número determinado de partidos
                            if(index < limitMatchesShown){
                                return <ShowMatch key={index} matchInfo={match} fullScreen={false}/>
                            }
                        })}
                    </article>
                    <Button text="Ver más" route="/matches" />
                </Window>
            </section>
        </>
    )
}