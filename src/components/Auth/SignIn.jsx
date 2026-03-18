import React, { useState } from "react";
import { HiEyeOff, HiEye } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";
import logo from "../../assets/img/logo 1.svg";

export const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignInClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      // On success, store token and user info for API calls
      localStorage.setItem("token", result.token);
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1e1b18] via-[#2a241f] to-[#201a14] flex items-center justify-center px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl">
        <div className="hidden lg:flex flex-col justify-center gap-6 bg-gradient-to-br from-[#1a1511] to-[#3c2b1f] px-10 py-12 text-white">
          <div>
            <img src={logo} alt="DgiGold logo" className="h-14 mb-6" />
          </div>

          <div className="space-y-4">
            <p className="text-sm text-[#d4b38c]">Create Your Secure Digital Account</p>
            <ul className="space-y-2 text-sm">
              <li>♦ Buy 24K Gold from just ₹1 & .999 Fine Silver at Live Rates</li>
              <li>♦ 99.9% Pure Metals — Always priced at live market rates</li>
              <li>♦ Bank-grade Security — Insured Storage · Zero Hidden Charges</li>
              <li>♦ Instant Transactions — Easy Withdrawals · Gifting</li>
            </ul>
          </div>

          <div className="text-sm text-[#9a8a7d]">
            Join thousands already investing in digital metals
          </div>
        </div>

        <div className="bg-white px-10 py-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 text-center">Sign in</h2>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <form onSubmit={handleSignInClick} className="space-y-4 mt-6">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-gray-600 text-sm mb-1">Password</label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-11 text-gray-400"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                >
                  {passwordVisible ? <HiEye /> : <HiEyeOff />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" required />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-amber-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>

              <div className="text-center text-sm text-gray-600">
                Need an account?{' '}
                <Link to="/signup" className="text-amber-600 hover:underline">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
