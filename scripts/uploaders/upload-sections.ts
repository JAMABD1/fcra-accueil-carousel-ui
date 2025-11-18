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
const STORAGE_FOLDER = 'sections';
const normalizedPublicUrl = `${PUBLIC_URL.replace(/\/+$/, '')}/fcra-sitweb`;

interface SectionData {
  title: string;
  subtitle: string | null;
  description: string;
  imageUrl: string;
  tagName: string | null;
  active: boolean;
  sortOrder: number;
}

const sections: SectionData[] = [
  {
    title: 'RVS',
    subtitle: 'Formation professionnelle',
    description: 'Programmes de formation et développement des compétences.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/sections/0.6039635795448833.JPG',
    tagName: 'Education',
    active: true,
    sortOrder: 3,
  },
  {
    title: 'Educations',
    subtitle: 'Éducation : semer aujourd’hui, construire demain',
    description: 'Au FCRA, l’éducation est une priorité absolue. Convaincu que le savoir est un levier fondamental pour le développement individuel et collectif, le FCRA s’engage à offrir un enseignement de qualité à tous les niveaux, dans un cadre alliant rigueur, bienveillance et excellence.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/sections/0.25256704088596216.png',
    tagName: 'Education',
    active: true,
    sortOrder: 2,
  },
  {
    title: 'RELIGION',
    subtitle: 'La spiritualité occupe une place centrale au sein de notre centre, où chaque année, de nombreux événements religieux rassemblent fidèles, familles et communautés dans un esprit de partage, de foi et de solidarité.',
    description: 'Parmi les temps forts, le mois sacré du Ramadan est un moment particulièrement symbolique. À cette occasion, notre centre organise de vastes actions sociales : plus de 10 000 repas sont servis chaque jour dans plus de dix communes dans la capitale, offrant ainsi soutien et réconfort aux plus démunis.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/sections/0.22669060998676016.jpg',
    tagName: null,
    active: true,
    sortOrder: 5,
  },
  {
    title: 'Orphelinat',
    subtitle: 'Actuellement, plus de 230 enfants — filles et garçons — bénéficient d’un accompagnement global au sein de nos structures : hébergement, alimentation, soins, éducation et encadrement affectif.',
    description: `Notre engagement envers les orphelins.\n\nAu cœur des actions du FCRA, l’accueil et la prise en charge des orphelins occupent une place essentielle. À Madagascar, nous gérons quatre centres d’orphelinat situés à Antaniavo, Andakana, Manakara et Sakoana, offrant un refuge sûr, stable et bienveillant à des enfants privés de soutien familial.\n\nActuellement, plus de 230 enfants — filles et garçons — bénéficient d’un accompagnement global au sein de nos structures : hébergement, alimentation, soins, éducation et encadrement affectif. Chaque centre est pensé comme un véritable foyer, où les enfants peuvent s’épanouir, apprendre et se construire un avenir digne et prometteur. \n\nNotre objectif est simple mais fondamental : redonner à chaque enfant la sécurité, la dignité et l’amour dont il a besoin pour grandir sereinement.\n\n`,
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/sections/0.15153585350972287.jpg',
    tagName: 'Communauté',
    active: true,
    sortOrder: 1,
  },
  {
    title: 'SANTE',
    subtitle: 'Santé : des soins accessibles pour tous',
    description: 'Parce que le développement passe aussi par la santé, le FCRA s’engage à faciliter l’accès aux soins de qualité pour les populations les plus vulnérables à Madagascar. À travers plusieurs structures médicales, ouvertes à tous, l\'association répond aux besoins essentiels des communautés, dans un esprit de solidarité, d’humanité et de professionnalisme.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/sections/0.2912770311758134.png',
    tagName: null,
    active: true,
    sortOrder: 4,
  },
  {
    title: 'Enseignement supérieur',
    subtitle: 'Enseignement supérieur – Un tremplin vers l’excellence académique',
    description: `Enseignement supérieur – Un tremplin vers l’excellence académique\n\nAu-delà de la formation technique, le FCRA s’engage à soutenir l’accès équitable à l’enseignement supérieur, convaincu que chaque jeune mérite une chance de poursuivre ses études, quelle que soit son origine.\n\n`,
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/sections/0.5267521811582525.JPG',
    tagName: null,
    active: true,
    sortOrder: 7,
  },
  {
    title: 'INFOPRO',
    subtitle: 'INFOPRO – Institut de Formation Professionnelle',
    description: 'Dans le prolongement de ses actions éducatives, le FCRA a mis en place l’Institut de Formation Professionnelle (INFOPRO) afin de répondre aux besoins concrets des jeunes en quête d’autonomie et d’insertion professionnelle.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/sections/0.02113474329689613.jpg',
    tagName: null,
    active: true,
    sortOrder: 6,
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
    const fileName = `section_${timestamp}_${sanitizedLabel}.${extension}`;
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

  console.log(`Starting upload for ${sections.length} sections...\n`);

  const processed: Array<SectionData & { r2ImageUrl: string }> = [];

  for (const section of sections) {
    try {
      const r2ImageUrl = await uploadImageToR2(section.imageUrl, `${section.title} image`);
      processed.push({
        ...section,
        r2ImageUrl,
      });
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to process "${section.title}", skipping...`, error);
    }
  }

  if (processed.length === 0) {
    console.log('No sections were processed successfully.');
    return;
  }

  const sql = `INSERT INTO sections (title, subtitle, description, image_url, tag_name, active, sort_order) VALUES
${processed.map((section, index) => {
  const comma = index < processed.length - 1 ? ',' : ';';
  const title = `'${escapeSql(section.title)}'`;
  const subtitle = section.subtitle ? `'${escapeSql(section.subtitle)}'` : 'NULL';
  const description = `'${escapeSql(section.description)}'`;
  const imageUrl = `'${escapeSql(section.r2ImageUrl)}'`;
  const tagName = section.tagName ? `'${escapeSql(section.tagName)}'` : 'NULL';
  const active = section.active;
  const sortOrder = section.sortOrder;

  return `  (${title}, ${subtitle}, ${description}, ${imageUrl}, ${tagName}, ${active}, ${sortOrder})${comma}`;
}).join('\n')}`;

  console.log('\n=== SQL INSERT STATEMENTS ===\n');
  console.log(sql);
  fs.writeFileSync('sections-insert.sql', sql);
  console.log('\n✓ SQL saved to sections-insert.sql');
  console.log(`\n✓ Successfully processed ${processed.length} sections`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


