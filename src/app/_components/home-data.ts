export type ServiceCard = {
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
  tone: 'orange' | 'light' | 'purple';
};

export const navItems = ['Home', 'Services', 'Portfolio', 'About', 'Blog', 'Contact'] as const;

export const heroStats: StatCard[] = [
  { value: '8+', label: 'Years of experience', tone: 'orange' },
  { value: '97%', label: 'Satisfied clients', tone: 'light' },
  { value: '450+', label: 'Creations', tone: 'purple' },
];

export const services: ServiceCard[] = [
  {
    title: 'WEBSITE',
    subtitle: 'Custom Development',
    tone: 'light',
  },
  {
    title: 'MOBILE APP',
    subtitle: 'App Development',
    tone: 'orange',
  },
  {
    title: 'SAAS PLATFORMS',
    subtitle: 'Cloud Solutions',
    tone: 'dark',
  },
  {
    title: 'CRM SYSTEMS',
    subtitle: 'Process Automation',
    tone: 'blue',
  },
  {
    title: 'AI INTEGRATIONS',
    subtitle: 'AI Automation',
    tone: 'ice',
  },
];

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

export const portfolioTopRow: ProjectCard[] = [
  {
    title: 'Meeting Assistant',
    image: '/figma-home/stanislav-hristov3.webp',
    width: 505,
    height: 378,
    radius: 43,
  },
  {
    title: 'Borbor Landing',
    image: '/figma-home/ui-design21.webp',
    imageClassName: 'home-project-image-borbor',
    width: 505,
    height: 378,
    radius: 45,
  },
  {
    title: 'Visual Hierarchy',
    image: '/figma-home/2661.webp',
    imageClassName: 'home-project-image-visual',
    width: 592,
    height: 383,
    radius: 35,
  },
];

export const portfolioBottomRow: ProjectCard[] = [
  {
    title: 'AI Listing',
    image: '/figma-home/klever-klever-io-instagram-photos-and-videos3.webp',
    width: 379,
    height: 378,
    radius: 32,
  },
  {
    title: 'Meeting Assistant',
    image: '/figma-home/stanislav-hristov3.webp',
    width: 505,
    height: 378,
    radius: 43,
  },
  {
    title: 'Borbor Landing',
    image: '/figma-home/ui-design21.webp',
    imageClassName: 'home-project-image-borbor',
    width: 505,
    height: 378,
    radius: 45,
  },
  {
    title: 'Visual Hierarchy',
    image: '/figma-home/2661.webp',
    imageClassName: 'home-project-image-visual',
    width: 592,
    height: 383,
    radius: 35,
  },
];

export const partnerLogos = [
  { src: '/figma-home/vector3.svg', width: 136, height: 79 },
  { src: '/figma-home/vector2.svg', width: 175, height: 53 },
  { src: '/figma-home/vector3.svg', width: 136, height: 79 },
  { src: '/figma-home/vector2.svg', width: 175, height: 53 },
] as const;

export const footerLinks = {
  Company: ['About', 'Team', 'Contact us', 'Portfolio', 'Services', 'Blog'],
  Services: ['Website', 'Mobile App', 'CRM Systems', 'SAAS Platforms', 'AI integration', 'All'],
} as const;

export const aboutParagraphs = [
  {
    parts: [
      { text: 'Over the past 8 years, ', bold: false },
      { text: 'Neetrino IT', bold: true },
      { text: ' has developed more than ', bold: false },
      { text: '400 online resources', bold: 'extrabold' as const },
      {
        text: ', ranging from simple websites to large-scale internet portals and e-commerce platforms',
        bold: false,
      },
    ],
  },
  {
    parts: [
      {
        text: 'We specialize in website development, AI and bot solutions, CRM system integration, mobile app development, as well as SEO and SMM optimization—',
        bold: false,
      },
      {
        text: 'delivering a comprehensive digital presence for your business.',
        bold: 'extrabold' as const,
      },
    ],
  },
] as const;

export const contactInfo = {
  address: '108/10 Andranik Zoravar St.',
  email: 'info@neetrino.com',
  phone: '+374 44 343 000',
  hours: 'Working Hours\nMon. - Fri. 10AM - 7PM',
} as const;

export const footerSocialIcons = [
  { src: '/figma-home/social-media-icon-square-facebook.svg', alt: 'Facebook', width: 11, height: 19 },
  { src: '/figma-home/social-media-icon-square-instagram.svg', alt: 'Instagram', width: 19, height: 19 },
  { src: '/figma-home/group73.svg', alt: 'LinkedIn', width: 19, height: 18 },
  { src: '/figma-home/group.svg', alt: 'Behance', width: 24, height: 15 },
  { src: '/figma-home/group74.svg', alt: 'YouTube', width: 21, height: 15 },
  { src: '/figma-home/vector7.svg', alt: 'Twitter', width: 20, height: 20 },
  { src: '/figma-home/vector8.svg', alt: 'Dribbble', width: 19, height: 20 },
] as const;
