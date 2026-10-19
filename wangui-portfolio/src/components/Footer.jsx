import { createElement } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { useContent } from "../lib/contentContext";

const SOCIALS = [
  ["facebook", "Facebook", FaFacebookF],
  ["x", "X", FaXTwitter],
  ["instagram", "Instagram", FaInstagram],
  ["youtube", "YouTube", FaYoutube],
];

function Footer() {
  const { settings, displayName } = useContent();
  const links = SOCIALS.filter(([key]) => settings.socials[key]);
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-name">{displayName}</div>
          <p>{[settings.aspiration, settings.role, settings.party].filter(Boolean).join(" \u00b7 ")}</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/work">Selected work</Link>
          <Link to="/career">Career</Link>
          <Link to="/vision">Vision</Link>
          <Link to="/press">Press</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        {links.length > 0 && (
          <div className="socials">
            {links.map(([key, label, icon]) => (
              <a key={key} href={settings.socials[key]} target="_blank" rel="noopener noreferrer" aria-label={label}>{createElement(icon)}</a>
            ))}
          </div>
        )}
      </div>
      <div className="container footer-legal">
        <span>&copy; {new Date().getFullYear()} {displayName}. Published and maintained by her office.</span>
        <span>Built by SpenceTecH &amp; Logistics Ltd</span>
      </div>
    </footer>
  );
}

export default Footer;
