import { useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';

export function Seo({ title, description, path = '/' }) {
  const { profile } = usePortfolio();
  const site = profile?.seo?.siteTitle || profile?.fullName || import.meta.env.VITE_SITE_NAME || 'Portfolio';
  const desc = description || profile?.seo?.description || profile?.shortIntro || '';
  const fullTitle = title ? `${title} — ${site}` : site;
  const origin = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const url = `${origin}${path}`;
  const image = profile?.seo?.ogImage || profile?.profileImage || `${origin}/favicon.svg`;

  useEffect(() => {
    document.title = fullTitle;
    setMeta('description', desc);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:image', image, 'property');
    setMeta('twitter:card', 'summary_large_image');
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [fullTitle, desc, url, image]);

  return null;
}

function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let node = document.querySelector(`meta[${attr}="${name}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attr, name);
    document.head.appendChild(node);
  }
  node.setAttribute('content', content);
}
