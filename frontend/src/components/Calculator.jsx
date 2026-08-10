import Crest from './Crest'
import Standings from './Standings'
import ShowMatch from './ShowMatch'
import Window from './Window'
import standings from '../data/standings.json'
import matches from '../data/matches.json'
import teams from '../data/teams.json'
import metadata from '../data/metadata.json'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useMemo } from 'react'
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { formatDate } from "../utils/formatDate"

/**
 * Función que gestiona el click de los botones que permiten el cambio entre jornadas.
 * @param {number} matchDay Número de la jornada que se está mostrando
 * @param {function} setMatchDay Función que cambia el estado de la jornada que se muestra.
 * @param {boolean} addDay Booleano que permite determinar si se buscará en la jornada anterior o posterior.
 */
function handleClick(matchDay, setMatchDay, addDay) {
    const newMatchDay = addDay ? matchDay + 1 : matchDay - 1
    if ("matchDay" + newMatchDay in matches) {
        setMatchDay(newMatchDay)
    }
}

/**
 * Función que gestiona el cambio de los goles de los partidos.
 * @param {Number} value Valor indicado por el usuario.
 * @param {Number} matchDay Jornada a la que pertenece el partido.
 * @param {Object} match Partido que se está revisando.
 * @param {string} field Variable que determina si se ha indicado el equipo local (home) o el visitante (away).
 * @param {function} setAllMatches Función que modifica el estado de los partidos.
 */
function handleChange(value, matchDay, match, field, setAllMatches){      

    // Revisamos que el usuario haya rellenado correctamente el partido
    let v = value.replace(/\D/g, "")
    v = v.replace(/^0+/, "")

    // Actualizamos los partidos
    updateMatches('matchDay' + matchDay, match.homeTeamId, match.awayTeamId, v, field, setAllMatches)
}

/**
 * Función que permite recalcular la clasificación en función de los partidos que el usuario ha indicado.
 * @param {Array} standingGeneral Clasificación actual del simulador.
 * @param {Object} allMatches Objeto con todos los partidos de la competición.
 * @returns Clasificación simulada con los partidos indicados por el usuario ya aplicados.
 */
function simulateStandings(standingGeneral, allMatches) {
    
    // Realizamos una copia de la clasificación actual, que es de donde partimos
    const copyStandingGeneral = structuredClone(standingGeneral)

    // Generamos un listado con todos los equipos
    const teamsList = new Map(
        copyStandingGeneral.map(team => [team.teamId, team])
    );

    // Recorremos todos los partidos
    Object.values(allMatches).forEach(matches => {
        matches.forEach(match => {

            // Ignoramos los partidos finalizados y sin simular
            if (match.status === "finished" || match.score.home == null || match.score.away == null){
                return
            }

            // Obtenemos los equipos del partido
            const homeTeam = teamsList.get(match.homeTeamId);
            const awayTeam = teamsList.get(match.awayTeamId);

            // Comprobamos el número de goles para ver quien gana y quien pierde, además de añadirlos a cada equipo
            const homeGoals = Number(match.score.home);
            const awayGoals = Number(match.score.away);

            addGoals(homeTeam, homeGoals, awayGoals)
            addGoals(awayTeam, awayGoals, homeGoals)

            if (homeGoals > awayGoals) {
                addWin(homeTeam)
                addLose(awayTeam)
            } else if (homeGoals < awayGoals) {
                addLose(homeTeam)
                addWin(awayTeam)
            } else {
                addDraw(homeTeam)
                addDraw(awayTeam)
            }
        });

    });

    // Revisamos posibles empates entre los equipos
    const head2head = head2headTeams(allMatches, copyStandingGeneral)

    // Ordenamos la clasificación
    copyStandingGeneral.sort((a, b) => {

        // Ordenación por puntos
        if (b.points !== a.points){
            return b.points - a.points;
        }

        // Comprobamos si los equipos que se están comparando están igualados a puntos
        if (a.teamId in head2head && b.teamId in head2head && head2head[a.teamId]['pointsGeneral'] == head2head[b.teamId]['pointsGeneral']){

            // Ordenación por puntos en duelos directos
            if(head2head[a.teamId]['points'] !== head2head[b.teamId]['points']){
                return head2head[b.teamId]['points'] - head2head[a.teamId]['points']
            }

            // Ordenación por diferencia de goles en duelos directos
            const goalDifferenceTeamA = head2head[a.teamId]['goals']['for'] - head2head[a.teamId]['goals']['against']
            const goalDifferenceTeamB = head2head[b.teamId]['goals']['for'] - head2head[b.teamId]['goals']['against']
            if(goalDifferenceTeamA !== goalDifferenceTeamB){
                return goalDifferenceTeamB - goalDifferenceTeamA
            }

            // Ordenación por goles a favor en duelos directos
            if(head2head[a.teamId]['goals']['for'] !== head2head[b.teamId]['goals']['for']){
                return head2head[b.teamId]['goals']['for'] - head2head[a.teamId]['goals']['for']
            }
        }

        // Ordenación por diferencia de goles
        if ((b.goals.for - b.goals.against) !== (a.goals.for - a.goals.against)){
            return (b.goals.for - b.goals.against) - (a.goals.for - a.goals.against)
        }
            
        // Ordenación por goles a favor
        if (b.goals.for !== a.goals.for){
            return b.goals.for - a.goals.for;
        }

        // Ordenación por nombre
        return teams[a.teamId].name.localeCompare(teams[b.teamId].name);

    });

    // Retornamos la clasificación simulada
    return copyStandingGeneral;
}

