import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { instructorPricingApi } from "../../auth/api";

export default function PricingPlansDashboard({ onBack, onCreatePlan, onSelectPlan }) {
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const res = await instructorPricingApi.getPricingPlans();
                const data = res.data?.data?.content || res.data?.data || [];
                setPlans(data);
            } catch (error) {
                console.error("Failed to load plans", error);
            } finally {
                setLoading(false);
            }
        };
        loadPlans();
    }, []);

    const handleDeletePlan = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete the plan "${title}"?`)) return;
        try {
            await instructorPricingApi.deletePricingPlan(id);
            setPlans(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete plan", error);
        }
    };

    const filters = ["ALL", "PUBLISHED", "UNPUBLISHED"];

    const filtered = plans.filter(p => {
        const status = p.active ? "PUBLISHED" : "UNPUBLISHED";
        const title = p.planTitle || p.title || "";
        const type = p.pricingType || p.type || "";
        return (activeFilter === "ALL" || status === activeFilter) &&
            (title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                type.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    return (
        <div className="min-h-screen">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Pricing Plans</h1>
                        <p className="text-xs text-gray-500">Manage pricing and expiry details for your product</p>
                    </div>
                    <button onClick={onCreatePlan}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition flex items-center gap-2 text-sm font-semibold shadow-sm">
                        <FaPlus className="text-xs" /> Create Plan
                    </button>
                </div>
            </div>

            <div className="px-6 py-6">
                <div className="relative mb-5 max-w-md">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by Title"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                    />
                </div>

                {filtered.length > 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300"
                                            style={{ accentColor: "#7c3aed" }}
                                            onChange={e => setSelectedPlans(e.target.checked ? filtered.map(p => p.id) : [])}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Plan Title</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Plan Type</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Price</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Validity</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(plan => {
                                    const title = plan.planTitle || plan.title;
                                    const type = plan.pricingType || plan.type;
                                    const price = plan.actualPrice ?? plan.price;
                                    const discount = plan.discountPrice;
                                    const validity = plan.validityInDays ? `${plan.validityInDays} days` : (plan.lifetimeAccess ? "Lifetime" : "N/A");

                                    return (
                                        <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPlans.includes(plan.id)}
                                                    style={{ accentColor: "#7c3aed" }}
                                                    onChange={() => setSelectedPlans(p => p.includes(plan.id) ? p.filter(id => id !== plan.id) : [...p, plan.id])}
                                                    className="w-4 h-4 rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-semibold text-gray-800">{title}</p>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">{type}</td>
                                            <td className="px-4 py-4">
                                                {discount
                                                    ? (() => {
                                                        const finalPrice = Number(price) - Number(discount);
                                                        return (
                                                            <span className="flex flex-col gap-0.5">
                                                                <span className="flex items-baseline gap-1.5">
                                                                    <span className="text-sm font-bold text-gray-900">₹{finalPrice.toLocaleString()}</span>
                                                                    <span className="text-xs text-gray-400 line-through">₹{Number(price).toLocaleString()}</span>
                                                                </span>
                                                                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded px-1 py-0.5 w-fit">
                                                                    Save ₹{Number(discount).toLocaleString()}
                                                                </span>
                                                            </span>
                                                        );
                                                    })()
                                                    : <span className="text-sm font-bold text-gray-900">₹{Number(price || 0).toLocaleString()}</span>}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">{validity}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => onSelectPlan(plan)} title="Edit"
                                                        className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition">
                                                        <FaEdit className="text-sm" />
                                                    </button>
                                                    <button onClick={() => handleDeletePlan(plan.id, title)} title="Delete"
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                        <FaTrash className="text-sm" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500">No plans found</p>
                        <p className="text-xs text-gray-400 mt-1">Create your first pricing plan</p>
                    </div>
                )}

                {selectedPlans.length > 0 && (
                    <div className="mt-4 flex items-center gap-3 px-1">
                        <span className="text-sm text-gray-600 font-medium">{selectedPlans.length} selected</span>
                        <button className="px-3 py-1.5 text-sm text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition font-medium">
                            Delete Selected
                        </button>
                        <button onClick={() => setSelectedPlans([])}
                            className="text-xs text-gray-400 hover:text-gray-600 transition">Clear</button>
                    </div>
                )}
            </div>
        </div>
    );
}
