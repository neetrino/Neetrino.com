import {
  getPortfolioMediaSizeLimitMessage,
  getPortfolioMediaValidationError,
  isPortfolioVideoFile,
} from '@/lib/portfolio-media';

export function resolvePortfolioUploadErrorMessage(error: unknown, fallbackMessage: string): string {
  if (!(error instanceof Error)) {
    return fallbackMessage;
  }

  const normalizedMessage = error.message.toLowerCase();

  if (
    normalizedMessage.includes('unexpected end of form') ||
    normalizedMessage.includes('body exceeded') ||
    normalizedMessage.includes('413')
  ) {
    return getPortfolioMediaSizeLimitMessage();
  }

  return error.message || fallbackMessage;
}

export function validateSelectedPortfolioFile(file: File | undefined): string | null {
  if (!file) {
    return 'Portfolio media is required.';
  }

  return getPortfolioMediaValidationError(file);
}

export function shouldAutoSelectAnimationType(file: File): boolean {
  return isPortfolioVideoFile(file);
}
