# React Test Hosting App

A simple React application built with Vite, ready for hosting.

## Features

- ⚡️ Fast development with Vite
- ⚛️ React 18
- 🎨 Modern UI with gradient design
- 📱 Responsive layout
- 🚀 Production-ready build

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

Create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Deployment

The `dist` folder contains the production-ready files. You can deploy it to:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your repository or deploy the `dist` folder
- **GitHub Pages**: Upload the `dist` folder contents
- **Any static hosting service**: Upload the `dist` folder contents

## Project Structure

```
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies and scripts
├── src/
│   ├── main.jsx       # React entry point
│   ├── App.jsx        # Main App component
│   ├── App.css        # App styles
│   └── index.css      # Global styles
└── dist/              # Production build (generated)
```

## License

MIT