/**
 * Función que permite añadir una victoria a un equipo.
 * @param {Object} team Equipo al que se añadirá la victoria.
 */
function addWin(team){
    team.matches.win++;
    team.points += 3;
}

/**
 * Función que permite añadir un empate a un equipo.
 * @param {Object} team Equipo al que se añadirá el empate.
 */
function addDraw(team){
    team.matches.draw++;
    team.points++;
}

/**
 * Función que permite añadir una derrota a un equipo.
 * @param {Object} team Equipo al que se añadirá la derrota.
 */
function addLose(team){
    team.matches.lose++;
}

/**
 * Función que permite añadir los goles a favor y en contra de un partido a un equipo.
 * @param {Object} team Equipo al que se añadirán los goles.
 * @param {Number} goalsFor Goles a favor.
 * @param {Number} goalsAgainst Goles en contra.
 */
function addGoals(team, goalsFor, goalsAgainst){
    team.goals.for += goalsFor
    team.goals.against += goalsAgainst
}

/**
 * Función que permite determinar los criterios de desempate en las situaciones donde 2 o más equipos estén empatados.
 * @param {Object} allMatches Objeto con todos los partidos del campeonato.
 * @param {Array} copyStandingGeneral Clasificación simulada.
 * @returns Objeto que contiene los equipos que están empatados y, de cada uno, los goles a favor, en contra y puntos contra el resto de equipos con quien están empatados.
 */
function head2headTeams(allMatches, copyStandingGeneral){

    // Recorremos los equipos, agrupándolos por puntos
    const ties = {}
    copyStandingGeneral.forEach(team => {
        if(team.points in ties){
            ties[team.points].push(team.teamId)
        }else{
            ties[team.points] = [team.teamId]
        }
    })

    // Preparamos un objeto con todos los empates que hay en la clasificación, con el fin de obtener las estadísticas de desempate posteriormente
    const head2head = {}
    Object.entries(ties).forEach(tie => {
        if(tie[1].length > 1){
            tie[1].forEach(t => head2head[t] = {
                points: 0,
                goals: {
                    for: 0,
                    against: 0,
                },
                pointsGeneral: tie[0]
            })
        }
    })

    // Recorremos los partidos, comprobamos que los equipos de cada uno de ellos son 2 que estén empatados
    Object.values(allMatches).forEach(matches => {
        matches.forEach(match => {
            const homeTeamId = match['homeTeamId']
            const awayTeamId = match['awayTeamId']
            if(homeTeamId in head2head && awayTeamId in head2head && head2head[homeTeamId]['pointsGeneral'] == head2head[awayTeamId]['pointsGeneral']){

                // Revisamos el marcador del partido para asignar las estadísticas necesarias a los equipos involucrados
                const score = match.score
                if(score.home != null){
                    if(score.home > score.away){
                        head2head[homeTeamId]['points'] += 3
                    }else if(score.home < score.away){
                        head2head[awayTeamId]['points'] += 3
                    }else{
                        head2head[homeTeamId]['points']++
                        head2head[awayTeamId]['points']++
                    }
                    addGoals(head2head[homeTeamId], score.home, score.away)
                    addGoals(head2head[awayTeamId], score.away, score.home)
                }
            }
        })
    })

    // Retornamos el objeto con los duelos directos en los empates
    return head2head
}

