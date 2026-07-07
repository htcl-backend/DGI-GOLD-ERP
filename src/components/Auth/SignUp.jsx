// import React, { useState } from "react"; // Import React and useState hook
// import { HiEyeOff, HiEye } from "react-icons/hi"; // Import icons for password visibility toggle
// import { Link, useNavigate } from "react-router-dom";
// import { apiFetch } from "../../api";
// import logo from "../../assets/img/logo 2.svg";


// const SignUp = () => {
//   // Use a single state object for form data for better organization
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     password: "",
//     role: "user", // default to user
//     designation: "",
//     department: "",
//     address: "",
//     city: "",
//     state: "",
//     zipCode: "",
//   });
//   const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
//   const [isLoading, setIsLoading] = useState(false); // For loading state
//   const [error, setError] = useState(""); // Error message state
//   const [successMessage, setSuccessMessage] = useState(""); // Success message state
//   const [step, setStep] = useState(1); // 1: register form, 2: OTP verification
//   const [otp, setOtp] = useState("");

//   const navigate = useNavigate(); // To redirect after successful signup

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Function to handle sign-up form submission
//   const handleSignUp = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior

//     // Basic client-side validation
//     if (formData.password.length < 8) {
//       setError("Password must be at least 8 characters long.");
//       return;
//     }

//     if (!formData.phone) {
//       setError("Phone number is required.");
//       return;
//     }

//     // Reset states
//     setError("");
//     setSuccessMessage("");
//     setIsLoading(true);

//     try {
//       const result = await apiFetch("/register", {
//         method: "POST",
//         body: JSON.stringify(formData),
//       });

//       // Store token and user returned from backend
//       if (result.token) {
//         localStorage.setItem("token", result.token);
//       }
//       if (result.user) {
//         localStorage.setItem("user", JSON.stringify(result.user));
//       }

//       setSuccessMessage("Account created! Please verify OTP to continue.");
//       setStep(2);
//     } catch (err) {
//       setError(err.message || "Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleVerifyOtp = (e) => {
//     e.preventDefault();

//     if (!otp || otp.length !== 6) {
//       setError("Please enter a valid 6-digit OTP.");
//       setSuccessMessage("");
//       return;
//     }

//     setError("");
//     setSuccessMessage("OTP verified! Redirecting to dashboard...");

//     setTimeout(() => {
//       navigate("/signin"); // Redirect to signin after successful OTP verification/registration
//     }, 1000);
//   };

//   // Show OTP verification screen once registration succeeds
//   if (step === 2) {
//     return (
//       <div className="min-h-screen bg-[#140f0b] flex items-center justify-center px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl w-full shadow-2xl rounded-2xl overflow-hidden">
//           {/* Left panel: branding */}
//           <div className="relative bg-gradient-to-br from-[#150d07] via-[#1f1208] to-[#2d1b0c] p-10 text-white flex flex-col justify-between">
//             <div>
//               <img src={logo} alt="DgiGold logo" className="h-14 w-auto mb-8" />
//               <h1 className="text-4xl font-bold tracking-tight mb-4">
//                 Dgi<span className="text-amber-300">Gold</span>
//               </h1>
//               <p className="text-sm text-amber-100/80 mb-8">
//                 Gold & Silver · Investment Platform
//               </p>

//               <ul className="space-y-3 text-sm text-amber-100/90">
//                 <li className="flex items-start gap-3">
//                   <span className="mt-1 text-amber-400">•</span>
//                   <span>
//                     Buy <span className="font-semibold">24K Gold</span> from just ₹1 &amp; .999 Fine Silver at live rates.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <span className="mt-1 text-amber-400">•</span>
//                   <span>
//                     <span className="font-semibold">99.9% pure metals</span> priced at live market rates.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <span className="mt-1 text-amber-400">•</span>
//                   <span>
//                     <span className="font-semibold">Bank-grade security</span> with insured storage and zero hidden fees.
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <span className="mt-1 text-amber-400">•</span>
//                   <span>
//                     <span className="font-semibold">Instant transactions</span> with easy withdrawals & gifting.
//                   </span>
//                 </li>
//               </ul>
//             </div>

//             <p className="text-xs text-amber-100/70 mt-10">
//               Join thousands already investing in digital metals.
//             </p>
//           </div>

//           {/* Right panel: OTP verification */}
//           <div className="bg-white p-10 rounded-2xl">
//             <div className="mb-8">
//               <h2 className="text-3xl font-semibold text-gray-800 mb-2">
//                 Verify OTP
//               </h2>
//               <p className="text-sm text-gray-600">
//                 Enter the 6-digit code sent to your email/phone.
//               </p>
//             </div>

//             {successMessage && (
//               <p className="text-green-600 text-sm mb-4">{successMessage}</p>
//             )}
//             {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

