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
const STORAGE_FOLDER = 'article-images';
const normalizedPublicUrl = `${PUBLIC_URL.replace(/\/+$/, '')}/fcra-sitweb`;

interface ArticleData {
  title: string;
  content: string;
  author: string | null;
  featured: boolean;
  status: 'published' | 'draft';
  images: string[];
}

const articles: ArticleData[] = [
  {
    title: 'DON DE LA FONDATION AXIAN',
    content: `# DON DE LA FONDATION AXIAN

En ce jeudi 7 août 2025, **la Fondation AXIAN** a procédé à la remise de plus de mille (1 000) kits scolaires au profit du FCRA.

Ces fournitures, composées de matériel essentiel pour la rentrée, sont destinées aux enfants orphelins et vulnérables pris en charge dans les différents centres du FCRA : 

* Antaniavo,

*  Andakana, 

*  Manakara 

*  Sakoana.

Ce geste s’inscrit dans le cadre d’un partenariat solide entre le FCRA et la Fondation AXIAN, qui perdure depuis maintenant quatre années et continue de porter ses fruits.

Le FCRA exprime toute sa reconnaissance et sa profonde gratitude à la Fondation AXIAN pour ce don généreux et renouvelé. Cet acte témoigne non seulement d’un engagement constant en faveur de l’éducation, mais aussi d’un profond attachement au bien-être et à l’épanouissement des enfants.

Grâce à ce don de kits scolaires , de nombreux élèves à travers le pays pourront entamer l’année scolaire avec confiance et sérénité, ouvrant ainsi la voie vers un avenir plus prometteur.
`,
    author: 'Mika',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.522107465549533.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.9484399924743505.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.6566454020757041.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.18336945220015743.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.7369543585262787.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.42646956418517146.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.7280229832318775.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.7604830366867829.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.45689094626550764.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.5088163856859993.jpg',
    ],
  },
  {
    title: 'Étudier à l’étranger : le FCRA ouvre les portes du possible!',
    content: `# Étudier à l’étranger : le FCRA ouvre les portes du possible!

Grâce au **partenariat entre le FCRA et Parul University (Inde)**,sept jeunes talentueux issus de l’orphelinat Zaynabia ont obtenu une bourse d’études dans des filières d’avenir telles que l’informatique, le management, la finance et la comptabilité. Cette opportunité exceptionnelle leur ouvre les portes d’un enseignement supérieur de qualité dans un environnement international, leur permettant d’acquérir des compétences solides et reconnues sur le marché mondial.

Le 12 juillet 2025, ces jeunes ont quitté Madagascar, le cœur rempli d’espoir, de fierté et de rêves pour l’avenir. Leur départ est l’aboutissement d’un long parcours, débuté sur les bancs de l’école primaire, poursuivi avec persévérance jusqu’à l’obtention de leur baccalauréat. Tout au long de ce chemin, leur détermination a été soutenue par l’accompagnement constant du FCRA, qui a su leur fournir les outils et les encouragements nécessaires pour franchir chaque étape avec succès.

Ce partenariat avec **Parul University** illustre parfaitement la mission que s’est fixée le FCRA : offrir à la jeunesse défavorisée un accès à une éducation de qualité et à de véritables opportunités professionnelles. En permettant à ces étudiants de se former dans des domaines stratégiques, le FCRA investit dans des compétences qui contribueront au développement économique et social, non seulement pour eux-mêmes, mais aussi pour leur communauté et leur pays.

Une graine d’espoir a été plantée aujourd’hui, et elle portera ses fruits demain. Ces sept boursiers représentent la promesse d’une génération de leaders, capables de relever les défis du monde moderne et d’inspirer d’autres jeunes à croire en leurs rêves. Leur réussite future sera la preuve que, grâce à l’éducation et à la solidarité, il est possible de transformer des vies et de bâtir un avenir meilleur pour tous.`,
    author: 'Jaolaza',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.330244020670991.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.018173792596769323.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.5187257327612212.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.7795467711914382.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.7431756244545031.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.09208302863838058.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.10132738209133163.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.6770324274906429.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.3755640781123898.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.21823560943295006.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.6445287405608744.jpg',
    ],
  },
  {
    title: 'Installation de la pierre angulaire de la maternité Baneen CR Tatao-Manakara',
    content: `# Installation de la pierre angulaire de la maternité Baneen CR Tatao-Manakara

L'installation de la pierre angulaire de la construction de la maternité BANEEN dans la commune rurale de Tatao, district de **Manakara**, a eu lieu le samedi 28 juin 2025 dernier. Cette infrastructure est érigée grâce au partenariat entre la **Communauté Khoja de Madagascar, le FCRA (Fifanampiana Centre Rassoul Akram)**, ainsi que les différentes autorités administratives du district de Manakara, comprenant les députés, le gouverneur de la région Fitovinany, et le maire de la commune de Tatao.

Cette maternité privée répondra aux normes internationales établies par le ministère de la Santé publique. Elle comprendra une salle d’accouchement, une salle d’opération, ainsi que des équipements tels que des couveuses, entre autres. Elle vise à répondre directement aux besoins de la population, en particulier des mères et des nouveau-nés au sein de la commune de Tatao et ses environs. La réalisation des travaux est prévue pour une durée de 8 mois.
`,
    author: 'Dina',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.22723753924064172.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.4360452183004816.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.5175493741164907.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.5748338070526294.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.47586887260844435.jpg',
    ],
  },
  {
    title: "Fankalazana ny nahaterahan'ilay mpaminany MOUHAMMAD (saw)",
    content: `Alahady 21 septambra 2025

Nomarihina tamin'ny Majlis lehibe  ny volan'ny fankalazana ny nahaterahan'ilay mpaminany MOUHAMMAD (saw) teto amin'ny FCRA (Fifanampiana Centre Rassoul Akram) Antaniavo Antohomadinika.

Tonga nanotrona izany fotoan-dehibe izany ny minisitry ny tanora sy ny fanatanjahan-tena MARSON Abdulah Moustapha,  ny masoivohon'i Indonezia KUTAP RI Lanang Seputro ary ireo olo-manan-kaja maro.`,
    author: 'Dina',
    featured: true,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.986725569884524.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.5105184294125136.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.519595501564845.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.746509041954287.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.6658796744450833.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.6562332746449162.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.6496966685434983.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.746707885766893.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.5659285232432556.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.1768301737250202.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.3156064662321404.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.9629597119266158.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.8851195894393652.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.5735752018052596.jpg',
    ],
  },
  {
    title: "Inauguration du nouveau bâtiment de l’école La Sagesse Universelle",
    content: `# Inauguration du nouveau bâtiment de l’école La Sagesse Universelle à Ambohitrinibe Andakana

Le FCRA ne cesse d’étendre ses infrastuctures !

L’inauguration officielle du nouveau batiment de l’école La sagesse universelle Ambohitrinibe Andakana a eu lieu le samedi 20 septembre 2025.

 Une cérémonie officielle sous la houlette du ministère de l’éducation nationale représentée par **minisitre de la jeunesse et des sports, MARSON Abdulah Moustapha**, en présence également de la famille du donateur représentée par **Al Haj Raza-Aly Hiridjee**  ainsi que des hautes personnalités et les parents d’élèves venus nombreux.

 L’école La sagesse universelle ouvre ses portes à tous les enfants malagasy sans distinction.`,
    author: 'Dina',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.2609536883228848.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.5540490587269445.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.9329109349215741.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.6057013236175286.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.7289320003602519.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.5889666934142631.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/article-images/0.911317559457085.jpg',
    ],
  },
];

