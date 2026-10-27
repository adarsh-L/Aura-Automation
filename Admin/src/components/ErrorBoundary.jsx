import { Component } from 'react'

/**
 * ErrorBoundary — Catches rendering errors and shows a fallback UI.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Component stack:', errorInfo?.componentStack)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-aura-900 p-8">
          <div className="glass-card p-10 max-w-lg w-full text-center space-y-6">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-aura-100">Something went wrong</h1>
            <p className="text-aura-400 text-sm leading-relaxed">
              An unexpected error occurred in the application. You can try resetting or check the console for details.
            </p>

            {/* Error details (dev only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-4 p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-left">
                <p className="text-xs font-mono text-red-400 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="mt-4 px-6 py-2.5 rounded-lg bg-neon-blue/20 text-neon-blue font-semibold text-sm
                         hover:bg-neon-blue/30 transition-all duration-200 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
