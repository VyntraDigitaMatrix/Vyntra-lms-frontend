import React, { useState, useEffect, useCallback } from "react";
import { MdListAlt, MdClose, MdErrorOutline, MdEdit } from "react-icons/md";
import { FaTrash, FaPlus } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { instructorQuizQuestionApi, instructorQuizOptionApi } from "../../auth/api";
import { fetchQuestionsWithOptions, blankQuestion } from "./utils";
import QuestionEditor from "./QuestionEditor";
import OptionRow from "./OptionRow";
import InlineOptionEditor from "./InlineOptionEditor";

const QuestionsManagerModal = ({ quiz, onClose }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [newQ, setNewQ] = useState(blankQuestion());
    const [addingQuestion, setAddingQuestion] = useState(false);

    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editDraft, setEditDraft] = useState(null);
    const [savingQuestion, setSavingQuestion] = useState(false);

    const [addingOptionForQuestionId, setAddingOptionForQuestionId] = useState(null);

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

    const handleAddQuestion = async () => {
        if (!newQ.question.trim()) { setError("Please enter a question."); return; }
        setAddingQuestion(true);
        setError("");
        try {
            const res = await instructorQuizQuestionApi.createQuestion(quiz.slug, {
                questionText: newQ.question.trim(),
                explanation: newQ.explanation?.trim() ?? "",
                marks: Number(newQ.marks || 1),
                sortOrder: questions.length + 1,
            });

            let created = res?.data?.data ?? res?.data;
            if (Array.isArray(created)) created = created[0];
            const newQuestionId = created?.id ?? created?.questionId ?? null;

            setNewQ(blankQuestion());
            await loadQuestions();

            if (newQuestionId) {
                setAddingOptionForQuestionId(newQuestionId);
            }
        } catch (err) {
            console.error("Add question failed:", err?.response?.data ?? err);
            setError(err?.response?.data?.message || "Failed to add question.");
        } finally {
            setAddingQuestion(false);
        }
    };

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
                    return {
                        id: o.id,
                        optionId: o.id,
                        optionText: newText,
                        correct: newCorrect,
                        sortOrder: targetSortOrder,
                    };
                }
                return {
                    id: o.id,
                    optionId: o.id,
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-2xl flex-shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                        <MdListAlt className="text-white text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-black text-white truncate">Manage Questions</h2>
                        <p className="text-[11px] text-violet-200 mt-0.5 truncate">{quiz?.title} · {questions.length} question{questions.length !== 1 ? "s" : ""}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition flex-shrink-0">
                        <MdClose />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    {loading && (
                        <div className="space-y-2">
                            {[1, 2].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
                        </div>
                    )}

                    {!loading && questions.length === 0 && (
                        <p className="text-[11px] text-slate-400 text-center py-4">
                            No questions yet — add your first question below.
                        </p>
                    )}

                    {!loading && questions.map((q, idx) => {
                        const isEditing = editingQuestionId === q.id;
                        return (
                            <div key={q.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                                {/* Question section */}
                                {isEditing ? (
                                    <QuestionEditor
                                        question={editDraft}
                                        label={`Edit Question ${idx + 1}`}
                                        saveLabel="Save Question"
                                        onChange={setEditDraft}
                                        onCancel={() => { setEditingQuestionId(null); setEditDraft(null); }}
                                        onSave={() => handleSaveQuestionEdit(q)}
                                        saving={savingQuestion}
                                    />
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 bg-violet-100 text-violet-600">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-slate-800 leading-snug">{q.question}</p>
                                            {q.explanation && <p className="text-[11px] text-slate-400 mt-1">{q.explanation}</p>}
                                            <span className="inline-block text-[10px] text-slate-400 mt-1">{q.marks} mark{q.marks !== 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button onClick={() => startEditQuestion(q)}
                                                className="w-6 h-6 rounded-lg bg-violet-50 text-violet-500 hover:bg-violet-100 flex items-center justify-center transition">
                                                <MdEdit className="text-xs" />
                                            </button>
                                            <button onClick={() => handleDeleteQuestion(q)}
                                                className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition">
                                                <FaTrash className="text-[9px]" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Options section */}
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
                                        <InlineOptionEditor
                                            questionId={q.id}
                                            existingOptions={q.optionObjects || []}
                                            sortOrder={(q.optionObjects?.length || 0) + 1}
                                            onSaveSuccess={() => { setAddingOptionForQuestionId(null); loadQuestions(); }}
                                            onCancel={() => setAddingOptionForQuestionId(null)}
                                        />
                                    ) : (
                                        <button onClick={() => setAddingOptionForQuestionId(q.id)}
                                            className="flex items-center gap-1.5 text-[11px] font-bold text-violet-600 hover:text-violet-700 transition">
                                            <FaPlus className="text-[8px]" /> Add Option
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {!loading && (
                        <div className="pt-2 space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-slate-200" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Add New Question</span>
                                <div className="flex-1 h-px bg-slate-200" />
                            </div>
                            <QuestionEditor question={newQ} onChange={setNewQ} />
                            <button type="button" onClick={handleAddQuestion}
                                disabled={addingQuestion || !newQ.question.trim()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition">
                                {addingQuestion
                                    ? <><AiOutlineLoading3Quarters className="animate-spin text-xs" /> Adding question…</>
                                    : <><FaPlus className="text-[9px]" /> Add Question</>}
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-[11px] font-semibold">
                            <MdErrorOutline className="text-sm flex-shrink-0" /> {error}
                            <button onClick={() => setError("")} className="ml-auto flex-shrink-0"><MdClose className="text-xs" /></button>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionsManagerModal;
