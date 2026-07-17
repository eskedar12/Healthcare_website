import { Component } from 'react'

// Catches rendering errors in whatever page is currently mounted (e.g. a
// bad API response shape) and shows a readable message + retry button
// instead of leaving the screen blank with no clue what happened.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Admin page crashed:', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-24 text-center">
          <p className="font-serif text-lg text-text-dark mb-2">
            Something went wrong loading this page.
          </p>
          <p className="font-sans text-sm text-text-muted mb-4">
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button onClick={this.handleRetry} className="btn-primary">
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
