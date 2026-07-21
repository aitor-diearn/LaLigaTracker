import Window from "./Window"
import Button from "./Button"
import ShowMatch from "./ShowMatch"
import standings from '../data/standings.json'
import matches from '../data/matches.json'
import teams from '../data/teams.json'

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

        // Revisamos que no haya ya 10 partidos introducidos
        if (matchesToShow.length >= 10) {
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
    }
}

/**
 * Componente principal, que muestra la pantalla principal de la aplicación.
 * @example <Home/>
 */
export default function Home() {

    // Generamos el array de los partidos a mostrar
    const matchesToShow = []
    for(let t of ['scheduled', 'finished']){
        getMatchesToShow(matchesToShow, matches, teams, t)
    }

    // Generamos el código del componente que se mostrará al usuario
    return (
        <main className="bg-secondary flex-1">
            <Window>
                <p className="font-black md:text-2xl lg:text-4xl mb-4 md:mb-6">LaLigaTracker</p>
                <p>Aplicación no oficial de datos de la liga española.</p>
            </Window>
            <section className="md:ml-6 md:mr-6 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <Window extraStyles="md:rounded-3xl">
                    <p className="font-black md:text-2xl lg:text-4xl mb-4 md:mb-6">Ranking</p>
                    {standings['general'].map((team, index) => {
                        
                        // Solo mostramos 10 equipos
                        if (index <= 9) {
                            const teamName = teams[team.teamId].name
                            return <p key={index}>{index + 1}. {teamName} - {team.points} pts.</p>
                        }
                    })}
                    <Button text="Ver más" route="/standings"/>
                </Window>
                <Window extraStyles="md:rounded-3xl">
                    <p className="font-black md:text-2xl lg:text-4xl mb-4 md:mb-6">Próximos partidos</p>
                    {matchesToShow.map((match, index) => <ShowMatch key={index} matchInfo={match} fullScreen={false}/>)}
                    <Button text="Ver más" route="/matches" />
                </Window>
            </section>
        </main>
    )
}