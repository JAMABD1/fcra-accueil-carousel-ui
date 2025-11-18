// upload-photos-images.ts
// Run with: npx tsx upload-photos-images.ts

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
const STORAGE_FOLDER = 'photos/images';
const normalizedPublicUrl = `${PUBLIC_URL.replace(/\/+$/, '')}/fcra-sitweb`;

interface PhotoData {
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  featured: boolean;
  status: 'published' | 'draft';
  images: string[];
  tagIds: string[] | null;
  publishedAt: string | null;
}

const photos: PhotoData[] = [
  {
    title: 'Example of How This Prompt Works',
    description: `Student seeks help speaking natural English. Alex reassures them, replaces the sentence "I want that I speak good" with "I want to speak well", and explains in French that "want" is followed by an infinitive with "to" and that "well" is the adverb for "good".`,
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1751695513197-DSC01510.JPG',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1751695513197-DSC01510.JPG',
    category: 'General',
    featured: true,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1751695513197-DSC01510.JPG',
    ],
    tagIds: null,
    publishedAt: null,
  },
  {
    title: 'Infopro',
    description: 'Infopro prépare les jeunes à un avenir professionnel durable.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754477887349-0-rimg18.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754477887349-0-rimg18.jpg',
    category: 'General',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754477887349-0-rimg18.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755159328499-0-DSC_0016.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755159332720-1-DSC_0018.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755159336529-2-DSC_0025.jpg',
    ],
    tagIds: ['b4e731f1-0fb3-4353-be70-cbad3a50166d'],
    publishedAt: '2025-07-08',
  },
  {
    title: 'Photo Education en General',
    description: 'Photos illustrant l’éducation en général.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754726515070-0-8F3A9340.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754726515070-0-8F3A9340.jpg',
    category: 'General',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754726515070-0-8F3A9340.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754726518021-1-vlcsnap-2025-08-08-14h58m30s392.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754726520867-2-vlcsnap-2025-08-08-15h10m52s102.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754726523526-3-vlcsnap-2025-08-08-15h55m33s624.png',
    ],
    tagIds: ['571435d1-5b03-4c92-af3f-45e8febf8c94'],
    publishedAt: null,
  },
  {
    title: 'Photo visite',
    description: 'Visite pour pape.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727637427-0-vlcsnap-2025-08-08-16h22m28s151.png',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727637427-0-vlcsnap-2025-08-08-16h22m28s151.png',
    category: 'Visite',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727637427-0-vlcsnap-2025-08-08-16h22m28s151.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727641711-1-vlcsnap-2025-08-08-16h24m01s266.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727646676-2-vlcsnap-2025-08-08-16h24m35s775.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727648026-3-vlcsnap-2025-08-08-16h24m56s712.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727649486-4-vlcsnap-2025-08-08-16h25m32s716.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727651014-5-vlcsnap-2025-08-08-16h26m41s241.png',
    ],
    tagIds: ['8cb33fe7-ebf0-49b5-96f9-139b8444c3ff'],
    publishedAt: null,
  },
  {
    title: 'Historique du centre Anatniavo',
    description: null,
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755590458201-0-1.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755590458201-0-1.jpg',
    category: 'General',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755590458201-0-1.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755590461073-1-remblage2.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755590462288-2-remblage3.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755590467981-4-remblage7.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755591766565-0-1.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755591772408-1-4.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755591985347-0-DSC00317.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755591989464-1-DSC00318.jpg',
    ],
    tagIds: ['5113688b-da84-49a5-b611-0164eb83da2f', 'dcd078d9-a9f1-4325-bc9b-52162769c47d'],
    publishedAt: null,
  },
  {
    title: 'Étudier à l’étranger : le FCRA ouvre les portes du possible!',
    description: 'Grâce au partenariat entre le FCRA et Parul University (Inde), sept jeunes de l’orphelinat Zaynabia obtiennent une bourse d’études dans des filières prometteuses.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641473217-0-516458734_1188859386613144_4191192383009745341_n.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641473217-0-516458734_1188859386613144_4191192383009745341_n.jpg',
    category: 'Étudiants',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641473217-0-516458734_1188859386613144_4191192383009745341_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641476201-1-517407339_1188859766613106_1700946718788388707_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641478880-2-517572542_1188859463279803_8513698256856921052_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641481328-3-517603779_1188859536613129_1262470969507527633_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641482489-4-518272340_1188859699946446_3292094387948165342_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641483682-5-518282532_1188859189946497_3813880794272342121_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641484883-6-518315616_1188859613279788_5422948611781648475_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641486133-7-518330085_1188859259946490_3477579817752196826_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641487743-8-518330789_1188859159946500_1502730652198790575_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641488831-9-518332461_1188859416613141_601732466680050937_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641489945-10-518332562_1188859436613139_2905359406714442129_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641491461-11-518340460_1188859546613128_7774350040549983339_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641492594-12-518357906_1188859199946496_8509051394739938195_n.jpg',
    ],
    tagIds: null,
    publishedAt: '2025-07-12',
  },
  {
    title: 'Photo',
    description: 'Collection de photos diverses.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754728410222-0-rimg1.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754728410222-0-rimg1.jpg',
    category: 'General',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754728410222-0-rimg1.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754728413833-1-rimg13.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754728417168-2-rimg14.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754728419080-3-vlcsnap-2025-08-05-16h51m31s752.png',
    ],
    tagIds: ['bd827394-5beb-4017-b644-eb17976869b5'],
    publishedAt: null,
  },
  {
    title: 'Photo (360A5689)',
    description: 'Autre série de photos avec prises de vue variées.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727777252-0-360A5689.JPG',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727777252-0-360A5689.JPG',
    category: 'General',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727777252-0-360A5689.JPG',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727783748-1-360A5702.JPG',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727790509-2-360A5705.JPG',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727793908-3-360A5715.JPG',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727800489-4-360A5721.JPG',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727803666-5-IMG_1457.JPG',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727808928-6-vlcsnap-2025-08-08-16h36m52s763%20copy.jpg',
    ],
    tagIds: ['b4e731f1-0fb3-4353-be70-cbad3a50166d'],
    publishedAt: null,
  },
  {
    title: 'DON DE LA FONDATION AXIAN',
    description: 'La Fondation AXIAN offre plus de mille kits scolaires destinés aux enfants orphelins et vulnérables du FCRA (Antaniavo, Andakana, Manakara et Sakoana).',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641650195-0-527315006_1213559984143084_7826979770822851828_n.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641650195-0-527315006_1213559984143084_7826979770822851828_n.jpg',
    category: 'Événement',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641650195-0-527315006_1213559984143084_7826979770822851828_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641653399-1-528324915_1213559810809768_4833170156005201513_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641656189-2-528346901_1213559750809774_3776267335676131988_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641658718-3-528366837_1213559747476441_7259544580908580662_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641660420-4-528376926_1213559787476437_2408578982491586962_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641661832-5-528657476_1213559927476423_8558320269407693555_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641662841-6-528770042_1213560017476414_5646615814632566627_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641663871-7-528987601_1213559817476434_3711689380759955407_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641665056-8-529264120_1213559930809756_8075648278572994471_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641666048-9-529352299_1213559804143102_8034947120390164663_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754641667262-10-529428869_1213560024143080_190542889066323731_n.jpg',
    ],
    tagIds: ['ff2018ad-6921-424f-a3f4-71e2a32f69c0'],
    publishedAt: '2025-08-07',
  },
  {
    title: 'Santé',
    description: null,
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727511600-0-vlcsnap-2025-08-08-16h15m12s067.png',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727511600-0-vlcsnap-2025-08-08-16h15m12s067.png',
    category: 'General',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727511600-0-vlcsnap-2025-08-08-16h15m12s067.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727515790-1-vlcsnap-2025-08-08-16h16m56s918.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754727517151-2-vlcsnap-2025-08-08-16h17m14s664.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755499958623-0-515937315_1181474124018337_8747861324103561571_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755499961486-1-516463206_1181474077351675_860404191887705781_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755499963330-2-516731462_1181474140685002_2209820991761915891_n.jpg',
    ],
    tagIds: ['3143ab07-b14e-42a4-8476-937986f851b5'],
    publishedAt: null,
  },
  {
    title: 'Ashoura 2025',
    description: 'Célébration de l’Ashoura le 6 juillet 2025 avec défilé, majlisy et repas partagé.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754733963780-0-504379497_1182732730559143_6331964229664444834_n.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754733963780-0-504379497_1182732730559143_6331964229664444834_n.jpg',
    category: 'Événement',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754733963780-0-504379497_1182732730559143_6331964229664444834_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754733967050-1-504380544_1182739387225144_5451003615875539627_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754733969708-2-504380702_1182732857225797_3660011662501080435_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754733971080-3-514343534_1182733280559088_8141147438877997724_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754733973787-4-515106385_1182731950559221_5960678380393343734_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754733974889-5-515939547_1182732890559127_7443242364735591772_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754733976087-6-515985938_1182733157225767_1708855766944768045_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754733977701-7-516765323_1182732443892505_2467299674535992664_n.jpg',
    ],
    tagIds: null,
    publishedAt: '2025-07-06',
  },
  {
    title: 'Mouharram',
    description: 'Actions sociales à Sakoana pendant les dix premiers jours de Mouharram : circoncision gratuite, consultations médicales, distribution de vivres et vêtements.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754734703897-0-515617419_1181474304018319_945928445558052166_n.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754734703897-0-515617419_1181474304018319_945928445558052166_n.jpg',
    category: 'Événement',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754734703897-0-515617419_1181474304018319_945928445558052166_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754734706900-1-515665954_1181474134018336_1034966128363542001_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754734709539-2-515937315_1181474124018337_8747861324103561571_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754734712186-3-515956579_1181474107351672_986102590606925106_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754734713389-4-516463206_1181474077351675_860404191887705781_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754734715825-5-516666719_1181501817348901_8817472086051976071_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754734716707-6-516731462_1181474140685002_2209820991761915891_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754734717884-7-516926474_1181474264018323_3455401521760353940_n.jpg',
    ],
    tagIds: null,
    publishedAt: '2025-06-30',
  },
  {
    title: 'Visite (IMG_3412)',
    description: 'Visite institutionnelle.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755004227183-0-1.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755004227183-0-1.jpg',
    category: 'Visite',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755004227183-0-1.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755004230290-1-IMG_3412.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755004233177-2-IMG_3667.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755004234297-3-IMG_3671.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755004237494-4-IMG_3687.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755004238945-5-IMG_3713.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755004241916-6-IMG_3722.jpg',
    ],
    tagIds: null,
    publishedAt: null,
  },
  {
    title: 'VISITE DU FCRA PAR MADAME LA MINISTRE',
    description: 'Visite de la Ministre de l’Enseignement Technique et de la Formation Professionnelle au FCRA le 23 juin 2023 pour renforcer la collaboration et souligner l’importance de la réinsertion professionnelle.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002779072-0-8F3A1020.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002779072-0-8F3A1020.jpg',
    category: 'Événement',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002779072-0-8F3A1020.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002782062-1-8F3A1026.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002785822-2-8F3A1036.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002789280-3-8F3A1064.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002791242-4-8F3A1065.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002792511-5-8F3A1104.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002795172-6-8F3A1116.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002796724-7-8F3A1135.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002797931-8-8F3A1136.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002799101-9-8F3A1142.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002800369-10-8F3A1212.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002802569-11-8F3A1238.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002804897-12-360A0956.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002807442-13-360A1024.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002810973-14-360A1034.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002814465-15-IMG_9978.jpg',
    ],
    tagIds: null,
    publishedAt: '2023-06-23',
  },
  {
    title: 'Visite (IMG_8155)',
    description: 'Visite officielle documentée en plusieurs clichés.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002247240-0-IMG_8155.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002247240-0-IMG_8155.jpg',
    category: 'Visite',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002247240-0-IMG_8155.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002249680-1-IMG_8173.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002252358-2-IMG_8179.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002254864-3-IMG_8198.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002257298-4-IMG_8201.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002258307-5-IMG_8228.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002259375-6-IMG_8333.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755002260381-7-IMG_8386.jpg',
    ],
    tagIds: null,
    publishedAt: null,
  },
  {
    title: 'Mission Centre Antaniavo',
    description: null,
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755592288591-0-509383210_1167655692066847_4560243111895713613_n.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755592288591-0-509383210_1167655692066847_4560243111895713613_n.jpg',
    category: 'General',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755592288591-0-509383210_1167655692066847_4560243111895713613_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755592309864-1-511277311_1167600168739066_7894673735363472263_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755592317017-2-C_vlcsnap-2025-08-05-16h04m58s516.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755592488138-0-515937315_1181474124018337_8747861324103561571_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755592496116-1-516463206_1181474077351675_860404191887705781_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755592502620-2-516731462_1181474140685002_2209820991761915891_n.jpg',
    ],
    tagIds: ['5113688b-da84-49a5-b611-0164eb83da2f', 'fa0d9055-eea3-4d37-8b27-aaefdcf520e6'],
    publishedAt: null,
  },
  {
    title: "Visite du Ministre de l'Enseignement Supérieure",
    description: "Visite du Ministre de l'Enseignement Supérieure.",
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003695950-0-1.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003695950-0-1.jpg',
    category: 'Visite',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003695950-0-1.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003700297-1-360A8152.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003701987-2-360A8154.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003705336-3-360A8157.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003709195-4-360A8161.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003710722-5-360A8163.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003714154-6-360A8165.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003716147-7-360A8365.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003718142-8-360A8371.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003720589-9-360A8399.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003722511-10-360A8410.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003725470-11-360A8414.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755003728152-12-360A8439.jpg',
    ],
    tagIds: null,
    publishedAt: null,
  },
  {
    title: 'RENCONTRE AVEC LE PAPE',
    description: "Rencontre au Vatican avec le Pape François le 9 novembre 2023, réunissant les représentants du FCRA et de la communauté Khoja pour 20 minutes d'échanges.",
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755584439187-0-493288363_1113220510843699_2894256134059046405_n.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755584439187-0-493288363_1113220510843699_2894256134059046405_n.jpg',
    category: 'Visite',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755584439187-0-493288363_1113220510843699_2894256134059046405_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755584442626-2-493322571_1113220390843711_4096040038224834787_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756187071228-1-img2.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756187073057-2-img3.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756187075765-4-img7.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756187076670-5-img9.jpg',
    ],
    tagIds: ['8cb33fe7-ebf0-49b5-96f9-139b8444c3ff'],
    publishedAt: '2023-11-09',
  },
  {
    title: 'Condoléances Fraternelles Solennelles',
    description: 'Délégation du FCRA et de l’AKSIAM présentant ses condoléances au Nonce Apostolique à Ivandry suite au décès du Pape François.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755583219990-0-1.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755583219990-0-1.jpg',
    category: 'Visite',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755583219990-0-1.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755583222597-1-492098853_1113573387475078_2282054111669506862_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755583223682-2-492145038_1113574120808338_5071265373213461857_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755583225963-3-492161429_1113573354141748_3534113841604534726_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755583227112-4-492483879_1113573964141687_2791270295612047787_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755583228618-5-492800251_1113574380808312_1842406703773185883_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755583230897-6-493319036_1113573380808412_4119937062868731440_n.jpg',
    ],
    tagIds: ['8cb33fe7-ebf0-49b5-96f9-139b8444c3ff'],
    publishedAt: '2025-04-22',
  },
  {
    title: 'Orphelinat',
    description: 'Liste des photos des orphelinats en général.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754466879851-0-C_vlcsnap-2025-08-05-16h04m58s516.png',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754466879851-0-C_vlcsnap-2025-08-05-16h04m58s516.png',
    category: 'General',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754466879851-0-C_vlcsnap-2025-08-05-16h04m58s516.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754466962088-2-img_Orphelina_1.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754466997833-3-snap-2025-08-05-15h55m47s034.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1754467008271-4-vlcsnap-2025-08-05-16h05m56s551.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755161044567-0-rimg17.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755161287126-0-rimg12.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755675877020-0-508672234_1166874152145001_4595140318583179787_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755675881006-1-509234345_1167600378739045_4401497103601192148_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755675884509-2-509246755_1167655662066850_2401200000956510087_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755675886149-3-509425147_1166874145478335_4306337361919487079_n.jpg',
    ],
    tagIds: ['440526eb-5ed1-4d09-b8a6-7426c17beb07'],
    publishedAt: null,
  },
  {
    title: 'FANOHIZANA FANKALAZANA NY EID AL-FITR',
    description: "Fête de l'Eid Al-Fitr à Mahamasina : rassemblement interreligieux, discours sur l'unité et distribution de nombreux lots surprises.",
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851709915-0-1.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851709915-0-1.jpg',
    category: 'Événement',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851709915-0-1.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851713533-1-487202123_1092912999541117_8064635499401236135_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851716210-2-487203638_1092912549541162_2192663658206492345_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851719010-3-487343701_1092912979541119_1870174899465123130_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851722071-4-487402750_1092912692874481_6836136856904280965_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851724937-5-487412940_1092912749541142_5496598975872663259_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851726034-6-487674660_1092912546207829_2474900536361795638_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851727149-7-487729506_1092912536207830_428243067522173824_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851729274-8-487793920_1092912469541170_7690549041334162267_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851732035-9-487845877_1092912786207805_7884324476082431360_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851733259-10-487991893_1092912522874498_1176322562776919411_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851735122-11-488036551_1092912792874471_2865572492570063258_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851736264-12-488206585_1092912969541120_3769362347548958315_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755851737614-13-488524703_1092912519541165_2909334059188174243_n.jpg',
    ],
    tagIds: null,
    publishedAt: '2025-03-31',
  },
  {
    title: 'VISITE MAIRE ANTANANARIVO AU FCRA',
    description: "Inauguration d'un point d'eau public à Antaniavo Antohomadinika par la Maire d’Antananarivo en collaboration avec le FCRA.",
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069808394-0-1.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069808394-0-1.jpg',
    category: 'Visite',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069808394-0-1.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069811776-1-509043154_1166887842143632_5187632341581121712_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069814490-2-509725623_1166887852143631_6384171605279546593_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069817132-3-510249286_1166887928810290_452207766152922625_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069818451-4-510251018_1166887802143636_7373373667326214852_n%20(1).jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069819610-5-510251018_1166887802143636_7373373667326214852_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069820846-6-510334357_1166887885476961_1004893677666426399_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069822529-7-511094483_1166887815476968_668093996437489248_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069825146-8-511130152_1166896698809413_1507720405876572607_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069826338-9-511135077_1166887752143641_3448300236134170722_n.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755069829007-10-511154824_1166887832143633_2290874529045840230_n.jpg',
    ],
    tagIds: null,
    publishedAt: null,
  },
  {
    title: 'VISITE DE LA FCRA AU CENTRE AKAMASOA',
    description: 'Visite du FCRA au centre Akamasoa le 23 avril 2023 pour renforcer les liens entre communautés musulmane et chrétienne.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001489314-0-8F3A0954.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001489314-0-8F3A0954.jpg',
    category: 'Visite',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001489314-0-8F3A0954.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001493891-1-8F3A0981.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001496656-2-8F3A0984.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001497947-3-8F3A1023.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001500312-4-8F3A1025.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001501961-5-8F3A1030.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001504021-6-360A0660.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001509102-7-360A0718.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001512044-8-360A0742.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001516276-10-360A0872.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001517876-11-360A0906.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001519524-12-360A1203.jpg',
    ],
    tagIds: null,
    publishedAt: '2023-04-23',
  },
  {
    title: 'VISITE HONORABLE DU NONCE APOSTOLIQUE',
    description: 'Le 6 octobre 2023, le FCRA Antohomadinika reçoit le Nonce Apostolique Mgr Tomas Grysa pour renforcer la cohabitation pacifique entre musulmans et chrétiens.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001978737-0-IMG_0097.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001978737-0-IMG_0097.jpg',
    category: 'Visite',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001978737-0-IMG_0097.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001981675-1-IMG_0098.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001984630-2-IMG_0123.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001986531-3-IMG_0128.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001989292-4-IMG_0131.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001991054-5-IMG_0141.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001992904-6-IMG_0176.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001996546-7-IMG_0179.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001998046-8-IMG_0180.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1755001999574-9-IMG_0181.jpg',
    ],
    tagIds: null,
    publishedAt: '2023-10-06',
  },
  {
    title: 'VISITE DU MINISTRE DE LA POPULATION ET DES SOLIDARITÉS À L’ORPHELINAT ZAYNABIA',
    description: 'La ministre visite l’orphelinat Zaynabia, partage ses encouragements avec les enfants et souligne des valeurs de compassion et de soutien.',
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192451981-0-1.png',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192451981-0-1.png',
    category: 'Visite',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192451981-0-1.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192457051-1-2.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192460061-2-3.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192461759-3-5.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192463017-4-7.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192466212-5-8.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192470193-6-9.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192471642-7-10.png',
    ],
    tagIds: null,
    publishedAt: null,
  },
  {
    title: 'VISITE DE L’AMBASSADE DE FRANCE À ANDAKANA',
    description: "L'ambassadeur de France à Madagascar visite l'annexe du FCRA le 19 janvier 2024, renforçant les relations entre les deux institutions.",
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192976898-0-1.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192976898-0-1.jpg',
    category: 'Visite',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192976898-0-1.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192981771-1-2.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192985011-2-3.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192987521-3-4.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192990671-4-5.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756192994557-5-6.jpg',
    ],
    tagIds: null,
    publishedAt: null,
  },
  {
    title: 'La sagesse',
    description: null,
    imageUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756196611810-0-1.jpg',
    thumbnailUrl: 'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756196611810-0-1.jpg',
    category: 'General',
    featured: false,
    status: 'published',
    images: [
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756196611810-0-1.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756196614355-1-2.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756196615573-2-3.jpg',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756196616983-3-4.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756196620977-4-5.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756196626206-5-6.png',
      'https://jjtvrqozrbbxathbofyu.supabase.co/storage/v1/object/public/photos/images/1756196628165-6-7.png',
    ],
    tagIds: ['657a0af8-7449-4b0d-83bb-cc6e4541ef79', 'b1c53c02-6147-4ae1-9684-9afdf52ffccb'],
    publishedAt: null,
  },
];

