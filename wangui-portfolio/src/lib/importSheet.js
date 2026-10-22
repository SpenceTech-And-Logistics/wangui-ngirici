/*
  Turns the content spreadsheet (see README, "Import from a spreadsheet") into
  site records. Input is the list of sheets from read-excel-file:
  [{ sheet: "Projects", data: [[header...], [row...], ...] }, ...]

  - Sheets and columns are matched by name, ignoring case, spaces and "*".
  - Rows whose required cell is empty, or still a [placeholder], are skipped and reported.
  - Nothing here touches the database; Import.jsx decides what to save.
*/

const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

export const SECTIONS = [
  {
    key: "projects", sheet: "Projects", label: "Selected work", target: "collection",
    required: "title",
    columns: {
      title: ["Title", "Project or bill name", "Project"],
      category: ["Category"],
      year: ["Year"],
      place: ["Place", "Ward", "Location"],
      result: ["Headline result", "Result"],
      resultLabel: ["What the result measures", "Result label"],
      summary: ["Description", "One-line description", "Summary"],
      url: ["Link", "URL"],
    },
  },
  {
    key: "press", sheet: "Press", label: "Press", target: "collection",
    required: "title",
    columns: {
      title: ["Headline", "Title", "Headline or title"],
      kind: ["Type", "Kind"],
      outlet: ["Outlet", "Media house"],
      date: ["Date"],
      url: ["Link", "URL", "Link to the original"],
      summary: ["Summary", "One-line summary"],
    },
  },
  {
    key: "career", sheet: "Career", label: "Career", target: "settings",
    required: "role",
    columns: { years: ["Years"], role: ["Position", "Role"], org: ["Organisation", "Organization"], note: ["Note", "One line on the role"] },
  },
  {
    key: "education", sheet: "Education", label: "Education", target: "settings",
    required: "what",
    columns: { years: ["Years"], what: ["Qualification", "Course"], where: ["Institution", "School"] },
  },
  {
    key: "committees", sheet: "Committees", label: "Committees and roles", target: "settings", list: true,
    required: "text",
    columns: { text: ["Committee or role", "Committee", "Role"] },
  },
  {
    key: "pillars", sheet: "Vision", label: "Vision priorities", target: "settings",
    required: "title",
    columns: { title: ["Priority", "Title"], text: ["Description", "Text"], commitments: ["Commitments"] },
  },
];

function cell(v) {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

/* Excel often turns "2019" into 2019 and dates into numbers or Date objects; make dates YYYY-MM-DD. */
function toDate(v) {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = cell(v);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/); // 29/04/2026 (day first, as in Kenya)
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  return s;
}

const isPlaceholder = (s) => /^\[.*\]$/.test(s) || /^\[/.test(s);

export function parseWorkbook(sheets) {
  const out = { found: [], skipped: [] };
  for (const sec of SECTIONS) {
    const sh = sheets.find((s) => norm(s.sheet) === norm(sec.sheet));
    if (!sh || !sh.data?.length) continue;
    const [header, ...rows] = sh.data;
    const index = {};
    for (const [key, names] of Object.entries(sec.columns)) {
      const i = header.findIndex((h) => names.some((n) => norm(n) === norm(h)));
      if (i >= 0) index[key] = i;
    }
    if (index[sec.required] === undefined) {
      out.skipped.push(`${sec.sheet}: no "${sec.columns[sec.required][0]}" column, sheet ignored.`);
      continue;
    }
    const items = [];
    rows.forEach((row, r) => {
      if (!row || row.every((v) => cell(v) === "")) return;
      const item = {};
      for (const [key, i] of Object.entries(index)) item[key] = key === "date" ? toDate(row[i]) : cell(row[i]);
      const req = item[sec.required];
      if (!req) {
        out.skipped.push(`${sec.sheet} row ${r + 2}: "${sec.columns[sec.required][0]}" is empty.`);
        return;
      }
      if (isPlaceholder(req)) {
        out.skipped.push(`${sec.sheet} row ${r + 2}: still a placeholder (${req}).`);
        return;
      }
      if (sec.key === "pillars") {
        item.commitments = (item.commitments || "").split(/;|\n/).map((s) => s.trim()).filter(Boolean);
      }
      for (const k of Object.keys(sec.columns)) if (item[k] === undefined) item[k] = sec.key === "pillars" && k === "commitments" ? [] : "";
      items.push(sec.list ? item.text : item);
    });
    out.found.push({ ...sec, items });
  }
  return out;
}
