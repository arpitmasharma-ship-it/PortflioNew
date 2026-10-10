import { Button } from '../components/common/Button.jsx';
import { Container } from '../components/common/Container.jsx';
import { Seo } from '../components/common/Seo.jsx';

export default function NotFound() {
  return (
    <>
      <Seo title="Not found" path="/404" />
      <Container className="py-28 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-sage">404</p>
        <h1 className="mt-4 font-display text-5xl text-ink">This page wandered off.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The link might be old, or the page was never here. The rest of the site is still warm.
        </p>
        <Button to="/" className="mt-8">
          Return home
        </Button>
      </Container>
    </>
  );
}
