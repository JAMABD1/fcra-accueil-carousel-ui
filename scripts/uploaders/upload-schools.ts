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
const STORAGE_FOLDER = 'schools';
const normalizedPublicUrl = `${PUBLIC_URL.replace(/\/+$/, '')}/fcra-sitweb`;

interface SchoolData {
  id: string;
  name: string;
  description: string;
  type: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  subtitle: string | null;
  coordonneId: string | null;
  tagId: string | null;
  videoId: string | null;
  active: boolean;
  sortOrder: number;
}

const schools: SchoolData[] = [
  {
    id: '64c63ab1-fb8f-479d-ad0f-107743b44b3a',
    name: 'École La Sagesse',
    description: 'Située à Antaniavo, Antananarivo, l’École La Sagesse est une institution d’excellence qui se distingue par la qualité de son enseignement et son engagement à former des élèves accomplis, dotés d’une solide culture générale et d’une parfaite maîtrise du français.',
    type: 'primaire',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/schools/school-1756195071675.jpg',
    createdAt: '2025-08-26 07:57:28.066409+00',
    updatedAt: '2025-08-26 07:57:28.066409+00',
    subtitle: 'L’École La Sagesse affiche un taux de réussite de 100 % au Baccalauréat, au BEPC français et aux diplômes français reconnus internationalement.',
    coordonneId: null,
    tagId: '657a0af8-7449-4b0d-83bb-cc6e4541ef79',
    videoId: null,
    active: true,
    sortOrder: 0,
  },
];

const uploadCache = new Map<string, string>();

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

async function uploadImageToR2(sourceUrl: string, label: string): Promise<string> {
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

    const contentType = response.headers.get('content-type') ||
      (cacheKey.endsWith('.jpg') || cacheKey.endsWith('.jpeg') ? 'image/jpeg' :
        cacheKey.endsWith('.png') ? 'image/png' :
          'image/jpeg');

    const sanitizedLabel = label.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const extension = cacheKey.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i)?.[1]?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const fileName = `school_${timestamp}_${sanitizedLabel}.${extension}`;
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

  console.log(`Starting upload for ${schools.length} schools...\n`);

  const processed: Array<SchoolData & { r2ImageUrl: string }> = [];

  for (const school of schools) {
    try {
      const r2ImageUrl = await uploadImageToR2(school.imageUrl, `${school.name} image`);
      processed.push({
        ...school,
        r2ImageUrl,
      });
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to process "${school.name}", skipping...`, error);
    }
  }

  if (processed.length === 0) {
    console.log('No schools were processed successfully.');
    return;
  }

  const sql = `INSERT INTO schools (id, name, description, type, image_url, created_at, updated_at, subtitle, coordonne_id, tag_id, video_id, active, sort_order) VALUES
${processed
  .map((school, index) => {
    const comma = index < processed.length - 1 ? ',' : ';';
    const id = `'${school.id}'`;
    const name = `'${escapeSql(school.name)}'`;
    const description = `'${escapeSql(school.description)}'`;
    const type = `'${escapeSql(school.type)}'`;
    const imageUrl = `'${escapeSql(school.r2ImageUrl)}'`;
    const createdAt = `'${escapeSql(school.createdAt)}'`;
    const updatedAt = `'${escapeSql(school.updatedAt)}'`;
    const subtitle = school.subtitle ? `'${escapeSql(school.subtitle)}'` : 'NULL';
    const coordonneId = school.coordonneId ? `'${escapeSql(school.coordonneId)}'` : 'NULL';
    const tagId = school.tagId ? `'${escapeSql(school.tagId)}'` : 'NULL';
    const videoId = school.videoId ? `'${escapeSql(school.videoId)}'` : 'NULL';
    const active = school.active;
    const sortOrder = school.sortOrder;

    return `  (${id}, ${name}, ${description}, ${type}, ${imageUrl}, ${createdAt}, ${updatedAt}, ${subtitle}, ${coordonneId}, ${tagId}, ${videoId}, ${active}, ${sortOrder})${comma}`;
  })
  .join('\n')}`;

  console.log('\n=== SQL INSERT STATEMENTS ===\n');
  console.log(sql);
  fs.writeFileSync('schools-insert.sql', sql);
  console.log('\n✓ SQL saved to schools-insert.sql');
  console.log(`\n✓ Successfully processed ${processed.length} school(s)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


