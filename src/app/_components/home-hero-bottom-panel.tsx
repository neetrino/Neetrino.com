const HERO_BOTTOM_PANEL_PATH =
  'M1440 147.784C1440 122.931 1419.85 102.784 1395 102.784L653.777 102.784C637.542 102.784 622.565 94.0387 614.586 79.8991L582.414 22.885C574.435 8.74541 559.458 0 543.223 0H45C20.1472 0 0 20.1472 0 45V412C0 436.853 20.1472 457 45 457H1395C1419.85 457 1440 436.853 1440 412V147.784Z';

const HERO_BOTTOM_PANEL_CLIP_ID = 'home-hero-bottom-panel-clip';

export function HomeHeroBottomPanel(): React.JSX.Element {
  return (
    <div className="home-hero-bottom-panel" aria-hidden>
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
  );
}
