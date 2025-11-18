import { db } from '../client';
import { eq, and, sql, desc, asc, or, like, inArray } from 'drizzle-orm';
import {
  articles,
  videos,
  photos,
  hero,
  impact,
  sections,
  directors,
  centres,
  activities,
  schools,
  coordonnes,
  library,
  partners,
  tags,
  users
} from '../schema';

// Export table schemas for use in components
export { library };

// Generic CRUD operations
export const createRecord = async (table: any, data: any) => {
  return await db.insert(table).values(data).returning();
};

export const updateRecord = async (table: any, id: string, data: any) => {
  return await db.update(table).set(data).where(eq(table.id, id)).returning();
};

export const deleteRecord = async (table: any, id: string) => {
  return await db.delete(table).where(eq(table.id, id));
};

export const getRecordById = async (table: any, id: string) => {
  return await db.select().from(table).where(eq(table.id, id));
};

export const getAllRecords = async (table: any, options: {
  limit?: number;
  offset?: number;
  orderBy?: any;
  where?: any;
} = {}) => {
  const { limit, offset, orderBy, where } = options;
  let query = db.select().from(table);

  if (where) {
    query = query.where(where);
  }

  if (orderBy) {
    query = query.orderBy(orderBy);
  }

  if (limit) {
    query = query.limit(limit);
  }

  if (offset) {
    query = query.offset(offset);
  }

  return await query;
};

// Specific query functions for articles
export const getArticles = async (options: {
  status?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  searchTerm?: string;
} = {}) => {
  const { status, featured, limit = 10, offset = 0, searchTerm } = options;

  let whereClause = sql`true`;

  if (status) {
    whereClause = and(whereClause, eq(articles.status, status));
  }

  if (featured !== undefined) {
    whereClause = and(whereClause, eq(articles.featured, featured));
  }

  if (searchTerm) {
    whereClause = and(whereClause, or(
      like(articles.title, `%${searchTerm}%`),
      like(articles.content, `%${searchTerm}%`),
      like(articles.excerpt, `%${searchTerm}%`)
    ));
  }

  return await db.select()
    .from(articles)
    .where(whereClause)
    .orderBy(desc(articles.createdAt))
    .limit(limit)
    .offset(offset);
};

// Specific query functions for videos
export const getVideos = async (options: {
  status?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  searchTerm?: string;
} = {}) => {
  const { status, featured, limit = 1000, offset = 0, searchTerm } = options;

  let whereClause = sql`true`;

  if (status) {
    whereClause = and(whereClause, eq(videos.status, status));
  }

  if (featured !== undefined) {
    whereClause = and(whereClause, eq(videos.featured, featured));
  }

  if (searchTerm) {
    whereClause = and(whereClause, or(
      like(videos.title, `%${searchTerm}%`),
      like(videos.description, `%${searchTerm}%`)
    ));
  }

  return await db.select({
      id: videos.id,
      title: videos.title,
      description: videos.description,
      excerpt: videos.excerpt,
      video_url: videos.videoUrl,
      videoUrl: videos.videoUrl,
      video_type: videos.videoType,
      videoType: videos.videoType,
      youtube_id: videos.youtubeId,
      youtubeId: videos.youtubeId,
      facebook_iframe: videos.facebookIframe,
      facebookIframe: videos.facebookIframe,
      thumbnail_url: videos.thumbnailUrl,
      thumbnailUrl: videos.thumbnailUrl,
      author: videos.author,
      tags: videos.tags,
      featured: videos.featured,
      status: videos.status,
      duration: videos.duration,
      file_size: videos.fileSize,
      fileSize: videos.fileSize,
      created_at: videos.createdAt,
      createdAt: videos.createdAt,
      updated_at: videos.updatedAt,
      updatedAt: videos.updatedAt,
    })
    .from(videos)
    .where(whereClause)
    .orderBy(desc(videos.createdAt))
    .limit(limit)
    .offset(offset);
};

