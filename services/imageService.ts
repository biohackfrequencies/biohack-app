// services/imageService.ts
import { imageData } from './imageData';

/**
 * Provides a unique image URL for any given item ID.
 * It first checks a pre-generated map for static library content.
 * If not found (e.g., for a custom user-created stack), it returns a default
 * pre-generated image to ensure instant loading and no real-time generation.
 * @param id The unique identifier for the frequency, session, or stack.
 * @returns A URL for a 500x500 pre-generated image.
 */
export const getImageUrl = (id: string): string => {
  // Use pre-generated image URL if available.
  // Fallback to a generic image for dynamic content (like custom stacks)
  // to prevent errors and avoid real-time generation.
  return imageData[id] || imageData['deep-relaxation'];
};
