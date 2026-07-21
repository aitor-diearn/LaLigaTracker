import logging
import time
import os
from dotenv import load_dotenv
from utilities.utilities import formatOriginalData, solveTies, sortStandings, getMetadata, saveDataInFile
from classes.GetDataFromApi import GetDataFromApi

# Cargamos el env en código
load_dotenv()

# Configuramos el gestor de logs
logging.basicConfig(
    level = logging.INFO,
    format = "%(asctime)s UTC %(levelname)s %(message)s"
)
logging.Formatter.converter = time.gmtime

# Obtenemos la información de la Api
logging.info('Getting data from the Api')
try:
    getDataFromApi = GetDataFromApi(os.getenv('API_KEY'))
    matches = getDataFromApi.getData('v4/competitions/PD/matches')
except Exception as e:
    logging.exception(str(e))
    exit()

# Formateamos y generamos los datos necesarios para el front-end
logging.info('Generating JSON for matches, standings and teams')
matchesDef, standingsDef, teamsDef = formatOriginalData(matches)

# Resolvemos los empates a puntos en las clasificaciones
logging.info('Solving ties')
head2head = solveTies(standingsDef['general'], matchesDef)

# Ordenamos las clasificaciones
logging.info('Sorting standings')
sortStandings(standingsDef, head2head, teamsDef)

# Generamos los metadatos de la aplicación
logging.info('Generating metadata')
metadata = getMetadata(matches)

# Guardamos la información en ficheros
logging.info('Saving data in files')
try:
    dataToSave = {
        'matches': matchesDef,
        'standings': standingsDef,
        'teams': teamsDef,
        'metadata': metadata
    }
    for nameFile, data in dataToSave.items():
        saveDataInFile(data, '../frontend/src/data/' + nameFile + '.json')
except FileNotFoundError as e:
    logging.exception(str(e))
    exit()
logging.info('Process finished')