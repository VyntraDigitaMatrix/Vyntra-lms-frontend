import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  FaChalkboardTeacher,
} from "react-icons/fa";
import { MdVerified, MdSecurity } from "react-icons/md";
import CP from "../../assets/CP.jpg";

const InstructorChangePassword = () => {
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
    if (status === "success") return "border-emerald-500 ring-2 ring-emerald-500/20";
    if (status === "error") return "border-rose-500 ring-2 ring-rose-500/20";
    return "border-gray-200 focus:ring-2 focus:ring-indigo-500/20";
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
    if (passwordStrength <= 2) return "bg-rose-500";
    if (passwordStrength <= 4) return "bg-amber-500";
    return "bg-emerald-500";
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
      // Simulate API call - Replace with your actual instructor password change API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example API call structure:
      // await axios.put("/api/instructor/change-password", {
      //   oldPassword,
      //   newPassword,
      // });

      setOldStatus("success");
      setNewStatus("success");
      setConfirmStatus("success");
      setSuccessMessage("Password changed successfully! Your instructor account is now more secure.");
      
      // Clear form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
        setOldStatus(null);
        setNewStatus(null);
        setConfirmStatus(null);
      }, 3000);
    } catch (error) {
      setOldStatus("error");
      setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-5 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-400">
            <Link to="/instructor/dashboard" className="hover:text-indigo-600 transition">
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-600 font-medium">Change Password</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full">
              <FaChalkboardTeacher className="text-indigo-600 text-sm" />
              <span className="text-xs font-medium text-indigo-700">Instructor Portal</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FaShieldAlt className="text-indigo-600 text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Change Password</h1>
              <p className="text-gray-500 mt-0.5 text-sm">Update your instructor account password to keep it secure</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Form Section */}
            <div className="flex-1 p-8 lg:p-10">
              <div className="max-w-md mx-auto lg:mx-0">
                {/* Success Message */}
                {successMessage && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-slideDown">
                    <FaCheckCircle className="text-emerald-600 text-xl" />
                    <div>
                      <p className="text-emerald-800 font-semibold">Success!</p>
                      <p className="text-emerald-600 text-sm">{successMessage}</p>
                    </div>
                  </div>
                )}

                {/* Old Password Field */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <FaKey className="text-gray-500 text-xs" />
                    Current Password
                    {oldStatus === "success" && (
                      <FaCheckCircle className="text-emerald-500 text-sm" />
                    )}
                  </label>

                  <div
                    className={`h-12 border ${getBorderClass(
                      oldStatus
                    )} rounded-xl flex items-center px-4 transition-all duration-200 bg-white`}
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
                      className="flex-1 outline-none text-sm bg-transparent text-gray-800 placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      {showOld ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <FaShieldAlt className="text-gray-500 text-xs" />
                    New Password
                    {newStatus === "success" && (
                      <FaCheckCircle className="text-emerald-500 text-sm" />
                    )}
                  </label>

                  <div
                    className={`h-12 border ${getBorderClass(
                      newStatus
                    )} rounded-xl flex items-center px-4 transition-all duration-200 bg-white`}
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
                      className="flex-1 outline-none text-sm bg-transparent text-gray-800 placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      {showNew ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Password Strength</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          passwordStrength <= 2 ? "bg-rose-100 text-rose-600" :
                          passwordStrength <= 4 ? "bg-amber-100 text-amber-600" :
                          "bg-emerald-100 text-emerald-600"
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getPasswordStrengthColor()} rounded-full transition-all duration-300`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Rules */}
                  {newPassword && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-700 mb-3">Password Requirements:</p>
                      <ul className="space-y-2">
                        {[
                          { key: "minLength", text: "Minimum 12 characters" },
                          { key: "uppercase", text: "At least one uppercase letter" },
                          { key: "lowercase", text: "At least one lowercase letter" },
                          { key: "special", text: "At least one special character" },
                          { key: "number", text: "At least one number" },
                        ].map((rule) => (
                          <li
                            key={rule.key}
                            className="flex items-center gap-2 text-xs"
                          >
                            {rules[rule.key] ? (
                              <FaCheck className="text-emerald-500 text-xs" />
                            ) : (
                              <FaTimes className="text-gray-300 text-xs" />
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
                <div className="mb-8">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <MdVerified className="text-gray-500 text-sm" />
                    Confirm New Password
                    {confirmStatus === "success" && (
                      <FaCheckCircle className="text-emerald-500 text-sm" />
                    )}
                  </label>

                  <div
                    className={`h-12 border ${getBorderClass(
                      confirmStatus
                    )} rounded-xl flex items-center px-4 transition-all duration-200 bg-white`}
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
                      className="flex-1 outline-none text-sm bg-transparent text-gray-800 placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      {showConfirm ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                    <p className="text-rose-600 text-sm font-medium flex items-center gap-2">
                      <FaTimes className="text-rose-500" />
                      {errorMessage}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <FaLock size={16} />
                        Change Password
                      </>
                    )}
                  </button>

                  <Link
                    to="/instructor/forgot-password"
                    className="w-full text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition flex items-center justify-center gap-2"
                  >
                    <FaArrowLeft size={12} />
                    Forgot Password?
                  </Link>
                </div>

                {/* Security Tips */}
                <div className="mt-8 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <p className="text-xs font-semibold text-indigo-800 flex items-center gap-2 mb-2">
                    <MdSecurity className="text-indigo-600" />
                    Security Tips for Instructors
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      Never share your password with anyone, including co-instructors
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      Use different passwords for your teaching and personal accounts
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      Enable two-factor authentication for extra security
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Illustration Section */}
            <div className="lg:w-[45%] bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-8 flex flex-col items-center justify-center">
              <img 
                src={CP}
                alt="Instructor Security"
                className="w-full h-64 object-cover rounded-xl shadow-md mb-6"
              />
              
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
                  <MdSecurity className="text-indigo-600 text-lg" />
                  <span className="text-sm font-semibold text-gray-700">Instructor Account Security</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Protect Your Courses
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                  As an instructor, your account contains valuable course content and student data. Keep it secure with a strong password.
                </p>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span>Strong</span>
                  </div>
                  <div className="w-px h-3 bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span>Medium</span>
                  </div>
                  <div className="w-px h-3 bg-gray-300" />
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-rose-500 rounded-full" />
                    <span>Weak</span>
                  </div>
                </div>
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

export default InstructorChangePassword;