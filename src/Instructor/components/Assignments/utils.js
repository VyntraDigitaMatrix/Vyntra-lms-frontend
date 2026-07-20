export const ASSIGNMENT_TYPES = [
  { value: "IN_CLASS_ASSIGNMENT", label: "In-Class Assignment" },
  { value: "HOMEWORK_ASSIGNMENT", label: "Homework Assignment" },
];

export const STATUS_STYLE = {
  DRAFT: "text-amber-700 bg-amber-50 border-amber-200",
  PUBLISHED: "text-emerald-700 bg-emerald-50 border-emerald-200",
  ARCHIVED: "text-slate-600 bg-slate-100 border-slate-200",
};

export const EMPTY_FORM = {
  title: "", description: "", instructions: "",
  assignmentType: "IN_CLASS_ASSIGNMENT", maxMarks: 100,
  dueDate: "", active: true, allowLateSubmission: false, allowResubmission: false,
  courseSlug: "", moduleSlug: "", lessonSlug: "",
};

export const extractList = (res) => {
  const body = res?.data?.data ?? res?.data;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.content)) return body.content;
  return [];
};

export const fmt = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const fmtType = (type) => ASSIGNMENT_TYPES.find(t => t.value === type)?.label ?? type ?? "—";
