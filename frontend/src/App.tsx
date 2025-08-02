import { GoogleOAuthProvider } from '@react-oauth/google'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthWrapper } from './components/AuthWrapper'
import Sidebar from './components/Sidebar'
import { config } from './config/env'
import About from './pages/About'
import Home from './pages/Home'
import MyTrainings from './pages/MyTrainings'
import Standings from './pages/Standings'
import Training from './pages/Training'

function App() {
    console.log('config.GOOGLE_CLIENT_ID', config.GOOGLE_OAUTH_CLIENT_ID)
    return (
        <GoogleOAuthProvider clientId={config.GOOGLE_OAUTH_CLIENT_ID}>
            <AuthWrapper>
                <div className="flex h-screen bg-gray-50">
                    {/* Sidebar */}
                    <div className="w-80 flex-shrink-0">
                        <Sidebar />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <main className="flex-1 overflow-y-auto">
                            <div className="p-8">
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <Navigate
                                                to="/my-trainings"
                                                replace
                                            />
                                        }
                                    />
                                    <Route
                                        path="/my-trainings"
                                        element={<MyTrainings />}
                                    />
                                    <Route
                                        path="/standings"
                                        element={<Standings />}
                                    />
                                    <Route
                                        path="/trainings/:id"
                                        element={<Training />}
                                    />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/home" element={<Home />} />
                                </Routes>
                            </div>
                        </main>
                    </div>
                </div>
            </AuthWrapper>
        </GoogleOAuthProvider>
    )
}

export default App