//             <form onSubmit={handleVerifyOtp}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   OTP
//                 </label>
//                 <input
//                   type="text"
//                   name="otp"
//                   placeholder="Enter 6-digit OTP"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   maxLength={6}
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="mb-3 w-full bg-gradient-to-r from-amber-500 to-amber-300 text-white py-3 rounded-lg shadow hover:from-amber-400 hover:to-amber-200 transition"
//               >
//                 Verify OTP
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#140f0b] flex items-center justify-center px-4 py-12">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl w-full shadow-2xl rounded-2xl overflow-hidden">
//         {/* Left panel: branding */}
//         <div className="relative bg-gradient-to-br from-[#150d07] via-[#1f1208] to-[#2d1b0c] p-10 text-white flex flex-col justify-between">
//           <div>
//             <img src={logo} alt="DgiGold logo" className="h-14 w-auto mb-8" />
//             <h1 className="text-4xl font-bold tracking-tight mb-4">
//               Dgi<span className="text-amber-300">Gold</span>
//             </h1>
//             <p className="text-sm text-amber-100/80 mb-8">
//               Gold & Silver · Investment Platform
//             </p>

//             <ul className="space-y-3 text-sm text-amber-100/90">
//               <li className="flex items-start gap-3">
//                 <span className="mt-1 text-amber-400">•</span>
//                 <span>
//                   Buy <span className="font-semibold">24K Gold</span> from just ₹1 &amp; .999 Fine Silver at live rates.
//                 </span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="mt-1 text-amber-400">•</span>
//                 <span>
//                   <span className="font-semibold">99.9% pure metals</span> priced at live market rates.
//                 </span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="mt-1 text-amber-400">•</span>
//                 <span>
//                   <span className="font-semibold">Bank-grade security</span> with insured storage and zero hidden fees.
//                 </span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <span className="mt-1 text-amber-400">•</span>
//                 <span>
//                   <span className="font-semibold">Instant transactions</span> with easy withdrawals & gifting.
//                 </span>
//               </li>
//             </ul>
//           </div>

//           <p className="text-xs text-amber-100/70 mt-10">
//             Join thousands already investing in digital metals.
//           </p>
//         </div>

//         {/* Right panel: signup form */}
//         <div className="bg-white p-10 rounded-2xl">
//           <div className="mb-8">
//             <h2 className="text-3xl font-semibold text-gray-800 mb-2">
//               Create Account
//             </h2>
//             <p className="text-sm text-gray-600">
//               Start your DigiGold journey today
//             </p>
//           </div>

//           {successMessage && (
//             <p className="text-green-600 text-sm mb-4">{successMessage}</p>
//           )}
//           {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

//           <form onSubmit={handleSignUp}>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="username"
//                   placeholder="Your full name"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="you@example.com"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   placeholder="10-digit mobile number"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Role
//                 </label>
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>

//               {formData.role === "admin" && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Designation
//                     </label>
//                     <input
//                       type="text"
//                       name="designation"
//                       placeholder="e.g., System Administrator"
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                       value={formData.designation}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Department
//                     </label>
//                     <input
//                       type="text"
//                       name="department"
//                       placeholder="e.g., IT"
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                       value={formData.department}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       name="address"
//                       placeholder="Street address"
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                       value={formData.address}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         City
//                       </label>
//                       <input
//                         type="text"
//                         name="city"
//                         placeholder="City"
//                         className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                         value={formData.city}
//                         onChange={handleChange}
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         State
//                       </label>
//                       <input
//                         type="text"
//                         name="state"
//                         placeholder="State"
//                         className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                         value={formData.state}
//                         onChange={handleChange}
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Zip Code
//                     </label>
//                     <input
//                       type="text"
//                       name="zipCode"
//                       placeholder="Zip Code"
//                       className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                       value={formData.zipCode}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </>
//               )}

//               <div className="relative">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <input
//                   type={passwordVisible ? "text" : "password"}
//                   name="password"
//                   placeholder="Min. 8 characters"
//                   className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
//                   value={formData.password}
//                   onChange={handleChange}
//                   minLength={8}
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-[38px] text-gray-500"
//                   onClick={() => setPasswordVisible(!passwordVisible)}
//                   aria-label={passwordVisible ? "Hide password" : "Show password"}
//                 >
//                   {passwordVisible ? <HiEye /> : <HiEyeOff />}
//                 </button>
//               </div>

//               {formData.password.length > 0 && formData.password.length < 8 && (
//                 <p className="text-sm text-red-500">Password must be at least 8 characters long.</p>
//               )}

//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-amber-500 to-amber-300 text-white py-3 rounded-lg shadow hover:from-amber-400 hover:to-amber-200 transition disabled:opacity-50"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Creating Account..." : "Create Account"}
//               </button>

//               <p className="text-sm text-center text-gray-600">
//                 Already have an account?{' '}
//                 <Link to="/signin" className="text-[#CC7B25] hover:underline">
//                   Sign In
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp; // Export the SignUp component
