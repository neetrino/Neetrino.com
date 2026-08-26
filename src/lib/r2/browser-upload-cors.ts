/** CORS rules required for browser PUT uploads to the R2 S3 API endpoint. */
export const R2_BROWSER_UPLOAD_CORS_RULES = [
  {
    AllowedOrigins: [
      'https://www.neetrino.com',
      'https://neetrino.com',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD'],
    AllowedHeaders: ['Content-Type'],
    ExposeHeaders: ['ETag', 'Content-Type', 'Content-Length'],
    MaxAgeSeconds: 86400,
  },
];
