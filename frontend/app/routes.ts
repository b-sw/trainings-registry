import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
    index('routes/_index.tsx'), // Renders at "/"
    route('/my-trainings', 'routes/my-trainings.tsx'), // Renders at "/my-trainings"
    route('/standings', 'routes/standings.tsx'),
    route('/about', 'routes/about.tsx'),
    route('/home', 'routes/home.tsx'),
] satisfies RouteConfig
