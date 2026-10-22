import { useCallback, useMemo, useState } from "react";
import Photo from "./Photo";
import Lightbox from "./Lightbox";
import { useContent } from "../lib/contentContext";
import { projectAnchor, projectPhotos } from "../lib/galleryItems";
import { safeUrl } from "../lib/socials";

/*
  A project card. When the project has more than one photo, the picture opens
  them all in the viewer. The optional link opens the project's own page.
*/
function WorkCard({ project: p }) {
  const { gallery } = useContent();
  const photos = useMemo(() => projectPhotos(p, gallery), [p, gallery]);
  const [open, setOpen] = useState(-1);
  const move = useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), [photos.length]);
  const url = safeUrl(p.url);
  const many = photos.length > 1;

  const media = (
    <>
      <Photo src={p.image || photos[0]?.image} label="PROJECT PHOTO" alt={p.title} />
      {p.category && <span className="tag">{p.category}</span>}
      {many && <span className="photo-count">{photos.length} photos</span>}
    </>
  );

  return (
    <article className="card" id={projectAnchor(p.id)}>
      {many ? (
        <button type="button" className="card-media card-media-btn" onClick={() => setOpen(0)} aria-label={`View ${photos.length} photos of ${p.title}`}>
          {media}
        </button>
      ) : (
        <div className="card-media">{media}</div>
      )}
      <div className="card-body">
        <div className="meta">{[p.place, p.year].filter(Boolean).join(" · ")}</div>
        <h3>{url ? <a className="card-title-link" href={url} target="_blank" rel="noopener noreferrer">{p.title}</a> : p.title}</h3>
        {p.summary && <p className="muted">{p.summary}</p>}
        {p.result && (
          <div className="result"><strong>{p.result}</strong><span>{p.resultLabel}</span></div>
        )}
        {url && <a className="read-link" href={url} target="_blank" rel="noopener noreferrer">Read more &rarr;</a>}
      </div>
      {open >= 0 && <Lightbox items={photos} index={open} onClose={() => setOpen(-1)} onMove={move} />}
    </article>
  );
}

export default WorkCard;
