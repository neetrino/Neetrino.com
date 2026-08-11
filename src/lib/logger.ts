type LogContext = Record<string, unknown>;

function serializeUnknown(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
      ...(typeof value === 'object' && value !== null && 'code' in value
        ? { code: (value as { code?: unknown }).code }
        : {}),
      ...(typeof value === 'object' && value !== null && 'meta' in value
        ? { meta: (value as { meta?: unknown }).meta }
        : {}),
    };
  }

  return value;
}

function writeLog(
  write: (message?: unknown, ...optionalParams: unknown[]) => void,
  message: string,
  context?: LogContext,
): void {
  if (!context) {
    write(message);
    return;
  }

  const serialized: LogContext = {};
  for (const [key, value] of Object.entries(context)) {
    serialized[key] = serializeUnknown(value);
  }

  write(message, serialized);
}

export const logger = {
  info(message: string, context?: LogContext): void {
    writeLog(console.info, message, context);
  },
  warn(message: string, context?: LogContext): void {
    writeLog(console.warn, message, context);
  },
  error(message: string, context?: LogContext): void {
    writeLog(console.error, message, context);
  },
};
