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
 * Service cards in Figma grid order (row-major: 3 columns, 2 rows).
 * Per-card colors/glows live in `services.css` (`.svc-card--<id>`).
 */
export const serviceCards: readonly ServiceDetailCard[] = [
  {
    id: 'saas',
    icon: 'saas',
    title: ['SaaS Development'],
    description: [
      'Scalable SaaS platforms built for growth',
      'Secure, flexible, and ready to evolve with your product',
    ],
  },
  {
    id: 'crm',
    icon: 'crm',
    title: ['CRM', 'Systems'],
    description: [
      'Powerful customer relationship management solutions to streamline your sales process and boost customer satisfaction.',
    ],
  },
  {
    id: 'website',
    icon: 'website',
    title: ['Website Development'],
    description: [
      'Cutting-edge web solutions built with modern technologies, optimized for performance and designed to convert visitors into customers.',
    ],
  },
  {
    id: 'mobile',
    icon: 'mobile',
    title: ['Mobile App Development'],
    description: [
      'Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android devices.',
    ],
  },
  {
    id: 'ai',
    icon: 'ai',
    title: ['AI Product Development'],
    description: [
      'Intelligent automation powered by machine learning and natural language processing to transform your business operations.',
    ],
  },
  {
    id: 'erp',
    icon: 'erp',
    title: ['ERP', 'System'],
    description: [
      'All-in-one systems for managing business operations',
      'Control data, processes, and resources in one place',
    ],
  },
] as const;
