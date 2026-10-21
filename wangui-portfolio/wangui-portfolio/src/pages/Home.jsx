import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Photo from "../components/Photo";
import WorkCard from "../components/WorkCard";
import PressCard from "../components/PressCard";
import { coverOf, isVideo } from "../lib/video";
import { useContent } from "../lib/contentContext";

function Home() {
  const { settings: s, displayName, projects, press, gallery } = useContent();
  const first = displayName.split(" ").slice(0, -1).join(" ");
  const last = displayName.split(" ").slice(-1)[0];
  return (
    <>
      <Seo />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="role-line">{s.role}</div>
            <h1>{first}<br /><span>{last}</span></h1>
            {s.aspiration && <div className="pill">{s.aspiration}</div>}
            <p className="lead">{s.intro}</p>
            <div className="btn-row">
              <Link to="/vision" className="btn btn-accent">My vision for {s.area.replace(" County", "")}</Link>
              <Link to="/career" className="btn btn-ghost">My story</Link>
            </div>
            <dl className="facts">
              <div><dt>Based in</dt><dd>{s.basedIn}</dd></div>
              {s.party && <div><dt>Party</dt><dd>{s.party}</dd></div>}
              {s.focus.length > 0 && <div><dt>Focus</dt><dd>{s.focus.join(" · ")}</dd></div>}
            </dl>
          </div>
          <div className="portrait-wrap">
            <div className="portrait-blob" aria-hidden="true" />
            <Photo src={s.heroImage} label="PORTRAIT PHOTO" alt={displayName} dark className="portrait" />
          </div>
        </div>
      </section>

      <section className="stats" aria-label="At a glance">
        <div className="container stats-grid">
          {s.stats.map((st, i) => (
            <div className="stat" key={i}><div className="stat-value">{st.value}</div><div className="stat-label">{st.label}</div></div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="wide">
            <Photo src={s.wideImage} label="WIDE PHOTO: EVENT OR SITE VISIT" alt="" dark className="wide-img" />
            <div className="wide-shade" aria-hidden="true" />
            {s.wideQuote && (
              <div className="wide-copy">
                <p className="wide-quote">&ldquo;{s.wideQuote}&rdquo;</p>
                <p className="wide-by">{[displayName, s.wideQuoteBy].filter(Boolean).join(" · ")}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div><div className="eyebrow">ON THE GROUND</div><h2>Out with the people</h2></div>
              <Link to="/gallery" className="text-link">Open the gallery &rarr;</Link>
            </div>
            <div className="mosaic">
              {gallery.slice(0, 5).map((g, i) => (
                <figure key={g.id} className={`m${i} ${isVideo(g) ? "is-video" : ""}`}><Photo src={coverOf(g)} label="EVENT PHOTO" alt={g.caption} />{isVideo(g) && <span className="play" aria-hidden="true" />}{g.caption && <figcaption>{g.caption}</figcaption>}</figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div><div className="eyebrow">THE RECORD</div><h2>Selected work</h2></div>
              <Link to="/work" className="text-link">All projects &rarr;</Link>
            </div>
            <div className="card-grid">{projects.slice(0, 3).map((p) => <WorkCard key={p.id} project={p} />)}</div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container timeline-split">
          <div>
            <div className="eyebrow">MY PATH</div>
            <h2>Career</h2>
            <p className="muted">{s.careerIntro}</p>
            <Link to="/career" className="text-link">Full career &rarr;</Link>
          </div>
          <ol className="timeline">
            {s.career.slice(0, 4).map((c, i) => (
              <li key={i}><span className="when">{c.years}</span><h3>{c.role}</h3><div className="org">{c.org}</div></li>
            ))}
          </ol>
        </div>
      </section>

      {press.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div><div className="eyebrow">IN THE NEWS</div><h2>Press</h2></div>
              <Link to="/press" className="text-link">All press &rarr;</Link>
            </div>
            <div className="card-grid">{press.slice(0, 3).map((n) => <PressCard key={n.id} item={n} />)}</div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="cta-card">
            <h2>Have a question, an idea or an invitation?</h2>
            <Link to="/contact" className="btn btn-dark">Talk to {s.title} {last}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
