import { Link } from 'react-router-dom';

export function PreviewCard({ title, description, action, to }) {
  return (
    <article className="preview-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <Link className="inline-link" to={to}>{action}</Link>
    </article>
  );
}
