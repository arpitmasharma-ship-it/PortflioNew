import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { Button } from '../components/common/Button.jsx';
import { Container, Skeleton } from '../components/common/Container.jsx';
import { Seo } from '../components/common/Seo.jsx';
import { formatDate } from '../utils/format.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api
      .get(`/projects/${slug}`)
      .then((res) => {
        if (!ignore) setProject(res.data.data);
      })
      .catch(() => {
        if (!ignore) setError('This project could not be found.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <Container className="py-20">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-6 h-40 w-full" />
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container className="py-20">
        <p className="text-muted">{error || 'Not found'}</p>
        <Button to="/projects" className="mt-6" variant="secondary">
          Back to work
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Seo title={project.title} path={`/projects/${project.slug}`} description={project.shortDescription} />
      <Container className="py-16 sm:py-20">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
          <ArrowLeft size={16} /> All work
        </Link>
        <p className="mt-8 text-xs uppercase tracking-[0.18em] text-sage">
          {project.category} · {project.status?.replace('-', ' ')}
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{project.title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{project.shortDescription}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {project.githubUrl ? (
            <Button href={project.githubUrl} target="_blank" rel="noreferrer noopener" variant="secondary">
              <Github size={16} /> Repository
            </Button>
          ) : null}
          {project.liveUrl ? (
            <Button href={project.liveUrl} target="_blank" rel="noreferrer noopener">
              <ExternalLink size={16} /> Live demo
            </Button>
          ) : null}
        </div>
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt=""
            className="mt-10 w-full rounded-2xl border border-line object-cover"
          />
        ) : null}
        <article className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-8 text-base leading-8 text-muted">
            {project.overview ? (
              <section>
                <h2 className="font-display text-2xl text-ink">Overview</h2>
                <p className="mt-3 whitespace-pre-line">{project.overview}</p>
              </section>
            ) : null}
            {project.features?.length ? (
              <section>
                <h2 className="font-display text-2xl text-ink">Key features</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  {project.features.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            {project.challenges ? (
              <section>
                <h2 className="font-display text-2xl text-ink">Challenges</h2>
                <p className="mt-3 whitespace-pre-line">{project.challenges}</p>
              </section>
            ) : null}
            {project.solutions ? (
              <section>
                <h2 className="font-display text-2xl text-ink">What I did about them</h2>
                <p className="mt-3 whitespace-pre-line">{project.solutions}</p>
              </section>
            ) : null}
          </div>
          <aside className="h-fit rounded-2xl border border-line bg-cream/60 p-6 text-sm">
            {project.role ? (
              <p>
                <span className="text-muted">Role</span>
                <br />
                <span className="text-ink">{project.role}</span>
              </p>
            ) : null}
            {project.contribution ? (
              <p className="mt-4">
                <span className="text-muted">Contribution</span>
                <br />
                <span className="text-ink">{project.contribution}</span>
              </p>
            ) : null}
            {project.createdDate ? (
              <p className="mt-4">
                <span className="text-muted">Date</span>
                <br />
                <span className="text-ink">{formatDate(project.createdDate)}</span>
              </p>
            ) : null}
            {project.technologies?.length ? (
              <div className="mt-4">
                <p className="text-muted">Stack</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="rounded-full bg-paper px-2.5 py-1 text-ink">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </article>
        {project.images?.length ? (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {project.images.map((src) => (
              <img key={src} src={src} alt="" className="rounded-2xl border border-line" loading="lazy" />
            ))}
          </div>
        ) : null}
      </Container>
    </>
  );
}
