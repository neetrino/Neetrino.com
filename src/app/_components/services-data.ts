import { servicesMessages, type ServicesMessages } from './services-messages';

export type ServiceIconKey = 'saas' | 'crm' | 'website' | 'mobile' | 'ai' | 'erp';

export type ServiceDetailCard = {
  id: ServiceIconKey;
  icon: ServiceIconKey;
  /** Title lines (1 or 2 lines, matching the Figma layout). */
  title: readonly string[];
  /** Description lines (each entry renders on its own line, matching Figma). */
  description: readonly string[];
  detailHeadline: string;
  detailBody: readonly string[];
  detailPoints: readonly string[];
};

type ServiceCardMessages = ServicesMessages['cards'][ServiceIconKey];

function createCard(id: ServiceIconKey, card: ServiceCardMessages): ServiceDetailCard {
  return {
    id,
    icon: id,
    title: card.title,
    description: card.description,
    detailHeadline: card.detailHeadline,
    detailBody: card.detailBody,
    detailPoints: card.detailPoints,
  };
}

/**
 * Service cards in grid order (row-major: 3 columns, 2 rows).
 * Per-card colors/glows live in `services.css` (`.svc-card--<id>`).
 */
export function createServiceDetailCards(messages: ServicesMessages): readonly ServiceDetailCard[] {
  const { cards } = messages;

  return [
    createCard('saas', cards.saas),
    createCard('crm', cards.crm),
    createCard('website', cards.website),
    createCard('mobile', cards.mobile),
    createCard('ai', cards.ai),
    createCard('erp', cards.erp),
  ];
}

export const serviceCards = createServiceDetailCards(servicesMessages);
