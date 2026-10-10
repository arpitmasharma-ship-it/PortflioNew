import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Container, EmptyState, PageHeader } from '../components/common/Container.jsx';
import { FadeIn } from '../components/common/Motion.jsx';
import { Seo } from '../components/common/Seo.jsx';
import { formatDate } from '../utils/format.js';

export default function Experience() {
  const { experience } = usePortfolio();

  return (
    <>
      <Seo title="Experience" path="/experience" />
      <Container className="py-16 sm:py-20">
        <PageHeader
          eyebrow="Experience"
          title="Where I have worked."
          description="Internships, roles, and other professional work. Nothing here is invented."
        />
        {experience.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title="No internships listed yet"
              body="I am currently building through coursework, personal projects, and consistent practice. When I join a team, the details will live on this page."
            />
          </div>
        ) : (
          <ol className="relative mt-14 max-w-3xl border-l border-line pl-8">
            {experience.map((item) => (
              <FadeIn key={item._id} className="mb-12">
                <span className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full bg-sage" />
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  {formatDate(item.startDate)} — {item.current ? 'Present' : formatDate(item.endDate)}
                  {item.remote ? ' · Remote' : item.location ? ` · ${item.location}` : ''}
                </p>
                <h2 className="mt-1 font-display text-2xl text-ink">{item.title}</h2>
                <p className="text-muted">
                  {item.company} · {item.employmentType}
                </p>
                {item.responsibilities?.length ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
                    {item.responsibilities.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : null}
                {item.technologies?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="rounded-full bg-cream px-2.5 py-1 text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}
                {item.certificateUrl ? (
                  <a
                    className="mt-3 inline-block text-sm text-sage-dark underline"
                    href={item.certificateUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Certificate
                  </a>
                ) : null}
              </FadeIn>
            ))}
          </ol>
        )}
      </Container>
    </>
  );
}
