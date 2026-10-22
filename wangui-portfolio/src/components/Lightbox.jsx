import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Photo from "./Photo";
import { parseVideo } from "../lib/video";

function Lightbox({ items, index, onClose, onMove }) {
  const item = items[index];
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onMove]);
  if (!item) return null;
  const video = parseVideo(item.video);
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={video ? "Video player" : "Photo viewer"} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        {video ? (
          <div className={`lightbox-video ${video.vertical ? "is-vertical" : ""}`}>
            <iframe key={item.id} src={video.embed} title={item.caption || `${video.provider} video`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          </div>
        ) : (
          <Photo src={item.image} label="PHOTO" alt={item.caption} dark />
        )}
        <figcaption>
          <span className="lb-text">
            {item.caption}
            {item.source && (item.source.href ? (
              <a className="lb-source" href={item.source.href} target="_blank" rel="noopener noreferrer">{item.source.label} &rarr;</a>
            ) : (
              <Link className="lb-source" to={item.source.to} onClick={onClose}>{item.source.label} &rarr;</Link>
            ))}
          </span>
          {items.length > 1 && <span>{index + 1} / {items.length}</span>}
        </figcaption>
      </figure>
      <button type="button" className="lightbox-btn close" onClick={onClose} aria-label="Close">&times;</button>
      {items.length > 1 && (
        <>
          <button type="button" className="lightbox-btn prev" onClick={(e) => { e.stopPropagation(); onMove(-1); }} aria-label="Previous">&larr;</button>
          <button type="button" className="lightbox-btn next" onClick={(e) => { e.stopPropagation(); onMove(1); }} aria-label="Next">&rarr;</button>
        </>
      )}
    </div>,
    document.body
  );
}

export default Lightbox;