async function uploadImageToR2(sourceUrl: string, label: string): Promise<string> {
  const cacheKey = sourceUrl.trim();
  if (!cacheKey) {
    throw new Error(`Invalid source URL for ${label}`);
  }

  if (!uploadCache.has(cacheKey)) {
    console.log(`Downloading ${label}...`);
    const response = await fetch(cacheKey);
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
    const fileName = `photo_${timestamp}_${sanitizedLabel}.${extension}`;
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

const uploadCache = new Map<string, string>();

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function formatTextArray(values: string[] | null | undefined): string {
  if (!values || values.length === 0) {
    return 'ARRAY[]::text[]';
  }

  const escaped = values.map((value) => `'${escapeSql(value)}'`);
  return `ARRAY[${escaped.join(', ')}]`;
}

async function main() {
  if (!BUCKET_NAME || !PUBLIC_URL) {
    throw new Error('Missing required environment variables for R2 configuration.');
  }

  console.log(`Starting upload for ${photos.length} photos...\n`);

  const processed: Array<PhotoData & {
    r2ImageUrl: string;
    r2ThumbnailUrl: string;
    r2Images: string[];
  }> = [];

  for (const photo of photos) {
    try {
      const r2ImageUrl = await uploadImageToR2(photo.imageUrl, `${photo.title} main`);
      const r2ThumbnailUrl = await uploadImageToR2(photo.thumbnailUrl || photo.imageUrl, `${photo.title} thumbnail`);

      const r2Images: string[] = [];
      for (const [index, imageUrl] of photo.images.entries()) {
        const uploadedUrl = await uploadImageToR2(imageUrl, `${photo.title} gallery ${index + 1}`);
        r2Images.push(uploadedUrl);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      processed.push({
        ...photo,
        r2ImageUrl,
        r2ThumbnailUrl,
        r2Images,
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Failed to process "${photo.title}", skipping...`, error);
    }
  }

  if (processed.length === 0) {
    console.log('No photos were processed successfully.');
    return;
  }

  const sql = `INSERT INTO photos (title, description, image_url, thumbnail_url, category, featured, status, images, tag_ids, published_at) VALUES
${processed.map((photo, index) => {
  const comma = index < processed.length - 1 ? ',' : ';';
  const title = escapeSql(photo.title);
  const description = photo.description ? `'${escapeSql(photo.description)}'` : 'NULL';
  const imageUrl = `'${escapeSql(photo.r2ImageUrl)}'`;
  const thumbnailUrl = `'${escapeSql(photo.r2ThumbnailUrl)}'`;
  const category = `'${escapeSql(photo.category)}'`;
  const featured = photo.featured;
  const status = `'${escapeSql(photo.status)}'`;
  const images = photo.r2Images.length ? formatTextArray(photo.r2Images) : 'ARRAY[]::text[]';
  const tagIds = 'NULL';
  const publishedAt = photo.publishedAt ? `'${photo.publishedAt}'` : 'NULL';

  return `('${title}', ${description}, ${imageUrl}, ${thumbnailUrl}, ${category}, ${featured}, ${status}, ${images}, ${tagIds}, ${publishedAt})${comma}`;
}).join('\n')}`;

  console.log('\n=== SQL INSERT STATEMENTS ===\n');
  console.log(sql);
  fs.writeFileSync('photos-insert.sql', sql);
  console.log('\n✓ SQL saved to photos-insert.sql');
  console.log(`\n✓ Successfully processed ${processed.length} photos`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