// Specific query functions for photos
export const getPhotos = async (options: {
  category?: string;
  status?: string;
  featured?: boolean;
  tagIds?: string[];
  limit?: number;
  offset?: number;
} = {}) => {
  const { category, status, featured, tagIds, limit = 1000, offset = 0 } = options;

  let whereClause = sql`true`;

  if (category) {
    whereClause = and(whereClause, eq(photos.category, category));
  }

  if (status) {
    whereClause = and(whereClause, eq(photos.status, status));
  }

  if (featured !== undefined) {
    whereClause = and(whereClause, eq(photos.featured, featured));
  }

  if (tagIds && tagIds.length > 0) {
    whereClause = and(whereClause, sql`${photos.tagIds} && ${tagIds}`);
  }

  return await db.select({
    id: photos.id,
    title: photos.title,
    description: photos.description,
    image_url: photos.imageUrl,
    imageUrl: photos.imageUrl,
    thumbnail_url: photos.thumbnailUrl,
    thumbnailUrl: photos.thumbnailUrl,
    category: photos.category,
    featured: photos.featured,
    status: photos.status,
    images: photos.images,
    tag_ids: photos.tagIds,
    tagIds: photos.tagIds,
    published_at: photos.publishedAt,
    publishedAt: photos.publishedAt,
    created_at: photos.createdAt,
    createdAt: photos.createdAt,
    updated_at: photos.updatedAt,
    updatedAt: photos.updatedAt,
  })
    .from(photos)
    .where(whereClause)
    .orderBy(desc(photos.createdAt))
    .limit(limit)
    .offset(offset);
};

// Specific query functions for hero
export const getHeroItems = async (active: boolean = true) => {
  return await db.select({
    id: hero.id,
    title: hero.title,
    subtitle: hero.subtitle,
    image_url: hero.imageUrl,
    imageUrl: hero.imageUrl,
    tag_ids: hero.tagIds,
    tagIds: hero.tagIds,
    sort_order: hero.sortOrder,
    sortOrder: hero.sortOrder,
    active: hero.active,
    created_at: hero.createdAt,
    updated_at: hero.updatedAt,
    createdAt: hero.createdAt,
    updatedAt: hero.updatedAt,
  })
    .from(hero)
    .where(eq(hero.active, active))
    .orderBy(asc(hero.sortOrder));
};

// Specific query functions for impact
export const getImpactItems = async (active: boolean = true) => {
  return await db.select({
    id: impact.id,
    number: impact.number,
    title: impact.title,
    subtitle: impact.subtitle,
    tags_id: impact.tagsId,
    tagsId: impact.tagsId,
    tag_ids: impact.tagIds,
    tagIds: impact.tagIds,
    active: impact.active,
    sort_order: impact.sortOrder,
    sortOrder: impact.sortOrder,
    created_at: impact.createdAt,
    createdAt: impact.createdAt,
    updated_at: impact.updatedAt,
    updatedAt: impact.updatedAt,
  })
    .from(impact)
    .where(eq(impact.active, active))
    .orderBy(asc(impact.sortOrder));
};

// Specific query functions for sections
export const getSections = async (active: boolean = true) => {
  return await db.select({
    id: sections.id,
    title: sections.title,
    subtitle: sections.subtitle,
    description: sections.description,
    // snake_case keys for existing public pages
    image_url: sections.imageUrl,
    hero_id: sections.heroId,
    tag_name: sections.tagName,
    tag_ids: sections.tagIds,
    sort_order: sections.sortOrder,
    created_at: sections.createdAt,
    updated_at: sections.updatedAt,
    // camelCase keys for admin tooling
    imageUrl: sections.imageUrl,
    heroId: sections.heroId,
    tagName: sections.tagName,
    tagIds: sections.tagIds,
    sortOrder: sections.sortOrder,
    createdAt: sections.createdAt,
    updatedAt: sections.updatedAt,
    active: sections.active,
  })
    .from(sections)
    .where(eq(sections.active, active))
    .orderBy(asc(sections.sortOrder));
};

