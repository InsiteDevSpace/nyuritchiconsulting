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

### Automatic Deployment with GitHub Actions (SSH)

This project includes GitHub Actions workflow for automatic deployment via SSH. The workflow automatically builds and deploys your app when you push to the `main` branch.

#### Setup GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add the following secrets:

1. **HOSTINGER_SSH_USER**: Your SSH username (e.g., `u173971351`)

2. **HOSTINGER_SSH_PASSWORD**: Your SSH password

3. **HOSTINGER_SSH_HOST**: Your server IP address (e.g., `145.14.153.48`)

4. **HOSTINGER_SSH_PORT**: Your SSH port (e.g., `65002`)

5. **HOSTINGER_DEPLOY_PATH**: Deployment path on server (e.g., `/home/u173971351/public_html` or `/domains/nyuritchiconsulting.com/public_html`)

#### Deploy

Simply push to the `main` branch:
```bash
git push origin main
```

The GitHub Actions workflow will:
1. Build your React app
2. Connect to your server via SSH
3. Deploy the built files to the specified path
4. Create backups of previous deployments

### Manual Deployment

The `dist` folder contains the production-ready files. You can also manually deploy it to:

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

