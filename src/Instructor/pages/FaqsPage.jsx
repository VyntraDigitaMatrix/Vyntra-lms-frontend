import React, {useState} from 'react';
import { MdAdd, MdClose } from "react-icons/md";

const FaqsPage = ({ data, setData }) => {
    const [q, setQ] = useState("");
    const [a, setA] = useState("");
    const addFaq = () => {
    if (!q.trim() || !a.trim()) return;

    setData(prev => ({
        ...prev,
        faqs: [
            ...(prev.faqs || []),
            {
                question: q.trim(),
                answer: a.trim(),
                displayOrder: (prev.faqs || []).length
            }
        ]
    }));

    setQ("");
    setA("");
};
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">FAQs</h2>
            <p className="text-sm text-gray-500 mb-8">Add frequently asked questions for your course</p>
            <div className="space-y-3 mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Question"
                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:border-green-400 transition" />
                <textarea value={a} onChange={e => setA(e.target.value)} placeholder="Answer" rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm resize-none focus:outline-none focus:border-green-400 transition" />
                <button onClick={addFaq}
                    className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition flex items-center gap-1.5">
                    <MdAdd /> Add FAQ
                </button>
            </div>
            <div className="space-y-3">
                {(data.faqs || []).map((faq, i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-800">Q: {faq.question}</p>
                            <button onClick={() => setData(d => ({ ...d, faqs: d.faqs.filter((_, j) => j !== i) }))}
                                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition flex-shrink-0">
                                <MdClose className="text-sm" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">A: {faq.answer}</p>
                    </div>
                ))}
                {!(data.faqs?.length) && <p className="text-sm text-gray-400">No FAQs added yet.</p>}
            </div>
        </div>
    );
}

export default FaqsPage;