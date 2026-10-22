import { useCallback, useMemo, useState } from "react";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import Lightbox from "../components/Lightbox";
import { useContent } from "../lib/contentContext";
import { useGalleryItems } from "../lib/galleryItems";
import { coverOf, isVideo } from "../lib/video";

function Gallery() {
  const { displayName } = useContent();
  const gallery = useGalleryItems();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(-1);
  const hasVideo = gallery.some(isVideo);
  const albums = useMemo(
    () => ["All", ...(hasVideo ? ["Videos"] : []), ...new Set(gallery.map((g) => g.category).filter((c) => c && c !== "Videos"))],
    [gallery, hasVideo]
  );
  const shown =
    filter === "All" ? gallery
    : filter === "Videos" ? gallery.filter(isVideo)
    : gallery.filter((g) => g.category === filter);
  const move = useCallback((d) => setOpen((i) => (i + d + shown.length) % shown.length), [shown.length]);
  return (
    <>
      <Seo title="Gallery" path="/gallery" description={`Photos and videos from events, projects and community visits by ${displayName}.`} />
      <section className="page-head">
        <div className="container">
          <div className="eyebrow">IN PICTURES</div>
          <h1>Gallery</h1>
        </div>
      </section>
      <section className="section tight">
        <div className="container">
          {albums.length > 2 && (
            <div className="filters" role="group" aria-label="Filter by album">
              {albums.map((a) => (
                <button key={a} type="button" className={`filter ${filter === a ? "is-active" : ""}`} aria-pressed={filter === a} onClick={() => setFilter(a)}>{a}</button>
              ))}
            </div>
          )}
          {shown.length === 0 && <p className="empty">Photos and videos will appear here soon.</p>}
          <div className="gallery" key={filter}>
            {shown.map((g, i) => {
              const video = isVideo(g);
              return (
                <button type="button" className={`gallery-item ${video ? "is-video" : ""}`} key={g.id} onClick={() => setOpen(i)}
                  aria-label={`${video ? "Play video" : "Open photo"}: ${g.caption || (video ? "gallery video" : "gallery photo")}`}>
                  <Photo src={coverOf(g)} label={video ? "VIDEO" : "PHOTO"} alt={g.caption} />
                  {video && <span className="play" aria-hidden="true" />}
                  {g.caption && <span className="cap">{g.caption}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>
      {open >= 0 && shown[open] && <Lightbox items={shown} index={open} onClose={() => setOpen(-1)} onMove={move} />}
    </>
  );
}

export default Gallery;
