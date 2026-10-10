import { Download, ExternalLink, Printer } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { Container, EmptyState, PageHeader } from '../components/common/Container.jsx';
import { Seo } from '../components/common/Seo.jsx';

export default function Resume() {
  const { profile, skills, education, projects, experience } = usePortfolio();
  const url = profile?.resumeUrl;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Seo title="Resume" path="/resume" />
      <Container className="py-16 sm:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between print:hidden">
          <PageHeader
            eyebrow="Resume"
            title="A concise snapshot."
            description="The downloadable file is managed from the admin panel so the link stays in one place."
          />
          <div className="flex flex-wrap gap-3">
            {url ? (
              <>
                <Button href={url} download>
                  <Download size={16} /> Download PDF
                </Button>
                <Button href={url} target="_blank" rel="noreferrer noopener" variant="secondary">
                  <ExternalLink size={16} /> Open PDF
                </Button>
              </>
            ) : null}
            <Button onClick={handlePrint} variant="ghost">
              <Printer size={16} /> Print
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Experience */}
          <section className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Experience & Internships</h2>
            {experience.length ? (
              <div className="mt-5 space-y-6">
                {experience.map((item) => (
                  <div key={item._id} className="border-b border-line/60 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-ink">{item.title}</h3>
                      <span className="text-xs uppercase tracking-wider text-sage">
                        {item.employmentType}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted">
                      {item.company} {item.location ? `· ${item.location}` : ''}
                    </p>
                    {item.responsibilities?.length ? (
                      <ul className="mt-2.5 list-disc pl-4 text-xs leading-5 text-muted">
                        {item.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">No professional roles listed yet.</p>
            )}
          </section>

          {/* Education */}
          <section className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Education</h2>
            {education.length ? (
              <div className="mt-5 space-y-6">
                {education.map((item) => (
                  <div key={item._id} className="border-b border-line/60 pb-4 last:border-0 last:pb-0">
                    <p className="text-xs uppercase tracking-wider text-sage">
                      {item.startYear} — {item.current ? 'Expected ' : ''}
                      {item.endYear}
                    </p>
                    <h3 className="mt-1 font-semibold text-ink">{item.institution}</h3>
                    <p className="text-sm text-muted">
                      {[item.degree, item.branch].filter(Boolean).join(' · ')}
                    </p>
                    {item.coursework?.length ? (
                      <p className="mt-2 text-xs text-muted">
                        <span className="font-medium text-ink">Coursework: </span>
                        {item.coursework.join(', ')}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Add education in admin" />
            )}
          </section>

          {/* Key Projects */}
          <section className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Selected Projects</h2>
            <div className="mt-5 space-y-4">
              {projects.slice(0, 5).map((p) => (
                <div key={p._id} className="border-b border-line/60 pb-3 last:border-0 last:pb-0">
                  <h3 className="font-medium text-ink">{p.title}</h3>
                  <p className="mt-1 text-xs text-muted">{p.shortDescription}</p>
                  {p.technologies?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.technologies.slice(0, 4).map((tech) => (
                        <span key={tech} className="rounded bg-cream px-2 py-0.5 text-[11px] text-ink">
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          {/* Technical Skills */}
          <section className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">Technical Skills</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s._id}
                  className="rounded-full border border-line bg-cream/70 px-3 py-1 text-xs font-medium text-ink"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
