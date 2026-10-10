import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from '../common/Motion.jsx';
import { staggerItem } from '../common/Motion.jsx';

export function ProjectCard({ project }) {
  return (
    <motion.article
      variants={staggerItem}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_1px_0_rgba(44,42,38,0.04)] transition hover:-translate-y-0.5 hover:border-ink/15"
    >
      <div className="aspect-[16/10] bg-cream">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-end p-6">
            <p className="font-display text-3xl text-ink/20">{project.title?.slice(0, 1)}</p>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-sage">{project.category}</p>
        <h3 className="mt-2 font-display text-2xl text-ink">
          <Link to={`/projects/${project.slug}`} className="hover:underline">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">{project.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(project.technologies || []).slice(0, 4).map((tech) => (
            <span key={tech} className="rounded-full bg-cream px-2.5 py-1 text-xs text-ink">
              {tech}
            </span>
          ))}
        </div>
        <Link
          to={`/projects/${project.slug}`}
          className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-ink"
        >
          View case study <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
}