/**
 * Función que actualiza el marcador de los partidos que introduce el usuario.
 * @param {Number} matchDay Jornada a la que pertenecen los partidos que se modifican.
 * @param {Number} homeTeamId Id del equipo local.
 * @param {Number} awayTeamId Id del equipo visitante.
 * @param {Number} goals Número de goles que ha indicado el usuario.
 * @param {string} field Variable que determina si se ha indicado el equipo local (home), el visitante (away) o la limpieza de toda la jornada de liga (delete).
 * @param {function} setAllMatches Función que modifica el estado de los partidos.
 */
function updateMatches(matchDay, homeTeamId, awayTeamId, goals, field, setAllMatches){
    
    // Determinamos cual es la otra clave que se debe revisar en los goles, con el fin de indicar algún gol si no lo tiene al equipo rival del que indicó el usuario 
    const otherField = field != 'away' ? 'away' : 'home'

    // Actualizamos los partidos
    setAllMatches(allMatches => ({
        ...allMatches,
        [matchDay]: allMatches[matchDay].map(match =>

            // Comprobamos si los ids de los equipos coinciden con los partidos modificados, y miramos si se indico borrado o no de datos
            match.homeTeamId == homeTeamId && match.awayTeamId == awayTeamId ? {
                ...match,
                score: field == 'delete' ? {
                    home: null,
                    away: null
                } : {
                    [field]: Number(goals),
                    [otherField]: match.score[otherField] == null ? 0 : match.score[otherField]
                },
            }
                : match
        )
    }))
}

/**
 * Función que permite generar los botones de la sección de partidos.
 * @param {string} icon Icono que se mostrará en los botones.
 * @param {string} className Valor del atributo class del elemento.
 * @param {function} onClick Evento de click cuando se pulsa el botón.
 * @returns Código HTML del botón.
 */
function generateButtonsMatches(icon, className, onClick){
    return <button className={className} onClick={onClick}><i className={icon}></i></button>
}

/**
 * Función que permite generar los inputs donde el usuario introducirá los resultados de los partidos.
 * @param {string} value Valor del input
 * @param {Number} matchDay Jornada del partido.
 * @param {Object} match Datos del partido.
 * @param {string} field Variable que determina si se ha indicado el equipo local (home) o el visitante (away).
 * @param {function} setAllMatches Función que modifica el estado de los partidos.
 * @returns Código HTML del input deseado.
 */
function generateInputsMatches(value, matchDay, match, field, setAllMatches){
    const padding = field == 'home' ? 'pl-2' : 'pr-2' 
    return <input type="text" inputMode="numeric" className={"inline-block w-6 md:w-8 text-center read-only:cursor-default " + padding} min="0" step="1" value={value != null ? value : ''} onChange={(e) => handleChange(e.target.value, matchDay, match, field, setAllMatches)} readOnly={match.status == 'finished' ? true : false}/>
}

/**
 * Componente que permite mostrar la calculadora para poder simular resultados.
 * @example <Calculator/>
 */
