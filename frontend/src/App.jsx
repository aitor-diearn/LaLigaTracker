import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from "./components/Home"
import Standings from './components/Standings'
import Matches from './components/Matches'
import Calculator from './components/Calculator'

/**
 * Componente principal de la aplicación.
 * @example <App/>
 */
export default function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <Navbar />

                <main className="bg-secondary flex-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/standings" element={<Standings />} />
                        <Route path="/matches" element={<Matches />} />
                        <Route path="/calculator" element={<Calculator />} />
                    </Routes>
                </main>

                <Footer/>
            </BrowserRouter>
        </div>
    )
}