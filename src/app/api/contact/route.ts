import { NextRequest, NextResponse } from 'next/server';

import {
  isQuoteBudgetId,
  isQuoteProjectGoalId,
  isQuoteProjectTypeId,
  isQuoteTimelineId,
  type QuoteAnswers,
} from '@/app/_components/quote-wizard-options';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

/** Matches WAF guidance for contact/lead forms: 10 requests / 10 min / IP. */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

const NAME_MAX_LENGTH = 120;
const PHONE_MAX_LENGTH = 40;
const PHONE_MIN_DIGITS = 7;

type QuotePayload = QuoteAnswers & {
  name: string;
  phone: string;
};

type RateBucket = {
  count: number;
  resetAt: number;
};

const rateBuckets = new Map<string, RateBucket>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) {
      return first;
    }
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const existing = rateBuckets.get(ip);

  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return true;
  }

  existing.count += 1;
  return false;
}

function readStringField(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= PHONE_MIN_DIGITS && digits.length <= PHONE_MAX_LENGTH;
}

function parsePayload(body: unknown): QuotePayload | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const record = body as Record<string, unknown>;
  const name = readStringField(record.name, NAME_MAX_LENGTH);
  const phone = readStringField(record.phone, PHONE_MAX_LENGTH);

  if (
    !name ||
    !phone ||
    !isValidPhone(phone) ||
    !isQuoteProjectTypeId(record.projectType) ||
    !isQuoteProjectGoalId(record.projectGoal) ||
    !isQuoteBudgetId(record.budget) ||
    !isQuoteTimelineId(record.timeline)
  ) {
    return null;
  }

  return {
    name,
    phone,
    projectType: record.projectType,
    projectGoal: record.projectGoal,
    budget: record.budget,
    timeline: record.timeline,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const payload = parsePayload(body);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name: payload.name,
        phone: payload.phone,
        projectType: payload.projectType,
        projectGoal: payload.projectGoal,
        budget: payload.budget,
        timeline: payload.timeline,
        email: '',
        message: '',
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create quote request.', { error });
    return NextResponse.json({ error: 'Unable to send message' }, { status: 500 });
  }
}