const uploadCache = new Map<string, string>();

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function formatJsonArray(values: string[]): string {
  const json = JSON.stringify(values);
  return `'${escapeSql(json)}'::jsonb`;
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
    const fileName = `article_${timestamp}_${sanitizedLabel}.${extension}`;
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

  console.log(`Starting upload for ${articles.length} articles...\n`);

  const processed: Array<ArticleData & { r2Images: string[] }> = [];

  for (const article of articles) {
    try {
      const r2Images: string[] = [];
      for (const [index, imageUrl] of article.images.entries()) {
        const uploadedUrl = await uploadImageToR2(imageUrl, `${article.title} image ${index + 1}`);
        r2Images.push(uploadedUrl);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      processed.push({
        ...article,
        r2Images,
      });

      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Failed to process "${article.title}", skipping...`, error);
    }
  }

  if (processed.length === 0) {
    console.log('No articles were processed successfully.');
    return;
  }

  const sql = `INSERT INTO articles (title, content, author, featured, status, images) VALUES
${processed
  .map((article, index) => {
    const comma = index < processed.length - 1 ? ',' : ';';
    const title = `'${escapeSql(article.title)}'`;
    const content = `'${escapeSql(article.content)}'`;
    const author = article.author ? `'${escapeSql(article.author)}'` : 'NULL';
    const featured = article.featured;
    const status = `'${escapeSql(article.status)}'`;
    const images = formatJsonArray(article.r2Images);

    return `  (${title}, ${content}, ${author}, ${featured}, ${status}, ${images})${comma}`;
  })
  .join('\n')}`;

  console.log('\n=== SQL INSERT STATEMENTS ===\n');
  console.log(sql);
  fs.writeFileSync('articles-insert.sql', sql);
  console.log('\n✓ SQL saved to articles-insert.sql');
  console.log(`\n✓ Successfully processed ${processed.length} articles`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


