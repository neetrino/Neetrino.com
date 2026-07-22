import { staticAsset } from '@/lib/static-asset';

/** Minimum desktop portfolio body height in design pixels (Figma baseline). */
export const PORTFOLIO_BODY_MIN_HEIGHT = 2226;

/** @deprecated Use PORTFOLIO_BODY_MIN_HEIGHT — body height is content-driven. */
export const PORTFOLIO_BODY_HEIGHT = PORTFOLIO_BODY_MIN_HEIGHT;

/**
 * Approximate canvas lock for scaler (body + footer chrome).
 * Kept as a floor; CanvasScaler may measure taller content when unlocked.
 */
export const PORTFOLIO_CANVAS_HEIGHT = 3100;

/** Portfolio card media box in design pixels (Figma). */
export const PORTFOLIO_CARD_MEDIA_WIDTH = 631;
export const PORTFOLIO_CARD_MEDIA_HEIGHT = 364;

/** Above-the-fold cards — eager load avoids decode jank while scrolling. */
export const PORTFOLIO_LCP_CARD_COUNT = 4;

/** Portfolio infinite scroll — initial batch, then load-more increments. */
export const PORTFOLIO_INITIAL_VISIBLE = 12;
export const PORTFOLIO_LOAD_MORE_COUNT = 6;

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
