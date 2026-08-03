import json
from datetime import datetime, UTC
from itertools import chain

def formatOriginalData(matches: json) -> tuple:
    """
        Función que permite obtener la clasificación, equipos y partidos en un formato JSON legible por el front-end a partir de los partidos recibidos de la API.

        Parameters:
            matches(json): JSON con todos los partidos obtenidos de la API.

        Returns:
            tuple: Una tupla que contiene:
                - dict: Partidos.
                - dict: Clasificación.
                - dict: Equipos.
    """

    # Variables que almacenarán los datos depurados
    matchesDep = {}
    standings = {
        'general': {},
        'local': {},
        'visitor': {},
    }
    teams = {}

    # Obtenemos los información adicional que se añadirá a los equipos obtenidos de la API
    with open("data/teamsExtraInfo.json", "r", encoding="utf-8") as f:
        teamsInfo = json.load(f)

    # Recorremos la información adicional de los equipos para generar las clasificaciones de estos y la información que tendrán
    for team in teamsInfo:
        for keyStanding in ['general', 'local', 'visitor']:
            standings[keyStanding][teamsInfo[team]['id']] = {
                    'teamId': teamsInfo[team]['id'],
                    'matches': {
                        'win': 0,
                        'draw': 0,
                        'lose': 0,
                    },
                    'points': 0,
                    'goals': {
                        'for': 0,
                        'against': 0
                    },
                    'form': '',
                    'nextRival': None
                }

        teams[teamsInfo[team]['id']] = {
            'name': team,
            'crest': teamsInfo[team]['crest']
        }

    # Creamos una clave para almacenar los partidos de cada jornada
    for i in range(1, 39):
        matchesDep.update({'matchDay' + str(i): []})

    # Recorremos los partidos
    for match in matches['matches']:

        # Nos quedamos solo con los datos deseados de los partidos
        matchDep = {
            'homeTeamId': teamsInfo[match['homeTeam']['name']]['id'],
            'awayTeamId': teamsInfo[match['awayTeam']['name']]['id'],
            'score': {
                'home': match['score']['fullTime']['home'],
                'away': match['score']['fullTime']['away'],
            },
            'datetime': match['utcDate'],
            'status': match['status'].lower()
        }

        # Añadimos el partido a su jornada correspondiente
        matchday = match['matchday']
        matchesDep['matchDay' + str(matchday)].append(matchDep)
    
        # Lista con los ids de los equipos que disputan el partido
        listIdTeams = [matchDep['homeTeamId'], matchDep['awayTeamId']]

        # Si es la 1ª jornada, guardamos la abreviatura de cada equipo en el diccionario de equipos
        if matchday == 1:
            for index, teamMatch in enumerate(listIdTeams):
                if index == 0:
                    keyTeam = 'homeTeam'
                else:
                    keyTeam = 'awayTeam'

                teams[teamMatch]['tla'] = match[keyTeam]['tla']

        # Revisamos si el partido se ha jugado o no
        if matchDep['status'].strip() != 'finished':

            # Si no se ha jugado el partido, asignamos el próximo rival al equipo si no lo tiene asignado
            addNextRival(standings['general'], listIdTeams[0], listIdTeams[1])
            addNextRival(standings['local'], listIdTeams[0], listIdTeams[1])
            addNextRival(standings['general'], listIdTeams[1], listIdTeams[0])
            addNextRival(standings['visitor'], listIdTeams[1], listIdTeams[0])
        else:

            # Dependiendo del marcador del partido, asignamos los puntos a uno u otro equipo
            scoreMatch = matchDep['score']
            if scoreMatch['home'] > scoreMatch['away']:
                for key in ['general', 'local']: 
                    addWin(standings[key][listIdTeams[0]])
                for key in ['general', 'visitor']: 
                    addLose(standings[key][listIdTeams[1]])
            elif scoreMatch['away'] > scoreMatch['home']:
                for key in ['general', 'local']: 
                    addLose(standings[key][listIdTeams[0]])
                for key in ['general', 'visitor']: 
                    addWin(standings[key][listIdTeams[1]])
            else:
                for key in ['general', 'local']: 
                    addDraw(standings[key][listIdTeams[0]])
                for key in ['general', 'visitor']: 
                    addDraw(standings[key][listIdTeams[1]])

            # Añadimos los goles a favor y en contra a los equipos
            for key in ['general', 'local']: 
                addGoals(standings[key][listIdTeams[0]], scoreMatch['home'], scoreMatch['away'])
            for key in ['general', 'visitor']: 
                addGoals(standings[key][listIdTeams[1]], scoreMatch['away'], scoreMatch['home'])

    # Ordenamos los equipos por clave y formateamos las clasificaciones
    teams = dict(sorted(teams.items()))
    sanitizeStandings(standings)

    # Retornamos los datos como una tupla
    return matchesDep, standings, teams

