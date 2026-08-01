import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdWarning } from "react-icons/md";

import PricingPlansDashboard from "../components/Plans/PricingPlansDashboard";
import ChoosePricingPlan from "../components/Plans/ChoosePricingPlan";
import CreatePricingPlan from "../components/Plans/CreatePricingPlan";
import EditPlanView from "../components/Plans/EditPlanView";

function Toast({ msg, type = "success", onClose }) {
    if (!msg) return null;
    return (
        <div className="fixed top-5 right-5 z-[9999] bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl min-w-[260px]">
            {type === "success"
                ? <MdCheckCircle className="text-emerald-500 text-xl flex-shrink-0" />
                : <MdWarning className="text-amber-500 text-xl flex-shrink-0" />}
            <span className="text-sm font-medium text-slate-800 flex-1">{msg}</span>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">&times;</button>
        </div>
    );
}

export default function PricingPlans({ onBack }) {
    const navigate = useNavigate();
    const [view, setView] = useState("dashboard");
    const [selectedPlanType, setSelectedPlanType] = useState(null);
    const [editingPlan, setEditingPlan] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleBack = onBack ?? (() => navigate(-1));

    return (
        <>
            <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

            {view === "dashboard" && (
                <PricingPlansDashboard
                    onBack={handleBack}
                    onCreatePlan={() => setView("choose")}
                    onSelectPlan={plan => { setEditingPlan(plan); setView("edit"); }}
                />
            )}

            {view === "choose" && (
                <ChoosePricingPlan
                    onBack={() => setView("dashboard")}
                    onSelectPlanType={type => { setSelectedPlanType(type); setView("create"); }}
                />
            )}

            {view === "create" && (
                <CreatePricingPlan
                    planType={selectedPlanType}
                    onBack={() => setView("choose")}
                    onSave={() => { showToast("Pricing plan created successfully!"); setView("dashboard"); }}
                />
            )}

            {view === "edit" && (
                <EditPlanView
                    plan={editingPlan}
                    onBack={() => setView("dashboard")}
                    onSave={() => { showToast("Plan updated successfully!"); setView("dashboard"); }}
                />
            )}
        </>
    );
}