export default function Calculator() {

    // Ponemos el title de la pestaña
    useDocumentTitle('Calculadora')

    // Creamos estados para los partidos que se muestran, la jornada en juego y la clasificación simulada
    const [allMatches, setAllMatches] = useState(matches)
    const [matchDay, setMatchDay] = useState(metadata.actualMatchDay)
    const [standingGeneral, setStandingGeneral] = useState(standings['general'])

    // Aplicamos cambios en la clasificación cuando está o los partidos sufrán cambios
    const simulatedStandings = useMemo(() => simulateStandings(standingGeneral, allMatches), [standingGeneral, allMatches])

    // Retornamos el componente
    return (
        <>
            <h1 className="text-xl md:text-3xl xl:text-4xl text-center font-bold mt-6">Calculadora</h1>
            <section className="md:ml-6 md:mr-6 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Window extraStyles="md:rounded-3xl">
                    <nav className="flex justify-center gap-x-4 lg:text-2xl mb-3 md:mb-5">
                        {generateButtonsMatches("bi bi-chevron-double-left", matchDay == 1 ? "hidden" : "", () => handleClick(matchDay, setMatchDay, false))}
                        <p className="font-bold text-principal">Jornada {matchDay}</p>
                        {generateButtonsMatches("bi bi-chevron-double-right", matchDay == 38 ? "hidden" : "", () => handleClick(matchDay, setMatchDay, true))}
                    </nav>
                    <div>
                        {generateButtonsMatches("bi bi-arrow-repeat text-lg md:text-xl xl:text-3xl text-principal", "mb-2", () => {
                            allMatches['matchDay' + matchDay].forEach(match => {
                                updateMatches('matchDay' + matchDay, match.homeTeamId, match.awayTeamId, null, 'delete', setAllMatches)
                            })
                        })}
                    </div>
                    <section className="grid grid-cols-1 gap-x-2">
                        {allMatches['matchDay' + matchDay].map((match, index) => {

                            const bgColor = match.status == 'finished' ? "bg-green-200" : ""
                            return (
                                <article className={"flex justify-center items-center gap-x-4 pt-1 pb-1 " + bgColor} key={index}>
                                    <p className="basis-25 md:basis-35 xl:basis-50">{formatDate(match.datetime)}</p>
                                    <Crest design={teams[match.homeTeamId].crest} extraStyles="shrink-0 w-7 h-7 md:w-9 md:h-9 lg:w-11 lg:h-11" />
                                    <p className="basis-25 md:basis-40 lg:basis-90 xl:basis-110 flex flex-row justify-center items-center">
                                        <span className="inline-block w-8 md:w-10">{teams[match.homeTeamId].tla}</span>
                                        {generateInputsMatches(match.score.home, matchDay, match, 'home', setAllMatches)}
                                        <span>-</span>
                                        {generateInputsMatches(match.score.away, matchDay, match, 'away', setAllMatches)}
                                        <span className="inline-block w-8 md:w-10">{teams[match.awayTeamId].tla}</span>
                                    </p>
                                    <Crest design={teams[match.awayTeamId].crest} extraStyles="shrink-0 w-7 h-7 md:w-9 md:h-9 lg:w-11 lg:h-11" />
                                </article>
                            )
                        })}
                    </section>
                </Window>
                <Window extraStyles="md:rounded-3xl">
                    <table className="w-full table-auto border-separate border-spacing-y-1.5 text-sm md:text-base">
                        <thead>
                            <tr>
                                {['#', 'Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DF', 'Pts.'].map((text, index) => <td key={index}>{text}</td>)}
                            </tr>
                        </thead>
                        <tbody>
                            {simulatedStandings.map((s, index) => {

                                // Determinamos el valor del borde que se mostrará al usuario
                                let borderColor = "border-transparent"
                                if(index < 4){
                                    borderColor = "border-champions-league"
                                }else if(index < 5){
                                    borderColor = "border-europa-league"
                                }else if(index < 6){
                                    borderColor = "border-conference-league"
                                }else if(index >= simulatedStandings.length - 3){
                                    borderColor = "border-relegation"
                                }
                                
                                return (<tr key={index}>
                                    <td className={"border-l-4 " + borderColor}>{index + 1}.</td>
                                    <td className="text-left">
                                        <div className="flex items-center">
                                            <Crest design={teams[s.teamId].crest} extraStyles="shrink-0 w-7 h-7" />
                                            <span className="pl-3">{teams[s.teamId].tla}</span>
                                        </div>
                                    </td>
                                    <td>{s.matches.win + s.matches.draw + s.matches.lose}</td>
                                    <td>{s.matches.win}</td>
                                    <td>{s.matches.draw}</td>
                                    <td>{s.matches.lose}</td>
                                    <td>{s.goals.for}</td>
                                    <td>{s.goals.against}</td>
                                    <td>{s.goals.for - s.goals.against}</td>
                                    <td className="font-bold">{s.points}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </Window>
            </section>
        </>
    )
}