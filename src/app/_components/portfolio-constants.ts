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

/** Portfolio pagination — same count on mobile and desktop. */
export const PORTFOLIO_ITEMS_PER_PAGE = 10;

/** Baked decor stack (body gradients + decor + footer ray) in design pixels. */
export const PORTFOLIO_DECOR_BAKE_WIDTH = 1440;
export const PORTFOLIO_DECOR_BAKE_HEIGHT = PORTFOLIO_CANVAS_HEIGHT;
export const PORTFOLIO_DECOR_BAKE_SRC = staticAsset('/portfolio/decor-stack.webp');

/** Portfolio hero title — Figma node 1:1136 (Megatrox, 646×117). */
export const PORTFOLIO_TITLE_WIDTH = 646;
export const PORTFOLIO_TITLE_HEIGHT = 117;
export const PORTFOLIO_TITLE_FONT_SIZE = 90;
export const PORTFOLIO_TITLE_COLOR = '#fffcfc';

/** Figma `Smartphone-Presentation-Mockup 1` (node 1:1326) — ANRA card background. */
export const PORTFOLIO_ANRA_MOCKUP_SRC = staticAsset('/portfolio/anra-smartphone-mockup.webp');

/** Figma `IMG_8277 1` (node 1:1327) — ANRA phone screen overlay. */
export const PORTFOLIO_ANRA_SCREEN_SRC = staticAsset('/portfolio/anra-phone-screen.webp');

/** Figma `BORBOR banner 1` (node 1:1316) — Borbor / DVBS card. */
export const PORTFOLIO_DVBS_BANNER_SRC = staticAsset('/portfolio/borbor-banner.webp');
