import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
    index('routes/_index.tsx'), // Renders at "/"
    route('/my-activities', 'routes/my-trainings.tsx'), // Renders at "/my-activities"
    route('/community-impact', 'routes/standings.tsx'),
    route('/about', 'routes/about.tsx'),
] satisfies RouteConfig;
