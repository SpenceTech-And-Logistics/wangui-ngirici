import { useMemo } from "react";
import { useContent } from "./contentContext";
import { safeUrl } from "./socials";

/*
  The public gallery is built from three places, so nothing is stored twice:
   1. Gallery records. Some are linked to a project (field projectId), the rest stand alone.
   2. Each project's main photo.
   3. Each press item's image.
  Linked items carry a "source" so the viewer can jump to the project or article.
*/

export const projectAnchor = (id) => `project-${id}`;

function projectSource(p) {
  return { type: "project", label: `Project: ${p.title}`, to: `/work#${projectAnchor(p.id)}` };
}

export function buildGallery({ gallery, projects, press }) {
  const byId = new Map(projects.map((p) => [p.id, p]));
  const own = gallery.map((g) => {
    const p = g.projectId && byId.get(g.projectId);
    return p ? { ...g, source: projectSource(p) } : g;
  });
  const covers = projects
    .filter((p) => p.image)
    .map((p) => ({ id: `cover-${p.id}`, image: p.image, caption: p.title, category: "Projects", source: projectSource(p) }));
  const pressImages = press
    .filter((n) => n.image)
    .map((n) => {
      const href = safeUrl(n.url);
      return {
        id: `press-${n.id}`,
        image: n.image,
        caption: n.title,
        category: "Press",
        source: href ? { type: "press", label: `${n.outlet || "Press"}: read the article`, href } : { type: "press", label: n.outlet ? `Press: ${n.outlet}` : "Press", to: "/press" },
      };
    });
  return [...own, ...covers, ...pressImages];
}

export function useGalleryItems() {
  const { gallery, projects, press } = useContent();
  return useMemo(() => buildGallery({ gallery, projects, press }), [gallery, projects, press]);
}

/* A project's main photo followed by its linked gallery photos. */
export function projectPhotos(project, gallery) {
  const linked = gallery.filter((g) => g.projectId === project.id && (g.image || g.video));
  const cover = project.image ? [{ id: `cover-${project.id}`, image: project.image, caption: project.title }] : [];
  return [...cover, ...linked];
}
