import { homeMessages, type HomeMessages } from './home-messages';

export type ServiceCard = {
  id: ServiceCardId;
  title: string;
  subtitle: string;
  tone: 'light' | 'orange' | 'dark' | 'blue' | 'ice';
};

export type ProjectCard = {
  title: string;
  image: string;
  imageClassName?: string;
  width: number;
  height: number;
  radius: number;
};

export type StatCard = {
  value: string;
  label: string;
  labelLines?: readonly string[];
  mobileLabelLines?: readonly string[];
  tone: 'orange' | 'light' | 'purple';
};

export type NavItem = {
  id: NavItemId;
  label: string;
  href: string;
};

export type RichTextPart = {
  text: string;
  bold: boolean | 'extrabold';
};

export type AboutParagraph = {
  parts: RichTextPart[];
};

export type FooterLink = {
  id: FooterLinkId;
  label: string;
  href: string;
};

type NavItemId = 'home' | 'services' | 'portfolio' | 'about' | 'contact' | 'blog' | 'team';
type ServiceCardId = 'website' | 'mobileApp' | 'saasPlatforms' | 'crmSystems' | 'aiIntegrations';
type FooterLinkId =
  | 'about'
  | 'team'
  | 'contactUs'
  | 'portfolio'
  | 'services'
  | 'blog'
  | 'website'
  | 'mobileApp'
  | 'crmSystems'
  | 'saasPlatforms'
  | 'aiIntegration'
  | 'all';

type MessageRichTextPart = {
  text: string;
  bold: boolean | string;
};

export const serviceIllustrations = [
  { src: '/figma-home/5391.webp', className: 'home-services-deco-laptop' },
  { src: '/figma-home/mobile-app.webp', className: 'home-services-deco-phone' },
  { src: '/figma-home/cloud-infrastructure.webp', className: 'home-services-deco-saas' },
  {
    src: '/figma-home/sports00065.webp',
    className: 'home-services-deco-crm',
    unoptimized: true,
  },
  {
    src: '/figma-home/2761.webp',
    className: 'home-services-deco-ai',
    unoptimized: true,
  },
] as const;

export const partnerLogos = [
  { src: '/figma-home/vector3.svg', width: 136, height: 79 },
  { src: '/figma-home/vector2.svg', width: 175, height: 53 },
  { src: '/figma-home/vector3.svg', width: 136, height: 79 },
  { src: '/figma-home/vector2.svg', width: 175, height: 53 },
] as const;

function normalizeRichTextPart(part: MessageRichTextPart): RichTextPart {
  return {
    text: part.text,
    bold: part.bold === 'extrabold' ? 'extrabold' : part.bold === true,
  };
}

