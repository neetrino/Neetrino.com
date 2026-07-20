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

export const logger = {
  error(message: string, context?: LogContext): void {
    if (!context) {
      console.error(message);
      return;
    }

    const serialized: LogContext = {};
    for (const [key, value] of Object.entries(context)) {
      serialized[key] = serializeUnknown(value);
    }

    console.error(message, serialized);
  },
};
