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
const VIDEO_FILE_FOLDER = 'videos';
const VIDEO_THUMBNAIL_FOLDER = 'video-thumbnails';
const normalizedPublicUrl = `${PUBLIC_URL.replace(/\/+$/, '')}/fcra-sitweb`;

type VideoType = 'upload' | 'youtube' | 'facebook';

interface VideoData {
  title: string;
  description: string;
  excerpt: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  author: string | null;
  tags: string[];
  featured: boolean;
  status: 'published' | 'draft';
  duration: number | null;
  fileSize: number | null;
  videoType: VideoType;
  youtubeId: string | null;
  facebookIframe: string | null;
}

const videosData: VideoData[] = [
  {
    title: 'FCRA & Parul University : un partenariat au service de l’avenir',
    description: `FCRA & Parul University : un partenariat au service de l’avenir. Le FCRA et Parul University unissent leurs forces dans un partenariat stratégique visant à offrir aux jeunes de nouvelles opportunités académiques et professionnelles. Dans le cadre de cette collaboration, le FCRA s’engage à envoyer chaque année des étudiants au sein de Parul University afin de leur permettre de bénéficier d’une formation de haut niveau, dans un environnement international et innovant. Cette initiative s’inscrit dans une vision commune : promouvoir l’excellence éducative, renforcer les compétences, et préparer les étudiants à relever les défis du monde moderne. Ensemble, ils œuvrent pour un avenir où la formation de qualité devient un levier essentiel de développement et d’épanouissement pour les générations futures.`,
    excerpt: 'FCRA & Parul University : un partenariat au service de l’avenir',
    videoUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/videos/1754637409689-AQMPCGrewLE08GFCy9Nqs3dvLA_IRB5otEYbVAmajSRlvf8UC_mRTOwTtH5DZ4jxzvSuF1h4M85uXPpGECd9BXicVJYktFf4DCZhPEsg68DfDw%20(1).mp4',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/video-thumbnails/1754637427941-vlcsnap-2025-08-08-10h04m54s693.png',
    author: 'Jaolaza',
    tags: ['571435d1-5b03-4c92-af3f-45e8febf8c94', 'ff2018ad-6921-424f-a3f4-71e2a32f69c0'],
    featured: false,
    status: 'published',
    duration: 270,
    fileSize: 34005162,
    videoType: 'upload',
    youtubeId: null,
    facebookIframe: null,
  },
  {
    title: 'REPORTAGE SUR LA POSE PIERRE DE LA MATERNITE BANEEN DANS LA COMMUNE RURALE DE TATAO - DISTRICT DE MANAKARA',
    description: `Un événement marquant s’est tenu dans la commune rurale de Tatao, district de Manakara, avec la cérémonie officielle de la pose de la première pierre de la future maternité BANEEN. Cette initiative, porteuse d’espoir pour la population locale, marque le début d’un projet ambitieux visant à améliorer l’accès aux soins de santé maternelle et infantile dans la région. La construction de cette maternité représente un pas décisif vers la réduction des risques liés à la grossesse et à l’accouchement, tout en offrant aux femmes et aux nouveau-nés un environnement médical adapté et sécurisé. Ce moment solennel, empreint d’émotion et de fierté, témoigne d’un engagement concret en faveur du bien-être et du développement communautaire.`,
    excerpt: 'Un événement marquant s’est tenu dans la commune rurale de Tatao, district de Manakara, avec la cérémonie officielle de la pose de la première pierre de la future maternité BANEEN.',
    videoUrl: null,
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/video-thumbnails/1754643093180-vlcsnap-2025-08-08-11h50m21s949.png',
    author: 'Jaolaza',
    tags: ['6b76cdd9-4b4f-4497-93ad-258cb1ffeac9'],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'youtube',
    youtubeId: 'BhYTUuCNCi4',
    facebookIframe: null,
  },
  {
    title: 'Bilan Moharram 2025 à Sakoana',
    description: `Le bilan du Moharram 2025 à Sakoana met en lumière une période riche en recueillement, en solidarité et en partage au sein de la communauté. Entre les cérémonies religieuses, les moments de prière collective et les activités de sensibilisation, cet événement a rassemblé fidèles, familles et jeunes autour de valeurs spirituelles et fraternelles. Ce temps fort a également permis de renforcer les liens sociaux et de perpétuer les traditions, tout en insufflant un message de paix, d’unité et de cohésion à l’ensemble des participants.`,
    excerpt: 'Le bilan du Moharram 2025 à Sakoana met en lumière une période riche en recueillement, en solidarité et en partage au sein de la communauté.',
    videoUrl: null,
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/video-thumbnails/1754643658679-vlcsnap-2025-08-08-12h00m31s092.png',
    author: 'Jaolaza',
    tags: ['8cb33fe7-ebf0-49b5-96f9-139b8444c3ff'],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'youtube',
    youtubeId: 'k1h3zKIutzM',
    facebookIframe: null,
  },
  {
    title: 'Iftar de la Fraternité au Radisson Blu : Chrétiens et Musulmans unis dans le partage et le dialogue',
    description: 'Iftar de la Fraternité au Radisson Blu : Chrétiens et Musulmans unis dans le partage et le dialogue.',
    excerpt: 'Iftar de la Fraternité au Radisson Blu : Chrétiens et Musulmans unis dans le partage et le dialogue.',
    videoUrl: null,
    thumbnailUrl: null,
    author: 'Dina',
    tags: [],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'facebook',
    youtubeId: null,
    facebookIframe: `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FfifanampinaCRA%2Fvideos%2F615928464754477%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
  },
  {
    title: 'Le FCRA Antohomadinika a célébré le Maoulid Nabi dans la ferveur et le partage',
    description: 'Le FCRA Antohomadinika a célébré le Maoulid Nabi dans la ferveur et le partage.',
    excerpt: 'Le FCRA Antohomadinika a célébré le Maoulid Nabi dans la ferveur et le partage.',
    videoUrl: null,
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/video-thumbnails/1758605832595-2.jpg',
    author: 'Dina',
    tags: ['8cb33fe7-ebf0-49b5-96f9-139b8444c3ff', 'ff2018ad-6921-424f-a3f4-71e2a32f69c0'],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'facebook',
    youtubeId: null,
    facebookIframe: `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FfifanampinaCRA%2Fvideos%2F1854942328743504%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
  },
  {
    title: 'Inauguration du nouveau bâtiment de l’école La Sagesse Universelle à Ambohitrinibe Andakana',
    description: `Inauguration du nouveau bâtiment de l’école La Sagesse Universelle à Ambohitrinibe Andakana. Tsy mitsahatra manitatra ny fotodrafitrasa ny FCRA. Tontosa androany sabotsy 20 septambra 2025 ny fitokanana tamin’ny fomba ofisialy ny fotodrafitrasa vaovao an’ny sekoly La Sagesse universelle Ambohitrinibe Andakana.`,
    excerpt: `Inauguration du nouveau bâtiment de l’école La Sagesse Universelle à Ambohitrinibe Andakana. Tsy mitsahatra manitatra ny fotodrafitrasa ny FCRA. Tontosa androany sabotsy 20 septambra 2025 ny fitokanana tamin’ny fomba ofisialy ny fotodrafitrasa vaovao an’ny sekoly La Sagesse universelle Ambohitrinibe Andakana.`,
    videoUrl: null,
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/video-thumbnails/1758606235194-548500469_1255751589923923_4019383048287369942_n.jpg',
    author: 'Dina',
    tags: ['ff2fe9c8-ac4e-4abb-9b35-e632219f9216', 'ff2018ad-6921-424f-a3f4-71e2a32f69c0'],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'youtube',
    youtubeId: 'wKjr4-EXO7w',
    facebookIframe: null,
  },
  {
    title: 'CLÔTURE DE L’ANNÉE SCOLAIRE POUR LES ETABLISSEMENTS SCOLAIRES LA SAGESSE (ANTANIAVO – ANDAKANA)',
    description: `La cérémonie de clôture de l’année scolaire s’est déroulée avec succès dans les établissements scolaires La Sagesse situés à Antaniavo et Andakana. Cet événement important marque la fin d’une année riche en apprentissages, en efforts et en progrès pour les élèves, les enseignants ainsi que l’ensemble du personnel éducatif. Tout au long de l’année, les établissements La Sagesse ont su offrir un environnement propice au développement intellectuel, social et moral des élèves, en veillant à maintenir un haut niveau d’excellence académique tout en cultivant des valeurs humaines fortes. Les enseignants ont déployé un travail acharné pour accompagner chaque élève dans son parcours scolaire, tout en favorisant l’épanouissement personnel et la réussite collective.`,
    excerpt: `La cérémonie de clôture de l’année scolaire s’est déroulée avec succès dans les établissements scolaires La Sagesse situés à Antaniavo et Andakana. Cet événement important marque la fin d’une année riche en apprentissages, en efforts et en progrès pour les élèves, les enseignants ainsi que l’ensemble du personnel éducatif.`,
    videoUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/videos/1754736886149-AQO_pZiHnrHfG8BtN93V9KgsUMqVcDRnP778P4VO4L-Xhfdn_l_HZb2Ho9NHVDIHIaY8ZRre7JlrEaoHQr9Hcr8v%20(1).mp4',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/video-thumbnails/1754736898052-vlcsnap-2025-08-09-13h54m03s986.png',
    author: null,
    tags: ['571435d1-5b03-4c92-af3f-45e8febf8c94', '657a0af8-7449-4b0d-83bb-cc6e4541ef79'],
    featured: false,
    status: 'published',
    duration: 297,
    fileSize: 35864625,
    videoType: 'upload',
    youtubeId: null,
    facebookIframe: null,
  },
  {
    title: 'Don de la fondation AXIAN',
    description: 'Don de la fondation AXIAN : Plus de de 1000 kits scolaires offerts aux enfants orphelins du FCRA.',
    excerpt: 'Don de la fondation AXIAN : Plus de de 1000 kits scolaires offerts aux enfants orphelins du FCRA.',
    videoUrl: null,
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/video-thumbnails/1755068228218-529264120_1213559930809756_8075648278572994471_n.jpg',
    author: 'Dina',
    tags: ['363e35e5-cc97-4568-a5ab-69888dc28893'],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'facebook',
    youtubeId: null,
    facebookIframe: `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FfifanampinaCRA%2Fvideos%2F1419739349252325%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
  },
  {
    title: 'Un voyage dans la Ville des Fleurs pour les enfants du FCRA',
    description: 'Le mérite scolaire récompensé par un voyage dans la Ville des Fleurs pour les enfants du FCRA.',
    excerpt: 'Le mérite scolaire récompensé par un voyage dans la Ville des Fleurs pour les enfants du FCRA.',
    videoUrl: null,
    thumbnailUrl: null,
    author: 'Dina',
    tags: [],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'facebook',
    youtubeId: null,
    facebookIframe: `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FfifanampinaCRA%2Fvideos%2F794182972936183%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
  },
  {
    title: 'VISITE MAIRE ANTANANARIVO AU FCRA',
    description: 'VISITE MAIRE ANTANANARIVO AU FCRA.',
    excerpt: 'VISITE MAIRE ANTANANARIVO AU FCRA.',
    videoUrl: null,
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/video-thumbnails/1755582439397-1.jpg',
    author: 'Dina',
    tags: [],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'facebook',
    youtubeId: null,
    facebookIframe: `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FfifanampinaCRA%2Fvideos%2F720616580705388%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
  },
  {
    title: 'Hommage solennel au Pape François',
    description: 'Le FCRA et l’AKSIAM transmettent leurs lettres de condoléances, accompagnées de celle de Sayed Al-Sistani, à la Nonciature Apostolique.',
    excerpt: 'Le FCRA et l’AKSIAM transmettent leurs lettres de condoléances, accompagnées de celle de Sayed Al-Sistani, à la Nonciature Apostolique.',
    videoUrl: null,
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/video-thumbnails/1755582711337-492194337_1113573297475087_5132862246694870593_n.jpg',
    author: 'Dina',
    tags: [],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'facebook',
    youtubeId: null,
    facebookIframe: `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FfifanampinaCRA%2Fvideos%2F988078326866742%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
  },
  {
    title: 'Maternité Baneen',
    description: 'Maternité Baneen: Un projet d’envergure pour la santé maternelle dans la commune rurale de Tataho, district de Manakara.',
    excerpt: 'Maternité Baneen: Un projet d’envergure pour la santé maternelle dans la commune rurale de Tataho, district de Manakara.',
    videoUrl: null,
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/video-thumbnails/1755850262705-536286082_1224151146417301_3014156249949456428_n.jpg',
    author: 'Dina',
    tags: ['6b76cdd9-4b4f-4497-93ad-258cb1ffeac9'],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'facebook',
    youtubeId: null,
    facebookIframe: `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FfifanampinaCRA%2Fvideos%2F1251819562919056%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
  },
  {
    title: 'PARTICIPATION DU LYCÉE PRIVÉ LA SAGESSE AU TANA SCHOOL EXPO',
    description: 'PARTICIPATION DU LYCÉE PRIVÉ LA SAGESSE AU TANA SCHOOL EXPO : UNE PREMIÈRE PARTICIPATION COURONNÉE DE SUCCÈS.',
    excerpt: 'PARTICIPATION DU LYCÉE PRIVÉ LA SAGESSE AU TANA SCHOOL EXPO : UNE PREMIÈRE PARTICIPATION COURONNÉE DE SUCCÈS.',
    videoUrl: null,
    thumbnailUrl: null,
    author: 'Dina',
    tags: ['657a0af8-7449-4b0d-83bb-cc6e4541ef79'],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'facebook',
    youtubeId: null,
    facebookIframe: `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FfifanampinaCRA%2Fvideos%2F1477214166987480%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
  },
  {
    title: 'Étudiants universitaires : Envolez-vous vers l’excellence à Parul University !',
    description: 'Étudiants universitaires : Envolez-vous vers l’excellence à Parul University !',
    excerpt: 'Étudiants universitaires : Envolez-vous vers l’excellence à Parul University !',
    videoUrl: null,
    thumbnailUrl: null,
    author: 'Khen Brada',
    tags: ['bd827394-5beb-4017-b644-eb17976869b5'],
    featured: false,
    status: 'published',
    duration: null,
    fileSize: null,
    videoType: 'facebook',
    youtubeId: null,
    facebookIframe: `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FfifanampinaCRA%2Fvideos%2F1399971034782957%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
  },
];

const uploadCache = new Map<string, string>();

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function formatJsonArray(values: string[]): string {
  if (!values || values.length === 0) {
    return `'[]'::jsonb`;
  }

  const json = JSON.stringify(values);
  return `'${escapeSql(json)}'::jsonb`;
}

function guessExtension(sourceUrl: string, contentType: string | null): string {
  const urlMatch = sourceUrl.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  if (urlMatch) {
    return urlMatch[1].toLowerCase();
  }

  if (contentType) {
    if (contentType.includes('mp4')) return 'mp4';
    if (contentType.includes('webm')) return 'webm';
    if (contentType.includes('png')) return 'png';
    if (contentType.includes('jpeg')) return 'jpg';
    if (contentType.includes('jpg')) return 'jpg';
  }

  return 'bin';
}

async function uploadAssetToR2(sourceUrl: string | null, label: string, folder: string): Promise<string | null> {
  if (!sourceUrl) {
    return null;
  }

  const cacheKey = `${folder}:${sourceUrl.trim()}`;
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
    const contentType = response.headers.get('content-type') || undefined;
    const sanitizedLabel = label.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const extension = guessExtension(sourceUrl, contentType || null);
    const timestamp = Date.now();
    const fileName = `${timestamp}_${sanitizedLabel}.${extension}`;
    const key = `${folder}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
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

  console.log(`Starting upload for ${videosData.length} videos...\n`);

  const processed: Array<VideoData & {
    r2VideoUrl: string | null;
    r2ThumbnailUrl: string | null;
  }> = [];

  for (const video of videosData) {
    try {
      const r2VideoUrl = video.videoType === 'upload'
        ? await uploadAssetToR2(video.videoUrl, `${video.title} video`, VIDEO_FILE_FOLDER)
        : null;

      const r2ThumbnailUrl = await uploadAssetToR2(
        video.thumbnailUrl,
        `${video.title} thumbnail`,
        VIDEO_THUMBNAIL_FOLDER,
      );

      processed.push({
        ...video,
        r2VideoUrl,
        r2ThumbnailUrl,
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Failed to process "${video.title}", skipping...`, error);
    }
  }

  if (processed.length === 0) {
    console.log('No videos were processed successfully.');
    return;
  }

  const sql = `INSERT INTO videos (title, description, excerpt, video_url, thumbnail_url, author, tags, featured, status, duration, file_size, video_type, youtube_id, facebook_iframe) VALUES
${processed
  .map((video, index) => {
    const comma = index < processed.length - 1 ? ',' : ';';
    const title = `'${escapeSql(video.title)}'`;
    const description = `'${escapeSql(video.description)}'`;
    const excerpt = video.excerpt ? `'${escapeSql(video.excerpt)}'` : 'NULL';
    const videoUrl = video.r2VideoUrl ? `'${escapeSql(video.r2VideoUrl)}'` : 'NULL';
    const thumbnailUrl = video.r2ThumbnailUrl ? `'${escapeSql(video.r2ThumbnailUrl)}'` : 'NULL';
    const author = video.author ? `'${escapeSql(video.author)}'` : 'NULL';
    const tags = formatJsonArray(video.tags);
    const featured = video.featured;
    const status = `'${escapeSql(video.status)}'`;
    const duration = typeof video.duration === 'number' ? video.duration : 'NULL';
    const fileSize = typeof video.fileSize === 'number' ? video.fileSize : 'NULL';
    const videoType = `'${escapeSql(video.videoType)}'`;
    const youtubeId = video.youtubeId ? `'${escapeSql(video.youtubeId)}'` : 'NULL';
    const facebookIframe = video.facebookIframe ? `'${escapeSql(video.facebookIframe)}'` : 'NULL';

    return `  (${title}, ${description}, ${excerpt}, ${videoUrl}, ${thumbnailUrl}, ${author}, ${tags}, ${featured}, ${status}, ${duration}, ${fileSize}, ${videoType}, ${youtubeId}, ${facebookIframe})${comma}`;
  })
  .join('\n')}`;

  console.log('\n=== SQL INSERT STATEMENTS ===\n');
  console.log(sql);
  fs.writeFileSync('videos-insert.sql', sql);
  console.log('\n✓ SQL saved to videos-insert.sql');
  console.log(`\n✓ Successfully processed ${processed.length} videos`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


