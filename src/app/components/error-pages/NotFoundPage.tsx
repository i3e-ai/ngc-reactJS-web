import Link from 'next/link';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="error">
      <div className="error__container">
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for doesn&apos;t exist or has been moved.</p>
      </div>
      <nav>
        <Link href="/"> Go Home</Link>
      </nav>
    </div>
  );
}