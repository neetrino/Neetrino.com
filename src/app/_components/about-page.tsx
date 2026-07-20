import { AboutContent } from './about-content';
import { AboutDeferredDecor } from './about-deferred-decor';
import { AboutHero } from './about-hero';
import { AboutMobile } from './about-mobile';
import { aboutMessages } from './about-messages';
import { NeetrinoPageShell } from './neetrino-page-shell';
import './about.css';

export function AboutPage(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="about-top" srOnlyTitle={aboutMessages.hero.srOnlyTitle}>
      <div className="about-desktop">
        <div className="about-body">
          <AboutDeferredDecor />
          <AboutHero />
          <AboutContent />
        </div>
      </div>

      <div className="about-mobile-wrap">
        <AboutMobile />
      </div>
    </NeetrinoPageShell>
  );
}
