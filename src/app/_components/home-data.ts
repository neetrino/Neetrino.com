import { homeMessages, type HomeMessages } from './home-messages';
import { staticAsset } from '@/lib/static-asset';

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

export type FooterSocialIcon = {
  src: string;
  alt: string;
  width: number;
  height: number;
  href?: string;
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
  { src: staticAsset('/figma-home/5391.webp'), className: 'home-services-deco-laptop' },
  { src: staticAsset('/figma-home/mobile-app.webp'), className: 'home-services-deco-phone' },
  { src: staticAsset('/figma-home/cloud-infrastructure.webp'), className: 'home-services-deco-saas' },
  {
    src: staticAsset('/figma-home/sports00065.webp'),
    className: 'home-services-deco-crm',
    unoptimized: true,
  },
  {
    src: staticAsset('/figma-home/2761.webp'),
    className: 'home-services-deco-ai',
    unoptimized: true,
  },
] as const;

/** Partner logos from Figma PARTNERS (node 1:565), left-to-right order. */
export const partnerLogos = [
  { src: staticAsset('/figma-home/partners/marco-group.webp'), width: 136, height: 79, alt: 'Marco Group' },
  { src: staticAsset('/figma-home/partners/borbor-aqua.webp'), width: 175, height: 53, alt: 'Borbor Aqua' },
  { src: staticAsset('/figma-home/partners/mika-kids.webp'), width: 78, height: 73, alt: 'Mika Kids Dental Clinic' },
  { src: staticAsset('/figma-home/partners/alatis.webp'), width: 157, height: 71, alt: 'Avetis' },
  { src: staticAsset('/figma-home/partners/hay-masters.webp'), width: 67, height: 96, alt: 'Hay Masters' },
] as const;

function normalizeRichTextPart(part: MessageRichTextPart): RichTextPart {
  return {
    text: part.text,
    bold: part.bold === 'extrabold' ? 'extrabold' : part.bold === true,
  };
}

export function createHomeData(messages: HomeMessages) {
  const { actions, footer, hero, meta, navigation } = messages;
  const serviceCards = messages.services.cards;

  const navItems: NavItem[] = [
    { id: 'home', label: navigation.items.home, href: '/' },
    { id: 'services', label: navigation.items.services, href: '/services' },
    { id: 'portfolio', label: navigation.items.portfolio, href: '/portfolio' },
    { id: 'about', label: navigation.items.about, href: '/about' },
    { id: 'contact', label: navigation.items.contact, href: '/contact' },
  ];

  const moreNavItems: NavItem[] = [
    { id: 'blog', label: navigation.items.blog, href: '/blog' },
    { id: 'team', label: navigation.items.team, href: '/team' },
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

  // Portfolio cards are sourced from the admin (database). No static image
  // fallback is provided; when the database is unavailable the rows are empty.
  const portfolioTopRow: ProjectCard[] = [];
  const portfolioBottomRow: ProjectCard[] = [];

  const footerLinks = {
    company: [
      { id: 'about', label: footer.links.about, href: '/#about' },
      { id: 'team', label: footer.links.team, href: '/team' },
      { id: 'contactUs', label: footer.links.contactUs, href: '/contact' },
      { id: 'portfolio', label: footer.links.portfolio, href: '/portfolio' },
      { id: 'services', label: footer.links.services, href: '/services' },
      { id: 'blog', label: footer.links.blog, href: '/blog' },
    ],
    services: [
      { id: 'website', label: footer.links.website, href: '/services#service-website' },
      { id: 'mobileApp', label: footer.links.mobileApp, href: '/services#service-mobile' },
      { id: 'crmSystems', label: footer.links.crmSystems, href: '/services#service-crm' },
      { id: 'saasPlatforms', label: footer.links.saasPlatforms, href: '/services#service-saas' },
      { id: 'aiIntegration', label: footer.links.aiIntegration, href: '/services#service-ai' },
      { id: 'all', label: footer.links.all, href: '/services#services-heading' },
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

  const footerSocialIcons: readonly FooterSocialIcon[] = [
    {
      src: staticAsset('/figma-home/social-media-icon-square-facebook.svg'),
      alt: messages.social.facebook,
      width: 11,
      height: 19,
      href: 'https://www.facebook.com/Neetrino.it.company/',
    },
    {
      src: staticAsset('/figma-home/social-media-icon-square-instagram.svg'),
      alt: messages.social.instagram,
      width: 19,
      height: 19,
      href: 'https://www.instagram.com/neetrino_it_company/',
    },
    {
      src: staticAsset('/figma-home/group73.svg'),
      alt: messages.social.linkedin,
      width: 19,
      height: 18,
      href: 'https://www.linkedin.com/company/neetrino-it-company/',
    },
    {
      src: staticAsset('/figma-home/group.svg'),
      alt: messages.social.behance,
      width: 24,
      height: 15,
      href: 'https://www.behance.net/NeetrinoITcompany',
    },
    {
      src: staticAsset('/figma-home/group74.svg'),
      alt: messages.social.youtube,
      width: 21,
      height: 15,
      href: 'https://www.youtube.com/@NeetrinoITCompany',
    },
    {
      src: staticAsset('/figma-home/vector7.svg'),
      alt: messages.social.whatsapp,
      width: 20,
      height: 20,
      href: 'https://api.whatsapp.com/send?phone=37444343000',
    },
    {
      src: '/figma-home/telegram.svg',
      alt: messages.social.telegram,
      width: 20,
      height: 20,
      href: 'https://telegram.me/neetrino',
    },
  ];

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
