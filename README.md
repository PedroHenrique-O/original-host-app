# Host Application - Module Federation Demo

This is the **Host Application** in a Module Federation setup that demonstrates micro-frontend architecture using React 18, TypeScript, and Webpack.

## What This Project Does

The Host Application serves as the main application shell that:

- **Consumes Remote Components**: Dynamically loads and renders components from remote applications at runtime
- **Provides Navigation**: Contains the main routing and navigation structure
- **Manages Integration**: Handles the integration between different micro-frontends
- **Shares Dependencies**: Coordinates shared dependencies (React, React-DOM) between applications

## Module Federation Setup

### Remote Integration

- **Remote Todo App**: Consumes a TodoApp component from `remotetodo/TodoApp`
- **Dynamic Loading**: Uses React.lazy() for dynamic component loading
- **Error Handling**: Includes comprehensive error boundaries for remote module failures

### Shared Dependencies

```javascript
shared: {
  react: { singleton: true, requiredVersion: "^18.2.0" },
  "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
  "react-router-dom": { singleton: true, requiredVersion: "^6.30.1" }
}
```

## Architecture

```
Host App (localhost:3000)
├── Main Navigation & Shell
├── Home Page
└── Remote Todo Page
    └── TodoApp Component (from Remote)
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Mode

```bash
npm start
```

- Runs on `http://localhost:3000`
- Expects remote todo app to be running on `http://localhost:3001`

### Production Build

```bash
npm run build
```

## Deployment

This application is configured for deployment on **Zephyr Cloud**:

- **Package Name**: Must match `"host"` in package.json
- **Remote Configuration**: In production, uses Zephyr's service discovery
- **Dependencies**: Configured via `zephyrDependencies` in package.json

### Zephyr Dependencies

```json
{
  "zephyrDependencies": {
    "remotetodo": "latest"
  }
}
```

## Key Files

- `src/App.tsx` - Main application with routing and remote component integration
- `webpack.config.js` - Module Federation configuration
- `package.json` - Dependencies and Zephyr configuration

## Features

- 🏠 **Home Page**: Overview of the micro-frontend architecture
- 📝 **Remote Todo**: Dynamically loaded todo application from remote
- 🔄 **Hot Reloading**: Development server with live reload
- 🛡️ **Error Boundaries**: Graceful handling of remote module failures
- 📱 **Responsive Design**: Mobile-friendly interface

## Module Federation Benefits

1. **Independent Deployment**: Each micro-frontend can be deployed separately
2. **Technology Agnostic**: Different teams can use different tech stacks
3. **Shared Dependencies**: Reduced bundle size through dependency sharing
4. **Runtime Integration**: Components are loaded at runtime, not build time
5. **Fault Tolerance**: Application continues working even if remote modules fail

## Related Projects

- **[Remote Todo App](../remote-todo/README.md)**: The todo component consumed by this host application
