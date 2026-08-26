import 'server-only';

import type { NextRequest } from 'next/server';
import { jsonToPortfolioFormData } from '@/lib/portfolio-complete-payload';

export async function readPortfolioApiFormData(request: NextRequest): Promise<FormData> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return jsonToPortfolioFormData(await request.json());
  }

  return request.formData();
}
