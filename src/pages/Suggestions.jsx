import { useState } from "react";

function Suggestions() {
    const [suggestion, setSuggestion] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for your suggestion!");
        setSuggestion("");
    };

    return (
        <div className="bg-gray-900 text-gray-300 min-h-screen">
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Suggest New Items</h1>
                <form onSubmit={handleSubmit} className="max-w-md mx-auto frosted-glass p-6 rounded-lg">
                    <textarea
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        className="w-full p-2 rounded mb-4"
                        rows="4"
                        placeholder="Suggest a snack or beverage..."
                        required
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 frosted-glass"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Suggestions;