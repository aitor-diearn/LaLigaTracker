import requests
import json

class GetDataFromApi():

    def __init__(self, apiKey: str):
        """
            Constructor de la clase.

            Parameters:
                apiKey (str): Clave para acceder a la Api.
        """

        self.__headers = {
            'X-Auth-Token': apiKey
        }

    def getData(self, url: str) -> json:
        """
            Método que permite obtener información de la Api.

            Parameters:
                url (str): Ruta de la Api a la que se quiere acceder.

            Returns:
                json: Datos recibidos de la Api

            Raises:
                Exception: Si no se obtiene nada de la Api, se arroja una excepción.
        """

        request = requests.get('http://api.football-data.org/' + url, headers=self.__headers)
        if request.status_code == 200:
            data = request.json()
            if len(data) == 0:
                raise Exception('No data obtained from the Api')
            else:
                return request.json()
        elif request.status_code == 404:
            raise Exception('Page Not Found')
        else:
            raise Exception('Unexpected error')