export function createHomeData(messages: HomeMessages) {
  const { actions, footer, hero, meta, navigation, portfolio } = messages;
  const serviceCards = messages.services.cards;

  const navItems: NavItem[] = [
    { id: 'home', label: navigation.items.home, href: '/' },
    { id: 'services', label: navigation.items.services, href: '/services' },
    { id: 'portfolio', label: navigation.items.portfolio, href: '/portfolio' },
    { id: 'about', label: navigation.items.about, href: '/about' },
    { id: 'contact', label: navigation.items.contact, href: '/contact' },
  ];

  const moreNavItems: NavItem[] = [
    { id: 'blog', label: navigation.items.blog, href: '/#blog' },
    { id: 'team', label: navigation.items.team, href: '/#team' },
  ];

  const heroStats: StatCard[] = [
    {
      value: hero.stats.experience.value,
      label: hero.stats.experience.label,
      labelLines: hero.stats.experience.labelLines,
      mobileLabelLines: hero.stats.experience.mobileLabelLines,
      tone: 'orange',
    },
    { value: hero.stats.clients.value, label: hero.stats.clients.label, tone: 'light' },
    { value: hero.stats.creations.value, label: hero.stats.creations.label, tone: 'purple' },
  ];

  const services: ServiceCard[] = [
    {
      id: 'website',
      title: serviceCards.website.title,
      subtitle: serviceCards.website.subtitle,
      tone: 'light',
    },
    {
      id: 'mobileApp',
      title: serviceCards.mobileApp.title,
      subtitle: serviceCards.mobileApp.subtitle,
      tone: 'orange',
    },
    {
      id: 'saasPlatforms',
      title: serviceCards.saasPlatforms.title,
      subtitle: serviceCards.saasPlatforms.subtitle,
      tone: 'dark',
    },
    {
      id: 'crmSystems',
      title: serviceCards.crmSystems.title,
      subtitle: serviceCards.crmSystems.subtitle,
      tone: 'blue',
    },
    {
      id: 'aiIntegrations',
      title: serviceCards.aiIntegrations.title,
      subtitle: serviceCards.aiIntegrations.subtitle,
      tone: 'ice',
    },
  ];

  const portfolioTopRow: ProjectCard[] = [
    {
      title: portfolio.projects.meetingAssistant,
      image: '/figma-home/stanislav-hristov3.webp',
      width: 505,
      height: 378,
      radius: 43,
    },
    {
      title: portfolio.projects.borborLanding,
      image: '/figma-home/ui-design21.webp',
      imageClassName: 'home-project-image-borbor',
      width: 505,
      height: 378,
      radius: 45,
    },
    {
      title: portfolio.projects.visualHierarchy,
      image: '/figma-home/2661.webp',
      imageClassName: 'home-project-image-visual',
      width: 592,
      height: 383,
      radius: 35,
    },
  ];

  const portfolioBottomRow: ProjectCard[] = [
    {
      title: portfolio.projects.aiListing,
      image: '/figma-home/klever-klever-io-instagram-photos-and-videos3.webp',
      width: 379,
      height: 378,
      radius: 32,
    },
    {
      title: portfolio.projects.meetingAssistant,
      image: '/figma-home/stanislav-hristov3.webp',
      width: 505,
      height: 378,
      radius: 43,
    },
    {
      title: portfolio.projects.borborLanding,
      image: '/figma-home/ui-design21.webp',
      imageClassName: 'home-project-image-borbor',
      width: 505,
      height: 378,
      radius: 45,
    },
    {
      title: portfolio.projects.visualHierarchy,
      image: '/figma-home/2661.webp',
      imageClassName: 'home-project-image-visual',
      width: 592,
      height: 383,
      radius: 35,
    },
  ];

  const footerLinks = {
    company: [
      { id: 'about', label: footer.links.about, href: '/#about' },
      { id: 'team', label: footer.links.team, href: '/#about' },
      { id: 'contactUs', label: footer.links.contactUs, href: '/contact' },
      { id: 'portfolio', label: footer.links.portfolio, href: '/portfolio' },
      { id: 'services', label: footer.links.services, href: '/services' },
      { id: 'blog', label: footer.links.blog, href: '/#blog' },
    ],
    services: [
      { id: 'website', label: footer.links.website, href: '/services' },
      { id: 'mobileApp', label: footer.links.mobileApp, href: '/services' },
      { id: 'crmSystems', label: footer.links.crmSystems, href: '/services' },
      { id: 'saasPlatforms', label: footer.links.saasPlatforms, href: '/services' },
      { id: 'aiIntegration', label: footer.links.aiIntegration, href: '/services' },
      { id: 'all', label: footer.links.all, href: '/services' },
    ],
  } satisfies Record<'company' | 'services', FooterLink[]>;

  const aboutParagraphs: AboutParagraph[] = messages.about.paragraphs.map((parts) => ({
    parts: parts.map(normalizeRichTextPart),
  }));

  const contactInfo = {
    address: footer.contact.address,
    email: footer.contact.email,
    phone: footer.contact.phone,
    hours: footer.contact.hours,
  } as const;

  const footerSocialIcons = [
    {
      src: '/figma-home/social-media-icon-square-facebook.svg',
      alt: messages.social.facebook,
      width: 11,
      height: 19,
    },
    {
      src: '/figma-home/social-media-icon-square-instagram.svg',
      alt: messages.social.instagram,
      width: 19,
      height: 19,
    },
    { src: '/figma-home/group73.svg', alt: messages.social.linkedin, width: 19, height: 18 },
    { src: '/figma-home/group.svg', alt: messages.social.behance, width: 24, height: 15 },
    { src: '/figma-home/group74.svg', alt: messages.social.youtube, width: 21, height: 15 },
    { src: '/figma-home/vector7.svg', alt: messages.social.twitter, width: 20, height: 20 },
    { src: '/figma-home/vector8.svg', alt: messages.social.dribbble, width: 19, height: 20 },
  ] as const;

  const homeCopy = {
    actions,
    footer,
    hero,
    meta,
    navigation,
    partners: messages.partners,
    sections: messages.sections,
  } as const;

  return {
    aboutParagraphs,
    contactInfo,
    footerLinks,
    footerSocialIcons,
    heroStats,
    homeCopy,
    moreNavItems,
    navItems,
    portfolioBottomRow,
    portfolioTopRow,
    services,
  };
}

const defaultHomeData = createHomeData(homeMessages);

export const {
  aboutParagraphs,
  contactInfo,
  footerLinks,
  footerSocialIcons,
  heroStats,
  homeCopy,
  moreNavItems,
  navItems,
  portfolioBottomRow,
  portfolioTopRow,
  services,
} = defaultHomeData;
