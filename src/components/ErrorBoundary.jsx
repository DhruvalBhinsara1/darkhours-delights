// src/components/ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container mx-auto p-4 text-red-500">
                    Something went wrong. Please try again later.
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;