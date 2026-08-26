import { NextRequest, NextResponse } from 'next/server';
import { assertAdminApiRequest } from '@/lib/admin-api-auth';
import { logger } from '@/lib/logger';
import {
  createPortfolioAssetFromFormData,
  getPortfolioUploadErrorMessage,
} from '@/lib/portfolio-upload-service';

export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const unauthorized = await assertAdminApiRequest(request);

  if (unauthorized) {
    return unauthorized;
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch (error) {
    logger.error('Failed to parse portfolio upload form data.', { error });

    return NextResponse.json({ error: 'Invalid upload payload.' }, { status: 400 });
  }

  try {
    await createPortfolioAssetFromFormData(formData);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    logger.error('Failed to upload portfolio media via API route.', { error });

    return NextResponse.json({ error: getPortfolioUploadErrorMessage(error) }, { status: 400 });
  }
}
