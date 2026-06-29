import { staticAsset } from '@/lib/static-asset';

/** Fixed desktop portfolio body height in design pixels (Figma). */
export const PORTFOLIO_BODY_HEIGHT = 2226;

/** Portfolio body + footer — stabilizes CanvasScaler height during scroll. */
export const PORTFOLIO_CANVAS_HEIGHT = 2737;

/** Portfolio card media box in design pixels (Figma). */
export const PORTFOLIO_CARD_MEDIA_WIDTH = 631;
export const PORTFOLIO_CARD_MEDIA_HEIGHT = 364;

/** Above-the-fold cards — eager load avoids decode jank while scrolling. */
export const PORTFOLIO_LCP_CARD_COUNT = 4;

/** Baked decor stack (body gradients + decor + footer ray) in design pixels. */
export const PORTFOLIO_DECOR_BAKE_WIDTH = 1440;
export const PORTFOLIO_DECOR_BAKE_HEIGHT = PORTFOLIO_CANVAS_HEIGHT;
export const PORTFOLIO_DECOR_BAKE_SRC = staticAsset('/portfolio/decor-stack.webp');

/** Glitch title image — transparent webp, same treatment as /services `services-title.webp`. */
export const PORTFOLIO_TITLE_SRC = staticAsset('/portfolio/portfolio-title.webp');
export const PORTFOLIO_TITLE_WIDTH = 597;
export const PORTFOLIO_TITLE_HEIGHT = 64;
