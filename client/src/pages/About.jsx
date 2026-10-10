import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Container, PageHeader } from '../components/common/Container.jsx';
import { FadeIn } from '../components/common/Motion.jsx';
import { Seo } from '../components/common/Seo.jsx';

function Block({ title, body }) {
  if (!body) return null;
  return (
    <FadeIn className="border-t border-line py-10">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-8 text-muted whitespace-pre-line">{body}</div>
    </FadeIn>
  );
}

export default function About() {
  const { profile, education } = usePortfolio();

  return (
    <>
      <Seo title="About" path="/about" description={profile?.about?.slice(0, 160)} />
      <Container className="py-16 sm:py-20">
        <PageHeader
          eyebrow="About"
          title={`Hello, I am ${profile?.fullName || 'here'}.`}
          description={profile?.shortIntro}
        />
        <div className="mt-12 max-w-3xl">
          <Block title="The path so far" body={profile?.about} />
          <Block title="What I care about" body={profile?.interests} />
          <Block title="How I learn and build" body={profile?.approach} />
          <Block title="Where I am headed" body={profile?.careerGoals} />
        </div>
        {education.length ? (
          <div className="mt-6 max-w-3xl">
            <h2 className="font-display text-2xl text-ink">Education</h2>
            <ol className="relative mt-8 border-l border-line pl-6">
              {education.map((item) => (
                <li key={item._id} className="mb-8">
                  <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-sage" />
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">
                    {item.startYear} — {item.current ? 'Expected ' : ''}
                    {item.endYear}
                  </p>
                  <p className="mt-1 font-medium text-ink">{item.institution}</p>
                  <p className="text-sm text-muted">
                    {[item.degree, item.branch].filter(Boolean).join(' · ')}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </Container>
    </>
  );
}
