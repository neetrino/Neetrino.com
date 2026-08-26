import {
  getPortfolioMediaSizeLimitMessage,
  getPortfolioMediaValidationError,
  isPortfolioUploadTransportLimitError,
  isPortfolioVideoFile,
} from '@/lib/portfolio-media';

export function resolvePortfolioUploadErrorMessage(error: unknown, fallbackMessage: string): string {
  if (isPortfolioUploadTransportLimitError(error)) {
    return getPortfolioMediaSizeLimitMessage();
  }

  if (error instanceof TypeError) {
    return 'Direct upload to storage failed. Check the connection and try again.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
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
