/**
 * Image helpers for Into Nepal
 * Enforces image dimension transforms (?width=600 for cards, 1200 for detail)
 * to avoid rendering heavy full-resolution uploads.
 */

// Curated high quality Nepal imagery fallbacks
export const HIMALAYAN_FALLBACKS: Record<string, string> = {
  everest: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
  annapurna: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca0c33',
  langtang: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
  manaslu: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  mustang: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5',
  cultural: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1',
  wildlife: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d',
  general: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa',
};

/**
 * Format an image URL to requested width (e.g. 600 for cards, 1200 for detail)
 */
export function getOptimizedImageUrl(
  rawUrl?: string | null,
  width: 600 | 1200 | 400 | 800 = 600,
  categoryOrFallbackKey: string = 'general'
): string {
  if (!rawUrl || rawUrl.trim() === '') {
    const fallbackBase =
      HIMALAYAN_FALLBACKS[categoryOrFallbackKey.toLowerCase()] ||
      HIMALAYAN_FALLBACKS.general;
    return `${fallbackBase}?w=${width}&q=80&auto=format&fit=crop`;
  }

  const url = rawUrl.trim();

  // 1. Supabase storage URL: append query param for image transformation
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}&quality=80`;
  }

  // 2. Unsplash URL: append standard parameters
  if (url.includes('images.unsplash.com')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=${width}&q=80&auto=format&fit=crop`;
  }

  return url;
}
