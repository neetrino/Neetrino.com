const HERO_BOTTOM_PANEL_CLIP_ID = 'home-hero-bottom-panel-clip';
const HERO_BOTTOM_PANEL_PATH =
  'M0 147.784C0 122.931 20.1472 102.784 45 102.784L786.223 102.784C802.458 102.784 817.435 94.0387 825.414 79.8991L857.586 22.885C865.565 8.74541 880.542 0 896.777 0H1395C1419.85 0 1440 20.1472 1440 45V412C1440 436.853 1419.85 457 1395 457H45C20.1472 457 0 436.853 0 412V147.784Z';

export function HomeHeroBottomPanel(): React.JSX.Element {
  return (
    <div className="home-hero-bottom-panel" aria-hidden>
      <div className="home-hero-bottom-panel-flip">
        <svg
          className="home-hero-bottom-panel-svg"
          viewBox="0 0 1440 457"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={HERO_BOTTOM_PANEL_CLIP_ID}>
              <path d={HERO_BOTTOM_PANEL_PATH} />
            </clipPath>
          </defs>

          <foreignObject
            width="1440"
            height="457"
            clipPath={`url(#${HERO_BOTTOM_PANEL_CLIP_ID})`}
          >
            <div className="home-hero-bottom-panel-glass" />
          </foreignObject>

          <path
            d={HERO_BOTTOM_PANEL_PATH}
            className="home-hero-bottom-panel-shape"
            clipPath={`url(#${HERO_BOTTOM_PANEL_CLIP_ID})`}
          />
        </svg>
      </div>
    </div>
  );
}
