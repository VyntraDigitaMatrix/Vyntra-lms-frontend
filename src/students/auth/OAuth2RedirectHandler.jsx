import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const { handleOAuthSuccess } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const code = searchParams.get("code");

    if (token) {
      // Case A: Backend authenticated user and returned access token
      handleOAuthSuccess(token, refreshToken || "");
    } else if (code) {
      // Case B: Google redirected directly to frontend. Forward authorization code to backend.
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
      window.location.href = `${apiBaseUrl}/login/oauth2/code/google${window.location.search}`;
    } else {
      console.error("No token or auth code found in OAuth redirect url");
      navigate("/UserLogin", { replace: true });
    }
  }, [searchParams, handleOAuthSuccess, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6f7fb]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-gray-500">Signing you in with Google...</p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;
