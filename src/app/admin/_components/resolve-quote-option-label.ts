import { contactMessagesByLocale } from '@/app/_components/contact-messages';
import type { HomeLocale } from '@/app/_components/home-messages';

type QuoteQuestionKey = 'projectType' | 'projectGoal' | 'budget' | 'timeline';

/** Resolves a stored quote option id to the localized public label. */
export function resolveQuoteOptionLabel(
  locale: HomeLocale,
  question: QuoteQuestionKey,
  optionId: string,
): string {
  if (!optionId) {
    return '';
  }

  const options = contactMessagesByLocale[locale].quote.questions[question].options as Record<
    string,
    string
  >;

  return options[optionId] ?? optionId;
}
