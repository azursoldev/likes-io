import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />
      <main style={{ padding: '40px 20px' }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          border: '1px solid #eee',
          borderRadius: '12px',
          padding: '32px',
          background: '#fff'
        }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>Page not found</h1>
          <p style={{ color: '#555', marginBottom: '20px' }}>
            The page you’re looking for doesn’t exist or may have been moved.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/" className="btn" style={{
              padding: '10px 16px',
              background: '#f97316',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              Go to Home
            </Link>
            <Link href="/contact" className="btn" style={{
              padding: '10px 16px',
              background: '#f3f4f6',
              color: '#333',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600
            }}>
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
