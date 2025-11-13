"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './navigation.css';
import { navigationData } from '@/app/data/navigationData'

interface DropdownContent {
  mainHref: string;
  links?: { text: string; href: string }[];
  featured?: {
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
}

interface NavigationProps {
  isOpen: boolean;
  onLinkClick: () => void;
}

export default function Navigation({ isOpen, onLinkClick }: NavigationProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [focusedDropdownIndex, setFocusedDropdownIndex] = useState(-1);
  const navRef = useRef<HTMLElement | null>(null);
  const menuItems = Object.entries(navigationData);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % menuItems.length);
          setFocusedDropdownIndex(-1);
          break;

        case 'ArrowLeft':
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
          setFocusedDropdownIndex(-1);
          break;

        case 'ArrowDown':
          e.preventDefault();
          const currentItem = menuItems[focusedIndex][1];
          if (currentItem.links && currentItem.links.length > 0) {
            setFocusedDropdownIndex(0);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          setFocusedDropdownIndex(-1);
          break;

        case 'Enter':
          e.preventDefault();
          const link = navRef.current?.querySelector(
            `[data-focused="true"] a`
          ) as HTMLAnchorElement;
          link?.click();
          break;

        case 'Escape':
          e.preventDefault();
          onLinkClick(); // Close menu
          break;

        case 'Tab':
          // Allow tab navigation to work naturally
          setFocusedDropdownIndex(-1);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, focusedDropdownIndex, menuItems, onLinkClick]);

  return (
    <nav
      className={`nav-sections ${isOpen ? 'is-open' : ''}`}
      ref={navRef}
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className="nav-menu">
        {menuItems.map(([key, content], index) => (
          <li
            key={key}
            className={`has-dropdown ${!content.links ? 'no-dropdown' : ''}`}
            data-focused={focusedIndex === index && focusedDropdownIndex === -1}
          >
            <Link
              href={content.mainHref}
              onClick={onLinkClick}
              tabIndex={isOpen ? 0 : -1}
            >
              {key}
            </Link>

            {content.links && (
              <div className="dropdown-content">
                <div className="dropdown-container">
                  <div className="dropdown-nav">
                    {content.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.href}
                        onClick={onLinkClick}
                        className={focusedIndex === index && focusedDropdownIndex === linkIndex ? 'focused' : ''}
                        tabIndex={isOpen && focusedIndex === index ? 0 : -1}
                      >
                        {link.text}
                      </Link>
                    ))}
                  </div>

                  {content.featured && (
                    <div className="dropdown-image">
                      <Image
                        src={content.featured.image}
                        alt={content.featured.title}
                        className="dropdown-featured-img"
                        width={700}
                        height={560}
                      />
                      <div className="image-overlay">
                        <h2 className="overlay-title">{content.featured.title}</h2>
                        <p className="overlay-subtitle">{content.featured.subtitle}</p>
                        <Link
                          href={content.featured.buttonLink}
                          className="overlay-button"
                          onClick={onLinkClick}
                          tabIndex={isOpen ? 0 : -1}
                        >
                          {content.featured.buttonText}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}