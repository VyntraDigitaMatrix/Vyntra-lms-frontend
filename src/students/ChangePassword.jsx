import React, { useState } from "react";
import CP from "../assets/cp.jpg";
import {
  FaRegEyeSlash,
  FaRegEye,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa";

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

  const [errorMessage, setErrorMessage] = useState("");

  const getBorderClass = (status) => {
    if (status === "success") return "border-green-500";
    if (status === "error") return "border-red-500";
    return "border-gray-300";
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

  const handleChangePassword = async () => {
    setErrorMessage("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setOldStatus(!oldPassword ? "error" : null);
      setNewStatus(!newPassword ? "error" : null);
      setConfirmStatus(!confirmPassword ? "error" : null);
      setErrorMessage("Please fill all password fields.");
      return;
    }

    if (!isNewPasswordValid) {
      setNewStatus("error");
      setErrorMessage("Please add all necessary characters to create safe password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmStatus("error");
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    try {
      // Replace this with your real backend API
      // await axios.post("/api/change-password", {
      //   oldPassword,
      //   newPassword,
      //   confirmPassword,
      // });

      setOldStatus("success");
      setNewStatus("success");
      setConfirmStatus("success");
      setErrorMessage("");
    } catch (error) {
      setOldStatus("error");
      setNewStatus("error");
      setConfirmStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
   
      <main className="flex-1 bg-[#f8f8f8] px-5 py-1">
        <div className="flex items-center justify-between mt-1 mb-1"></div>

        <h2 className="text-3xl font-bold mb-4">Change Password</h2>

       <div className="bg-white p-8 w-full min-h-[520px] rounded-2xl border border-gray-200">
  <div className="flex flex-col lg:flex-row items-start gap-12">

    {/* Left Content */}
    <div className="w-full lg:w-[420px] space-y-7">

            <div>
              <label className="text-sm font-semibold flex items-center gap-2 mb-2">
                Old Password
                {oldStatus === "success" && (
                  <FaCheckCircle className="text-green-500" size={14} />
                )}
              </label>

              <div
                className={`h-12 border ${getBorderClass(
                  oldStatus
                )} rounded-lg flex items-center px-4`}
              >
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    setOldStatus(null);
                    setErrorMessage("");
                  }}
                  placeholder="Enter old password"
                  className="flex-1 outline-none text-sm bg-transparent"
                />

                <button type="button" onClick={() => setShowOld(!showOld)}>
                  {showOld ? (
                    <FaRegEye className="text-gray-700" />
                  ) : (
                    <FaRegEyeSlash className="text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                New Password
              </label>

              <div
                className={`h-12 border ${getBorderClass(
                  newStatus
                )} rounded-lg flex items-center px-4`}
              >
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setNewStatus(null);
                    setErrorMessage("");
                  }}
                  placeholder="Enter new password"
                  className="flex-1 outline-none text-sm bg-transparent"
                />

                <button type="button" onClick={() => setShowNew(!showNew)}>
                  {showNew ? (
                    <FaRegEye className="text-gray-700" />
                  ) : (
                    <FaRegEyeSlash className="text-gray-700" />
                  )}
                </button>
              </div>

              {newStatus === "error" && (
                <p className="text-red-500 text-xs font-semibold mt-2">
                  Please add all necessary characters to create safe password.
                </p>
              )}

              {newPassword && (
                <ul className="mt-3 space-y-2 text-xs">
                  <li
                    className={`flex items-center gap-2 ${
                      rules.minLength ? "text-blue-500" : "text-gray-400"
                    }`}
                  >
                    <FaCircle size={7} /> Minimum characters 12
                  </li>

                  <li
                    className={`flex items-center gap-2 ${
                      rules.uppercase ? "text-blue-500" : "text-gray-400"
                    }`}
                  >
                    <FaCircle size={7} /> One uppercase character
                  </li>

                  <li
                    className={`flex items-center gap-2 ${
                      rules.lowercase ? "text-blue-500" : "text-gray-400"
                    }`}
                  >
                    <FaCircle size={7} /> One lowercase character
                  </li>

                  <li
                    className={`flex items-center gap-2 ${
                      rules.special ? "text-blue-500" : "text-gray-400"
                    }`}
                  >
                    <FaCircle size={7} /> One special character
                  </li>

                  <li
                    className={`flex items-center gap-2 ${
                      rules.number ? "text-blue-500" : "text-gray-400"
                    }`}
                  >
                    <FaCircle size={7} /> One number
                  </li>
                </ul>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Confirm New Password
              </label>

              <div
                className={`h-12 border ${getBorderClass(
                  confirmStatus
                )} rounded-lg flex items-center px-4`}
              >
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmStatus(null);
                    setErrorMessage("");
                  }}
                  placeholder="Enter confirm new password"
                  className="flex-1 outline-none text-sm bg-transparent"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <FaRegEye className="text-gray-400" />
                  ) : (
                    <FaRegEyeSlash className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm font-semibold">
                {errorMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleChangePassword}
              className="w-full h-14 bg-blue-600 text-white rounded-lg font-semibold shadow-xl hover:bg-blue-700 transition"
            >
              Change Password
            </button>

            <button
              type="button"
              className="text-none text-xs font-semibold underline"
            >
              Forgot Password?
            </button>
            </div>

    {/* Right Content */}
   <div className="flex-1 flex flex-col items-center justify-center">
     <img
  src={CP}
  alt="Change Password"
  className="w-[320px] h-[320px] object-contain"
/>
<h3 className="text-[28px] font-bold text-blue-600 mt-0">
  Secure Your Account
</h3>

<p className="text-gray-500 text-[16px] leading-8 text-center max-w-[450px] mt-4">
  Create a strong password to protect your account and personal data.
</p>
    </div>
          </div>
        </div>
      </main>
    
  );
};

export default ChangePassword;