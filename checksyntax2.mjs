import { parse } from "@babel/parser";
import fs from "fs";

const files = [
  "src/Admin/components/Sidebar.jsx",
  "src/Admin/components/Navbar.jsx",
  "src/Admin/components/AdminDashboardLayout.jsx",
  "src/Admin/components/AdminDashboard.jsx",
];

let hasError = false;
for (const f of files) {
  const code = fs.readFileSync(f, "utf8");
  try {
    parse(code, { sourceType: "module", plugins: ["jsx"] });
    console.log("OK   ", f);
  } catch (e) {
    hasError = true;
    console.log("FAIL ", f, "->", e.message);
  }
}
process.exit(hasError ? 1 : 0);
