'use server';

import { revalidatePath } from 'next/cache';

import { requireAdminSession } from '@/lib/admin-session';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export type ContactMessageDeleteState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

function readMessageId(formData: FormData): string {
  const value = formData.get('messageId');

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('Message id is required.');
  }

  return value.trim();
}

export async function deleteContactMessage(
  _previousState: ContactMessageDeleteState,
  formData: FormData,
): Promise<ContactMessageDeleteState> {
  await requireAdminSession();

  try {
    const messageId = readMessageId(formData);

    await prisma.contactMessage.delete({
      where: { id: messageId },
    });

    revalidatePath('/admin/messages');

    return { status: 'success', message: '' };
  } catch (error) {
    logger.error('Failed to delete contact message.', { error });
    return { status: 'error', message: 'Could not delete request.' };
  }
}
