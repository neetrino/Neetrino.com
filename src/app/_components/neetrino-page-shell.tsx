import type { ReactNode } from 'react';
import { CanvasScaler } from './canvas-scaler';
import { HomeFooter } from './home-footer';
import { HomeHeader } from './home-header';
import { HomeScrollPerformance } from './home-scroll-performance';
import { HomeSmoothAnchorScroll } from './home-smooth-anchor-scroll';

type NeetrinoPageShellProps = {
  children: ReactNode;
  mainId: string;
  srOnlyTitle: string;
};

/** Shared page chrome: header, scaled canvas, and footer used across all marketing pages. */
export function NeetrinoPageShell({
  children,
  mainId,
  srOnlyTitle,
}: NeetrinoPageShellProps): React.JSX.Element {
  return (
    <main className="home-page" id={mainId}>
      <HomeSmoothAnchorScroll />
      <HomeScrollPerformance>
        <HomeHeader />
        <CanvasScaler wrapClassName="neetrino-canvas-wrap--page">
          <h1 className="sr-only">{srOnlyTitle}</h1>
          {children}
          <HomeFooter />
        </CanvasScaler>
      </HomeScrollPerformance>
    </main>
  );
}
