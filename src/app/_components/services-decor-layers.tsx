const SERVICE_BACKGROUND_DECORATIONS = [
  'svc-deco-glow-1',
  'svc-deco-glow-2',
  'svc-deco-beam-l',
  'svc-deco-beam-r',
  'svc-deco-beam-center',
  'svc-deco-arc-1',
  'svc-deco-arc-2',
  'svc-deco-grid-far',
  'svc-deco-grid-near',
] as const;

const SERVICE_RAYS = ['svc-ray--mid', 'svc-ray--end'] as const;

/** Live CSS decor layers — used only by the bake route. */
export function ServicesDecorLayers(): React.JSX.Element {
  return (
    <>
      <div className="home-page-glow svc-page-glow" />
      <div className="svc-bg">
        {SERVICE_BACKGROUND_DECORATIONS.map((name) => (
          <span key={name} className={`svc-deco ${name}`} />
        ))}
      </div>
      <div className="svc-rays">
        {SERVICE_RAYS.map((name) => (
          <span key={name} className={`svc-ray ${name}`} />
        ))}
      </div>
    </>
  );
}
