type LogContext = Record<string, unknown>;

export const logger = {
  error(message: string, context?: LogContext): void {
    console.error(message, context);
  },
};