def addWin(team: dict):
    """
        Función que permite añadir una victoria a un equipo.

        Parameters:
            team (dict): Equipo al que se añadirá la victoria.
    """

    team['matches']['win'] += 1
    team['form'] += 'W'
    team['points'] += 3

def addDraw(team: dict):
    """
        Función que permite añadir un empate a un equipo.

        Parameters:
            team (dict): Equipo al que se añadirá el empate.
    """

    team['matches']['draw'] += 1
    team['form'] += 'D'
    team['points'] += 1

def addLose(team: dict):
    """
        Función que permite añadir una derrota a un equipo.

        Parameters:
            team (dict): Equipo al que se añadirá la derrota.
    """

    team['matches']['lose'] += 1
    team['form'] += 'L'

def addGoals(team: dict, goalsFor: int, goalsAgainst: int):
    """
        Función que permite añadir los goles a favor y en contra de un partido a un equipo.

        Parameters:
            team (dict): Equipo al que se añadirán los goles.
            goalsFor (int): Goles a favor.
            goalsAgainst (int): Goles en contra.

    """

    team['goals']['for'] += goalsFor
    team['goals']['against'] += goalsAgainst

def addNextRival(standing: dict, team: int, rival: int):
    """
        Función que permite añadir el próximo rival a un equipo, si es que no lo tiene aún.

        Parameters:
            standing (dict): Clasificación en la que se indicará el próximo rival.
            team (int): Id del equipo al que se añadirá el rival.
            rival (int): Id del equipo rival.
    """

    if standing[team]['nextRival'] == None:
        standing[team]['nextRival'] = rival

def sanitizeStandings(standings: dict):
    """
        Función que formatea de forma correcta las clasificaciones, reduciendo la longitud de la forma del equipo, y cambiando de diccionarios a listas.

        Parameters:
            standings (dict): Diccionario con todas las clasificaciones a formatear.
    """

    for key in ['general', 'local', 'visitor']:
        standings[key] = list(standings[key].values())
        for team in standings[key]:
            if len(team['form']) > 5:
                team['form'] = team['form'][len(team['form'])-5:]

def solveTies(standingGeneral: dict, matchesDef: dict) -> dict:
    """
        Función que permite obtener los equipos que se encuentran empatados a puntos en la clasificación general, y calcular cual debe estar por delante en función de los duelos directos.

        Parameters:
            standingGeneral (dict): Clasificación general donde se revisarán los equipos igualados.
            matchesDef (dict): Partidos de la temporada.

        Returns:
            dict: Diccionario con todos los equipos que están empatados, y los puntos y goles de cada uno de ellos en los duelos particulares.
    """

    # Recorremos los equipos, agrupándolos por puntos
    ties = {}
    for team in standingGeneral:
        if team['points'] in ties:
            ties[team['points']].append(team['teamId'])
        else:
            ties[team['points']] = [team['teamId']]

    # Preparamos un diccionario con todos los empates que hay en la clasificación, con el fin de obtener las estadísticas de desempate posteriormente
    head2head = {}
    for points, tie in ties.items():
        if len(tie) > 1:
            for t in tie:
                head2head[t] = {
                    'points': 0,
                    'goals': {
                        'for': 0,
                        'against': 0,
                    },
                    'pointsGeneral': points
                }
    
    # Recorremos los partidos, comprobamos que los equipos de cada uno de ellos son 2 que estén empatados
    for m in chain.from_iterable(matchesDef.values()):
        homeTeamId = m['homeTeamId']
        awayTeamId = m['awayTeamId']
        if homeTeamId in head2head and awayTeamId in head2head and head2head[homeTeamId]['pointsGeneral'] == head2head[awayTeamId]['pointsGeneral']:

            # Revisamos el marcador del partido para asignar las estadísticas necesarias a los equipos involucrados
            score = m['score']
            if score['home'] != None:
                if score['home'] > score['away']:
                    head2head[homeTeamId]['points'] += 3
                elif score['home'] < score['away']:
                    head2head[awayTeamId]['points'] += 3
                else:
                    head2head[homeTeamId]['points'] += 1
                    head2head[awayTeamId]['points'] += 1
                addGoals(head2head[homeTeamId], score['home'], score['away'])
                addGoals(head2head[awayTeamId], score['away'], score['home'])

    # Retornamos el array con los duelos directos en los empates
    return head2head

