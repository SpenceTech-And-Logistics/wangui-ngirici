import Seo from "../components/Seo";
import { useContent } from "../lib/contentContext";

function Career() {
  const { settings: s, displayName } = useContent();
  return (
    <>
      <Seo title="Career" path="/career" description={`The career of ${displayName}: public service, professional work and education.`} />
      <section className="page-head">
        <div className="container">
          <div className="eyebrow">MY PATH</div>
          <h1>Career</h1>
          <p className="lead">{s.careerIntro}</p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <ol className="timeline big">
            {s.career.map((c, i) => (
              <li key={i}>
                <span className="when">{c.years}</span>
                <h3>{c.role}</h3>
                <div className="org">{c.org}</div>
                {c.note && <p className="muted">{c.note}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section alt">
        <div className="container info-grid">
          <div>
            <h2>Education</h2>
            <ul className="plain">
              {s.education.map((e, i) => (
                <li key={i}><strong>{e.what}</strong><span>{e.where}</span><em>{e.years}</em></li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Committees</h2>
            <ul className="plain">{s.committees.map((c, i) => <li key={i}>{c}</li>)}</ul>
          </div>
          {s.affiliations.length > 0 && (
            <div>
              <h2>Professional bodies</h2>
              <ul className="plain">{s.affiliations.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Career;
