# Trainings Registry

A modern React application with Server-Side Rendering (SSR) built with Vite and React Router DOM.

## Features

-   ⚡️ **Vite** - Lightning fast build tool
-   ⚛️ **React 18** - Latest React with concurrent features
-   🧭 **React Router DOM** - Client-side routing with SSR support
-   🎯 **TypeScript** - Full type safety
-   🎨 **Modern CSS** - Clean and responsive design
-   🚀 **SSR Ready** - Server-side rendering for better SEO and performance

## Getting Started

### Prerequisites

-   Node.js 16+
-   npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd trainings-registry
```

2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm run serve
```

## Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production (client + server)
-   `npm run build:client` - Build client-side code
-   `npm run build:server` - Build server-side code
-   `npm run preview` - Preview production build locally
-   `npm run serve` - Start production server

## Project Structure

```
src/
├── pages/           # Page components
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Trainings.tsx
│   └── Training.tsx
├── App.tsx          # Main app component
├── App.css          # Global styles
├── entry-client.tsx # Client-side entry point
└── entry-server.tsx # Server-side entry point
```

## Routes

-   `/` - Home page
-   `/about` - About page
-   `/trainings` - Training courses listing
-   `/trainings/:id` - Individual training course details

## Technologies Used

-   **React** - UI library
-   **TypeScript** - Type safety
-   **React Router DOM** - Routing
-   **Vite** - Build tool and dev server
-   **Express** - Production server
-   **CSS3** - Styling

## License

MIT
