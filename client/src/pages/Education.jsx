import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Container, EmptyState, PageHeader } from '../components/common/Container.jsx';
import { FadeIn } from '../components/common/Motion.jsx';
import { Seo } from '../components/common/Seo.jsx';

export default function Education() {
  const { education } = usePortfolio();

  return (
    <>
      <Seo title="Education" path="/education" />
      <Container className="py-16 sm:py-20">
        <PageHeader
          eyebrow="Education"
          title="Study, not a highlight reel."
          description="Academic background with optional details you can update from the admin panel."
        />
        {education.length === 0 ? (
          <div className="mt-12">
            <EmptyState title="Education details coming soon" />
          </div>
        ) : (
          <div className="mt-12 grid gap-6">
            {education.map((item) => (
              <FadeIn key={item._id} className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.14em] text-sage">
                  {item.startYear} — {item.current ? 'Expected ' : ''}
                  {item.endYear}
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink">{item.institution}</h2>
                <p className="mt-1 text-muted">
                  {[item.degree, item.branch].filter(Boolean).join(' · ')}
                </p>
                {item.showGrades && (item.cgpa || item.sgpa) ? (
                  <p className="mt-3 text-sm text-ink">
                    {item.cgpa ? `CGPA ${item.cgpa}` : ''}
                    {item.cgpa && item.sgpa ? ' · ' : ''}
                    {item.sgpa ? `SGPA ${item.sgpa}` : ''}
                  </p>
                ) : null}
                {item.coursework?.length ? (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-ink">Coursework</h3>
                    <p className="mt-2 text-sm text-muted">{item.coursework.join(' · ')}</p>
                  </div>
                ) : null}
                {item.projects?.length ? (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-ink">Academic projects</h3>
                    <ul className="mt-2 list-disc pl-5 text-sm text-muted">
                      {item.projects.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {item.activities?.length ? (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-ink">Activities</h3>
                    <p className="mt-2 text-sm text-muted">{item.activities.join(' · ')}</p>
                  </div>
                ) : null}
              </FadeIn>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
