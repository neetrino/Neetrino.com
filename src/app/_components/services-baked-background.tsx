import Image from 'next/image';

import {
  SERVICES_DECOR_BAKE_HEIGHT,
  SERVICES_DECOR_BAKE_SRC,
  SERVICES_DECOR_BAKE_WIDTH,
} from './services-constants';

/** Pre-composited services background — same pixels, no runtime blend modes. */
export function ServicesBakedBackground(): React.JSX.Element {
  return (
    <div className="svc-baked-bg" aria-hidden>
      <Image
        src={SERVICES_DECOR_BAKE_SRC}
        alt=""
        width={SERVICES_DECOR_BAKE_WIDTH}
        height={SERVICES_DECOR_BAKE_HEIGHT}
        priority
        sizes={`${SERVICES_DECOR_BAKE_WIDTH}px`}
        className="svc-baked-bg-image"
      />
    </div>
  );
}
