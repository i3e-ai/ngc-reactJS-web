"use client";

import React, { useEffect, useState, useRef } from "react"
import Image from 'next/image'
import './header.css';
import Navigation from '../navigation/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null); // Added proper typing

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

  }

  const handleLinkClick = () => {
    setIsOpen(false);
    document.body.classList.remove('no-scroll');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        document.body.classList.remove('no-scroll');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        document.body.classList.remove('no-scroll');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Update nav-menu active class
  useEffect(() => {
    const navigationMenu = document.querySelector('.nav-menu');
    if (navigationMenu) {
      if (isOpen) {
        navigationMenu.classList.add('active');
      } else {
        navigationMenu.classList.remove('active');
      }
    }
  }, [isOpen]);

  return (
    <header ref={headerRef} className="header">
      <div className="header__wrapper">
        <div className="header__content">
          <div className="header__hamburger" onClick={toggleMenu}>
            <button className="header__hamburger-button" type="button" aria-label="Toggle navigation menu" aria-expanded={isOpen}>☰</button>
          </div>
          <div className="header__brand">
            <Image
              src="/assets/logo.png"
              alt="EDS App Logo"
              width={64}
              height={56}
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7"
            />
            <div className="header__title">
              <h1>EDS App</h1>
            </div>
          </div>
        </div>
        <div className={`header__navigation ${isOpen ? 'is-open' : ''}`}>
          <Navigation isOpen={isOpen} onLinkClick={handleLinkClick} />
        </div>
      </div>
    </header>
  );
}