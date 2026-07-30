import React from "react";
import { FaChevronLeft, FaGift } from "react-icons/fa";
import { MdPayment, MdAccessTime } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";

export const PLAN_TYPES = [
    { id: "free", title: "Free Plan", desc: "Set a free plan for your course", icon: <FaGift className="text-green-500" /> },
    { id: "one-time", title: "One Time Purchase Plan", desc: "Set a fixed purchase amount for your course", icon: <MdPayment className="text-blue-500" /> },
    { id: "instalment", title: "Instalment Purchase Plan", desc: "Allow learners to pay in instalments", icon: <AiOutlineCalendar className="text-orange-500" /> },
    { id: "limited-time", title: "Limited Time Offer Plan", desc: "Offer a discounted amount for a limited time", icon: <MdAccessTime className="text-red-500" /> },
];

export default function ChoosePricingPlan({ onBack, onSelectPlanType }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <button onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-violet-600 transition">
                    <FaChevronLeft className="text-sm" />
                    <span className="text-sm font-medium">Back</span>
                </button>
            </div>
            <div className="px-6 py-4 max-w-7xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose Pricing Plan</h2>
                <p className="text-sm text-gray-500 mb-8">Select the type of pricing plan you want to create.</p>
                <div className="grid grid-cols-2 gap-4">
                    {PLAN_TYPES.map(plan => (
                        <button key={plan.id} onClick={() => onSelectPlanType(plan.id)}
                            className="p-6 bg-white border border-gray-200 rounded-xl text-left hover:border-violet-400 hover:shadow-md transition group">
                            <div className="text-3xl mb-3">{plan.icon}</div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-violet-700 transition">{plan.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">{plan.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
