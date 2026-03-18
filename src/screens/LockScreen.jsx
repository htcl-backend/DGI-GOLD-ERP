import React, { useState } from 'react';
import logo from "../assets/images/logo.png"; // Assuming you have a logo

const LockScreen = ({ onUnlock, username }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleUnlock = (e) => {
        e.preventDefault();
        // In a real application, you would send this password to the backend
        // for re-authentication. For this example, we'll simulate it.
        // A more robust solution would involve a dedicated /unlock API endpoint
        // or re-using the /login endpoint to verify credentials without issuing a new token.

        // For demonstration, let's assume the user's actual password is required.
        // This is a placeholder. You'd need to fetch the actual user's password securely
        // or have a dedicated unlock PIN.
        // For now, we'll just check if the password is not empty.
        if (password.length > 0) { // Replace with actual password validation
            onUnlock();
            setError('');
        } else {
            setError('Please enter your password.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
                <img src={logo} alt="DgiGold logo" className="h-16 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Screen Locked</h2>
                <p className="text-gray-600 mb-6">Welcome back, {username || 'User'}!</p>

                <form onSubmit={handleUnlock} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
                    >
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LockScreen;