import {
  HERO_TECH_ATMOSPHERE_CYCLE_MS,
  HERO_TECH_PACKET_CYCLE_MS,
  HERO_TECH_SCAN_CYCLE_MS,
  HERO_TECH_TOKEN_CYCLE_MS,
  heroTechCircuitNodes,
  heroTechCodeTokens,
  heroTechGridLines,
  heroTechStreamColumns,
} from './home-hero-tech-atmosphere-data';

export function HomeHeroTechAtmosphere(): React.JSX.Element {
  return (
    <div
      className="hero-tech-atmosphere"
      style={
        {
          '--hero-atmosphere-cycle-ms': `${HERO_TECH_ATMOSPHERE_CYCLE_MS}ms`,
          '--hero-tech-scan-cycle-ms': `${HERO_TECH_SCAN_CYCLE_MS}ms`,
          '--hero-tech-packet-cycle-ms': `${HERO_TECH_PACKET_CYCLE_MS}ms`,
          '--hero-tech-token-cycle-ms': `${HERO_TECH_TOKEN_CYCLE_MS}ms`,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <div className="hero-tech-atmosphere-zone">
        {heroTechGridLines.map((line) => (
          <span key={line.top} className="hero-tech-grid-line" style={{ top: line.top }} />
        ))}

        {heroTechStreamColumns.map((column) => (
          <div
            key={`${column.left}-${column.width}`}
            className="hero-tech-stream-column"
            style={
              {
                left: column.left,
                width: column.width,
                animationDelay: `${column.animationDelayMs}ms`,
                '--hero-stream-opacity': column.streamOpacity,
              } as React.CSSProperties
            }
          >
            {column.packetDelaysMs.map((delayMs) => (
              <span
                key={delayMs}
                className="hero-tech-packet"
                style={{ animationDelay: `${delayMs}ms` }}
              />
            ))}
          </div>
        ))}

        {heroTechCodeTokens.map((token) => (
          <span
            key={`${token.left}-${token.top}-${token.label}`}
            className="hero-tech-code-token"
            style={{
              left: token.left,
              top: token.top,
              fontSize: token.fontSize,
              animationDelay: `${token.animationDelayMs}ms`,
            }}
          >
            {token.label}
          </span>
        ))}

        {heroTechCircuitNodes.map((node) => (
          <span
            key={`${node.left}-${node.top}`}
            className="hero-tech-circuit-node"
            style={{
              left: node.left,
              top: node.top,
              animationDelay: `${node.animationDelayMs}ms`,
            }}
          />
        ))}

        <span className="hero-tech-scanline" />
      </div>
    </div>
  );
}
