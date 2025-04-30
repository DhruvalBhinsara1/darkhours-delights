import { useState } from "react";
import { FaLightbulb } from "react-icons/fa";

function Suggestions() {
    const [suggestion, setSuggestion] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            alert("Thank you for your suggestion!");
            setSuggestion("");
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-primary text-primary">
            <div className="container mx-auto p-4 sm:p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-center mb-8">
                        <FaLightbulb className="text-4xl text-accent-primary mr-3" />
                        <h1 className="text-3xl font-bold text-primary">Suggest New Items</h1>
                    </div>
                    <div className="card p-6 rounded-xl border border-border-color">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="suggestion"
                                    className="block text-sm font-medium text-primary mb-2"
                                >
                                    Your Suggestion
                                </label>
                                <textarea
                                    id="suggestion"
                                    value={suggestion}
                                    onChange={(e) => setSuggestion(e.target.value)}
                                    className="input w-full min-h-[150px]"
                                    placeholder="Suggest a snack or beverage you'd like to see in our menu..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-button-primary text-button-text rounded-lg hover:bg-button-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            ></path>
                                        </svg>
                                        Submitting...
                                    </div>
                                ) : (
                                    "Submit Suggestion"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Suggestions;