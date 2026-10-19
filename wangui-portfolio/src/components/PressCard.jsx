import Photo from "./Photo";
import { formatDate } from "../lib/format";

function PressCard({ item: n }) {
  const body = (
    <>
      <div className="card-media">
        <Photo src={n.image} label="PRESS IMAGE" alt="" />
        {n.kind && <span className="tag">{n.kind}</span>}
      </div>
      <div className="card-body">
        <div className="meta">{[n.outlet, formatDate(n.date)].filter(Boolean).join(" · ")}</div>
        <h3>{n.title}</h3>
        {n.summary && <p className="muted">{n.summary}</p>}
        {n.url && <span className="read-link">Read at source &rarr;</span>}
      </div>
    </>
  );
  return n.url ? (
    <a className="card" href={n.url} target="_blank" rel="noopener noreferrer">{body}</a>
  ) : (
    <article className="card">{body}</article>
  );
}

export default PressCard;
