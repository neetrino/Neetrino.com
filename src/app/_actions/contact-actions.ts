'use server';

import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 4000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

function readRequiredText(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

function validateContactInput(name: string, email: string, message: string): void {
  if (name.length > MAX_NAME_LENGTH) {
    throw new Error('Name is too long.');
  }

  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    throw new Error('Email is invalid.');
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error('Message is too long.');
  }
}

export async function submitContactMessage(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  try {
    const name = readRequiredText(formData, 'name');
    const email = readRequiredText(formData, 'email').toLowerCase();
    const message = readRequiredText(formData, 'message');

    validateContactInput(name, email, message);

    await prisma.contactMessage.create({
      data: { name, email, message },
    });

    revalidatePath('/admin/contact');

    return {
      status: 'success',
      message: 'success',
    };
  } catch (error) {
    logger.error('Failed to submit contact message.', { error });

    return {
      status: 'error',
      message: 'error',
    };
  }
}