// Specific query functions for centres with relations
export const getCentres = async (active: boolean = true) => {
  const rows = await db
    .select({
      centre: centres,
      director: directors,
      video: videos,
      heroItem: hero,
    })
    .from(centres)
    .leftJoin(directors, eq(centres.directorId, directors.id))
    .leftJoin(videos, eq(centres.videoId, videos.id))
    .leftJoin(hero, eq(centres.heroId, hero.id))
    .where(eq(centres.active, active))
    .orderBy(asc(centres.sortOrder));

  const centreMap = new Map<string, any>();

  rows.forEach(({ centre, director, video, heroItem }) => {
    if (!centre) return;

    let entry = centreMap.get(centre.id);
    if (!entry) {
      entry = {
        id: centre.id,
        name: centre.name,
        description: centre.description,
        address: centre.address,
        phone: centre.phone,
        email: centre.email,
        image_url: centre.imageUrl,
        imageUrl: centre.imageUrl,
        hero_id: centre.heroId,
        heroId: centre.heroId,
        video_id: centre.videoId,
        videoId: centre.videoId,
        director_id: centre.directorId,
        directorId: centre.directorId,
        tag_id: centre.tagId,
        tagId: centre.tagId,
        sort_order: centre.sortOrder,
        sortOrder: centre.sortOrder,
        active: centre.active,
        created_at: centre.createdAt,
        createdAt: centre.createdAt,
        updated_at: centre.updatedAt,
        updatedAt: centre.updatedAt,
        hero: heroItem
          ? {
              id: heroItem.id,
              title: heroItem.title,
              subtitle: heroItem.subtitle,
              image_url: heroItem.imageUrl,
              imageUrl: heroItem.imageUrl,
            }
          : null,
        videos: video
          ? {
              id: video.id,
              title: video.title,
              video_type: video.videoType,
              videoType: video.videoType,
              youtube_id: video.youtubeId,
              youtubeId: video.youtubeId,
              facebook_iframe: video.facebookIframe,
              facebookIframe: video.facebookIframe,
              video_url: video.videoUrl,
              videoUrl: video.videoUrl,
              thumbnail_url: video.thumbnailUrl,
              thumbnailUrl: video.thumbnailUrl,
            }
          : null,
        directors: [],
      };
      centreMap.set(centre.id, entry);
    }

    if (director) {
      const directorsList = entry.directors ?? [];
      if (!directorsList.some((d: any) => d.id === director.id)) {
        directorsList.push({
          id: director.id,
          name: director.name,
          job: director.job,
          image_url: director.imageUrl,
          imageUrl: director.imageUrl,
        });
      }
      entry.directors = directorsList;
    }

    if (heroItem) {
      entry.hero = {
        id: heroItem.id,
        title: heroItem.title,
        subtitle: heroItem.subtitle,
        image_url: heroItem.imageUrl,
        imageUrl: heroItem.imageUrl,
      };
    }

    if (video) {
      entry.videos = entry.videos || {
        id: video.id,
        title: video.title,
        video_type: video.videoType,
        videoType: video.videoType,
        youtube_id: video.youtubeId,
        youtubeId: video.youtubeId,
        facebook_iframe: video.facebookIframe,
        facebookIframe: video.facebookIframe,
        video_url: video.videoUrl,
        videoUrl: video.videoUrl,
        thumbnail_url: video.thumbnailUrl,
        thumbnailUrl: video.thumbnailUrl,
      };
    }
  });

  return Array.from(centreMap.values());
};

// Specific query functions for directors
export const getDirectors = async (active: boolean = true) => {
  return await db.select({
    id: directors.id,
    name: directors.name,
    image_url: directors.imageUrl,
    imageUrl: directors.imageUrl,
    job: directors.job,
    responsibility: directors.responsibility,
    sort_order: directors.sortOrder,
    sortOrder: directors.sortOrder,
    centre_id: directors.centreId,
    centreId: directors.centreId,
    is_director: directors.isDirector,
    isDirector: directors.isDirector,
    active: directors.active,
    created_at: directors.createdAt,
    createdAt: directors.createdAt,
    updated_at: directors.updatedAt,
    updatedAt: directors.updatedAt,
  })
    .from(directors)
    .where(eq(directors.active, active))
    .orderBy(asc(directors.sortOrder));
};

// Specific query functions for administrators
export const getAdministrators = async (options: {
  active?: boolean;
  isDirector?: boolean;
  limit?: number;
  offset?: number;
} = {}) => {
  const { active = true, isDirector, limit, offset = 0 } = options;

  let whereClause = sql`true`;

  if (active !== undefined) {
    whereClause = and(whereClause, eq(directors.active, active));
  }

  if (isDirector !== undefined) {
    whereClause = and(whereClause, eq(directors.isDirector, isDirector));
  }

  const baseQuery = db.select({
    id: directors.id,
    name: directors.name,
    image_url: directors.imageUrl,
    imageUrl: directors.imageUrl,
    job: directors.job,
    responsibility: directors.responsibility,
    sort_order: directors.sortOrder,
    sortOrder: directors.sortOrder,
    centre_id: directors.centreId,
    centreId: directors.centreId,
    is_director: directors.isDirector,
    isDirector: directors.isDirector,
    active: directors.active,
    created_at: directors.createdAt,
    createdAt: directors.createdAt,
    updated_at: directors.updatedAt,
    updatedAt: directors.updatedAt,
  })
    .from(directors)
    .where(whereClause)
    .orderBy(asc(directors.sortOrder));

  const result = limit 
    ? await baseQuery.limit(limit).offset(offset)
    : offset > 0
    ? await baseQuery.offset(offset)
    : await baseQuery;

  return result;
};

// Specific query functions for activities
export const getActivities = async (active: boolean = true) => {
  return await db.select()
    .from(activities)
    .where(eq(activities.active, active))
    .orderBy(asc(activities.sortOrder));
};

