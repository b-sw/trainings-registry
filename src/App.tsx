import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import About from './pages/About'
import Home from './pages/Home'
import Training from './pages/Training'
import Trainings from './pages/Trainings'

function App() {
    return (
        <div className="app">
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        Trainings Registry
                    </Link>
                    <div className="nav-menu">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                        <Link to="/about" className="nav-link">
                            About
                        </Link>
                        <Link to="/trainings" className="nav-link">
                            Trainings
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/trainings" element={<Trainings />} />
                    <Route path="/trainings/:id" element={<Training />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
