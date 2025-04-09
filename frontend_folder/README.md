# NBA Player Analytics - Frontend

This React application provides a comprehensive NBA player analytics platform with a modern, responsive UI built with Tailwind CSS and Chart.js visualizations.

## Features

- **Player Search & Filtering**: Search for NBA players by name, team, or position
- **Player Cards**: Interactive player cards displaying key statistics
- **Detailed Statistics**: Comprehensive player performance metrics
- **Trade Impact Analysis**: Visualize and analyze how trades affect player performance
- **Modern UI**: NBA-themed interface with blue and gold color scheme

## Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application at http://localhost:5173

### Building for Production

To create a production build:
```bash
npm run build
```

The built application will be in the `dist` directory, ready for deployment.

## Project Structure

- `src/components/` - React components
  - `PlayerPage.jsx` - Main component for player search and display
  - `PlayerStats.jsx` - Component for displaying detailed player statistics
  - `TradeSimulation.jsx` - Component for trade impact analysis
- `src/utils/` - Utility functions and data services
- `src/App.jsx` - Main application component
- `src/App.css` - Global CSS styles
- `src/index.css` - Tailwind CSS imports and custom utilities

## Technology Stack

- React 19
- Tailwind CSS for styling
- Chart.js for data visualization
- Vite for build tooling

## Deployment

The application can be deployed to Netlify or any static hosting service. A Netlify configuration is included in the repository.
