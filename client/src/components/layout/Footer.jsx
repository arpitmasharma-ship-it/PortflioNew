import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { Container } from '../common/Container.jsx';
import { SocialRow } from '../common/SocialRow.jsx';

export function Footer() {
  const { profile, social } = usePortfolio();
  const year = new Date().getFullYear();
  const name = profile?.fullName || 'Arpit';

  return (
    <footer className="mt-20 border-t border-line bg-cream/60">
      <Container className="flex flex-col gap-8 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl text-ink">{name}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            {profile?.professionalTitle || 'Software Engineer'}. Built with care, not a template.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 sm:items-end">
          <SocialRow links={social} />
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <Link to="/resume" className="hover:text-ink">
              Resume
            </Link>
            <Link to="/contact" className="hover:text-ink">
              Contact
            </Link>
            <Link to="/connect" className="hover:text-ink">
              Profiles
            </Link>
          </div>
          <p className="text-xs text-muted">© {year} {name}</p>
        </div>
      </Container>
    </footer>
  );
}
