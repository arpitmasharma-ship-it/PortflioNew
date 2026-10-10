import { cn } from '../../utils/format.js';

export function Container({ className, children }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>{children}</div>;
}

export function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sage">{eyebrow}</p>
      ) : null}
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
      {description ? <p className="mt-5 text-base leading-7 text-muted sm:text-lg">{description}</p> : null}
    </header>
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-cream/50 px-6 py-12 text-center">
      <p className="font-display text-xl text-ink">{title}</p>
      {body ? <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{body}</p> : null}
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-xl bg-sand/70', className)} />;
}
