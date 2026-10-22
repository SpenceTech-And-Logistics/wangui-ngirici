import { FaFacebookF, FaInstagram, FaLinkedinIn, FaThreads, FaTiktok, FaWhatsapp, FaXTwitter, FaYoutube } from "react-icons/fa6";

/*
  One list of social platforms, shared by the footer, the Contact page and /admin.
  To add a platform: add a row here and a key in DEFAULT_SETTINGS.socials.
*/
export const SOCIALS = [
  { key: "facebook", label: "Facebook", icon: FaFacebookF, placeholder: "https://www.facebook.com/..." },
  { key: "x", label: "X", icon: FaXTwitter, placeholder: "https://x.com/..." },
  { key: "instagram", label: "Instagram", icon: FaInstagram, placeholder: "https://www.instagram.com/..." },
  { key: "youtube", label: "YouTube", icon: FaYoutube, placeholder: "https://www.youtube.com/@..." },
  { key: "tiktok", label: "TikTok", icon: FaTiktok, placeholder: "https://www.tiktok.com/@..." },
  { key: "linkedin", label: "LinkedIn", icon: FaLinkedinIn, placeholder: "https://www.linkedin.com/in/..." },
  { key: "threads", label: "Threads", icon: FaThreads, placeholder: "https://www.threads.net/@..." },
  { key: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, placeholder: "https://wa.me/2547XXXXXXXX or a channel link" },
];

/* Only web links are shown, so a typo or a pasted script can never become a link. */
export function safeUrl(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : "";
  } catch {
    return "";
  }
}

/* Platforms that have a link, in the order above. */
export function activeSocials(settings) {
  return SOCIALS.map((p) => ({ ...p, url: safeUrl(settings.socials?.[p.key]) })).filter((p) => p.url);
}

/* Extra links with their own names (party site, Wikipedia, a blog...). */
export function otherLinks(settings) {
  return (settings.links || [])
    .map((l) => ({ label: String(l.label || "").trim(), url: safeUrl(l.url) }))
    .filter((l) => l.label && l.url);
}
