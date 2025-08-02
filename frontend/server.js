import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
    ? fs.readFileSync('./dist/client/index.html', 'utf-8')
    : ''
const ssrManifest = isProduction
    ? fs.readFileSync('./dist/client/ssr-manifest.json', 'utf-8')
    : undefined

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base,
    })
    app.use(vite.ssrLoadModule('/src/entry-server.tsx'))
} else {
    app.use(express.static('./dist/client', { index: false }))
}

// Serve HTML
app.use('*', async (req, res) => {
    try {
        const url = req.originalUrl.replace(base, '')

        let template
        let render
        if (!isProduction) {
            // Always read fresh template in development
            template = fs.readFileSync('./index.html', 'utf-8')
            template = await vite.transformIndexHtml(url, template)
            render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
        } else {
            template = templateHtml
            render = (await import('./dist/server/entry-server.js')).render
        }

        const rendered = await render(url, ssrManifest)

        const html = template.replace(`<!--ssr-outlet-->`, rendered.html ?? '')

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
        vite?.ssrFixStacktrace(e)
        console.log(e.stack)
        res.status(500).end(e.stack)
    }
})

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