export const getActivityWithRelations = async (id: string) => {
  const rows = await db
    .select({
      activity: activities,
      video: videos,
      photo: photos,
    })
    .from(activities)
    .leftJoin(videos, eq(activities.videoId, videos.id))
    .leftJoin(photos, eq(activities.photoId, photos.id))
    .where(eq(activities.id, id))
    .limit(1);

  if (!rows.length) {
    return null;
  }

  const { activity, video, photo } = rows[0];

  const result: any = {
    ...activity,
    video_id: activity.videoId,
    videoId: activity.videoId,
    photo_id: activity.photoId,
    photoId: activity.photoId,
    video_description: activity.videoDescription,
    videoDescription: activity.videoDescription,
    photo_description: activity.photoDescription,
    photoDescription: activity.photoDescription,
    created_at: activity.createdAt,
    createdAt: activity.createdAt,
    updated_at: activity.updatedAt,
    updatedAt: activity.updatedAt,
  };

  if (video) {
    result.videos = {
      id: video.id,
      title: video.title,
      description: video.description,
      excerpt: video.excerpt,
      video_type: video.videoType,
      videoType: video.videoType,
      youtube_id: video.youtubeId,
      youtubeId: video.youtubeId,
      facebook_iframe: video.facebookIframe,
      facebookIframe: video.facebookIframe,
      video_url: video.videoUrl,
      videoUrl: video.videoUrl,
      thumbnail_url: video.thumbnailUrl,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      file_size: video.fileSize,
      fileSize: video.fileSize,
    };
  }

  if (photo) {
    result.photoGroup = {
      id: photo.id,
      title: photo.title,
      description: photo.description,
      images: photo.images,
      image_url: photo.imageUrl,
      imageUrl: photo.imageUrl,
      thumbnail_url: photo.thumbnailUrl,
      thumbnailUrl: photo.thumbnailUrl,
      category: photo.category,
    };
  }

  return result;
};

// Specific query functions for schools with relations
export const getSchools = async (options: {
  type?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
} = {}) => {
  const { type, active = true, limit, offset = 0 } = options;

  const baseQuery = db
    .select({
      school: schools,
      coordonne: coordonnes,
      tag: tags,
      video: videos,
    })
    .from(schools)
    .leftJoin(coordonnes, eq(schools.coordonneId, coordonnes.id))
    .leftJoin(tags, eq(schools.tagId, tags.id))
    .leftJoin(videos, eq(schools.videoId, videos.id))
    .where(
      and(
        active !== undefined ? eq(schools.active, active) : sql`true`,
        type ? eq(schools.type, type) : sql`true`
      )
    )
    .orderBy(asc(schools.sortOrder), desc(schools.createdAt));

  const rows = limit 
    ? await baseQuery.limit(limit).offset(offset)
    : offset > 0
    ? await baseQuery.offset(offset)
    : await baseQuery;

  return rows.map(({ school, coordonne, tag, video }) => ({
    id: school.id,
    name: school.name,
    description: school.description,
    type: school.type,
    subtitle: school.subtitle,
    image_url: school.imageUrl,
    imageUrl: school.imageUrl,
    coordonne_id: school.coordonneId,
    coordonneId: school.coordonneId,
    tag_id: school.tagId,
    tagId: school.tagId,
    video_id: school.videoId,
    videoId: school.videoId,
    active: school.active,
    sort_order: school.sortOrder,
    sortOrder: school.sortOrder,
    created_at: school.createdAt,
    createdAt: school.createdAt,
    updated_at: school.updatedAt,
    updatedAt: school.updatedAt,
    coordonnes: coordonne
      ? {
          id: coordonne.id,
          phone: coordonne.phone,
          email: coordonne.email,
          address: coordonne.address,
          google_map_url: coordonne.googleMapUrl,
          googleMapUrl: coordonne.googleMapUrl,
        }
      : null,
    tag: tag
      ? {
          id: tag.id,
          name: tag.name,
          color: tag.color,
        }
      : null,
    video: video
      ? {
          id: video.id,
          title: video.title,
          description: video.description,
          video_type: video.videoType,
          videoType: video.videoType,
          youtube_id: video.youtubeId,
          youtubeId: video.youtubeId,
          facebook_iframe: video.facebookIframe,
          facebookIframe: video.facebookIframe,
          video_url: video.videoUrl,
          videoUrl: video.videoUrl,
          thumbnail_url: video.thumbnailUrl,
          thumbnailUrl: video.thumbnailUrl,
        }
      : null,
  }));
};

