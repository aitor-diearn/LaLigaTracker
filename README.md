# LaLigaTracker

### Español

_Nota: La aplicación todavia se encuentra en desarrollo. Se irá actualizando y mejorando con el tiempo._

Aplicación no oficial de la liga española que muestra la clasificación y partidos de la actual temporada. También se puede realizar una simulación de todos los partidos de la temporada, viendo como cambia la clasificación en vivo.

La parte back-end de obtención de datos se ha hecho con Python. Dichos datos son obtenidos de la API de <a href="https://www.football-data.org/">football-data.org</a> y transformados en lo que espera recibir la parte front-end, guardándose estos en tantos ficheros JSON como sean necesarios.
Dichos ficheros se almacenan en la carpeta <i>frontend/src/data</i>.

La parte front-end es una aplicación hecha en React, versión 19.2.6, y creada con Vite. Además, se ha utilizado la librería TailwindCSS para estilizar la aplicación.

La aplicación se encuentra publicada en GitHub Pages mediante CI/CD, usando GitHub Actions. La aplicación se despliega cada 2 horas, o cada vez que se lleva a cabo una acción de push sobre la rama master, para reflejar los cambios realizados o actualizar los datos.

### Aviso legal

Este proyecto ha sido desarrollado con fines exclusivamente educativos y como parte de un portfolio personal. No tiene ánimo de lucro.

Los datos deportivos mostrados en la aplicación se obtienen a través de la API de <a href="https://www.football-data.org/">football-data.org</a> y se utilizan de acuerdo con sus condiciones de uso.

Los nombres de los clubes, competiciones, escudos, logotipos y demás marcas mencionadas o mostradas en la aplicación pertenecen a sus respectivos propietarios y se utilizan únicamente con fines identificativos.

Este proyecto no está afiliado, patrocinado ni respaldado por <a href="https://www.football-data.org/">football-data.org</a>, LaLiga, los clubes participantes ni ninguna otra entidad deportiva.

___

### English

_Note: The app is still under development. It will be updated and improved over time._

An unofficial app for the Spanish football league that displays the league table and fixtures for the current season. You can also make a simulation of all the fixtures in the season and watch how the league table changes in real time.

The back-end is developed with Python. This part retrieves data from the <a href="https://www.football-data.org/">football-data.org</a> API and converts it into the format required by the front-end, saving the data in as many JSON files as necessary. These files are stored in the <i>frontend/src/data</i> folder.

The front-end is developed with React, version 19.2.6, and created with Vite. In addition, the Tailwind CSS library is used to style the application.

The application is published on GitHub Pages via CI/CD, using GitHub Actions. The application is deployed every 2 hours, or whenever a push is made to the master branch, to reflect any changes made or to update the data.

### Legal notice

This project has been developed only for educational purposes and as part of a personal portfolio. It is a non-profit initiative.

The sporting data displayed in the app is obtained via the <a href="https://www.football-data.org/">football-data.org</a> API and is used in accordance with its terms of use.

The names of clubs, competitions, crests, logos and other trademarks mentioned or displayed in the app belong to their respective owners and are used only for identification purposes.

This project is not affiliated with, sponsored by or endorsed by <a href="https://www.football-data.org/">football-data.org</a>, LaLiga, the participating clubs or any other sporting organisation.