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
  { top: '12%' },
  { top: '24%' },
  { top: '36%' },
  { top: '48%' },
  { top: '60%' },
  { top: '72%' },
  { top: '84%' },
];

export const heroTechStreamColumns: readonly HeroTechStreamColumn[] = [
  {
    left: '4%',
    width: '4px',
    animationDelayMs: 0,
    streamOpacity: 0.92,
    packetDelaysMs: [0, 520, 1040],
  },
  {
    left: '9%',
    width: '6px',
    animationDelayMs: 320,
    streamOpacity: 0.78,
    packetDelaysMs: [320, 840, 1360, 1880],
  },
  {
    left: '15%',
    width: '5px',
    animationDelayMs: 680,
    streamOpacity: 0.88,
    packetDelaysMs: [680, 1200, 1720],
  },
  {
    left: '21%',
    width: '7px',
    animationDelayMs: 140,
    streamOpacity: 0.72,
    packetDelaysMs: [140, 660, 1180, 1700],
  },
  {
    left: '28%',
    width: '4px',
    animationDelayMs: 920,
    streamOpacity: 0.85,
    packetDelaysMs: [920, 1440, 1960],
  },
  {
    left: '34%',
    width: '5px',
    animationDelayMs: 540,
    streamOpacity: 0.68,
    packetDelaysMs: [540, 1060],
  },
];

export const heroTechCodeTokens: readonly HeroTechCodeToken[] = [
  { left: '6%', top: '14%', fontSize: '22px', label: 'AI', animationDelayMs: 0 },
  { left: '24%', top: '22%', fontSize: '15px', label: '{dev}', animationDelayMs: 500 },
  { left: '12%', top: '38%', fontSize: '14px', label: '0101', animationDelayMs: 900 },
  { left: '28%', top: '48%', fontSize: '16px', label: 'bot', animationDelayMs: 300 },
  { left: '8%', top: '58%', fontSize: '18px', label: '</>', animationDelayMs: 1200 },
  { left: '22%', top: '68%', fontSize: '14px', label: 'fn()', animationDelayMs: 700 },
  { left: '16%', top: '78%', fontSize: '20px', label: 'λ', animationDelayMs: 1500 },
  { left: '30%', top: '86%', fontSize: '13px', label: 'RPA', animationDelayMs: 400 },
];

export const heroTechCircuitNodes: readonly HeroTechCircuitNode[] = [
  { left: '7%', top: '26%', animationDelayMs: 0 },
  { left: '18%', top: '52%', animationDelayMs: 600 },
  { left: '30%', top: '34%', animationDelayMs: 1200 },
  { left: '13%', top: '70%', animationDelayMs: 900 },
];
