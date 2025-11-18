// upload-directors-images.ts
// Run this script with: npx tsx upload-directors-images.ts
// Make sure your R2 environment variables are set

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';

// R2 Configuration
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
const STORAGE_FOLDER = 'directors';
const normalizedPublicUrl = `${PUBLIC_URL.replace(/\/+$/, '')}/fcra-sitweb`;

interface DirectorData {
  name: string;
  imageUrl: string;
  job: string;
  responsibility: string | null;
  sortOrder: number;
  isDirector: boolean;
  active: boolean;
}

const directors: DirectorData[] = [
  {
    name: 'Mme MALEKA  AKBARALY',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/directors/0.6649553048750235.jpg',
    job: 'Chef de section Orphelinat',
    responsibility: null,
    sortOrder: 1,
    isDirector: false,
    active: true,
  },
  {
    name: 'Mr ZAHIR  ALI',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/directors/0.2250945014223079.jpeg',
    job: 'Directeur Général',
    responsibility: null,
    sortOrder: 0,
    isDirector: false,
    active: true,
  },
  {
    name: 'Mr Abdallah Rocky',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/directors/0.9747696212707059.jpg',
    job: 'Directeur régional de Manakara',
    responsibility: null,
    sortOrder: 4,
    isDirector: false,
    active: true,
  },
  {
    name: 'Mr MADJID',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/directors/0.656835169236634.jpeg',
    job: 'Chef Section Hawza et Shouyouk',
    responsibility: null,
    sortOrder: 2,
    isDirector: false,
    active: true,
  },
  {
    name: 'Said MOHAMMAD',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/directors/0.8674204051912804.JPG',
    job: 'Chef Section MADRESSAT',
    responsibility: null,
    sortOrder: 3,
    isDirector: false,
    active: true,
  },
  {
    name: 'Mme ASMA',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/directors/0.3669474695154019.jpg',
    job: 'Chef the Section R.V.S',
    responsibility: null,
    sortOrder: 4,
    isDirector: false,
    active: true,
  },
  {
    name: 'Dr.  NJATOVO',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/directors/0.18176812443344448.jpg',
    job: 'Medicien Chef',
    responsibility: null,
    sortOrder: 5,
    isDirector: false,
    active: true,
  },
  {
    name: 'Mme HAINGO',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/directors/0.6218663362279212.jpg',
    job: 'Chef Section Education',
    responsibility: null,
    sortOrder: 6,
    isDirector: false,
    active: true,
  },
  {
    name: 'Mr ARMAND',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/directors/0.33921729373892595.jpg',
    job: 'Directeur de Ressouces Humaines',
    responsibility: null,
    sortOrder: 7,
    isDirector: false,
    active: true,
  },
  {
    name: 'Sheick AKBARALY HANIPHE',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/directors/0.31598404349121967.jpeg',
    job: 'Président-directeur général et fondateur',
    responsibility: null,
    sortOrder: 0,
    isDirector: true,
    active: true,
  },
];

async function uploadImageToR2(imageUrl: string, directorName: string): Promise<string> {
  try {
    console.log(`Downloading image for ${directorName}...`);
    
    // Fetch image from Supabase (using native fetch in Node.js 18+)
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Get content type from response or infer from URL
    const contentType = response.headers.get('content-type') || 
      (imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') ? 'image/jpeg' : 
       imageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg');
    
    // Generate filename from director name
    const sanitizedName = directorName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const timestamp = Date.now();
    const extension = imageUrl.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i)?.[1]?.toLowerCase() || 'jpg';
    const fileName = `director_${timestamp}_${sanitizedName}.${extension}`;
    const key = `${STORAGE_FOLDER}/${fileName}`;
    
    console.log(`Uploading to R2: ${key}...`);
    
    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'max-age=31536000',
    });
    
    await s3Client.send(command);
    
    // Generate public URL
    const publicUrl = `${normalizedPublicUrl}/${key}`;
    console.log(`✓ Uploaded: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading image for ${directorName}:`, error);
    throw error;
  }
}

async function main() {
  console.log('Starting image upload process...\n');
  
  const sqlStatements: string[] = [];
  const uploadedDirectors: Array<DirectorData & { r2ImageUrl: string }> = [];
  
  for (const director of directors) {
    try {
      const r2ImageUrl = await uploadImageToR2(director.imageUrl, director.name);
      uploadedDirectors.push({ ...director, r2ImageUrl });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to upload image for ${director.name}, skipping...`);
    }
  }
  
  console.log('\n=== SQL INSERT STATEMENTS ===\n');
  
  const sql = `INSERT INTO directors (name, image_url, job, responsibility, sort_order, is_director, active) VALUES\n${uploadedDirectors.map((d, index) => {
    const name = d.name.replace(/'/g, "''"); // Escape single quotes
    const job = d.job.replace(/'/g, "''");
    const imageUrl = d.r2ImageUrl.replace(/'/g, "''");
    const responsibility = d.responsibility ? `'${d.responsibility.replace(/'/g, "''")}'` : 'NULL';
    const comma = index < uploadedDirectors.length - 1 ? ',' : ';';
    
    return `('${name}', '${imageUrl}', '${job}', ${responsibility}, ${d.sortOrder}, ${d.isDirector}, ${d.active})${comma}`;
  }).join('\n')}`;
  
  console.log(sql);
  
  // Also save to file
  fs.writeFileSync('directors-insert.sql', sql);
  console.log('\n✓ SQL saved to directors-insert.sql');
  
  console.log(`\n✓ Successfully processed ${uploadedDirectors.length} directors`);
}

main().catch(console.error);

