import React, { useState } from "react";

const ForgotPassword = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // method to handle Otp verification
  const handleVerifyOtp = (e) => {
    e.preventDefault();

    // Simple Otp validation
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      setSuccess("");
      return;
    }

    // Mock OTP verification process i use bakced in this code
    setTimeout(() => {
      setSuccess("OTP successfully verified!");
      setError("");
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Enter OTP
        </h2>

        {/*It will be show the Error message */}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        {/*it will be show Success message */}
        {success && (
          <div className="text-green-500 text-sm mt-2">{success}</div>
        )}

        {/* Otp Input Fiel */}
        <form onSubmit={handleVerifyOtp} className="mt-4">
          <div className="mb-4">
            <label htmlFor="otp" className="block text-gray-600">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter the 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6" // Ensure only 6 dig required rhega
            />
          </div>

          <div className="mt-4 text-center">
            <a
              href="/signin"
              className="text-sm text-[#CC7B25FF] hover:underline"
            >
              Back to Sign In
            </a>
          </div>
        </form>

        {/* otp verify button      */}

        <button
          type="submit"
          className="w-full py-2 mt-4 bg-[#CC7B25FF] text-white rounded-md hover:bg-[#f5c688] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
