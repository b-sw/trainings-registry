import { config } from '../config/env'

export interface UserInfo {
    id: string
    email: string
    name: string
    picture?: string
}

// Simple authentication state management
class AuthManager {
    private user: UserInfo | null = null
    private listeners: ((user: UserInfo | null) => void)[] = []

    constructor() {
        // Load user from localStorage on initialization (client-side only)
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user')
            if (savedUser) {
                try {
                    this.user = JSON.parse(savedUser)
                } catch (error) {
                    console.error('Failed to parse saved user:', error)
                    localStorage.removeItem('user')
                }
            }
        }
    }

    getUser(): UserInfo | null {
        return this.user
    }

    setUser(user: UserInfo | null): void {
        this.user = user
        // Only use localStorage on client-side
        if (typeof window !== 'undefined') {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user))
            } else {
                localStorage.removeItem('user')
            }
        }
        this.notifyListeners()
    }

    subscribe(listener: (user: UserInfo | null) => void): () => void {
        this.listeners.push(listener)
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener)
        }
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.user))
    }

    async authenticateWithGoogle(googleToken: string): Promise<UserInfo> {
        console.log('config.BACKEND_URL', config.BACKEND_URL)
        const response = await fetch(`${config.BACKEND_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ googleToken }),
        })

        if (!response.ok) {
            throw new Error(`Authentication failed: ${response.statusText}`)
        }

        const userInfo: UserInfo = await response.json()
        this.setUser(userInfo)
        return userInfo
    }

    logout(): void {
        this.setUser(null)
    }

    isAuthenticated(): boolean {
        return this.user !== null
    }
}

export const authManager = new AuthManager()

// React hook for using auth state
import { useEffect, useState } from 'react'

export function useAuth() {
    const [user, setUser] = useState<UserInfo | null>(authManager.getUser())

    useEffect(() => {
        return authManager.subscribe(setUser)
    }, [])

    return {
        user,
        isAuthenticated: authManager.isAuthenticated(),
        login: authManager.authenticateWithGoogle.bind(authManager),
        logout: authManager.logout.bind(authManager),
    }
}
