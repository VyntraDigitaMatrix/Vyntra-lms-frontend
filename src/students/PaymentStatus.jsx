import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { studentPaymentApi } from "./auth/api";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowRight, FaBookOpen } from "react-icons/fa";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId =
    searchParams.get("order_id") ||
    searchParams.get("orderId") ||
    searchParams.get("cf_order_id");
  const paymentId =
    searchParams.get("payment_id") ||
    searchParams.get("paymentId");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      if (!orderId) {
        if (isMounted) {
          setLoading(false);
          setSuccess(false);
          setMessage("No order reference found in URL.");
        }
        return;
      }

      try {
        let res = null;
        const maxAttempts = 3;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            res = await studentPaymentApi.verifyPayment({
              orderId,
              paymentId: paymentId || null,
            });
            if (res.status === 200 || (res.data && res.data.success)) {
              break;
            }
          } catch (err) {
            if (attempt < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 1500));
              if (!isMounted) return;
            } else {
              throw err;
            }
          }
        }

        if (isMounted) {
          if (res && (res.status === 200 || (res.data && res.data.success))) {
            setSuccess(true);
            setMessage(
              res.data?.message ||
                "Payment verified successfully! Your course enrollment is now active."
            );
          } else {
            setSuccess(false);
            setMessage(
              res?.data?.message ||
                "Payment verification could not be completed. Please contact support."
            );
          }
        }
      } catch (err) {
        console.error("Payment verification failed:", err);
        if (isMounted) {
          setSuccess(false);
          setMessage(
            err.response?.data?.message ||
              err.message ||
              "Payment verification failed. If your account was debited, your enrollment will reflect shortly."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [orderId, paymentId]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 text-center">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <FaSpinner className="w-12 h-12 text-[#043573] animate-spin" />
            <h2 className="text-lg font-bold text-gray-900">
              Verifying Payment with Cashfree…
            </h2>
            <p className="text-xs text-gray-500 max-w-xs">
              Please do not close this window or refresh while we confirm your payment status.
            </p>
          </div>
        ) : success ? (
          <div className="py-4">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              Payment Successful!
            </h2>
            <p className="text-xs text-green-600 font-semibold mb-4">
              Enrolled & Verified
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              {message}
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-xl p-3 mb-6 border border-gray-100 text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Order ID:</span>
                  <span className="font-mono text-gray-800 font-semibold">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Gateway:</span>
                  <span className="font-semibold text-gray-800">Cashfree Payments</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/student/courses"
                className="flex-1 py-3 px-4 rounded-xl bg-[#043573] hover:bg-[#032550] text-white text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <FaBookOpen />
                My Courses
              </Link>
              <Link
                to="/student/dashboard"
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                Dashboard
                <FaArrowRight size={11} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              Payment Unsuccessful
            </h2>
            <p className="text-xs text-red-600 font-semibold mb-4">
              Verification Notice
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              {message}
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-xl p-3 mb-6 border border-gray-100 text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Order ID:</span>
                  <span className="font-mono text-gray-800">{orderId}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#043573] hover:bg-[#032550] text-white text-xs font-bold transition"
              >
                Try Again
              </button>
              <Link
                to="/student/dashboard"
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
