# Manual de instalación / Installation manual

## Español

### 1. Requisitos

Los requisitos de la aplicación son los siguientes:
- Python: 3.12.3+
- Node: 25.9.0+
- npm: 11.12.1+
- Una API key de <a href="https://www.football-data.org/">football-data.org</a>, la cual debe almacenarse en un fichero <i>.env</i>, dentro de la carpeta <i>backend</i>. (Nota: hay un fichero de ejemplo para saber como debe guardarse esta clave)

### 2. Instalación de dependencias y creación de ficheros necesarios para el front-end

Se proporcionan 2 maneras de llevar a cabo este proceso:
- Ejecutando el fichero de instalación correspondiente a tu SO.
    - Linux
        ```
        ~$ cd /LaLigaTracker/installation
        ~/LaLigaTracker/installation$ ./install.sh
        ```
    - Windows
        ```
        > cd \LaLigaTracker\installation
	    \LaLigaTracker\installation> install.bat
        ```

- Ejecutando los siguientes comandos en consola.
    - Linux
        ```
        # Creación de entorno virtual para Python
        ~$ cd /LaLigaTracker/backend
        ~/LaLigaTracker/backend$ python3 -m venv venv

        # Instalar dependencias de Python y crear ficheros para el front-end
        ~/LaLigaTracker/backend$ source venv/bin/activate
        ~/LaLigaTracker/backend$ pip install -r requirements.txt
        ~/LaLigaTracker/backend$ python3 main.py
        ~/LaLigaTracker/backend$ deactivate

        # Instalar dependencias de Node
        ~/LaLigaTracker/backend$ cd ../frontend
        ~/LaLigaTracker/frontend$ npm install
        ```
    - Windows
        ```
        # Creación de entorno virtual para Python
        > cd LaLigaTracker\backend
        \LaLigaTracker\backend> python -m venv venv

        # Instalar dependencias de Python y crear ficheros para el front-end
        \LaLigaTracker\backend> venv\Scripts\activate
        \LaLigaTracker\backend> pip install -r requirements.txt
        \LaLigaTracker\backend> python3 main.py
        \LaLigaTracker\backend> deactivate
        
        # Instalar dependencias de Node
        \LaLigaTracker\backend> cd ..\frontend
        \LaLigaTracker\frontend> npm install
        ```

### 3. Ejecutar la aplicación en local

Para ello, simplemente lanzamos el servidor local de Node:
- Linux
    ```
    ~/LaLigaTracker$ cd frontend
    ~/LaLigaTracker/frontend$ npm run dev
    ```
- Windows
    ```
    \LaLigaTracker> cd frontend
    \LaLigaTracker\frontend> npm run dev    
    ```

Una vez ejecutado, podremos acceder a la aplicación usando la URL que nos retorna el comando.

### 4. Actualizar la información de la aplicación

Para actualizar la información, debemos ejecutar el fichero <i>main.py</i> de la carpeta <i>backend</i>.
- Linux
    ```
    ~/LaLigaTracker$ cd backend
    ~/LaLigaTracker/backend$ source venv/bin/activate
    ~/LaLigaTracker/backend$ python3 main.py
    ~/LaLigaTracker/backend$ deactivate
    ```
- Windows
    ```
    \LaLigaTracker> cd backend
    \LaLigaTracker\backend> venv\Scripts\activate
    \LaLigaTracker\backend> python3 main.py
    \LaLigaTracker\backend> deactivate
    ```

Con ello, ya tendremos toda la información actualizada en nuestra aplicación.

___

## English

### 1. Requirements

The app requirements are this:
- Python: 3.12.3+
- Node: 25.9.0+
- npm: 11.12.1+
- An API key from <a href="https://www.football-data.org/">football-data.org</a>, which must be stored in a <i>.env</i> file, inside the <i>backend</i> folder. (Note: There is an sample file showing how this key should be saved)

### 2. Installing dependencies & creating the files required for the front-end

There are 2 ways to do this proccess:
- Running the installation file for your OS.
    - Linux
        ```
        ~$ cd /LaLigaTracker/installation
        ~/LaLigaTracker/installation$ ./install.sh
        ```
    - Windows
        ```
        > cd \LaLigaTracker\installation
	    \LaLigaTracker\installation> install.bat
        ```
- Running the following commands in the console.
    - Linux
        ```
        # Setting up a virtual environment for Python
        ~$ cd /LaLigaTracker/backend
        ~/LaLigaTracker/backend$ python3 -m venv venv

        # Installing dependencies & creating the files required for the front-end
        ~/LaLigaTracker/backend$ source venv/bin/activate
        ~/LaLigaTracker/backend$ pip install -r requirements.txt
        ~/LaLigaTracker/backend$ python3 main.py
        ~/LaLigaTracker/backend$ deactivate

        # Installing Node dependencies
        ~/LaLigaTracker/backend$ cd ../frontend
        ~/LaLigaTracker/frontend$ npm install
        ```
    - Windows
        ```
        # Setting up a virtual environment for Python
        > cd LaLigaTracker\backend
        \LaLigaTracker\backend> python -m venv venv

        # Installing dependencies & creating the files required for the front-end
        \LaLigaTracker\backend> venv\Scripts\activate
        \LaLigaTracker\backend> pip install -r requirements.txt
        \LaLigaTracker\backend> python3 main.py
        \LaLigaTracker\backend> deactivate
        
        # Installing Node dependencies
        \LaLigaTracker\backend> cd ..\frontend
        \LaLigaTracker\frontend> npm install
        ```

### 3. Running the app locally

To do this, simply launch the Node local server:
- Linux
    ```
    ~/LaLigaTracker$ cd frontend
    ~/LaLigaTracker/frontend$ npm run dev
    ```
- Windows
    ```
    \LaLigaTracker> cd frontend
    \LaLigaTracker\frontend> npm run dev    
    ```

After this, we can access the app using the URL returned by the command.

### 4. How to update the app data

To update the data, only execute the <i>main.py</i> file from the <i>backend</i> folder.
- Linux
    ```
    ~/LaLigaTracker$ cd backend
    ~/LaLigaTracker/backend$ source venv/bin/activate
    ~/LaLigaTracker/backend$ python3 main.py
    ~/LaLigaTracker/backend$ deactivate
    ```
- Windows
    ```
    \LaLigaTracker> cd backend
    \LaLigaTracker\backend> venv\Scripts\activate
    \LaLigaTracker\backend> python3 main.py
    \LaLigaTracker\backend> deactivate
    ```

After doing this, we'll have all the up-to-date data on our app.