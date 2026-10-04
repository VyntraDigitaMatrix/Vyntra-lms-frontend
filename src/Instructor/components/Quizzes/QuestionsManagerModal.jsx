import React, { useState, useEffect, useCallback } from "react";
import {
    MdListAlt, MdClose, MdErrorOutline, MdEdit, MdCheck,
} from "react-icons/md";
import { FaTrash, FaPlus, FaCheck } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { instructorQuizQuestionApi, instructorQuizOptionApi } from "../../auth/api";
import { fetchQuestionsWithOptions, blankQuestion } from "./utils";
import OptionRow from "./OptionRow";

/* ── uid helper ─────────────────────────────────────────────── */
const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;
const blankOpt = (sortOrder) => ({ _id: uid(), text: "", correct: false, sortOrder });

const QuestionsManagerModal = ({ quiz, onClose }) => {
    /* ── Saved questions ── */
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* ── Existing-question editing ── */
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editDraft, setEditDraft] = useState(null);
    const [savingQuestion, setSavingQuestion] = useState(false);
    const [addingOptionForQuestionId, setAddingOptionForQuestionId] = useState(null);

    /* ── Draft questions (local, not yet saved) ── */
    const [drafts, setDrafts] = useState([
        { _id: uid(), ...blankQuestion(), options: [] },
    ]);
    const [savingAll, setSavingAll] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    /* ── Load saved questions ── */
    const loadQuestions = useCallback(async () => {
        if (!quiz?.slug) return;
        setLoading(true);
        try {
            const qs = await fetchQuestionsWithOptions(quiz.slug);
            setQuestions(qs);
        } catch (err) {
            console.error(err);
            setError("Failed to load questions.");
        } finally {
            setLoading(false);
        }
    }, [quiz?.slug]);

    useEffect(() => { loadQuestions(); }, [loadQuestions]);

    /* ── Draft helpers ── */
    const updateDraft = (_id, patch) =>
        setDrafts(prev => prev.map(d => d._id === _id ? { ...d, ...patch } : d));

    const removeDraft = (_id) =>
        setDrafts(prev => {
            const next = prev.filter(d => d._id !== _id);
            return next.length === 0 ? [{ _id: uid(), ...blankQuestion(), options: [] }] : next;
        });

    const addAnotherDraft = () =>
        setDrafts(prev => [...prev, { _id: uid(), ...blankQuestion(), options: [] }]);

    const addOptionToDraft = (draftId) =>
        setDrafts(prev => prev.map(d =>
            d._id === draftId
                ? { ...d, options: [...d.options, blankOpt(d.options.length + 1)] }
                : d
        ));

    const removeOptionFromDraft = (draftId, optId) =>
        setDrafts(prev => prev.map(d =>
            d._id === draftId
                ? { ...d, options: d.options.filter(o => o._id !== optId).map((o, i) => ({ ...o, sortOrder: i + 1 })) }
                : d
        ));

    const updateOptionInDraft = (draftId, optId, patch) =>
        setDrafts(prev => prev.map(d =>
            d._id === draftId
                ? { ...d, options: d.options.map(o => o._id === optId ? { ...o, ...patch } : o) }
                : d
        ));

    /* ── Save all drafts at once ── */
    const handleSaveAll = async () => {
        for (const d of drafts) {
            if (!d.question.trim()) {
                setError("All questions must have text before saving.");
                return;
            }
        }
        setSavingAll(true);
        setError("");
        try {
            for (let i = 0; i < drafts.length; i++) {
                const d = drafts[i];
                const res = await instructorQuizQuestionApi.createQuestion(quiz.slug, {
                    questionText: d.question.trim(),
                    explanation: d.explanation?.trim() ?? "",
                    marks: Number(d.marks || 1),
                    sortOrder: questions.length + i + 1,
                });
                let created = res?.data?.data ?? res?.data;
                if (Array.isArray(created)) created = created[0];
                const newQuestionId = created?.id ?? created?.questionId ?? null;

                if (newQuestionId && d.options.length > 0) {
                    const optionPayload = d.options
                        .filter(o => o.text.trim())
                        .map((o, idx) => ({
                            optionText: o.text.trim(),
                            correct: o.correct,
                            sortOrder: idx + 1,
                        }));
                    if (optionPayload.length > 0) {
                        await instructorQuizOptionApi.bulkCreateOptions(newQuestionId, optionPayload);
                    }
                }
            }
            setDrafts([{ _id: uid(), ...blankQuestion(), options: [] }]);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            await loadQuestions();
        } catch (err) {
            console.error("Save all failed:", err?.response?.data ?? err);
            setError(err?.response?.data?.message || "Failed to save questions.");
        } finally {
            setSavingAll(false);
        }
    };

    /* ── Existing question: edit ── */
    const startEditQuestion = (q) => {
        setEditingQuestionId(q.id);
        setEditDraft({ question: q.question, explanation: q.explanation, marks: q.marks });
    };

    const handleSaveQuestionEdit = async (q) => {
        if (!editDraft?.question?.trim()) return;
        setSavingQuestion(true);
        setError("");
        try {
            await instructorQuizQuestionApi.updateQuestion(q.id, {
                questionText: editDraft.question.trim(),
                explanation: editDraft.explanation?.trim() ?? "",
                marks: Number(editDraft.marks || 1),
            });
            setEditingQuestionId(null);
            setEditDraft(null);
            await loadQuestions();
        } catch (err) {
            console.error("Update question failed:", err?.response?.data ?? err);
            setError(err?.response?.data?.message || "Failed to update question.");
        } finally {
            setSavingQuestion(false);
        }
    };

    const handleDeleteQuestion = async (q) => {
        if (!window.confirm("Delete this question and all its options?")) return;
        setError("");
        try {
            await instructorQuizQuestionApi.deleteQuestion(q.id);
            await loadQuestions();
        } catch (err) {
            console.error("Delete question failed:", err?.response?.data ?? err);
            setError("Failed to delete question.");
        }
    };

    /* ── Existing question: option update/delete ── */
    const handleUpdateOption = async (questionId, option, newText, newCorrect, newSortOrder) => {
        try {
            const question = questions.find(q => q.id === questionId);
            const existingOptions = question?.optionObjects || [];
            const targetSortOrder = newSortOrder ?? option.sortOrder ?? 1;
            if (existingOptions.some(o => o.id !== option.id && o.sortOrder === targetSortOrder)) {
                alert(`Sort order ${targetSortOrder} already exists for another option!`);
                return;
            }
            const payload = existingOptions.map(o => {
                if (o.id === option.id) {
                    return { id: o.id, optionId: o.id, optionText: newText, correct: newCorrect, sortOrder: targetSortOrder };
                }
                return {
                    id: o.id, optionId: o.id,
                    optionText: o.optionText ?? o.text,
                    correct: newCorrect ? false : (o.correct === true || o.isCorrect === true),
                    sortOrder: o.sortOrder ?? 1,
                };
            });
            await instructorQuizOptionApi.updateOptions(questionId, payload);
            await loadQuestions();
        } catch (err) {
            console.error("Update option failed:", JSON.stringify(err?.response?.data || err.message));
            setError(err?.response?.data?.message || "Failed to update option.");
        }
    };

    const handleDeleteOption = async (optionId) => {
        try {
            await instructorQuizOptionApi.deleteOption(optionId);
            await loadQuestions();
        } catch (err) {
            console.error("Delete option failed:", err?.response?.data ?? err);
            setError("Failed to delete option.");
        }
    };

    /* ── Inline option adder for existing saved questions ── */
    const InlineOptionAdder = ({ questionId, existingOptions }) => {
        const [text, setText] = useState("");
        const [correct, setCorrect] = useState(false);
        const [addSaving, setAddSaving] = useState(false);

        const save = async () => {
            if (!text.trim()) return;
            setAddSaving(true);
            try {
                await instructorQuizOptionApi.bulkCreateOptions(questionId, [{
                    optionText: text.trim(),
                    correct,
                    sortOrder: existingOptions.length + 1,
                }]);
                setAddingOptionForQuestionId(null);
                await loadQuestions();
            } catch (err) {
                console.error(err);
                alert("Failed to save option.");
            } finally {
                setAddSaving(false);
            }
        };

        return (
            <div className="flex items-center gap-2 p-2 bg-blue-50/50 border border-blue-200 border-dashed rounded-xl mt-2">
                <button
                    onClick={() => setCorrect(c => !c)}
                    className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border transition ${correct ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 text-transparent hover:border-emerald-400"}`}
                    title={correct ? "Mark incorrect" : "Mark correct"}
                >
                    <FaCheck className="text-[8px]" />
                </button>
                <input
                    autoFocus
                    placeholder="Option text…"
                    className="flex-1 text-xs text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-0"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && save()}
                />
                {correct && (
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wide flex-shrink-0">Correct</span>
                )}
                <button disabled={addSaving || !text.trim()} onClick={save}
                    className="px-3 py-1.5 text-[10px] font-bold text-white bg-[#043573] hover:bg-blue-900 rounded-lg disabled:opacity-50 transition">
                    {addSaving ? "Saving…" : "Save"}
                </button>
                <button disabled={addSaving} onClick={() => setAddingOptionForQuestionId(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                    <MdClose className="text-sm" />
                </button>
            </div>
        );
    };

    /* ── Render ── */
    const inp = "w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition bg-white placeholder-slate-400";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#043573] to-blue-900 rounded-t-2xl flex-shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                        <MdListAlt className="text-white text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-black text-white truncate">Manage Questions</h2>
                        <p className="text-[11px] text-blue-200 mt-0.5 truncate">
                            {quiz?.title} · {questions.length} saved question{questions.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition flex-shrink-0">
                        <MdClose />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                    {/* ── Saved questions (already in DB) ── */}
                    {loading && (
                        <div className="space-y-2">
                            {[1, 2].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
                        </div>
                    )}

                    {!loading && questions.length === 0 && (
                        <p className="text-[11px] text-slate-400 text-center py-2">
                            No questions saved yet — fill in the drafts below and click <strong>Save All Questions</strong>.
                        </p>
                    )}

                    {!loading && questions.map((q, idx) => {
                        const isEditing = editingQuestionId === q.id;
                        return (
                            <div key={q.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Question *</label>
                                            <textarea rows={2}
                                                className={inp + " resize-none"}
                                                value={editDraft.question}
                                                onChange={e => setEditDraft({ ...editDraft, question: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="col-span-2">
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Explanation</label>
                                                <input className={inp} value={editDraft.explanation}
                                                    onChange={e => setEditDraft({ ...editDraft, explanation: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Marks</label>
                                                <input type="number" min={1} className={inp} value={editDraft.marks}
                                                    onChange={e => setEditDraft({ ...editDraft, marks: Number(e.target.value) })} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleSaveQuestionEdit(q)} disabled={savingQuestion || !editDraft.question.trim()}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition">
                                                {savingQuestion ? <AiOutlineLoading3Quarters className="animate-spin text-xs" /> : <FaCheck className="text-[9px]" />}
                                                {savingQuestion ? "Saving…" : "Save Question"}
                                            </button>
                                            <button onClick={() => { setEditingQuestionId(null); setEditDraft(null); }}
                                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 bg-blue-100 text-[#043573]">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-slate-800 leading-snug">{q.question}</p>
                                            {q.explanation && <p className="text-[11px] text-slate-400 mt-1">{q.explanation}</p>}
                                            <span className="inline-block text-[10px] text-slate-400 mt-1">{q.marks} mark{q.marks !== 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={() => startEditQuestion(q)}
                                                className="w-6 h-6 rounded-lg bg-blue-50 text-[#043573] hover:bg-blue-100 flex items-center justify-center transition">
                                                <MdEdit className="text-xs" />
                                            </button>
                                            <button onClick={() => handleDeleteQuestion(q)}
                                                className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition">
                                                <FaTrash className="text-[9px]" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Options for saved question */}
                                <div className="pl-9 space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Options</p>
                                    {q.optionObjects.length === 0 && addingOptionForQuestionId !== q.id && (
                                        <p className="text-[11px] text-slate-400">No options yet.</p>
                                    )}
                                    {q.optionObjects.map(opt => (
                                        <OptionRow
                                            key={opt.id}
                                            option={opt}
                                            isCorrect={opt.isCorrect === true || opt.correct === true}
                                            onSave={(text, correct, newSortOrder) => handleUpdateOption(q.id, opt, text, correct, newSortOrder)}
                                            onDelete={() => handleDeleteOption(opt.id)}
                                        />
                                    ))}
                                    {addingOptionForQuestionId === q.id ? (
                                        <InlineOptionAdder questionId={q.id} existingOptions={q.optionObjects} />
                                    ) : (
                                        <button onClick={() => setAddingOptionForQuestionId(q.id)}
                                            className="flex items-center gap-1.5 text-[11px] font-bold text-[#043573] hover:text-blue-900 transition">
                                            <FaPlus className="text-[8px]" /> Add Option
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* ── Draft questions (local, batch) ── */}
                    {!loading && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pt-2">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                                    New Questions · unsaved
                                </span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>

                            {drafts.map((draft, i) => (
                                <div key={draft._id} className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/60 to-white p-4 space-y-3">
                                    {/* Card header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-[#043573] flex items-center justify-center text-white text-[10px] font-black">
                                                {questions.length + i + 1}
                                            </div>
                                            <p className="text-xs font-black text-blue-900 uppercase tracking-wide">
                                                Question {questions.length + i + 1}
                                            </p>
                                        </div>
                                        {drafts.length > 1 && (
                                            <button onClick={() => removeDraft(draft._id)}
                                                className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition"
                                                title="Remove this draft question">
                                                <MdClose className="text-xs" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Question text */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Question *</label>
                                        <textarea className={inp + " resize-none"} rows={2} placeholder="Type your question here…"
                                            value={draft.question}
                                            onChange={e => updateDraft(draft._id, { question: e.target.value })} />
                                    </div>

                                    {/* Explanation + Marks */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Explanation (optional)</label>
                                            <input className={inp} placeholder="Why is this the correct answer?"
                                                value={draft.explanation}
                                                onChange={e => updateDraft(draft._id, { explanation: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Marks</label>
                                            <input type="number" min={1} className={inp} placeholder="1"
                                                value={draft.marks}
                                                onChange={e => updateDraft(draft._id, { marks: Number(e.target.value) })} />
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Options</p>
                                        {draft.options.length === 0 && (
                                            <p className="text-[11px] text-slate-400">No options yet — click Add Option below.</p>
                                        )}
                                        {draft.options.map(opt => (
                                            <div key={opt._id}
                                                className={`flex items-center gap-2 p-2 rounded-xl border transition ${opt.correct ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200"}`}>
                                                <button
                                                    title={opt.correct ? "Mark as incorrect" : "Mark as correct"}
                                                    onClick={() => updateOptionInDraft(draft._id, opt._id, { correct: !opt.correct })}
                                                    className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border transition ${opt.correct ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 text-transparent hover:border-emerald-400"}`}>
                                                    <FaCheck className="text-[8px]" />
                                                </button>
                                                <input
                                                    className="flex-1 text-xs text-slate-700 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-slate-400"
                                                    placeholder="Option text…"
                                                    value={opt.text}
                                                    onChange={e => updateOptionInDraft(draft._id, opt._id, { text: e.target.value })}
                                                />
                                                {opt.correct && (
                                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wide flex-shrink-0">Correct</span>
                                                )}
                                                <button onClick={() => removeOptionFromDraft(draft._id, opt._id)}
                                                    className="w-5 h-5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition flex-shrink-0">
                                                    <MdClose className="text-[10px]" />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addOptionToDraft(draft._id)}
                                            className="flex items-center gap-1.5 text-[11px] font-bold text-[#043573] hover:text-blue-900 transition">
                                            <FaPlus className="text-[8px]" /> Add Option
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Add another question (stays local) */}
                            <button type="button" onClick={addAnotherDraft}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-blue-300 hover:border-[#043573] text-[#043573] hover:bg-blue-50/50 text-xs font-bold rounded-xl transition">
                                <FaPlus className="text-[9px]" /> Add Another Question
                            </button>

                            {/* Single save button for all drafts */}
                            <button type="button" onClick={handleSaveAll}
                                disabled={savingAll || drafts.every(d => !d.question.trim())}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#043573] hover:bg-blue-900 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-900/20">
                                {savingAll ? (
                                    <><AiOutlineLoading3Quarters className="animate-spin text-sm" /> Saving all questions…</>
                                ) : saveSuccess ? (
                                    <><MdCheck className="text-sm" /> Saved successfully!</>
                                ) : (
                                    <><FaCheck className="text-[9px]" /> Save All Questions</>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-[11px] font-semibold">
                            <MdErrorOutline className="text-sm flex-shrink-0" /> {error}
                            <button onClick={() => setError("")} className="ml-auto flex-shrink-0">
                                <MdClose className="text-xs" />
                            </button>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-white bg-[#043573] hover:bg-blue-900 rounded-xl transition">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionsManagerModal;