def sortStandings(standings: dict, head2head: dict, teams: dict):
    """
        Función que permite ordenar las clasificaciones por los siguientes criterios: puntos, duelos directos (solo en la general), diferencia de gol, goles a favor y nombre del equipo, ya en caso de que todo esté igualado.

        Parameters:
            standings (dict): Diccionario con todas las clasificaciones a ordenar.
            head2head (dict): Diccionario con todos los equipos que están empatados a puntos y que contiene los diversos criterios para que desempaten.
            teams (dict): Diccionario con todos los datos de los equipos.
    """
    for key in ['general', 'local', 'visitor']:
        if key == 'general':
            sortFunction = lambda x: (-x['points'], *head2headComparation(x['teamId'], head2head), -(x['goals']['for'] - x['goals']['against']), -x['goals']['for'], teams[x['teamId']]['name'])
        else:
            sortFunction = lambda x: (-x['points'], -(x['goals']['for'] - x['goals']['against']), -x['goals']['for'], teams[x['teamId']]['name'])
        standings[key] = sorted(standings[key], key=sortFunction)

def head2headComparation(teamId: int, head2head: dict) -> tuple:
    """
        Función que permite realizar la comparación para desempatar equipos.

        Parameters:
            teamId (int): Id del equipo a revisar.
            head2head (dict): Diccionario con los empates entre equipos.

        Returns:
            tuple: Una tupla con los datos de desempate, que contiene:
                - int: Puntos del equipo.
                - int: Diferencia de goles.
                - int: Goles a favor.
    """

    # Comprobamos que exista el equipo en los duelos
    h2h = head2head.get(teamId)
    if not h2h:
        return (0, 0, 0)

    # Obtenemos los goles
    goals_for = h2h['goals']['for']
    goals_against = h2h['goals']['against']

    # Retornamos los datos
    return (-h2h['points'], -(goals_for - goals_against), -goals_for)

def getMetadata(matches: json) -> dict:
    """
        Función que devuelve los metadatos necesarios para la aplicación.

        Parameteres:
            matches(json): JSON con todos los partidos obtenidos de la API.

        Returns:
            dict: Diccionaro con los metadatos de la aplicación.
    """

    # Obtenemos la jornada donde se haya el próximo partido a jugar
    actualMatchDay = 1
    for match in matches['matches']:
        if match['status'].lower() != 'finished':
            actualMatchDay = match['matchday']
            break

    # Retornamos los metadatos
    return {
        'season': matches['filters']['season'],
        'competition': matches['competition']['name'],
        'lastUpdate': datetime.now(UTC).replace(microsecond=0).isoformat().replace('+00:00', 'Z'),
        'actualMatchDay': actualMatchDay
    }

def saveDataInFile(data: json, filename: str):
    """
        Función que permite guardar los datos JSON en un fichero que será consumido por el front-end.

        Parameters:
            data (json): JSON a guardar en el fichero.
            filename (str): Nombre del fichero donde se guardará el JSON.

        Raises:
            FileNotFoundException: Al utilizarse el método open() del módulo os, se arroja una excepción si la ruta del fichero no existe.
    """
    
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)