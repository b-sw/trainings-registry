import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        minify: false,
        rollupOptions: {
            input: {
                main: './index.html',
            },
        },
    },
    ssr: {
        noExternal: ['react-router-dom'],
    },
})
