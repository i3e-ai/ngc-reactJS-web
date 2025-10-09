"use client";

import { useEffect, useState, useRef } from "react"
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

  useEffect(() => {
    const setupNavigation = () => {
      const navigationMenu = document.querySelector('.nav-menu');
      if (navigationMenu) {
        const navLinks = document.querySelectorAll('a');
        navLinks.forEach((link) => {
          link.addEventListener('click', () => {
            setIsOpen(false);
            document.body.classList.remove('no-scroll')
          });
        });
      } else {
        setTimeout(setupNavigation, 100);
      }
    };
    setupNavigation();

    return () => {
      document.body.classList.remove('no-scroll');
    }
  }, [])

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
    <div ref={headerRef} className="header-wrapper">
      <div className="header block">
        <div className="header-content">
          <div className="nav-hamburger" onClick={toggleMenu}>
            <button className="hamburger-button"><b>☰</b></button>
          </div>
          <div className="title-block">
            <div className="title">
              <h1><b>EDS App</b></h1>
            </div>
            <Image src="/vercel.svg" alt="logo" width={100} height={24} />
          </div>
          <Navigation isOpen={isOpen} />
        </div>
      </div>
    </div>
  );
}