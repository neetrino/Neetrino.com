import { aboutMessages, type AboutMessages } from './about-messages';
import { staticAsset } from '@/lib/static-asset';

export type GradientTone = 'purple' | 'orange' | 'green' | 'peach' | 'cyan';

export type AboutStat = {
  value: string;
  label: string;
  tone: GradientTone;
};

export type AboutIllustration = {
  src: string;
  alt: string;
  className: string;
};

export type AboutFeature = {
  lead: string;
  rest: string;
};

export type AboutRichTextPart = {
  text: string;
  bold: boolean;
};

export type AboutReflectTitle = {
  plain: string;
  accent: string;
  trailing?: string;
};

export type AboutMobileReflectLine = {
  text: string;
  accent?: boolean;
};

export type AboutMobileWhyRow = {
  lead: string;
  rest: string;
  restLines?: string[];
};

export type AboutPageData = {
  heroHeadline: AboutMessages['headline'];
  heroIntroRight: string;
  heroIntroLeft: string;
  heroIntroMobile: string;
  heroParagraph: readonly AboutRichTextPart[];
  missionText: string;
  visionText: string;
  missionTextMobile: string;
  visionTextMobile: string;
  teamText: string;
  heroStats: AboutStat[];
  impactStats: AboutStat[];
  whyIllustrations: AboutIllustration[];
  whyFeatures: AboutFeature[];
  whyMobileRows: AboutMobileWhyRow[];
  missionTitle: AboutReflectTitle;
  visionTitle: AboutReflectTitle;
  whyTitle: AboutReflectTitle;
  countriesTitle: AboutReflectTitle;
  countriesTitleMobile: AboutMessages['countries']['titleMobile'];
  teamTitle: AboutReflectTitle;
  teamImageAlt: string;
  countriesMapAlt: string;
  exploreCta: string;
  ariaMissionVision: string;
  ariaLead: string;
  ariaImpact: string;
};

const WHY_ILLUSTRATION_META = [
  { src: '/about/why-1.webp', className: 'about-why-rocket' },
  { src: '/about/why-2.webp', className: 'about-why-palette' },
  { src: '/about/why-3.webp', className: 'about-why-lightning' },
  { src: '/about/why-4.webp', className: 'about-why-helmet' },
] as const;

function mapStats(
  stats: AboutMessages['stats']['hero'] | AboutMessages['stats']['impact'],
): AboutStat[] {
  return stats.map((stat) => ({
    value: stat.value,
    label: stat.label,
    tone: stat.tone as GradientTone,
  }));
}

function mapLeadParts(parts: AboutMessages['lead']['parts']): AboutRichTextPart[] {
  return parts.map((part) => ({
    text: part.text,
    bold: part.bold === true,
  }));
}

export function createAboutPageData(messages: AboutMessages): AboutPageData {
  return {
    heroHeadline: messages.headline,
    heroIntroRight: messages.intro.right,
    heroIntroLeft: messages.intro.left,
    heroIntroMobile: messages.intro.mobile,
    heroParagraph: mapLeadParts(messages.lead.parts),
    missionText: messages.mission.text,
    visionText: messages.vision.text,
    missionTextMobile: messages.mission.textMobile,
    visionTextMobile: messages.vision.textMobile,
    teamText: messages.team.text,
    heroStats: mapStats(messages.stats.hero),
    impactStats: mapStats(messages.stats.impact),
    whyIllustrations: WHY_ILLUSTRATION_META.map((item, index) => ({
      src: staticAsset(item.src),
      className: item.className,
      alt: messages.why.illustrationAlts[index] ?? '',
    })),
    whyFeatures: messages.why.features,
    whyMobileRows: messages.why.mobileRows,
    missionTitle: messages.mission.title,
    visionTitle: messages.vision.title,
    whyTitle: messages.why.title,
    countriesTitle: messages.countries.title,
    countriesTitleMobile: messages.countries.titleMobile,
    teamTitle: messages.team.title,
    teamImageAlt: messages.team.imageAlt,
    countriesMapAlt: messages.countries.mapAlt,
    exploreCta: messages.actions.explore,
    ariaMissionVision: messages.aria.missionVision,
    ariaLead: messages.aria.lead,
    ariaImpact: messages.aria.impact,
  };
}

export const aboutPageData = createAboutPageData(aboutMessages);

// Legacy exports for any remaining static imports.
export const heroHeadline = aboutPageData.heroHeadline;
export const heroIntroRight = aboutPageData.heroIntroRight;
export const heroIntroLeft = aboutPageData.heroIntroLeft;
export const heroIntroMobile = aboutPageData.heroIntroMobile;
export const heroParagraph = aboutPageData.heroParagraph;
export const missionText = aboutPageData.missionText;
export const visionText = aboutPageData.visionText;
export const missionTextMobile = aboutPageData.missionTextMobile;
export const visionTextMobile = aboutPageData.visionTextMobile;
export const teamText = aboutPageData.teamText;
export const heroStats = aboutPageData.heroStats;
export const impactStats = aboutPageData.impactStats;
export const whyIllustrations = aboutPageData.whyIllustrations;
export const whyFeatures = aboutPageData.whyFeatures;
