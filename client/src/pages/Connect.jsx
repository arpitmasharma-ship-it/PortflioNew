import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Container, EmptyState, PageHeader } from '../components/common/Container.jsx';
import { Seo } from '../components/common/Seo.jsx';
import { IconByName } from '../utils/icons.jsx';

export default function Connect() {
  const { social, profile } = usePortfolio();
  const links = social.filter((l) => l.url && l.visible !== false);

  return (
    <>
      <Seo title="Profiles" path="/connect" />
      <Container className="py-16 sm:py-20">
        <PageHeader
          eyebrow="Elsewhere"
          title="Find me on the web."
          description="Only profiles I actually maintain. Empty placeholders stay off this page."
        />
        {profile?.email ? (
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-line px-4 py-3 text-ink"
          >
            <IconByName name="Mail" /> {profile.email}
          </a>
        ) : null}
        {links.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="No public profiles yet" body="Add real URLs in admin and mark them visible." />
          </div>
        ) : (
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {links.map((link) => (
              <li key={link._id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-between rounded-2xl border border-line bg-paper px-5 py-4 transition hover:border-ink/20"
                >
                  <span className="inline-flex items-center gap-3">
                    <IconByName name={link.icon} />
                    <span>{link.label}</span>
                  </span>
                  <span className="text-xs text-muted">{link.platform}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
