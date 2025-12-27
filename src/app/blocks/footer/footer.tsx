"use client";

import Link from "next/link";
import "./footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h3>About</h3>
          <p>Company Description</p>
          <p>email: info@example.com</p>
          <p>Phone: +1 234 567 890 </p>
        </div>
        <div className="footer__section footer__section--nav">
          <h3>Quick Links</h3>
          <nav className="footer__nav">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/blog">Blog</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
