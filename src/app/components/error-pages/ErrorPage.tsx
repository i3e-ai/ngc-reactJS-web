import './ErrorPage.css';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="error-page">
      <div className="error-page__component">
        <h1>Something went wrong!</h1>
        <p>We encountered an unexpected error. Our team has been notified.</p>
      </div>
      <nav className="error-page__redirect">
        <button onClick={reset}> Try Again</button>
        <button onClick={() => window.location.href = '/'}>Go Home</button>
      </nav>
    </div>
  );
}