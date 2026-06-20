import { servicesMessages, type ServicesMessages } from './services-messages';

export type ServiceIconKey = 'saas' | 'crm' | 'website' | 'mobile' | 'ai' | 'erp';

export type ServiceDetailCard = {
  id: ServiceIconKey;
  icon: ServiceIconKey;
  /** Title lines (1 or 2 lines, matching the Figma layout). */
  title: readonly string[];
  /** Description lines (each entry renders on its own line, matching Figma). */
  description: readonly string[];
};

/**
 * Service cards in grid order (row-major: 3 columns, 2 rows).
 * Per-card colors/glows live in `services.css` (`.svc-card--<id>`).
 */
export function createServiceDetailCards(messages: ServicesMessages): readonly ServiceDetailCard[] {
  const { cards } = messages;

  return [
    {
      id: 'saas',
      icon: 'saas',
      title: cards.saas.title,
      description: cards.saas.description,
    },
    {
      id: 'crm',
      icon: 'crm',
      title: cards.crm.title,
      description: cards.crm.description,
    },
    {
      id: 'website',
      icon: 'website',
      title: cards.website.title,
      description: cards.website.description,
    },
    {
      id: 'mobile',
      icon: 'mobile',
      title: cards.mobile.title,
      description: cards.mobile.description,
    },
    {
      id: 'ai',
      icon: 'ai',
      title: cards.ai.title,
      description: cards.ai.description,
    },
    {
      id: 'erp',
      icon: 'erp',
      title: cards.erp.title,
      description: cards.erp.description,
    },
  ];
}

export const serviceCards = createServiceDetailCards(servicesMessages);
