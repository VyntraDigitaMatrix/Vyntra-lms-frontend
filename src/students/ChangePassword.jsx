import React, { useState } from "react";
import { Link } from "react-router-dom";
import CP from "../assets/cp.jpg";
import { studentAuth } from "./auth/api";
import {
  FaRegEyeSlash,
  FaRegEye,
  FaCheckCircle,
  FaShieldAlt,
  FaLock,
  FaKey,
  FaArrowLeft,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { MdVerified, MdSecurity } from "react-icons/md";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [oldStatus, setOldStatus] = useState(null);
  const [newStatus, setNewStatus] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState(null);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getBorderClass = (status) => {
    if (status === "success") return "border-green-500 ring-2 ring-green-500/20";
    if (status === "error") return "border-red-500 ring-2 ring-red-500/20";
    return "border-gray-200 focus:ring-2 focus:ring-blue-500/20";
  };

  const validatePassword = (password) => {
    return {
      minLength: password.length >= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      number: /[0-9]/.test(password),
    };
  };

  const rules = validatePassword(newPassword);
  const isNewPasswordValid = Object.values(rules).every(Boolean);
  const passwordStrength = Object.values(rules).filter(Boolean).length;

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "No password";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleChangePassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setOldStatus(null);
    setNewStatus(null);
    setConfirmStatus(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      if (!oldPassword) setOldStatus("error");
      if (!newPassword) setNewStatus("error");
      if (!confirmPassword) setConfirmStatus("error");
      setErrorMessage("Please fill all password fields.");
      return;
    }

    if (!isNewPasswordValid) {
      setNewStatus("error");
      setErrorMessage("Please add all necessary characters to create a safe password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmStatus("error");
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    setIsLoading(true);

    try {
<<<<<<< Updated upstream
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setOldStatus("success");
      setNewStatus("success");
      setConfirmStatus("success");
      setSuccessMessage("Password changed successfully!");
      
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
=======
      await studentAuth.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      setOldStatus("success");
      setNewStatus("success");
      setConfirmStatus("success");
      setSuccessMessage("Password changed successfully! Redirecting to login...");

      // Clear form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Clear storage and redirect to login after 2.5 seconds
>>>>>>> Stashed changes
      setTimeout(() => {
        localStorage.removeItem("student_accessToken");
        localStorage.removeItem("student_refreshToken");
        window.location.href = "/UserLogin";
      }, 2500);
    } catch (error) {
      setOldStatus("error");
      setErrorMessage(
        error.response?.data?.message || "Failed to change password. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
<<<<<<< Updated upstream
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 py-4 sm:py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-5">
          <p className="text-xs sm:text-sm text-gray-400">
            <Link to="/student/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span className="mx-1 sm:mx-2">&gt;</span>
            <span className="text-gray-600 font-medium">Change Password</span>
          </p>
=======
      <main className="max-w-7xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-center justify-between   mb-5">
          <p className="text-sm text-gray-400">
            <Link to="/student/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-600 font-medium">Change Password</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200"></div>
          </div>
        </div>
        <div className="mb-8">
          <div className="flex items-center gap-3 -mb-2 -mt-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Change Password</h1>
              <p className="text-gray-500 mt-1">Update your password to keep your account secure</p>
            </div>
          </div>
>>>>>>> Stashed changes
        </div>

        {/* Header */}
        <div className="mb-5 sm:mb-6 md:mb-8">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">Change Password</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Update your password to keep your account secure</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Form Section */}
            <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
              <div className="max-w-md mx-auto lg:mx-0">
                {/* Success Message */}
                {successMessage && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 sm:gap-3 animate-slideDown">
                    <FaCheckCircle className="text-green-600 text-base sm:text-xl shrink-0" />
                    <div>
                      <p className="text-green-800 font-semibold text-xs sm:text-sm">Success!</p>
                      <p className="text-green-600 text-[11px] sm:text-sm">{successMessage}</p>
                    </div>
                  </div>
                )}

                {/* Old Password Field */}
                <div className="mb-4 sm:mb-6">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <FaKey className="text-gray-500 text-[10px] sm:text-xs" />
                    Old Password
                    {oldStatus === "success" && (
                      <FaCheckCircle className="text-green-500 text-[10px] sm:text-sm" />
                    )}
                  </label>

                  <div
                    className={`h-10 sm:h-12 border ${getBorderClass(
                      oldStatus
                    )} rounded-xl flex items-center px-3 sm:px-4 transition-all duration-200 bg-white`}
                  >
                    <input
                      type={showOld ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                        setOldStatus(null);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      placeholder="Enter your current password"
                      className="flex-1 outline-none text-xs sm:text-sm bg-transparent text-gray-800 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      {showOld ? <FaRegEye size={14} className="sm:text-lg" /> : <FaRegEyeSlash size={14} className="sm:text-lg" />}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div className="mb-4 sm:mb-6">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <FaShieldAlt className="text-gray-500 text-[10px] sm:text-xs" />
                    New Password
                    {newStatus === "success" && (
                      <FaCheckCircle className="text-green-500 text-[10px] sm:text-sm" />
                    )}
                  </label>

                  <div
                    className={`h-10 sm:h-12 border ${getBorderClass(
                      newStatus
                    )} rounded-xl flex items-center px-3 sm:px-4 transition-all duration-200 bg-white`}
                  >
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setNewStatus(null);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      placeholder="Create a strong password"
                      className="flex-1 outline-none text-xs sm:text-sm bg-transparent text-gray-800 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      {showNew ? <FaRegEye size={14} className="sm:text-lg" /> : <FaRegEyeSlash size={14} className="sm:text-lg" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
<<<<<<< Updated upstream
                    <div className="mt-2 sm:mt-3">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <span className="text-[10px] sm:text-xs text-gray-500">Password Strength</span>
                        <span className={`text-[9px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${
                          passwordStrength <= 2 ? "bg-red-100 text-red-600" :
                          passwordStrength <= 4 ? "bg-yellow-100 text-yellow-600" :
                          "bg-green-100 text-green-600"
                        }`}>
=======
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Password Strength</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${passwordStrength <= 2 ? "bg-red-100 text-red-600" :
                            passwordStrength <= 4 ? "bg-yellow-100 text-yellow-600" :
                              "bg-green-100 text-green-600"
                          }`}>
>>>>>>> Stashed changes
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getPasswordStrengthColor()} rounded-full transition-all duration-300`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Rules */}
                  {newPassword && (
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-2 sm:mb-3">Password Requirements:</p>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {[
                          { key: "minLength", text: "Minimum 12 characters" },
                          { key: "uppercase", text: "At least one uppercase letter" },
                          { key: "lowercase", text: "At least one lowercase letter" },
                          { key: "special", text: "At least one special character" },
                          { key: "number", text: "At least one number" },
                        ].map((rule) => (
                          <li
                            key={rule.key}
                            className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs"
                          >
                            {rules[rule.key] ? (
                              <FaCheck className="text-green-500 text-[8px] sm:text-xs" />
                            ) : (
                              <FaTimes className="text-gray-300 text-[8px] sm:text-xs" />
                            )}
                            <span className={rules[rule.key] ? "text-gray-700" : "text-gray-400"}>
                              {rule.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="mb-6 sm:mb-8">
                  <label className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <MdVerified className="text-gray-500 text-[10px] sm:text-sm" />
                    Confirm New Password
                    {confirmStatus === "success" && (
                      <FaCheckCircle className="text-green-500 text-[10px] sm:text-sm" />
                    )}
                  </label>

                  <div
                    className={`h-10 sm:h-12 border ${getBorderClass(
                      confirmStatus
                    )} rounded-xl flex items-center px-3 sm:px-4 transition-all duration-200 bg-white`}
                  >
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmStatus(null);
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      placeholder="Confirm your new password"
                      className="flex-1 outline-none text-xs sm:text-sm bg-transparent text-gray-800 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      {showConfirm ? <FaRegEye size={14} className="sm:text-lg" /> : <FaRegEyeSlash size={14} className="sm:text-lg" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-[11px] sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                      <FaTimes className="text-red-500 text-[10px] sm:text-xs" />
                      {errorMessage}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2.5 sm:space-y-3">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaLock size={12} className="sm:text-base" />
                        Change Password
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="w-full text-blue-600 text-[11px] sm:text-sm font-semibold hover:text-blue-700 transition flex items-center justify-center gap-1.5"
                  >
                    <FaArrowLeft size={10} className="sm:text-xs" />
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>

            {/* Right Illustration Section - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 flex-col items-center justify-center">
              <img
                src={CP}
                alt="Change Password Illustration"
                className="w-48 md:w-64 h-48 md:h-64 object-contain mb-4 md:mb-6"
              />

              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white rounded-full shadow-sm mb-3 md:mb-4">
                  <MdSecurity className="text-blue-600 text-base md:text-lg" />
                  <span className="text-xs md:text-sm font-semibold text-gray-700">Account Security</span>
                </div>
<<<<<<< Updated upstream
                
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
                  Secure Your Account
                </h3>
                
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-md">
                  Create a strong, unique password to protect your account from unauthorized access and keep your personal data safe.
                </p>
                
                <div className="mt-4 md:mt-6 flex items-center justify-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500">
                  <div className="flex items-center gap-0.5 md:gap-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full" />
=======

                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Secure Your Account
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                  Create a strong, unique password to protect your account from unauthorized access and keep your personal data safe.
                </p>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
>>>>>>> Stashed changes
                    <span>Strong</span>
                  </div>
                  <div className="w-px h-2 md:h-3 bg-gray-300" />
                  <div className="flex items-center gap-0.5 md:gap-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-500 rounded-full" />
                    <span>Medium</span>
                  </div>
                  <div className="w-px h-2 md:h-3 bg-gray-300" />
                  <div className="flex items-center gap-0.5 md:gap-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full" />
                    <span>Weak</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Illustration - Simple version for mobile */}
            <div className="lg:hidden bg-gradient-to-br from-blue-50 to-indigo-50 p-4 mt-4 rounded-xl flex items-center justify-center gap-3">
              <img
                src={CP}
                alt="Change Password Illustration"
                className="w-16 h-16 object-contain"
              />
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <MdSecurity className="text-blue-600 text-sm" />
                  <span className="text-xs font-semibold text-gray-700">Account Security</span>
                </div>
                <p className="text-[10px] text-gray-600">
                  Create a strong, unique password
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChangePassword;