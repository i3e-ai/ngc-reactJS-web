import React from 'react';
import './press-release.css'
// 1. Define the TypeScript type for a single press release
interface PressReleaseItem {
  titleHTML: string;
  infoHTML: string;
  linkURL?: string; // Link is optional
}

// 2. Hardcode the data directly in the file
const pressReleasesData: PressReleaseItem[] = [
  {
    titleHTML: '<h3>Q3 2025 Financial Results Announced</h3>',
    infoHTML: '<p>Published on: October 12, 2025</p>',
    linkURL: '/downloads/q3-2025-report.pdf',
  },
  {
    titleHTML: '<h3>New Flagship Product "Innovate X" Launched</h3>',
    infoHTML: '<p>Published on: September 28, 2025</p>',
    linkURL: '/downloads/innovate-x-press-kit.zip',
  },
  {
    titleHTML: '<h3>Strategic Partnership with FutureTech Inc.</h3>',
    infoHTML: '<p>Published on: August 15, 2025</p>',
    linkURL: '/downloads/innovate-x-press-kit.zip',
  },
  {
    titleHTML: '<h3>Company Expands Operations to Europe</h3>',
    infoHTML: '<p>Published on: July 05, 2025</p>',
    linkURL: '/downloads/european-expansion-details.pdf',
  },
];

// 3. Create the React component
const PressReleasePage: React.FC = () => {
  return (
    <section className="press-release">
      {pressReleasesData.map((release, index) => (
        <div key={index} className="press-release__item">
          <div
            className="press-release__title"
            dangerouslySetInnerHTML={{ __html: release.titleHTML }}
          />
          <div
            className="press-release__info"
            dangerouslySetInnerHTML={{ __html: release.infoHTML }}
          />
          <nav>
            {release.linkURL && (
              <a href={release.linkURL} className="press-release__button" download>
                Download
              </a>
            )}
          </nav>
        </div>
      ))}
    </section>
  );
};

export default PressReleasePage;