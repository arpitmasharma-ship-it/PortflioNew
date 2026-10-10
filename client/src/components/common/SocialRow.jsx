import { IconByName } from '../../utils/icons.jsx';

export function SocialRow({ links = [] }) {
  const visible = links.filter((link) => link.visible !== false && link.url);
  if (!visible.length) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {visible.map((link) => (
        <li key={link._id || link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink transition hover:border-ink/30"
            aria-label={link.label}
          >
            <IconByName name={link.icon} size={15} />
            <span>{link.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
