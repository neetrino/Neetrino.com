import { partnerLogos as staticPartnerLogos } from '@/app/_components/home-data';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export type PublicPartnerLogo = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

const DEFAULT_LOGO_WIDTH = 140;
const DEFAULT_LOGO_HEIGHT = 72;

export async function getPublicPartnerLogos(): Promise<readonly PublicPartnerLogo[]> {
  try {
    const partners = await prisma.partner.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { sortOrder: 'asc' },
      select: {
        name: true,
        alt: true,
        url: true,
      },
    });

    if (partners.length === 0) {
      return staticPartnerLogos;
    }

    return partners.map((partner) => ({
      src: partner.url,
      width: DEFAULT_LOGO_WIDTH,
      height: DEFAULT_LOGO_HEIGHT,
      alt: partner.alt || partner.name,
    }));
  } catch (error) {
    logger.error('Failed to load public partner logos; using static fallback.', { error });
    return staticPartnerLogos;
  }
}
