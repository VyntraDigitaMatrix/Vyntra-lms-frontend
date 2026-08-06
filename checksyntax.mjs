import { parse } from "@babel/parser";
import fs from "fs";

const files = [
  "src/Admin/auth/api.js",
  "src/Admin/pages/AllCourses.jsx",
  "src/Admin/pages/CourseViewDetails.jsx",
  "src/Admin/pages/LessonView.jsx",
  "src/Admin/pages/CreateCourse.jsx",
  "src/Admin/pages/CourseSettings.jsx",
  "src/Admin/components/AdminDashboard.jsx",
  "src/App.jsx",
];

let hasError = false;
for (const f of files) {
  const code = fs.readFileSync(f, "utf8");
  try {
    parse(code, {
      sourceType: "module",
      plugins: ["jsx"],
    });
    console.log("OK   ", f);
  } catch (e) {
    hasError = true;
    console.log("FAIL ", f, "->", e.message);
  }
}
process.exit(hasError ? 1 : 0);
