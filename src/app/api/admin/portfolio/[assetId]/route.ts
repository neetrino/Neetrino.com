import { NextRequest, NextResponse } from 'next/server';
import { assertAdminApiRequest } from '@/lib/admin-api-auth';
import { logger } from '@/lib/logger';
import {
  getPortfolioUploadErrorMessage,
  updatePortfolioAssetFromFormData,
} from '@/lib/portfolio-upload-service';

export const runtime = 'nodejs';

type PortfolioAssetRouteContext = {
  params: Promise<{ assetId: string }>;
};

export async function PATCH(request: NextRequest, context: PortfolioAssetRouteContext): Promise<NextResponse> {
  const unauthorized = await assertAdminApiRequest(request);

  if (unauthorized) {
    return unauthorized;
  }

  const { assetId } = await context.params;

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch (error) {
    logger.error('Failed to parse portfolio update form data.', { error, assetId });

    return NextResponse.json({ error: 'Invalid upload payload.' }, { status: 400 });
  }

  formData.set('assetId', assetId);

  try {
    const updated = await updatePortfolioAssetFromFormData(formData);

    return NextResponse.json({ status: 'success', data: updated });
  } catch (error) {
    logger.error('Failed to update portfolio asset via API route.', { error, assetId });

    return NextResponse.json({ error: getPortfolioUploadErrorMessage(error) }, { status: 400 });
  }
}
