import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Use Vite's environment variables (must be prefixed with VITE_)
const s3Client = new S3Client({
  region: 'auto',
  endpoint: import.meta.env.VITE_AWS_S3_API_URL || import.meta.env.AWS_S3_API_URL || '',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || import.meta.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || import.meta.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = import.meta.env.VITE_AWS_S3_BUCKET_NAME || import.meta.env.AWS_S3_BUCKET_NAME || '';
const PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || import.meta.env.R2_PUBLIC_URL || '';
const R2_PREFIX = 'fcra-sitweb'; // Prefix for all R2 file paths

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

/**
 * Upload a file to Cloudflare R2
 */
export const uploadFile = async (
  file: File,
  key: string,
  options: {
    contentType?: string;
    cacheControl?: string;
  } = {}
): Promise<UploadResult> => {
  try {
    const { contentType = file.type, cacheControl = 'max-age=31536000' } = options;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: contentType,
      CacheControl: cacheControl,
    });

    await s3Client.send(command);

    // Add fcra-sitweb prefix to public URL (storage key has no prefix)
    // Remove any existing prefix from key first (for backward compatibility)
    const cleanKey = key.startsWith(`${R2_PREFIX}/`) 
      ? key.replace(new RegExp(`^${R2_PREFIX}/+`), '')
      : key;
    const publicUrl = `${PUBLIC_URL}/${R2_PREFIX}/${cleanKey}`;
    
    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    };
  }
};

/**
 * Delete a file from Cloudflare R2
 */
export const deleteFile = async (key: string): Promise<DeleteResult> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return {
      success: true,
    };
  } catch (error) {
    console.error('R2 delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown delete error',
    };
  }
};

/**
 * Generate a public URL for a file
 */
export const getPublicUrl = (key: string): string => {
  // Remove any existing fcra-sitweb prefix from key (for backward compatibility)
  // Then add fcra-sitweb prefix to the public URL
  const cleanKey = key.startsWith(`${R2_PREFIX}/`) 
    ? key.replace(new RegExp(`^${R2_PREFIX}/+`), '')
    : key;
  return `${PUBLIC_URL}/${R2_PREFIX}/${cleanKey}`;
};

/**
 * Upload an image with automatic key generation
 */
export const uploadImage = async (
  file: File,
  folder: string = 'images',
  prefix: string = ''
): Promise<UploadResult> => {
  const timestamp = Date.now();
  const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  // No prefix - upload directly to folder: sections/section...png
  const key = `${folder}/${prefix}${timestamp}-${fileName}`;

  return await uploadFile(file, key, {
    contentType: file.type,
    cacheControl: 'max-age=31536000', // 1 year cache
  });
};

/**
 * Upload a video with automatic key generation
 */
export const uploadVideo = async (
  file: File,
  folder: string = 'videos',
  prefix: string = ''
): Promise<UploadResult> => {
  const timestamp = Date.now();
  const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  // No prefix - upload directly to folder: videos/video...mp4
  const key = `${folder}/${prefix}${timestamp}-${fileName}`;

  return await uploadFile(file, key, {
    contentType: file.type,
    cacheControl: 'max-age=31536000', // 1 year cache
  });
};

/**
 * Upload a document with automatic key generation
 */
export const uploadDocument = async (
  file: File,
  folder: string = 'documents',
  prefix: string = ''
): Promise<UploadResult> => {
  const timestamp = Date.now();
  const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  // No prefix - upload directly to folder: documents/doc...pdf
  const key = `${folder}/${prefix}${timestamp}-${fileName}`;

  return await uploadFile(file, key, {
    contentType: file.type,
    cacheControl: 'max-age=3600', // 1 hour cache for documents
  });
};
