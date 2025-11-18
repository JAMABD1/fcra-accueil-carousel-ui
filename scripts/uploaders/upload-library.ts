import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.VITE_AWS_S3_API_URL || process.env.AWS_S3_API_URL || '',
  credentials: {
    accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.VITE_AWS_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET_NAME || '';
const PUBLIC_URL = process.env.VITE_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || '';
const STORAGE_FOLDER = 'library';
const normalizedPublicUrl = `${PUBLIC_URL.replace(/\/+$/, '')}/fcra-sitweb`;

interface LibraryData {
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: string;
  downloads: number;
  featured: boolean;
  status: 'published' | 'draft';
  author: string | null;
}

const libraryItems: LibraryData[] = [
  {
    title: 'RAPPORT DES ACTIVITES DU FCRA [2023-2024]',
    description: 'RAPPORT DES ACTIVITES DU FCRA [2023-2024]',
    fileUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/library/1756194232097-rapport20232024.pdf',
    fileName: '1756194232097-rapport20232024.pdf',
    fileSize: 8929480,
    fileType: 'application/pdf',
    category: 'general',
    downloads: 2,
    featured: false,
    status: 'published',
    author: 'Daoud',
  },
];

const uploadCache = new Map<string, string>();

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

async function uploadFileToR2(sourceUrl: string, label: string): Promise<string> {
  const cacheKey = sourceUrl.trim();
  if (!cacheKey) {
    throw new Error(`Invalid source URL for ${label}`);
  }

  if (!uploadCache.has(cacheKey)) {
    console.log(`Downloading ${label}...`);
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${label}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const extension = sourceUrl.match(/\.[^./?]+$/)?.[0]?.toLowerCase() || '.bin';
    const sanitizedLabel = label.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const timestamp = Date.now();
    const fileName = `library_${timestamp}_${sanitizedLabel}${extension}`;
    const key = `${STORAGE_FOLDER}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'max-age=31536000',
    });

    await s3Client.send(command);
    const publicUrl = `${normalizedPublicUrl}/${key}`;
    console.log(`✓ Uploaded ${label} -> ${publicUrl}`);
    uploadCache.set(cacheKey, publicUrl);
  } else {
    console.log(`Skipping download for ${label}, already uploaded.`);
  }

  return uploadCache.get(cacheKey)!;
}

async function main() {
  if (!BUCKET_NAME || !PUBLIC_URL) {
    throw new Error('Missing required environment variables for R2 configuration.');
  }

  console.log(`Starting upload for ${libraryItems.length} library items...\n`);

  const processed: Array<LibraryData & { r2FileUrl: string }> = [];

  for (const item of libraryItems) {
    try {
      const r2FileUrl = await uploadFileToR2(item.fileUrl, item.title);
      processed.push({
        ...item,
        r2FileUrl,
      });
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to process "${item.title}", skipping...`, error);
    }
  }

  if (processed.length === 0) {
    console.log('No library items were processed successfully.');
    return;
  }

  const sql = `INSERT INTO library (title, description, file_url, file_name, file_size, file_type, category, downloads, featured, status, author) VALUES
${processed
  .map((item, index) => {
    const comma = index < processed.length - 1 ? ',' : ';';
    const title = `'${escapeSql(item.title)}'`;
    const description = `'${escapeSql(item.description)}'`;
    const fileUrl = `'${escapeSql(item.r2FileUrl)}'`;
    const fileName = `'${escapeSql(item.fileName)}'`;
    const fileSize = item.fileSize;
    const fileType = `'${escapeSql(item.fileType)}'`;
    const category = `'${escapeSql(item.category)}'`;
    const downloads = item.downloads;
    const featured = item.featured;
    const status = `'${escapeSql(item.status)}'`;
    const author = item.author ? `'${escapeSql(item.author)}'` : 'NULL';

    return `  (${title}, ${description}, ${fileUrl}, ${fileName}, ${fileSize}, ${fileType}, ${category}, ${downloads}, ${featured}, ${status}, ${author})${comma}`;
  })
  .join('\n')}`;

  console.log('\n=== SQL INSERT STATEMENTS ===\n');
  console.log(sql);
  fs.writeFileSync('library-insert.sql', sql);
  console.log('\n✓ SQL saved to library-insert.sql');
  console.log(`\n✓ Successfully processed ${processed.length} library item(s)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


