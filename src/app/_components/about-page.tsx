import { AboutContent } from './about-content';
import { AboutDeferredDecor } from './about-deferred-decor';
import { AboutHero } from './about-hero';
import { NeetrinoPageShell } from './neetrino-page-shell';
import './about.css';

export function AboutPage(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="about-top" srOnlyTitle="About Neetrino" scaleOnMobile>
      <div className="home-page-center-beam" aria-hidden data-name="Rectangle 17418" />
      <div className="about-body">
        <AboutDeferredDecor />
        <AboutHero />
        <AboutContent />
      </div>
    </NeetrinoPageShell>
  );
}
