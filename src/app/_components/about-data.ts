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

/** Hero headline split into the exact word styling used in the Figma design. */
export const heroHeadline = {
  line1Plain: 'WITH',
  line1Accent: 'US',
  line2: 'EVERY IDEA',
  line3: 'BECOMES',
  line4: 'POSSIBLE',
} as const;

export const heroIntroRight =
  'Over the past 7 years, Neetrino IT has developed more than 400 online resources, ranging from simple websites to large-scale internet portals and e-commerce platforms.';

export const heroIntroLeft =
  'We specialize in website development, AI and bot solutions, CRM system integration, mobile app development, as well as SEO and SMM optimization—delivering a comprehensive digital presence for your business.';

export const heroParagraph = [
  { text: 'Neetrino', bold: true },
  { text: ' is the first company to', bold: false },
  { text: ' offer website sales', bold: true },
  { text: ' through a Platform that provides access to ', bold: false },
  { text: 'over 100,000', bold: true },
  {
    text: ' professional designs. Our Platform enables businesses to quickly and affordably create fully functional websites, perfectly tailored to',
    bold: false,
  },
  { text: ' modern business needs', bold: true },
  {
    text: '. We not only save you time and resources but also guarantee high quality, advanced functionality, and ongoing support—maximizing the efficiency and competitiveness of ',
    bold: false,
  },
  { text: 'your online presence', bold: true },
  { text: '.', bold: false },
] as const;

export const missionText =
  'Our goal is to deliver fast, affordable, and high-quality digital solutions, empowering businesses to effortlessly build and expand their online presence, no matter how complex the project.';

export const visionText =
  'We envision a world where businesses of all sizes can effortlessly establish a strong digital presence using our fast, cutting-edge technological solutions. Our aim is to lead the transformation of website and app development, making these tools accessible to everyone, everywhere.';

export const teamText = visionText;

export const heroStats: AboutStat[] = [
  { value: '450+', label: 'Projects Delivered', tone: 'purple' },
  { value: '6+', label: 'Core Services', tone: 'orange' },
  { value: '24/7', label: 'Support Available', tone: 'green' },
];

export const impactStats: AboutStat[] = [
  { value: '380+', label: 'Active Users', tone: 'purple' },
  { value: '400+', label: 'Projects Done', tone: 'orange' },
  { value: '25+', label: 'Members', tone: 'peach' },
  { value: '8', label: 'Years of Experience', tone: 'cyan' },
];

export const whyIllustrations: AboutIllustration[] = [
  { src: '/about/why-1.png', alt: 'Rocket', className: 'about-why-rocket' },
  { src: '/about/why-2.png', alt: 'Palette', className: 'about-why-palette' },
  { src: '/about/why-3.png', alt: 'Lightning', className: 'about-why-lightning' },
  { src: '/about/why-4.png', alt: 'Helmet', className: 'about-why-helmet' },
];

export const whyFeatures: AboutFeature[] = [
  { lead: 'Fast and premium', rest: 'execution delivered in record time' },
  { lead: 'A selection of over', rest: '100,000 design options' },
  { lead: 'Websites created 10 times', rest: 'faster than traditional methods' },
  { lead: '24/7 technical support', rest: 'and free consultations' },
];
