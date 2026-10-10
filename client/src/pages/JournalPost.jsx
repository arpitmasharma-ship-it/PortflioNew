import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { Button } from '../components/common/Button.jsx';
import { Container, Skeleton } from '../components/common/Container.jsx';
import { Seo } from '../components/common/Seo.jsx';
import { formatDate } from '../utils/format.js';

export default function JournalPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    api
      .get(`/blog/${slug}`)
      .then((res) => !ignore && setPost(res.data.data))
      .catch(() => !ignore && setError('This note is not published or does not exist.'))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <Container className="py-20">
        <Skeleton className="h-12 w-2/3" />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container className="py-20">
        <p className="text-muted">{error}</p>
        <Button to="/journal" variant="secondary" className="mt-6">
          Back to journal
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Seo title={post.title} path={`/journal/${post.slug}`} description={post.excerpt} />
      <Container className="py-16 sm:py-20">
        <Link to="/journal" className="text-sm text-muted hover:text-ink">
          ← Journal
        </Link>
        <p className="mt-8 text-xs uppercase tracking-[0.16em] text-sage">
          {post.category} · {post.readingTime} min · {formatDate(post.publishedAt, { dateStyle: 'medium' })}
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{post.title}</h1>
        <article className="mt-8 max-w-2xl whitespace-pre-line text-base leading-8 text-muted">
          {post.content}
        </article>
      </Container>
    </>
  );
}
