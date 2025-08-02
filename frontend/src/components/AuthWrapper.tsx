import { ReactNode } from 'react'
import Landing from '../pages/Landing'
import { useAuth } from '../utils/auth'

interface AuthWrapperProps {
    children: ReactNode
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Landing />
    }

    return <>{children}</>
}
