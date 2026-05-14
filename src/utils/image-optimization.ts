
/**
 * Utility to optimize Unsplash URLs by adding transformation parameters.
 * Unsplash supports dynamic resizing, formatting, and quality adjustments via query params.
 */

export function getOptimizedUnsplashUrl(
  url: string, 
  { width, height, quality = 80, format = 'auto', fit = 'crop' }: { 
    width?: number; 
    height?: number; 
    quality?: number; 
    format?: string; 
    fit?: string; 
  } = {}
) {
  if (!url || !url.includes('unsplash.com')) return url;

  // Remove existing optimization params if any
  const baseUrl = url.split('?')[0];
  
  const params = new URLSearchParams();
  params.append('auto', format);
  params.append('fit', fit);
  params.append('q', quality.toString());
  
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());

  return `${baseUrl}?${params.toString()}`;
}

export function getUnsplashSrcSet(url: string, widths: number[] = [400, 800, 1200, 1600, 2000]) {
  if (!url || !url.includes('unsplash.com')) return undefined;
  
  return widths
    .map(w => `${getOptimizedUnsplashUrl(url, { width: w })} ${w}w`)
    .join(', ');
}
