import { NextRequest, NextResponse } from 'next/server';
import { assertAdminApiRequest } from '@/lib/admin-api-auth';
import { logger } from '@/lib/logger';
import { readPortfolioApiFormData } from '@/lib/portfolio-request-body';
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
    formData = await readPortfolioApiFormData(request);
  } catch (error) {
    logger.error('Failed to parse portfolio upload request body.', { error });

    return NextResponse.json({ error: getPortfolioUploadErrorMessage(error) }, { status: 400 });
  }

  try {
    await createPortfolioAssetFromFormData(formData);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    logger.error('Failed to upload portfolio media via API route.', { error });

    return NextResponse.json({ error: getPortfolioUploadErrorMessage(error) }, { status: 400 });
  }
}
