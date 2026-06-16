import Image from 'next/image';
import { navItems } from './home-data';

export function HomeHeader(): React.JSX.Element {
  return (
    <header className="home-header">
      <div className="home-header-inner">
        <a href="#home" className="home-header-logo">
          <Image
            src="/figma-home/neetrino-logo.svg"
            alt="Neetrino"
            width={130}
            height={37}
            priority
          />
        </a>
        <nav className="home-header-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
        <a href="#contact" className="home-header-quote">
          Get a Quote
        </a>
        <button type="button" className="home-header-language" aria-label="Change language">
          <span className="home-header-language-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </span>
          ENG
        </button>
      </div>
    </header>
  );
}
