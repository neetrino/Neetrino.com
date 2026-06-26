'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/admin-session';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import type { ContactActionState } from '@/app/_actions/contact-actions';

function readRequiredId(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

export async function deleteContactMessage(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  await requireAdminSession();

  try {
    const messageId = readRequiredId(formData, 'messageId');

    await prisma.contactMessage.delete({
      where: { id: messageId },
    });

    revalidatePath('/admin/contact');

    return {
      status: 'success',
      message: 'Message deleted.',
    };
  } catch (error) {
    logger.error('Failed to delete contact message.', { error });

    return {
      status: 'error',
      message: 'Could not delete this message.',
    };
  }
}
