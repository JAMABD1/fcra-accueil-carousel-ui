import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "@/integrations/supabase/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to fetch photos by tag IDs
export async function fetchPhotosByTags(tagIds: string[], limit: number = 10) {
  if (!tagIds || tagIds.length === 0) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('status', 'published')
      .overlaps('tag_ids', tagIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching photos:', error);
      return [];
    }

    // Extract all image URLs from the images array of each photo
    const allImageUrls: string[] = [];
    
    (data || []).forEach((photo: any) => {
      // Use the images array if it exists and has items
      if (photo.images && Array.isArray(photo.images) && photo.images.length > 0) {
        // Add all images from the images array
        photo.images.forEach((imageUrl: string) => {
          if (imageUrl && typeof imageUrl === 'string') {
            allImageUrls.push(imageUrl);
          }
        });
      } else if (photo.image_url) {
        // Fallback to single image_url if images array is empty
        allImageUrls.push(photo.image_url);
      }
    });

    return allImageUrls;
  } catch (error) {
    console.error('Error in fetchPhotosByTags:', error);
    return [];
  }
}
