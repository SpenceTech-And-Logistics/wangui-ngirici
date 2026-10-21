/*
  Videos are stored as links, not files: the free Firebase plan cannot hold
  video, and YouTube, Facebook and TikTok host and stream it for free.
  parseVideo turns a pasted link into what the site needs to show it.
*/

function toUrl(raw) {
  try {
    const s = String(raw || "").trim();
    if (!s) return null;
    return new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
  } catch {
    return null;
  }
}

const YT_ID = /^[\w-]{11}$/;

function youtube(u) {
  const host = u.hostname.replace(/^(www|m|music)\./, "");
  let id = "";
  if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") id = u.searchParams.get("v") || "";
    else {
      const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/);
      if (m) id = m[1];
    }
  }
  if (!YT_ID.test(id)) return null;
  return {
    provider: "YouTube",
    embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
    thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    vertical: u.pathname.startsWith("/shorts/"),
  };
}

function facebook(u) {
  const host = u.hostname.replace(/^(www|m|web|mbasic)\./, "");
  if (host !== "facebook.com" && host !== "fb.watch") return null;
  if (host === "facebook.com" && !/\/(videos|reel|watch|share\/v|share\/r)(\/|$)/.test(u.pathname)) return null;
  const link = host === "fb.watch" ? u.href : `https://www.facebook.com${u.pathname}${u.pathname.startsWith("/watch") ? u.search : ""}`;
  return {
    provider: "Facebook",
    embed: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(link)}&show_text=false&autoplay=true`,
    thumb: "",
    vertical: u.pathname.includes("/reel"),
  };
}

function tiktok(u) {
  const host = u.hostname.replace(/^(www|m)\./, "");
  if (host !== "tiktok.com") return null;
  const m = u.pathname.match(/\/video\/(\d{8,25})/);
  if (!m) return null;
  return { provider: "TikTok", embed: `https://www.tiktok.com/embed/v2/${m[1]}`, thumb: "", vertical: true };
}

export function parseVideo(raw) {
  const u = toUrl(raw);
  if (!u) return null;
  return youtube(u) || facebook(u) || tiktok(u);
}

export function isVideo(item) {
  return Boolean(item?.video && parseVideo(item.video));
}

/* The picture to show for a gallery item: its own photo, else the video's thumbnail. */
export function coverOf(item) {
  return item?.image || parseVideo(item?.video)?.thumb || "";
}

export function videoError(raw) {
  if (!String(raw || "").trim()) return "";
  return parseVideo(raw)
    ? ""
    : "That link was not recognised. Paste a YouTube, Facebook or TikTok video link (the address of the video's own page).";
}
