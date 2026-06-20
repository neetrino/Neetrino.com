import { portfolioMessages, type PortfolioMessages } from './portfolio-messages';

export type PortfolioProjectId =
  | 'tooonExpo'
  | 'zeppelin'
  | 'degusto'
  | 'digitalImplant'
  | 'borborAqua'
  | 'marcoGroup'
  | 'ncie'
  | 'anra';

export type PortfolioProject = {
  title: string;
  alt: string;
  image: string;
  variant?: 'zeppelin';
  overlayTitle?: string;
};

const PORTFOLIO_PROJECT_META: readonly {
  id: PortfolioProjectId;
  image: string;
  variant?: 'zeppelin';
}[] = [
  { id: 'tooonExpo', image: '/portfolio/optimized/tooon-expo.jpg' },
  { id: 'zeppelin', image: '/portfolio/optimized/zeppelin-bg.jpg', variant: 'zeppelin' },
  { id: 'degusto', image: '/portfolio/optimized/degusto.jpg' },
  { id: 'digitalImplant', image: '/portfolio/optimized/digital-implant.jpg' },
  { id: 'borborAqua', image: '/portfolio/optimized/borbor.jpg' },
  { id: 'marcoGroup', image: '/portfolio/optimized/marco.jpg' },
  { id: 'ncie', image: '/portfolio/optimized/ncie.jpg' },
  { id: 'anra', image: '/portfolio/optimized/anra.jpg' },
];

export function createPortfolioProjects(messages: PortfolioMessages): PortfolioProject[] {
  return PORTFOLIO_PROJECT_META.map((meta) => {
    const copy = messages.projects[meta.id];

    return {
      title: copy.title,
      alt: copy.alt,
      image: meta.image,
      variant: meta.variant,
      overlayTitle: 'overlayTitle' in copy ? copy.overlayTitle : undefined,
    };
  });
}

export const portfolioProjects = createPortfolioProjects(portfolioMessages);
