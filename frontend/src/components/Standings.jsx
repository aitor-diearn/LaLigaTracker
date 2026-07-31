import Window from "./Window"
import Footer from "./Footer"
import Crest from "./Crest"
import ShowTeamNames from './ShowTeamNames'
import standings from '../data/standings.json'
import teams from '../data/teams.json'
import '../styles/standings.css'
import { useState } from 'react'
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/**
 * Función que permite obtener la infomación de la clasificación para luego mostrarse en la tabla correctamente
 * @param {Array} standing Clasificación de la que se obtendrá la información.
 * @returns Array de objetos que contienen la información necesaria para mostrarse en una tabla.
 */
function getDataStanding(standing, element = null){
    return standings[standing].map(teamStanding => {
        const teamData = teams[teamStanding.teamId]
        return {
            design: teamData.crest,
            name: teamData.name,
            tla: teamData.tla,
            matchesPlayed: teamStanding.matches.win + teamStanding.matches.draw + teamStanding.matches.lose,
            matchesWin: teamStanding.matches.win,
            matchesDraw: teamStanding.matches.draw,
            matchesLose: teamStanding.matches.lose,
            goalsFor: teamStanding.goals.for,
            goalsAgainst: teamStanding.goals.against,
            goalsDiff: teamStanding.goals.for - teamStanding.goals.against,
            points: teamStanding.points,
            teamForm: teamStanding.form.split(''),
            nextRivalName: teams[teamStanding.nextRival].name,
            nextRivalTla: teams[teamStanding.nextRival].tla
        }
    })
}

/**
 * Función que permite manejar el evento de click en 
 * @param {string} standingToShow Clave del objeto de clasificaciones que se va a mostrar.
 * @param {React.Dispatch} setStanding Manejador del estado de la clasificación que se muestra.
 * @param {React.Dispatch} setSelected Manejador del estado del texto de clasificación destacado.
 */
function handleClick(standingToShow, setStanding, setSelected){
    setStanding(getDataStanding(standingToShow))
    setSelected(standingToShow)
}

/**
 * Componente que permite generar los iconos con el estado de forma de cada equipo.
 * @param {string} props.teamForm Forma del equipo.
 * @example <TeamForm teamForm="WWDLW"/>
 */
function TeamForm({ teamForm }) {

    // Definimos los colores que van con cada tipo de forma
    const teamFormColors = {
        W: {
            color: "bg-victory",
            label: "V",
            title: "Victoria",
        },
        D: {
            color: "bg-draw",
            label: "E",
            title: "Empate",
        },
        L: {
            color: "bg-defeat",
            label: "D",
            title: "Derrota",
        },
    };

    // Definimos los estilos que tendrá el elemento
    const className = "flex w-6 h-6 lg:h-7 lg:w-7 items-center justify-center rounded-full text-xs font-bold text-black "

    // Retornamos el componente
    return (
        <div className="flex justify-center items-center gap-1">
            {teamForm.map((result, index) => (
                <span
                    key={index}
                    title={teamFormColors[result].title}
                    className={className + teamFormColors[result].color}
                >
                    {teamFormColors[result].label}
                </span>
            ))}
        </div>
    );
}

/**
 * Componente que nos permite mostrar las diferentes clasificaciones de la competición.
 * @example <Standings />
 */
export default function Standings() {

    // Ponemos el title de la pestaña
    useDocumentTitle('Clasificación')

    // Creamos estados para almacenar la clasificación y mostrar, de manera gráfica, cual se está viendo
    const [standing, setStanding] = useState(getDataStanding('general'))
    const [selected, setSelected] = useState('general')

    // Establecemos las medidas de los escudos
    const widthCrest = 35
    const heightCrest = 35
    const borderWidthCrest = 1

    // Estilos de las celdas de la tabla
    const styleTitleTable = "text-black font-bold"
    const styleTeamForm = "hidden md:table-cell"
    const arrayStyleColsTable = []
    for(let i = 0; i < 12; i++){
        if(i == 10){
            arrayStyleColsTable.push(styleTeamForm + " md:40 " + styleTitleTable)
        }else if(i != 1 && i != 11){
            arrayStyleColsTable.push("w-6 md:w-10 " + styleTitleTable)
        }else{
            let lengths = "w-20 md:w-auto "
            if(i == 11){
                lengths += ""
            }
            arrayStyleColsTable.push(lengths + styleTitleTable)
        }
    }

    // Retornamos el componente
    return (
        <>
            <h1 className="text-xl md:text-3xl xl:text-4xl text-center font-bold mt-6">Clasificación</h1>
            <Window extraStyles="md:ml-6 md:mr-6 md:rounded-3xl">
                <nav className="flex flex-col gap-y-2 sm:flex-row justify-between mb-2">
                    {
                        ['general', 'local', 'visitor'].map((text, index) => <button key={index} className={selected == text ? "font-bold text-principal" : ""} onClick={e => handleClick(text, setStanding, setSelected)}><span className="text-sm md:text-base lg:text-lg xl:text-xl">Clasificación {text == 'visitor' ? 'visitante' : text}</span></button>)
                    }
                </nav>
                <hr/>
                <table className="w-full table-auto border-separate border-spacing-y-1.5 text-sm md:text-base lg:text-lg xl:text-xl">
                    <thead>
                        <tr>
                            {['#', 'Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG', 'Pts.', 'Forma', 'Próximo rival'].map((text, index) => <td key={index} className={arrayStyleColsTable[index]}>{text}</td>)}
                        </tr>
                    </thead>
                    <tbody>
                        {standing.map((s, index) => {
                            
                            // Determinamos el valor del borde que se mostrará al usuario
                            let borderColor = "border-transparent"
                            if(index < 4){
                                borderColor = "border-champions-league"
                            }else if(index < 5){
                                borderColor = "border-europa-league"
                            }else if(index < 6){
                                borderColor = "border-conference-league"
                            }else if(index >= standing.length - 3){
                                borderColor = "border-relegation"
                            }
                        
                            // Retornamos la fila de la tabla
                            return (
                            <tr key={index}>
                                <td className={"border-l-4 md:border-l-6 " + borderColor}>{index + 1}.</td>
                                <td className="text-left">
                                    <div className="flex items-center">
                                        <Crest design={s.design} extraStyles="shrink-0 w-7 h-7 md:w-9 md:h-9 lg:w-11 lg:h-11" />
                                        <span className="inline-block lg:hidden pl-3">{s.tla}</span>
                                        <span className="hidden lg:inline-block pl-3">{s.name}</span>
                                    </div>
                                </td>
                                <td>{s.matchesPlayed}</td>
                                <td>{s.matchesWin}</td>
                                <td>{s.matchesDraw}</td>
                                <td>{s.matchesLose}</td>
                                <td>{s.goalsFor}</td>
                                <td>{s.goalsAgainst}</td>
                                <td>{s.goalsDiff}</td>
                                <td className="font-bold">{s.points}</td>
                                <td className={styleTeamForm}>{s.teamForm.length > 0 ? <TeamForm teamForm={s.teamForm}/> : "Sin info"}</td>
                                <td>
                                    <span className="inline-block lg:hidden whitespace-nowrap">{s.nextRivalTla}</span>
                                    <span className="hidden lg:inline-block whitespace-nowrap">{s.nextRivalName}</span>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </Window>
        </>
    )
}