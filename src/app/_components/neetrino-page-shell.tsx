import type { ReactNode } from 'react';
import { CanvasScaler } from './canvas-scaler';
import { CriticalRouteImagePreloader } from './critical-route-image-preloader';
import { HomeFooter } from './home-footer';
import { HomeHeader } from './home-header';
import { HomeScrollPerformance } from './home-scroll-performance';
import { HomeSmoothAnchorScroll } from './home-smooth-anchor-scroll';
import { MobileHeader } from './mobile-header';
import './mobile-footer.css';
import './mobile-header.css';

type NeetrinoPageShellProps = {
  children: ReactNode;
  mainId: string;
  srOnlyTitle: string;
  /** Scale the canvas on all viewports including mobile (shows the same layout as desktop, scaled). */
  scaleOnMobile?: boolean;
  /** Locks scaled canvas height to avoid scroll jumps when footer assets finish loading. */
  canvasHeight?: number;
};

/** Shared page chrome: header, scaled canvas, and footer used across all marketing pages. */
export function NeetrinoPageShell({
  children,
  mainId,
  srOnlyTitle,
  scaleOnMobile,
  canvasHeight,
}: NeetrinoPageShellProps): React.JSX.Element {
  return (
    <main className="home-page" id={mainId}>
      <HomeSmoothAnchorScroll />
      <CriticalRouteImagePreloader />
      <HomeScrollPerformance>
        <HomeHeader />
        <CanvasScaler
          wrapClassName="neetrino-canvas-wrap--page"
          minWidth={scaleOnMobile ? 0 : undefined}
          canvasHeight={canvasHeight}
        >
          <h1 className="sr-only">{srOnlyTitle}</h1>
          {children}
          <HomeFooter />
        </CanvasScaler>
        <MobileHeader />
      </HomeScrollPerformance>
    </main>
  );
}
