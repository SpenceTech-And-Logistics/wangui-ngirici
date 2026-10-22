import { useState } from "react";
import { useContent } from "../../lib/contentContext";
import { parseWorkbook } from "../../lib/importSheet";
import { importItems, saveSettings } from "../../lib/store";

/*
  Admin > Import: upload the content spreadsheet, check what was found,
  choose per section whether to add or replace, then import.
  Photos are not in the spreadsheet; add them in each section afterwards.
*/

const keyOf = {
  projects: (p) => p.title,
  press: (n) => n.url || n.title,
  career: (c) => `${c.role}|${c.org}`,
  education: (e) => `${e.what}|${e.where}`,
  committees: (t) => t,
  pillars: (p) => p.title,
};
const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
const titleOf = (sec, item) => (sec.list ? item : item.title || item.role || item.what || "");

function Import() {
  const content = useContent();
  const [file, setFile] = useState("");
  const [parsed, setParsed] = useState(null);
  const [modes, setModes] = useState({});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const existing = (key) => (key === "projects" || key === "press" ? content[key] : content.settings[key] || []);

  // In "add" mode, rows already on the site (same title/link) are left out so importing twice is harmless.
  // Career, education, committees and vision are single lists, so the sheet replaces them by default.
  // Projects and press are records with photos, so the sheet adds to them by default.
  const defaultMode = (sec) => (sec.target === "settings" ? "replace" : "add");

  function plan(sec) {
    const mode = modes[sec.key] || defaultMode(sec);
    if (mode === "skip") return { mode, items: [], dupes: 0 };
    if (mode === "replace") return { mode, items: sec.items, dupes: 0 };
    const have = new Set(existing(sec.key).map((x) => norm(keyOf[sec.key](x))));
    const items = sec.items.filter((x) => !have.has(norm(keyOf[sec.key](x))));
    return { mode, items, dupes: sec.items.length - items.length };
  }

  async function onFile(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setError("");
    setStatus("");
    setParsed(null);
    try {
      const { default: readExcelFile } = await import("read-excel-file/browser");
      const sheets = await readExcelFile(f);
      const result = parseWorkbook(sheets);
      if (!result.found.length) {
        setError("No sheets named Projects, Press, Career, Education, Committees or Vision were found in that file.");
        return;
      }
      setFile(f.name);
      setParsed(result);
      setModes({});
    } catch (err) {
      setError(`That file could not be read as an Excel (.xlsx) file. ${err.message || ""}`);
    }
  }

  async function onImport() {
    const plans = parsed.found.map((sec) => ({ sec, ...plan(sec) })).filter((p) => p.mode !== "skip" && (p.items.length || p.mode === "replace"));
    const replacing = plans.filter((p) => p.mode === "replace" && p.sec.target === "collection").map((p) => p.sec.label);
    if (replacing.length && !window.confirm(`Delete everything currently in ${replacing.join(" and ")} (including their photos) and replace it with the sheet? This cannot be undone.`)) return;
    setBusy(true);
    setError("");
    setStatus("Importing...");
    try {
      const nextSettings = { ...content.settings };
      let settingsChanged = false;
      const done = [];
      for (const p of plans) {
        if (p.sec.target === "collection") {
          const current = content[p.sec.key];
          const start = p.mode === "replace" ? 0 : Math.max(-1, ...current.map((x) => x.order ?? 0)) + 1;
          await importItems(p.sec.key, p.items, { replace: p.mode === "replace", startOrder: start });
        } else {
          nextSettings[p.sec.key] = p.mode === "replace" ? p.items : [...(nextSettings[p.sec.key] || []), ...p.items];
          settingsChanged = true;
        }
        done.push(`${p.sec.label}: ${p.items.length} ${p.mode === "replace" ? "(replaced)" : "added"}`);
      }
      if (settingsChanged) await saveSettings(nextSettings);
      setStatus(`Done. ${done.join(" · ")}. Now add photos in Selected work, Press and Gallery.`);
      setParsed(null);
    } catch (err) {
      setError(`Import stopped: ${err.message || "could not save"}. Check your connection and that you are signed in as an administrator.`);
      setStatus("");
    }
    setBusy(false);
  }

  return (
    <div>
      <div className="admin-head">
        <div>
          <h1>Import from a spreadsheet</h1>
          <p className="admin-small">Fill in the content spreadsheet in Excel or Google Sheets (download it as .xlsx), then upload it here. Photos are added afterwards in each section.</p>
        </div>
        <div className="admin-actions">
          <a className="admin-btn" href="/content-template.xlsx" download>Download blank template</a>
          <label className={`admin-btn ${busy ? "" : "primary"}`} aria-disabled={busy}>
            Choose spreadsheet
            <input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" hidden disabled={busy} onChange={onFile} />
          </label>
        </div>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {status && <p className="admin-ok" role="status">{status}</p>}

      {!parsed && !status && (
        <div className="admin-panel">
          <h2>How it works</h2>
          <ul className="admin-small steps">
            <li>The spreadsheet has one sheet per section: <b>Projects</b>, <b>Press</b>, <b>Career</b>, <b>Education</b>, <b>Committees</b> and <b>Vision</b>. Keep the column names in row 1.</li>
            <li>Rows still showing a [placeholder] or with an empty first column are skipped.</li>
            <li><b>Career, Education, Committees and Vision</b> are replaced by the sheet (the sheet is the full list).</li>
            <li><b>Selected work and Press</b> are added to: rows already on the site (same title, or same link for press) are not added twice, and existing items keep their photos.</li>
            <li>You can change this per section before importing. Replacing Selected work or Press deletes the current items and their photos; project photos added under &ldquo;More photos&rdquo; stay in the Gallery.</li>
          </ul>
        </div>
      )}

      {parsed && (
        <div className="admin-panel">
          <h2>Found in {file}</h2>
          <ul className="import-list">
            {parsed.found.map((sec) => {
              const p = plan(sec);
              return (
                <li key={sec.key} className="import-row">
                  <div className="import-main">
                    <strong>{sec.label}</strong>
                    <span className="admin-small">
                      {sec.items.length} row{sec.items.length === 1 ? "" : "s"} in the sheet
                      {p.mode === "add" && p.dupes > 0 && ` · ${p.dupes} already on the site`}
                      {p.mode !== "skip" && ` · ${p.items.length} will be ${p.mode === "replace" ? "imported, replacing the current " + existing(sec.key).length : "added"}`}
                    </span>
                    {sec.items.length > 0 && (
                      <span className="admin-small import-sample">{sec.items.slice(0, 4).map((x) => titleOf(sec, x)).join(" · ")}{sec.items.length > 4 ? " ..." : ""}</span>
                    )}
                  </div>
                  <select value={p.mode} onChange={(e) => setModes((m) => ({ ...m, [sec.key]: e.target.value }))} aria-label={`What to do with ${sec.label}`}>
                    <option value="add">Add</option>
                    <option value="replace">Replace</option>
                    <option value="skip">Skip</option>
                  </select>
                </li>
              );
            })}
          </ul>
          {parsed.skipped.length > 0 && (
            <details className="admin-small import-skipped">
              <summary>{parsed.skipped.length} row{parsed.skipped.length === 1 ? "" : "s"} skipped</summary>
              <ul>{parsed.skipped.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </details>
          )}
          <div className="admin-actions">
            <button className="admin-btn primary" onClick={onImport} disabled={busy}>{busy ? "Importing..." : "Import"}</button>
            <button className="admin-btn" onClick={() => setParsed(null)} disabled={busy}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Import;
