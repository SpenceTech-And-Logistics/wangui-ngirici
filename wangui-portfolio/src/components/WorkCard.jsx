import Photo from "./Photo";

function WorkCard({ project: p }) {
  const body = (
    <>
      <div className="card-media">
        <Photo src={p.image} label="PROJECT PHOTO" alt={p.title} />
        {p.category && <span className="tag">{p.category}</span>}
      </div>
      <div className="card-body">
        <div className="meta">{[p.place, p.year].filter(Boolean).join(" · ")}</div>
        <h3>{p.title}</h3>
        {p.summary && <p className="muted">{p.summary}</p>}
        {p.result && (
          <div className="result"><strong>{p.result}</strong><span>{p.resultLabel}</span></div>
        )}
      </div>
    </>
  );
  return p.url ? (
    <a className="card" href={p.url} target="_blank" rel="noopener noreferrer">{body}</a>
  ) : (
    <article className="card">{body}</article>
  );
}

export default WorkCard;
