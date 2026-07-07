import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-[#1e1b18] via-[#2a241f] to-[#201a14] flex items-center justify-center px-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-10 shadow-2xl">
                <h1 className="mb-6 text-3xl font-semibold text-gray-900">Register</h1>
                <p className="mb-4 text-sm text-gray-600">
                    The registration page is under development. Please use the login page for now.
                </p>
                <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-amber-400"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );
};

export default Register;
