import { useState } from "react";
import { useContent } from "../../lib/contentContext";
import { compressImage } from "../../lib/image";
import { saveItem } from "../../lib/store";

/*
  Extra photos for one project. Each photo is saved as its own gallery record
  with projectId set, so it also appears in the public Gallery (album "Projects")
  and a project can have many photos without hitting the database size limit.
*/
function LinkedPhotos({ projectId, title }) {
  const { gallery } = useContent();
  const linked = gallery.filter((g) => g.projectId === projectId);
  const unlinked = gallery.filter((g) => !g.projectId && g.image);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [picking, setPicking] = useState(false);

  async function upload(e) {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setMsg("");
    let done = 0;
    try {
      for (const file of files) {
        const image = await compressImage(file, 1400);
        await saveItem("gallery", { image, caption: title || "", category: "Projects", projectId, order: Date.now() + done });
        done++;
        setMsg(`Uploaded ${done} of ${files.length}`);
      }
      setMsg(`Added ${done} photo${done === 1 ? "" : "s"}. They also appear in the Gallery.`);
    } catch (err) {
      setMsg(`Stopped after ${done} of ${files.length}: ${err.message || "could not save"}`);
    }
    setBusy(false);
  }

  async function link(g, on) {
    try {
      await saveItem("gallery", { id: g.id, projectId: on ? projectId : "", ...(on && !g.caption ? { caption: title || "" } : {}) });
    } catch {
      setMsg("Could not update that photo. Check your connection.");
    }
  }

  return (
    <div className="admin-field wide">
      <span className="admin-label">More photos of this project</span>
      <span className="admin-small">
        Shown when visitors open the project, and in the Gallery under &ldquo;Projects&rdquo;. Removing a photo here keeps it in the Gallery; delete it from the Gallery screen.
      </span>
      {linked.length > 0 && (
        <ul className="linked-photos">
          {linked.map((g) => (
            <li key={g.id}>
              <img src={g.image} alt="" />
              <button type="button" className="admin-btn danger small" onClick={() => link(g, false)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div className="admin-actions">
        <label className={`admin-btn ${busy ? "" : "primary"}`} aria-disabled={busy}>
          {busy ? "Uploading..." : "Upload photos"}
          <input type="file" accept="image/*" multiple hidden disabled={busy} onChange={upload} />
        </label>
        {unlinked.length > 0 && (
          <button type="button" className="admin-btn" onClick={() => setPicking((v) => !v)}>
            {picking ? "Done choosing" : "Choose from the Gallery"}
          </button>
        )}
      </div>
      {picking && (
        <ul className="linked-photos pick">
          {unlinked.map((g) => (
            <li key={g.id}>
              <button type="button" onClick={() => link(g, true)} aria-label={`Add ${g.caption || "photo"} to this project`}>
                <img src={g.image} alt="" />
                <span>+ Add</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {msg && <p className="admin-small" role="status">{msg}</p>}
    </div>
  );
}

export default LinkedPhotos;
