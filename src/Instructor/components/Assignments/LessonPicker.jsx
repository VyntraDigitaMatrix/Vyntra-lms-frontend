import React, { useState, useEffect } from "react";
import { instructorCourseApi, instructorModuleApi, instructorLessonApi } from "../../auth/api";
import { extractList } from "./utils";

export default function LessonPicker({ onSelect }) {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [cSlug, setCSlug] = useState("");
  const [mSlug, setMSlug] = useState("");

  useEffect(() => {
    instructorCourseApi.getInstructorCourses(0, 100)
      .then(res => setCourses(extractList(res))).catch(console.error);
  }, []);

  useEffect(() => {
    setModules([]); setMSlug(""); setLessons([]);
    if (!cSlug) return;
    instructorModuleApi.getCourseModules(cSlug, 0, 100)
      .then(res => setModules(res?.data?.data?.content ?? extractList(res))).catch(console.error);
  }, [cSlug]);

  useEffect(() => {
    setLessons([]);
    if (!mSlug) return;
    instructorLessonApi.getModuleLessons(mSlug, 0, 100)
      .then(res => {
        const list = res?.data?.data?.content ?? extractList(res);
        setLessons(list);
      }).catch(console.error);
  }, [mSlug]);

  const sel = "w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white";
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[160px]">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Course</label>
        <select value={cSlug} onChange={e => {
          setCSlug(e.target.value);
          if (!e.target.value) onSelect(null, null);
        }} className={sel}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.slug || c.id} value={c.slug || c.id}>{c.title}</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-[140px]">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Module</label>
        <select value={mSlug} onChange={e => {
          setMSlug(e.target.value);
          if (!e.target.value) onSelect(null, null);
        }} disabled={!cSlug} className={sel}>
          <option value="">All Modules</option>
          {modules.map(m => <option key={m.slug || m.id} value={m.slug || m.id}>{m.title}</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-[140px]">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Lesson</label>
        <select disabled={!mSlug}
          onChange={e => {
            if (e.target.value) onSelect(e.target.value, lessons.find(l => (l.lessonSlug || l.id) === e.target.value));
            else onSelect(null, null);
          }}
          className={sel}>
          <option value="">— Pick Lesson —</option>
          {lessons.map(l => <option key={l.lessonSlug || l.id} value={l.lessonSlug || l.id}>{l.title}</option>)}
        </select>
      </div>
    </div>
  );
}
