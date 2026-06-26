const REMOTE_IMAGE_PROTOCOLS = ['http://', 'https://'] as const;

export function isRemoteImageUrl(src: string): boolean {
  return REMOTE_IMAGE_PROTOCOLS.some((protocol) => src.startsWith(protocol));
}
