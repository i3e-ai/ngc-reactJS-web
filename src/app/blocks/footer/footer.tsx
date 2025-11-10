"use client";

import Link from "next/link";
import "./footer.css"

export default function Footer(){
  return(
    <div className="footer-block">
      <div className="footer-content">

      <div className="footer-section">
        <h3>About</h3>
        <p>Company Description</p>
        <p>email: info@example.com</p>
        <p>Phone: +1 234 567 890 </p>
      </div>                                  
      <div className="nav-section">
        <h3>Quick Links</h3>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/blog">Blog</Link>
        </nav>
      </div>
    </div>
      <div className="footer-bottom">
        <p>All Rights Reserved</p>
      </div>
    </div>
  )
}
