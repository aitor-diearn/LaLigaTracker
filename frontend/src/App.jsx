import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from "./components/Home"
import Standings from './components/Standings'
import Matches from './components/Matches'
import Calculator from './components/Calculator'
import Button from "./components/Button"
import { useDocumentTitle } from "./hooks/useDocumentTitle"
import { useTranslation } from "react-i18next"

// Obtenemos a que ruta quería acceder el usuario
const redirect = sessionStorage.getItem("redirect");
if (redirect) {

    // Eliminamos la ruta de la sesión, y llevamos al usuario a la ruta deseada
    sessionStorage.removeItem("redirect");
    window.history.replaceState(null, "", redirect);
}

/**
 * Componente que devuelve las diferentes páginas de la aplicación.
 * @example <Layout/>
 */
function Layout(){
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="bg-secondary flex-1">
                <Outlet />
            </main>
            <Footer/>
        </div>
    )
}

/**
 * Componente que muestra una página de error si se intenta acceder a una ruta que no existe.
 * @example <PageNotFound /> 
 */
function PageNotFound() {

    // Creamos el objeto para cambiar de idioma
    const { t } = useTranslation()

    // Ponemos el title de la pestaña
    useDocumentTitle(t('pageNotFound.title'))

    return (
        <div className="min-h-screen flex flex-col">
            <main className="bg-secondary flex-1 flex flex-col items-center justify-center">
                <h1 className="text-xl md:text-3xl xl:text-4xl font-bold mt-6 mb-6">Uy...</h1>
                <p className="text-md md:text-xl xl:text-2xl mb-4 text-center">{t('pageNotFound.text')}</p>
                <Button route="/" text={t('pageNotFound.button')}/>
            </main>
        </div>
    );
}

/**
 * Componente principal de la aplicación.
 * @example <App/>
 */
export default function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<Home />} />
                    <Route path="/standings" element={<Standings />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/calculator" element={<Calculator />} />
                </Route>

                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    )
}