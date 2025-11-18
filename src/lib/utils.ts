import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to fetch photos by tag IDs
export async function fetchPhotosByTags(tagIds: string[], limit: number = 10) {
  try {
    const { getPhotos } = await import("@/lib/db/queries");
    const photos = await getPhotos({ status: 'published' });

    let matchingPhotos;

    if (!tagIds || tagIds.length === 0) {
      // If no tagIds provided, return all photos (for sections without specific tags)
      matchingPhotos = photos;
    } else {
      // Filter photos that have matching tag IDs
      matchingPhotos = photos.filter((photo: any) => {
        if (!photo.tagIds || !Array.isArray(photo.tagIds)) return false;
        return photo.tagIds.some((tagId: string) => tagIds.includes(tagId));
      });
    }

    // Extract all image URLs from the images array of each photo
    const allImageUrls: string[] = [];

    matchingPhotos.slice(0, limit).forEach((photo: any) => {
      // Use the images array if it exists and has items
      if (photo.images && Array.isArray(photo.images) && photo.images.length > 0) {
        // Add all images from the images array
        photo.images.forEach((imageUrl: string) => {
          if (imageUrl && typeof imageUrl === 'string') {
            allImageUrls.push(imageUrl);
          }
        });
      } else if (photo.imageUrl) {
        // Fallback to single imageUrl if images array is empty
        allImageUrls.push(photo.imageUrl);
      }
    });

    return allImageUrls;
  } catch (error) {
    console.error('Error in fetchPhotosByTags:', error);
    return [];
  }
}
