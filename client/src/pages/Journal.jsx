import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Container, EmptyState, PageHeader } from '../components/common/Container.jsx';
import { Seo } from '../components/common/Seo.jsx';
import { formatDate } from '../utils/format.js';

export default function Journal() {
  const { posts } = usePortfolio();

  return (
    <>
      <Seo title="Journal" path="/journal" />
      <Container className="py-16 sm:py-20">
        <PageHeader
          eyebrow="Journal"
          title="Notes from learning in public."
          description="Short writing on DSA, development, and the work of getting better. Optional, and only published when ready."
        />
        {posts.length === 0 ? (
          <div className="mt-12">
            <EmptyState title="No published notes yet" body="Drafts stay private until you publish them." />
          </div>
        ) : (
          <ul className="mt-12 space-y-6">
            {posts.map((post) => (
              <li key={post._id} className="border-b border-line pb-6">
                <p className="text-xs uppercase tracking-[0.14em] text-sage">
                  {post.category} · {post.readingTime} min read
                </p>
                <h2 className="mt-2 font-display text-2xl">
                  <Link to={`/journal/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-muted">{post.excerpt}</p>
                <p className="mt-2 text-xs text-muted">{formatDate(post.publishedAt, { dateStyle: 'medium' })}</p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
