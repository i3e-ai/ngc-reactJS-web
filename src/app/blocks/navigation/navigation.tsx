"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './navigation.css';
import { navigationData } from '@/app/data/navigationData'

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
      className={`nav ${isOpen ? 'nav--open' : ''}`}
      ref={navRef}
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className="nav__menu">
        {menuItems.map(([key, content], index) => (
          <li
            key={key}
            className={`nav__item ${!content.links ? 'nav__item--no-dropdown' : ''}`}
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
              <div className="nav__dropdown">
                <section className="nav__dropdown-container">
                  <nav className="nav__dropdown-menu">
                    {content.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.href}
                        onClick={onLinkClick}
                        className={focusedIndex === index && focusedDropdownIndex === linkIndex ? 'nav__dropdown-link--focused' : ''}
                        tabIndex={isOpen && focusedIndex === index ? 0 : -1}
                      >
                        {link.text}
                      </Link>
                    ))}
                  </nav>

                  {content.featured && (
                    <section className="nav__dropdown-image">
                      <Image
                        src={content.featured.image}
                        alt={content.featured.title}
                        className="nav__dropdown-img"
                        width={700}
                        height={560}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAAAAAAAAAAAAAAAAAAAACv/EAB8QAAEEAQUBAAAAAAAAAAAAAAABAgMRBAUSITFBUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="nav__dropdown-overlay">
                        <h2 className="nav__dropdown-title">{content.featured.title}</h2>
                        <p className="nav__dropdown-subtitle">{content.featured.subtitle}</p>
                        <Link
                          href={content.featured.buttonLink}
                          className="nav__dropdown-button"
                          onClick={onLinkClick}
                          tabIndex={isOpen ? 0 : -1}
                        >
                          {content.featured.buttonText}
                        </Link>
                      </div>
                    </section>
                  )}
                </section>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}