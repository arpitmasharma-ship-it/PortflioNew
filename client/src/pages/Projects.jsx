import { useMemo, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Container, EmptyState, PageHeader } from '../components/common/Container.jsx';
import { Stagger } from '../components/common/Motion.jsx';
import { Seo } from '../components/common/Seo.jsx';
import { ProjectCard } from '../components/projects/ProjectCard.jsx';

export default function Projects() {
  const { projects } = usePortfolio();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const categories = useMemo(
    () => ['all', ...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects],
  );

  const filtered = projects.filter((project) => {
    const matchesCategory = category === 'all' || project.category === category;
    const hay = `${project.title} ${project.shortDescription} ${(project.tags || []).join(' ')} ${(project.technologies || []).join(' ')}`.toLowerCase();
    return matchesCategory && hay.includes(query.toLowerCase());
  });

  const featured = filtered.filter((p) => p.featured);

  return (
    <>
      <Seo title="Work" path="/projects" />
      <Container className="py-16 sm:py-20">
        <PageHeader
          eyebrow="Work"
          title="Things I have built."
          description="A mix of learning projects and more complete applications. Each page is a short case study, not a marketing sheet."
        />
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-3 py-1.5 text-sm capitalize ${
                  category === item ? 'bg-ink text-paper' : 'bg-cream text-ink'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="project-search">
            Search projects
          </label>
          <input
            id="project-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, tag, or stack"
            className="w-full rounded-full border border-line bg-paper px-4 py-2.5 text-sm sm:max-w-xs"
          />
        </div>

        {featured.length ? (
          <div className="mt-12">
            <h2 className="font-display text-2xl text-ink">Featured</h2>
            <Stagger className="mt-5 grid gap-6 md:grid-cols-2">
              {featured.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </Stagger>
          </div>
        ) : null}

        <div className="mt-14">
          <h2 className="font-display text-2xl text-ink">All projects</h2>
          {filtered.length ? (
            <Stagger className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard key={`all-${project._id}`} project={project} />
              ))}
            </Stagger>
          ) : (
            <div className="mt-6">
              <EmptyState title="No matching projects" body="Try another filter or search term." />
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
