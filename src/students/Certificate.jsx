import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaCertificate,
    FaCheckCircle,
    FaCheck,
    FaHourglassHalf,
    FaClock,
} from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import certificate from "../assets/certificate.jpg";
import certificate2 from "../assets/certificate2.jpg";
import certificate3 from "../assets/certificate3.jpg";
import certificate4 from "../assets/certificate4.jpg";

const Certificate = () => {
    const [activeTab, setActiveTab] = useState("All Certificates");

    const certificates = [
        {
            id: 1,
            title: "Digital Marketing Fundamentals",
            status: "Earned",
            issued: "25 May 2024",
            credential: "DL-DMF-2024-1256",
            image: certificate,
            button: "Download",
            badge: "Verified",
            color: "green",
        },

        {
            id: 2,
            title: "SEO & Keyword Research",
            status: "Earned",
            issued: "30 May 2024",
            credential: "DL-SEO-2024-1289",
            image: certificate2,
            button: "Download",
            badge: "Verified",
            color: "green",
        },

        {
            id: 3,
            title: "Social Media Marketing",
            status: "Earned",
            issued: "05 Jun 2024",
            credential: "DL-SMM-2024-1324",
            image: certificate3,
            button: "Download",
            badge: "Verified",
            color: "green",
        },

        {
            id: 4,
            title: "Google Ads & PPC",
            status: "In Progress",
            issued: "75% Completed",
            credential: "",
            image: certificate4,
            button: "Continue",
            badge: "In Progress",
            color: "blue",
        },
    ];

    const filteredCertificates =
        activeTab === "All Certificates"
            ? certificates
            : certificates.filter(
                (item) => item.status === activeTab
            );
    return (
        <div className="p-3 sm:p-5 md:p-6 min-h-screen bg-[#f7f8fc]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

                    {/* Left Side */}
                    <div>
                        <p className="text-sm text-gray-400 mb-2">
                            <Link
                                to="/student/dashboard"
                                className="hover:text-blue-600 transition"
                            >
                                Dashboard
                            </Link>

                            <span className="mx-2 ">&gt;</span>

                            <span className="text-gray-600 font-medium">
                                Certificates
                            </span>
                        </p>

                        <h1 className="text-xl font-bold text-gray-900">
                            My Certificates
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            View and download your earned certificates for completed courses.
                        </p>
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    {/* CARD 1 */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">

                        <div className="w-[58px] h-[58px] rounded-xl bg-[#f3eaff] flex items-center justify-center shrink-0">
                            <FaCertificate className="text-[#6a3df0] text-[24px]" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#241b4b] leading-5">
                                Total Certificates
                            </p>

                            <h2 className="text-2xl font-bold text-[#140b45] leading-none mt-2">
                                08
                            </h2>
                        </div>
                    </div>

                    {/* CARD 2 */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">

                        <div className="w-[58px] h-[58px] rounded-xl bg-[#eafaf0] flex items-center justify-center shrink-0">
                            <FaCheckCircle className="text-[#16a34a] text-[24px]" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#241b4b] leading-5">
                                Verified Certificates
                            </p>

                            <h2 className="text-2xl font-bold text-[#140b45] leading-none mt-2">
                                07
                            </h2>
                        </div>
                    </div>

                    {/* CARD 3 */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">

                        <div className="w-[58px] h-[58px] rounded-xl bg-[#edf4ff] flex items-center justify-center shrink-0">
                            <FaHourglassHalf className="text-[#2563eb] text-[24px]" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#241b4b] leading-5">
                                In Progress
                            </p>

                            <h2 className="text-2xl font-bold text-[#140b45] leading-none mt-2">
                                02
                            </h2>
                        </div>
                    </div>

                    {/* CARD 4 */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">

                        <div className="w-[58px] h-[58px] rounded-xl bg-[#fff6e9] flex items-center justify-center shrink-0">
                            <FaClock className="text-[#f59e0b] text-[24px]" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#241b4b] leading-5">
                                Expiring Soon
                            </p>

                            <h2 className="text-2xl font-bold text-[#140b45] leading-none mt-2">
                                01
                            </h2>
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex items-center gap-6 sm:gap-10 border-b border-gray-200 pb-4 mb-6 overflow-x-auto scrollbar-hide">

                    <button
                        onClick={() => setActiveTab("All Certificates")}
                        className={`font-semibold text-sm pb-3 whitespace-nowrap border-b-[3px] transition ${activeTab === "All Certificates"
                            ? "text-[#5b35ff] border-[#5b35ff]"
                            : "text-gray-500 border-transparent"
                            }`}
                    >
                        All Certificates
                    </button>

                    <button
                        onClick={() => setActiveTab("Earned")}
                        className={`font-semibold text-sm pb-3 whitespace-nowrap border-b-[3px] transition ${activeTab === "Earned"
                            ? "text-[#5b35ff] border-[#5b35ff]"
                            : "text-gray-500 border-transparent"
                            }`}
                    >
                        Earned
                    </button>

                    <button
                        onClick={() => setActiveTab("In Progress")}
                        className={`font-semibold text-sm pb-3 whitespace-nowrap border-b-[3px] transition ${activeTab === "In Progress"
                            ? "text-[#5b35ff] border-[#5b35ff]"
                            : "text-gray-500 border-transparent"
                            }`}
                    >
                        In Progress
                    </button>

                    <button
                        onClick={() => setActiveTab("Expired")}
                        className={`font-semibold text-sm pb-3 whitespace-nowrap border-b-[3px] transition ${activeTab === "Expired"
                            ? "text-[#5b35ff] border-[#5b35ff]"
                            : "text-gray-500 border-transparent"
                            }`}
                    >
                        Expired
                    </button>
                </div>

                {/* CERTIFICATES */}
                <div className="space-y-5">

                    {filteredCertificates.length > 0 ? (
                        filteredCertificates.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm"
                            >

                                {/* LEFT */}
                                <div className="flex flex-col sm:flex-row gap-4">

                                    {/* IMAGE */}
                                    <div className="w-full sm:w-[150px] h-[180px] sm:h-[100px] rounded-xl overflow-hidden border border-gray-200 shrink-0">
                                        <img
                                            src={item.image}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* DETAILS */}
                                    <div>

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">

                                            <h2 className="text-[15px] sm:text-sm font-bold text-[#241b4b] leading-6">
                                                {item.title}
                                            </h2>

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${item.color === "green"
                                                    ? "bg-green-100 text-green-600"
                                                    : item.color === "blue"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {item.color === "green" && (
                                                    <MdOutlineVerified className="text-sm" />
                                                )}

                                                {item.color === "blue" && (
                                                    <FaHourglassHalf className="text-sm" />
                                                )}

                                                {item.badge}
                                            </span>
                                        </div>

                                        <div className="mt-3 space-y-1">

                                            <p className="text-xs text-gray-500">
                                                <span className="font-semibold text-[#241b4b]">
                                                    Issued on:
                                                </span>{" "}
                                                {item.issued}
                                            </p>

                                            {item.credential && (
                                                <p className="text-xs text-gray-500">
                                                    <span className="font-semibold text-[#241b4b]">
                                                        Credential ID:
                                                    </span>{" "}
                                                    {item.credential}
                                                </p>
                                            )}
                                        </div>

                                        {item.status === "In Progress" && (
                                            <div className="mt-4">

                                                <div className="w-full sm:w-[220px] h-[7px] bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="w-[75%] h-full bg-[#5b35ff] rounded-full"></div>
                                                </div>

                                                <p className="text-xs text-gray-500 mt-2">
                                                    75% Completed
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT BUTTONS */}
                                <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">

                                    <button className="text-sm h-[38px] sm:h-[30px] px-5 rounded-xl border border-[#6a3df0] text-[#6a3df0] font-semibold hover:bg-[#f4f0ff] transition flex-1 sm:flex-none">
                                        {item.button}
                                    </button>

                                    <button className="text-sm w-[38px] h-[38px] sm:w-[30px] sm:h-[30px] rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition">
                                        ⋮
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-14 text-center shadow-sm">
                            <FaCertificate className="mx-auto text-5xl text-gray-300 mb-4" />

                            <h2 className="text-2xl font-bold text-gray-700">
                                No Certificates Found
                            </h2>

                            <p className="text-gray-500 mt-2">
                                There are no certificates available in this section.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Certificate