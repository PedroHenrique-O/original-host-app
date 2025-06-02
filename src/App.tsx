import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
// import { tw } from "./utils/tw";

// Use React.lazy with proper Module Federation import
const RemoteTodoApp = React.lazy(() => import("remotetodo/TodoApp"));

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Module Federation Demo
            </h1>
            <nav className="flex gap-4">
              <Link to="/" className="federation-nav-link">
                Home
              </Link>
              <Link to="/todos" className="federation-nav-link">
                Remote Todo
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/todos"
                element={
                  <ErrorBoundary>
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                              Loading remote module...
                            </p>
                          </div>
                        </div>
                      }
                    >
                      <RemoteTodoApp />
                    </Suspense>
                  </ErrorBoundary>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

// Error Boundary for Module Federation
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Module Federation Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="federation-card max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Remote Module Error
          </h2>
          <p className="text-gray-700 mb-4">
            Failed to load the remote Todo component. Please check:
          </p>
          <ul className="space-y-2 mb-4 text-gray-600">
            <li>• Remote application is running on localhost:3001</li>
            <li>• Network connectivity</li>
            <li>• Module Federation configuration</li>
          </ul>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="federation-button"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const HomePage: React.FC = () => (
  <div className="federation-card max-w-2xl mx-auto">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      Host Application
    </h2>
    <p className="text-gray-700 mb-4">
      This app demonstrates Module Federation between two React applications:
    </p>
    <ul className="space-y-2 mb-6">
      <li className="flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        <strong className="text-gray-900">Host App</strong>
        <span className="text-gray-600">
          (Production URL) - Main application shell
        </span>
      </li>
      <li className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <strong className="text-gray-900">Remote App</strong>
        <span className="text-gray-600">
          (Production URL) - Todo functionality module
        </span>
      </li>
    </ul>
    <p className="text-gray-700 mb-6">
      The Todo component is loaded dynamically from the remote application at
      runtime, demonstrating microfrontend architecture.
    </p>
    <Link to="/todos" className="federation-button">
      View Remote Todo Component
    </Link>
  </div>
);

export default App;
