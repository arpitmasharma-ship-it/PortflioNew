import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Container, EmptyState, PageHeader } from '../components/common/Container.jsx';
import { Seo } from '../components/common/Seo.jsx';
import { achievementTypeLabels } from '../constants/nav.js';
import { formatDate } from '../utils/format.js';

export default function Achievements() {
  const { achievements } = usePortfolio();
  const grouped = achievements.reduce((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <>
      <Seo title="Achievements" path="/achievements" />
      <Container className="py-16 sm:py-20">
        <PageHeader
          eyebrow="Recognition"
          title="Certifications and notes worth keeping."
          description="Only real credentials and milestones. Empty sections stay hidden."
        />
        {achievements.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title="Nothing listed yet"
              body="When you earn a certificate or complete a competition, add it from the admin panel."
            />
          </div>
        ) : (
          <div className="mt-12 space-y-12">
            {Object.entries(grouped).map(([type, items]) => (
              <section key={type}>
                <h2 className="font-display text-2xl text-ink">
                  {achievementTypeLabels[type] || type}
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {items.map((item) => (
                    <article key={item._id} className="rounded-2xl border border-line bg-paper p-5">
                      {item.image ? (
                        <img src={item.image} alt="" className="mb-4 h-36 w-full rounded-xl object-cover" />
                      ) : null}
                      <h3 className="font-medium text-ink">{item.title}</h3>
                      <p className="text-sm text-muted">
                        {[item.issuer, formatDate(item.date)].filter(Boolean).join(' · ')}
                      </p>
                      {item.description ? (
                        <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
                      ) : null}
                      {item.credentialUrl ? (
                        <a
                          href={item.credentialUrl}
                          className="mt-3 inline-block text-sm text-sage-dark underline"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Credential
                        </a>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
