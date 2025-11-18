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
const STORAGE_FOLDER = 'hero';
const normalizedPublicUrl = `${PUBLIC_URL.replace(/\/+$/, '')}/fcra-sitweb`;

interface HeroData {
  title: string;
  subtitle: string;
  imageUrl: string;
  sortOrder: number;
}

const heroData: HeroData[] = [
  {
    title: '❤️ SANTÉ – Votre Bien-être, Notre Priorité',
    subtitle: 'Des soins de qualité, une écoute attentive, une vie en meilleure santé.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.5877338210162004.png',
    sortOrder: 5,
  },
  {
    title: '🌿 SANTÉ – Ensemble pour une Vie Plus Saine',
    subtitle: 'Prévenir, soigner, accompagner… chaque jour à vos côtés.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.5389802852267427.png',
    sortOrder: 6,
  },
  {
    title: '🤝 Religion – Unis par la Foi, Liés par la Fraternité',
    subtitle: 'Ensemble, dans l’amour, la paix et le respect.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.3534862128748877.png',
    sortOrder: 3,
  },
  {
    title: '💖 Religion – Fondée sur l’Amour, Guidée par la Foi',
    subtitle: 'L’amour comme lien sacré entre tous les êtres.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.9314543297353847.png',
    sortOrder: 1,
  },
  {
    title: 'Savoir et Solidarité : Bâtir Ensemble l’Avenir',
    subtitle: 'Ensemble, cultivons le savoir pour construire un avenir solidaire et prometteur',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.34513651409246704.jpg',
    sortOrder: 4,
  },
  {
    title: "L'Éducation, au Cœur de Notre Mission",
    subtitle: 'Semer aujourd’hui le savoir pour récolter demain un monde plus juste et solidaire.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.6127954118387533.png',
    sortOrder: 1,
  },
  {
    title: 'L’Excellence Académique au Service du Développement',
    subtitle: 'Former les esprits, façonner l’avenir – l’Université comme levier de transformation sociale',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.2504889766184635.JPG',
    sortOrder: 3,
  },
  {
    title: 'Santé et Solidarité : Ensemble pour une Vie Meilleure',
    subtitle: 'Informer, Sensibiliser, Guérir – Au service des familles et des générations futures.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.3590525628942469.jpg',
    sortOrder: 0,
  },
  {
    title: 'Devenez l’expert que les entreprises recherchent',
    subtitle: 'Des formations ciblées, un savoir-faire reconnu, une carrière en main.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.6065543209965931.jpg',
    sortOrder: 0,
  },
  {
    title: 'Un Abri d’Amour et d’Espoir pour Tous',
    subtitle: 'Là où chaque enfant trouve un foyer, un sourire et un avenir.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.14041074343680815.jpg',
    sortOrder: 2,
  },
  {
    title: 'Une Éducation de Cœur et d’Avenir pour Chaque Orphelin',
    subtitle: 'Former aujourd’hui les bâtisseurs de demain',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.7910163863333743.jpg',
    sortOrder: 1,
  },
  {
    title: 'Bien-être et Joie : Construisons les Sourires de Demain',
    subtitle: 'Aimer, Éduquer, Valoriser – Ensemble pour la dignité et le bonheur des enfants.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.022578661477292483.jpg',
    sortOrder: 2,
  },
  {
    title: 'Bienvenu Chez FCRA',
    subtitle: "Bienvenue chez FCRA, là où l'engagement social rencontre le développement durable pour bâtir un avenir meilleur.",
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.014504032303463643.jpg',
    sortOrder: 0,
  },
  {
    title: 'Un Refuge d’Espoir pour Chaque Orphelin',
    subtitle: 'Offrir amour, sécurité et un avenir à ceux qui en ont le plus besoin.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.3679900445847879.JPG',
    sortOrder: 3,
  },
  {
    title: "L'Éducation, au Cœur de Notre Mission",
    subtitle: 'Semer aujourd’hui le savoir pour récolter demain un monde plus juste et solidaire.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.8288957702980077.jpg',
    sortOrder: 0,
  },
  {
    title: "L'Éducation, au Cœur de Notre Mission",
    subtitle: 'Semer aujourd’hui le savoir pour récolter demain un monde plus juste et solidaire.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.45715677988154657.png',
    sortOrder: 1,
  },
  {
    title: 'Innover, transformer grâce à l’éducation et la recherche',
    subtitle: 'Excellence en éducation et recherche pour un monde meilleur',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.2843331093377043.png',
    sortOrder: 2,
  },
  {
    title: 'Radio Voix de la Sagesse – Ny Feon’ny Fahendrena',
    subtitle: 'Informer, Éduquer, Instruire – Au service du peuple malgache et de ses valeurs.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.5997887905630237.jpg',
    sortOrder: 2,
  },
  {
    title: 'INFOPRO – Transformez vos Compétences en Carrière',
    subtitle: 'Des formations pratiques, un savoir concret, un avenir assuré.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.4957085375298993.jpg',
    sortOrder: 1,
  },
  {
    title: '🎓 INFOPRO – Ouvrez la Porte de Votre Avenir',
    subtitle: 'Formations professionnelles d’excellence pour bâtir votre réussite.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/hero/0.8790798172110144.jpg',
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
    const fileName = `hero_${timestamp}_${sanitizedLabel}.${extension}`;
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

  console.log(`Starting upload for ${heroData.length} hero entries...\n`);

  const processed: Array<HeroData & { r2ImageUrl: string }> = [];

  for (const hero of heroData) {
    try {
      const r2ImageUrl = await uploadImageToR2(hero.imageUrl, `${hero.title} image`);
      processed.push({
        ...hero,
        r2ImageUrl,
      });
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to process "${hero.title}", skipping...`, error);
    }
  }

  if (processed.length === 0) {
    console.log('No hero entries were processed successfully.');
    return;
  }

  const sql = `INSERT INTO hero (title, subtitle, image_url, sort_order) VALUES
${processed.map((hero, index) => {
  const comma = index < processed.length - 1 ? ',' : ';';
  const title = `'${escapeSql(hero.title)}'`;
  const subtitle = `'${escapeSql(hero.subtitle)}'`;
  const imageUrl = `'${escapeSql(hero.r2ImageUrl)}'`;
  const sortOrder = hero.sortOrder;

  return `  (${title}, ${subtitle}, ${imageUrl}, ${sortOrder})${comma}`;
}).join('\n')}`;

  console.log('\n=== SQL INSERT STATEMENTS ===\n');
  console.log(sql);
  fs.writeFileSync('hero-insert.sql', sql);
  console.log('\n✓ SQL saved to hero-insert.sql');
  console.log(`\n✓ Successfully processed ${processed.length} hero entries`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


