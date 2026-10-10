import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { publicNav } from '../../constants/nav.js';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { Container } from '../common/Container.jsx';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';

export function Navbar() {
  const { profile } = usePortfolio();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduced = useReducedMotion();
  const name = profile?.fullName || 'Arpit';

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <NavLink to="/" className="font-display text-lg tracking-tight text-ink">
          {name}
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {publicNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive ? 'bg-cream text-ink' : 'text-muted hover:text-ink'
                }`
              }
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-full p-2 text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            className="border-t border-line bg-paper lg:hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            aria-label="Mobile"
          >
            <div className="flex flex-col px-5 py-4">
              {publicNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-3 text-base ${
                    location.pathname === item.to ? 'bg-cream text-ink' : 'text-muted'
                  }`}
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
