export type PortfolioProject = {
  title: string;
  alt: string;
  image: string;
  variant?: 'zeppelin';
};

export const portfolioProjects: PortfolioProject[] = [
  {
    title: 'Tooon Expo',
    alt: 'Tooon Expo banner',
    image: '/portfolio/optimized/tooon-expo.jpg',
  },
  {
    title: 'Zeppelin',
    alt: 'Zeppelin banner',
    image: '/portfolio/optimized/zeppelin-bg.jpg',
    variant: 'zeppelin',
  },
  {
    title: 'Degusto',
    alt: 'Degusto banner',
    image: '/portfolio/optimized/degusto.jpg',
  },
  {
    title: 'Digital Implant Clinic',
    alt: 'Digital Implant Clinic banner',
    image: '/portfolio/optimized/digital-implant.jpg',
  },
  {
    title: 'Borbor Aqua',
    alt: 'Borbor banner',
    image: '/portfolio/optimized/borbor.jpg',
  },
  {
    title: 'Marco Group',
    alt: 'Marco Group banner',
    image: '/portfolio/optimized/marco.jpg',
  },
  {
    title: 'National Center for Innovation and Entrepreneurship',
    alt: 'NCIE banner',
    image: '/portfolio/optimized/ncie.jpg',
  },
  {
    title: 'Armenian Nuclear Regulatory Authority',
    alt: 'Armenian Nuclear Regulatory Authority banner',
    image: '/portfolio/optimized/anra.jpg',
  },
];
