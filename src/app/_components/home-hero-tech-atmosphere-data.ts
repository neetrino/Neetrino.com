export type HeroTechGridLine = {
  top: string;
};

export type HeroTechStreamColumn = {
  left: string;
  width: string;
  animationDelayMs: number;
  streamOpacity: number;
  packetDelaysMs: readonly number[];
};

export type HeroTechCodeToken = {
  left: string;
  top: string;
  fontSize: string;
  label: string;
  animationDelayMs: number;
};

export type HeroTechCircuitNode = {
  left: string;
  top: string;
  animationDelayMs: number;
};

export const HERO_TECH_ATMOSPHERE_CYCLE_MS = 2800;
export const HERO_TECH_SCAN_CYCLE_MS = 4200;
export const HERO_TECH_PACKET_CYCLE_MS = 2200;
export const HERO_TECH_TOKEN_CYCLE_MS = 3600;

export const heroTechGridLines: readonly HeroTechGridLine[] = [
  { top: '18%' },
  { top: '42%' },
  { top: '66%' },
  { top: '86%' },
];

export const heroTechStreamColumns: readonly HeroTechStreamColumn[] = [
  {
    left: '6%',
    width: '4px',
    animationDelayMs: 0,
    streamOpacity: 0.88,
    packetDelaysMs: [0, 760],
  },
  {
    left: '16%',
    width: '5px',
    animationDelayMs: 280,
    streamOpacity: 0.76,
    packetDelaysMs: [280, 1040],
  },
  {
    left: '26%',
    width: '4px',
    animationDelayMs: 560,
    streamOpacity: 0.82,
    packetDelaysMs: [560, 1320],
  },
  {
    left: '34%',
    width: '5px',
    animationDelayMs: 140,
    streamOpacity: 0.7,
    packetDelaysMs: [140, 900],
  },
];

export const heroTechCodeTokens: readonly HeroTechCodeToken[] = [
  { left: '8%', top: '16%', fontSize: '22px', label: 'AI', animationDelayMs: 0 },
  { left: '22%', top: '34%', fontSize: '15px', label: '{dev}', animationDelayMs: 500 },
  { left: '12%', top: '56%', fontSize: '18px', label: '</>', animationDelayMs: 900 },
  { left: '28%', top: '78%', fontSize: '16px', label: 'bot', animationDelayMs: 300 },
];

export const heroTechCircuitNodes: readonly HeroTechCircuitNode[] = [
  { left: '10%', top: '28%', animationDelayMs: 0 },
  { left: '24%', top: '62%', animationDelayMs: 800 },
];
