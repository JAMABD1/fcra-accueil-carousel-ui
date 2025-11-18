import { pgTable, text, timestamp, boolean, uuid, integer, jsonb, bigint, index, date, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Helper function for updated_at trigger
export const updatedAt = () => timestamp('updated_at', { withTimezone: true }).default(sql`now()`).notNull();

// Users table for authentication
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
});

// Tags table
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  color: text('color').default('#3B82F6'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  nameIdx: index('tags_name_idx').on(table.name),
}));

// Articles table
export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  images: jsonb('images').$type<string[]>().default([]),
  author: text('author'),
  tags: jsonb('tags').$type<string[]>().default([]),
  featured: boolean('featured').default(false),
  status: text('status').default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  statusIdx: index('articles_status_idx').on(table.status),
  createdAtIdx: index('articles_created_at_idx').on(table.createdAt.desc()),
  featuredIdx: index('articles_featured_idx').on(table.featured),
}));

// Videos table
export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text(),
  excerpt: text(),
  videoUrl: text('video_url'),
  thumbnailUrl: text('thumbnail_url'),
  author: text('author'),
  tags: jsonb('tags').$type<string[]>().default([]),
  featured: boolean('featured').default(false),
  status: text('status').default('draft'),
  duration: integer('duration'),
  fileSize: bigint('file_size', { mode: 'number' }),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
  videoType: varchar('video_type', { length: 20 }).default('upload'),
  youtubeId: varchar('youtube_id', { length: 100 }),
  facebookIframe: text('facebook_iframe'),
}, (table) => ({
  statusIdx: index('videos_status_idx').on(table.status),
  featuredIdx: index('videos_featured_idx').on(table.featured),
  videoTypeIdx: index('idx_videos_video_type').on(table.videoType),
  youtubeIdIdx: index('idx_videos_youtube_id').on(table.youtubeId),
}));

// Photos table
export const photos = pgTable('photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text(),
  imageUrl: text('image_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: text('category').default('General').notNull(),
  featured: boolean('featured').default(false),
  status: text('status').default('published'),
  images: text('images').array(),
  tagIds: text('tag_ids').array().default(sql`ARRAY[]::text[]`),
  publishedAt: date('published_at'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  categoryIdx: index('photos_category_idx').on(table.category),
  statusIdx: index('photos_status_idx').on(table.status),
  featuredIdx: index('photos_featured_idx').on(table.featured),
  photosTagIdsGinIdx: index('idx_photos_tag_ids').using('gin', table.tagIds),
  photosImagesGinIdx: index('idx_photos_images').using('gin', table.images),
}));

// Hero table
export const hero = pgTable('hero', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  imageUrl: text('image_url').notNull(),
  tagIds: jsonb('tag_ids').$type<string[]>().default([]),
  sortOrder: integer('sort_order').default(0),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  activeIdx: index('hero_active_idx').on(table.active),
  sortOrderIdx: index('hero_sort_order_idx').on(table.sortOrder),
  tagIdsIdx: index('hero_tag_ids_idx').on(table.tagIds),
}));

// Impact table
export const impact = pgTable('impact', {
  id: uuid('id').primaryKey().defaultRandom(),
  number: integer('number').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  tagsId: uuid('tags_id').references(() => tags.id, { onDelete: 'set null' }),
  tagIds: jsonb('tag_ids').$type<string[]>().default([]),
  active: boolean('active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  activeIdx: index('impact_active_idx').on(table.active),
  sortOrderIdx: index('impact_sort_order_idx').on(table.sortOrder),
  tagsIdIdx: index('impact_tags_id_idx').on(table.tagsId),
}));

// Sections table
export const sections = pgTable('sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  subtitle: text(),
  description: text(),
  imageUrl: text('image_url').notNull(),
  heroId: uuid('hero_id').references(() => hero.id, { onDelete: 'set null' }),
  tagName: text('tag_name'),
  tagIds: jsonb('tag_ids').$type<string[]>().default([]),
  active: boolean('active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  activeIdx: index('sections_active_idx').on(table.active),
  sortOrderIdx: index('sections_sort_order_idx').on(table.sortOrder),
  heroIdIdx: index('sections_hero_id_idx').on(table.heroId),
}));

// Directors table
export const directors = pgTable('directors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  job: text('job'),
  responsibility: text(),
  sortOrder: integer('sort_order').default(0),
  centreId: uuid('centre_id').references(() => centres.id, { onDelete: 'set null' }),
  isDirector: boolean('is_director').default(false),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  centreIdIdx: index('directors_centre_id_idx').on(table.centreId),
  isDirectorIdx: index('directors_is_director_idx').on(table.isDirector),
  activeIdx: index('directors_active_idx').on(table.active),
  sortOrderIdx: index('directors_sort_order_idx').on(table.sortOrder),
}));