// Specific query functions for coordonnes
export const getCoordonnes = async (active: boolean = true) => {
  return await db.select()
    .from(coordonnes)
    .where(eq(coordonnes.active, active))
    .orderBy(asc(coordonnes.sortOrder));
};

// Specific query functions for library
export const getLibraryItems = async (options: {
  category?: string;
  status?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  searchTerm?: string;
} = {}) => {
  const { category, status, featured, limit = 10, offset = 0, searchTerm } = options;

  let whereClause = sql`true`;

  if (category) {
    whereClause = and(whereClause, eq(library.category, category));
  }

  if (status) {
    whereClause = and(whereClause, eq(library.status, status));
  }

  if (featured !== undefined) {
    whereClause = and(whereClause, eq(library.featured, featured));
  }

  if (searchTerm) {
    whereClause = and(whereClause, or(
      like(library.title, `%${searchTerm}%`),
      like(library.description, `%${searchTerm}%`),
      like(library.author, `%${searchTerm}%`)
    ));
  }

  return await db.select()
    .from(library)
    .where(whereClause)
    .orderBy(desc(library.createdAt))
    .limit(limit)
    .offset(offset);
};

// Specific query functions for partners
export const getPartners = async (active: boolean = true) => {
  return await db.select({
    id: partners.id,
    title: partners.title,
    subtitle: partners.subtitle,
    description: partners.description,
    image_url: partners.imageUrl,
    imageUrl: partners.imageUrl,
    tag_ids: partners.tagIds,
    tagIds: partners.tagIds,
    sort_order: partners.sortOrder,
    sortOrder: partners.sortOrder,
    active: partners.active,
    website_url: partners.websiteUrl,
    websiteUrl: partners.websiteUrl,
    contact_email: partners.contactEmail,
    contactEmail: partners.contactEmail,
    contact_phone: partners.contactPhone,
    contactPhone: partners.contactPhone,
    created_at: partners.createdAt,
    createdAt: partners.createdAt,
    updated_at: partners.updatedAt,
    updatedAt: partners.updatedAt,
  })
    .from(partners)
    .where(eq(partners.active, active))
    .orderBy(asc(partners.sortOrder));
};

// Specific query functions for partenaires (enhanced version with options)
export const getPartenaires = async (options: {
  active?: boolean;
  tagIds?: string[];
  limit?: number;
  offset?: number;
  searchTerm?: string;
} = {}) => {
  const { active = true, tagIds, limit, offset = 0, searchTerm } = options;

  let whereClause = sql`true`;

  if (active !== undefined) {
    whereClause = and(whereClause, eq(partners.active, active));
  }

  if (tagIds && tagIds.length > 0) {
    whereClause = and(whereClause, sql`${partners.tagIds} && ${tagIds}`);
  }

  if (searchTerm) {
    whereClause = and(whereClause, or(
      like(partners.title, `%${searchTerm}%`),
      like(partners.subtitle, `%${searchTerm}%`),
      like(partners.description, `%${searchTerm}%`)
    ));
  }

  const baseQuery = db.select({
    id: partners.id,
    title: partners.title,
    subtitle: partners.subtitle,
    description: partners.description,
    image_url: partners.imageUrl,
    imageUrl: partners.imageUrl,
    tag_ids: partners.tagIds,
    tagIds: partners.tagIds,
    sort_order: partners.sortOrder,
    sortOrder: partners.sortOrder,
    active: partners.active,
    website_url: partners.websiteUrl,
    websiteUrl: partners.websiteUrl,
    contact_email: partners.contactEmail,
    contactEmail: partners.contactEmail,
    contact_phone: partners.contactPhone,
    contactPhone: partners.contactPhone,
    created_at: partners.createdAt,
    createdAt: partners.createdAt,
    updated_at: partners.updatedAt,
    updatedAt: partners.updatedAt,
  })
    .from(partners)
    .where(whereClause)
    .orderBy(asc(partners.sortOrder));

  const result = limit 
    ? await baseQuery.limit(limit).offset(offset)
    : offset > 0
    ? await baseQuery.offset(offset)
    : await baseQuery;

  return result;
};

// Specific query functions for tags
export const getTags = async () => {
  return await db.select().from(tags).orderBy(asc(tags.name));
};

// User authentication functions
export const getUserByEmail = async (email: string) => {
  return await db.select().from(users).where(eq(users.email, email)).limit(1);
};

export const createUser = async (email: string, passwordHash: string) => {
  const result = await db.insert(users).values({
    email,
    passwordHash,
  }).returning();
  return result[0];
};
