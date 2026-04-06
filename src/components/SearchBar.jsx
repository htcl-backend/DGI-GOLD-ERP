import React, { useState } from "react";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        try {
            // Static mock search data
            const mockSearchData = [
                { type: "Customer", name: "Rajesh Kumar", id: "1" },
                { type: "Customer", name: "Priya Sharma", id: "2" },
                { type: "Customer", name: "Amit Singh", id: "3" },
                { type: "Product", name: "Gold Bar 24K", id: "p1" },
                { type: "Product", name: "Silver Bar 999", id: "p2" },
                { type: "Order", name: "ORD-001 - Rajesh Kumar", id: "o1" },
                { type: "Order", name: "ORD-002 - Priya Sharma", id: "o2" }
            ];

            // Filter results based on search term
            const filteredResults = mockSearchData.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.type.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setSearchResults(filteredResults);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search customers, products, orders..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                    type="submit"
                    className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition"
                >
                    Search
                </button>
            </form>

            {searchResults.length > 0 && (
                <div className="mt-4 max-h-60 overflow-y-auto bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Search Results:</h4>
                    <ul className="space-y-2">
                        {searchResults.map((result, index) => (
                            <li key={index} className="text-sm text-gray-700">
                                <span className="font-medium">{result.type}:</span> {result.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;