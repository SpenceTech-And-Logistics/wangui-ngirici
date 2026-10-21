import { createElement } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../lib/contentContext";
import { activeSocials, otherLinks } from "../lib/socials";

function Footer() {
  const { settings, displayName } = useContent();
  const links = activeSocials(settings);
  const extra = otherLinks(settings);
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
        {(links.length > 0 || extra.length > 0) && (
          <div className="footer-social">
            {links.length > 0 && (
              <div className="socials">
                {links.map((p) => (
                  <a key={p.key} href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.label} title={p.label}>{createElement(p.icon)}</a>
                ))}
              </div>
            )}
            {extra.length > 0 && (
              <ul className="other-links">
                {extra.map((l, i) => (
                  <li key={i}><a href={l.url} target="_blank" rel="noopener noreferrer">{l.label} <span aria-hidden="true">&#8599;</span></a></li>
                ))}
              </ul>
            )}
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