// Centres table
export const centres = pgTable('centres', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text(),
  address: text(),
  phone: text(),
  email: text(),
  heroId: uuid('hero_id').references(() => hero.id, { onDelete: 'set null' }),
  videoId: uuid('video_id').references(() => videos.id, { onDelete: 'set null' }),
  directorId: uuid('director_id').references(() => directors.id, { onDelete: 'set null' }),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'set null' }),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').default(0),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  heroIdIdx: index('centres_hero_id_idx').on(table.heroId),
  videoIdIdx: index('centres_video_id_idx').on(table.videoId),
  directorIdIdx: index('centres_director_id_idx').on(table.directorId),
  activeIdx: index('centres_active_idx').on(table.active),
  sortOrderIdx: index('centres_sort_order_idx').on(table.sortOrder),
}));

// Activities table
export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  subtitle: text(),
  description: text(),
  sectionId: uuid('section_id').references(() => sections.id, { onDelete: 'cascade' }),
  videoId: uuid('video_id').references(() => videos.id, { onDelete: 'set null' }),
  photoId: uuid('photo_id').references(() => photos.id, { onDelete: 'set null' }),
  videoDescription: text('video_description'),
  photoDescription: text('photo_description'),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'set null' }),
  sortOrder: integer('sort_order').default(0),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  sectionIdIdx: index('activities_section_id_idx').on(table.sectionId),
  videoIdIdx: index('activities_video_id_idx').on(table.videoId),
  photoIdIdx: index('activities_photo_id_idx').on(table.photoId),
  tagIdIdx: index('activities_tag_id_idx').on(table.tagId),
  sortOrderIdx: index('activities_sort_order_idx').on(table.sortOrder),
  activeIdx: index('activities_active_idx').on(table.active),
}));

// Schools table
export const schools = pgTable('schools', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text(),
  type: text('type').notNull(),
  imageUrl: text('image_url'),
  subtitle: text('subtitle'),
  coordonneId: uuid('coordonne_id').references(() => coordonnes.id, { onDelete: 'set null' }),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'set null' }),
  videoId: uuid('video_id').references(() => videos.id, { onDelete: 'set null' }),
  active: boolean('active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  tagIdIdx: index('idx_schools_tag_id').on(table.tagId),
  videoIdIdx: index('idx_schools_video_id').on(table.videoId),
  coordonneIdIdx: index('idx_schools_coordonne_id').on(table.coordonneId),
}));

// Coordonnes table
export const coordonnes = pgTable('coordonnes', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: text('phone'),
  email: text(),
  address: text(),
  tagsId: uuid('tags_id').references(() => tags.id, { onDelete: 'set null' }),
  googleMapUrl: text('google_map_url'),
  sortOrder: integer('sort_order').default(0),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  tagsIdIdx: index('coordonnes_tags_id_idx').on(table.tagsId),
  activeIdx: index('coordonnes_active_idx').on(table.active),
  sortOrderIdx: index('coordonnes_sort_order_idx').on(table.sortOrder),
}));

// Library table
export const library = pgTable('library', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text(),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: bigint('file_size', { mode: 'number' }).notNull(),
  fileType: text('file_type').notNull(),
  category: text('category').notNull().default('general'),
  downloads: integer('downloads').default(0),
  featured: boolean('featured').default(false),
  status: text('status').default('published'),
  author: text('author'),
  tags: jsonb('tags').$type<string[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  categoryIdx: index('library_category_idx').on(table.category),
  statusIdx: index('library_status_idx').on(table.status),
  featuredIdx: index('library_featured_idx').on(table.featured),
  downloadsIdx: index('library_downloads_idx').on(table.downloads.desc()),
}));

// Partners table
export const partners = pgTable('partners', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  subtitle: text(),
  description: text(),
  imageUrl: text('image_url').notNull(),
  tagIds: jsonb('tag_ids').$type<string[]>().default([]),
  sortOrder: integer('sort_order').default(0),
  active: boolean('active').default(true),
  websiteUrl: text('website_url'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`).notNull(),
  updatedAt: updatedAt(),
}, (table) => ({
  activeIdx: index('partners_active_idx').on(table.active),
  sortOrderIdx: index('partners_sort_order_idx').on(table.sortOrder),
}));
