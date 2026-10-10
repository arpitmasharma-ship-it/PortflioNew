import { ArrowRight, Download, MapPin } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { Container, EmptyState, Skeleton } from '../components/common/Container.jsx';
import { FadeIn, Stagger } from '../components/common/Motion.jsx';
import { Seo } from '../components/common/Seo.jsx';
import { SocialRow } from '../components/common/SocialRow.jsx';
import { ProjectCard } from '../components/projects/ProjectCard.jsx';
import { skillCategoryLabels } from '../constants/nav.js';
import { initials } from '../utils/format.js';

export default function Home() {
  const { profile, projects, skills, education, experience, social, loading } = usePortfolio();
  const featured = projects.filter((p) => p.featured);
  const shown = featured.length ? featured : projects.slice(0, 3);
  const grouped = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return (
      <Container className="py-20">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="mt-6 h-24 w-full max-w-2xl" />
      </Container>
    );
  }

  return (
    <>
      <Seo path="/" />
      <section className="border-b border-line/80">
        <Container className="grid gap-12 py-16 lg:grid-cols-[1.4fr_0.8fr] lg:items-center lg:py-24">
          <FadeIn>
            {profile?.availability?.isAvailable ? (
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-sage/20 bg-[#e7eee8] px-3 py-1 text-xs font-medium text-sage-dark">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                {profile.availability.label}
              </p>
            ) : null}
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
              {profile?.professionalTitle}
            </p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
              {profile?.headline || 'Building useful things for the web.'}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">{profile?.shortIntro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/projects">
                Explore my work <ArrowRight size={16} />
              </Button>
              {profile?.resumeUrl ? (
                <Button href={profile.resumeUrl} variant="secondary" download>
                  <Download size={16} /> Download resume
                </Button>
              ) : (
                <Button to="/resume" variant="secondary">
                  Resume
                </Button>
              )}
              <Button to="/contact" variant="ghost">
                Contact
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted">
              {profile?.location ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} /> {profile.location}
                </span>
              ) : null}
              <SocialRow links={social} />
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-cream" />
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.fullName}
                  className="relative h-64 w-64 rounded-[1.75rem] object-cover sm:h-80 sm:w-80"
                />
              ) : (
                <div className="relative flex h-64 w-64 items-center justify-center rounded-[1.75rem] bg-ink text-paper sm:h-80 sm:w-80">
                  <span className="font-display text-7xl">{initials(profile?.fullName || 'A')}</span>
                </div>
              )}
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sage">Selected work</p>
              <h2 className="mt-2 font-display text-3xl text-ink">Featured projects</h2>
            </div>
            <Button to="/projects" variant="ghost">
              All work
            </Button>
          </div>
          {shown.length ? (
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </Stagger>
          ) : (
            <EmptyState title="Projects will appear here" body="Add a project from the admin panel." />
          )}
        </Container>
      </section>

      <section className="border-y border-line bg-cream/50 py-20">
        <Container>
          <h2 className="font-display text-3xl text-ink">Skills at a glance</h2>
          <p className="mt-3 max-w-2xl text-muted">
            A working toolkit rather than a scorecard. Depth lives in the projects.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-sage">
                  {skillCategoryLabels[category] || category}
                </h3>
                <p className="mt-3 text-ink">{items.map((s) => s.name).join(' · ')}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-ink">Education</h2>
            <ul className="mt-6 space-y-5">
              {education.map((item) => (
                <li key={item._id} className="rounded-2xl border border-line bg-paper p-5">
                  <p className="font-medium text-ink">{item.institution}</p>
                  <p className="text-sm text-muted">
                    {[item.degree, item.branch].filter(Boolean).join(' · ')}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {item.startYear} — {item.current ? 'Present' : item.endYear}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl text-ink">Experience</h2>
            {experience.length ? (
              <ul className="mt-6 space-y-5">
                {experience.slice(0, 3).map((item) => (
                  <li key={item._id} className="rounded-2xl border border-line bg-paper p-5">
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="text-sm text-muted">{item.company}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-muted">
                I am currently focused on coursework and personal projects. Formal internships will
                be listed here as they happen.
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
