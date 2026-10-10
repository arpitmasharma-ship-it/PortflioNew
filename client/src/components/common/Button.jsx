import { Link } from 'react-router-dom';
import { cn } from '../../utils/format.js';

const styles = {
  primary:
    'bg-ink text-paper hover:bg-sage-dark focus-visible:outline-sage',
  secondary:
    'bg-transparent text-ink border border-ink/15 hover:border-ink/40 hover:bg-cream',
  ghost: 'bg-transparent text-ink hover:bg-cream',
};

export function Button({
  as = 'button',
  to,
  href,
  variant = 'primary',
  className,
  children,
  ...props
}) {
  const cls = cn(
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200',
    styles[variant],
    className,
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }
  const Tag = as;
  return (
    <Tag className={cls} {...props}>
      {children}
    </Tag>
  );
}
