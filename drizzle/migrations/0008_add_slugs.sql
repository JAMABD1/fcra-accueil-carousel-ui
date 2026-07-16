-- Add SEO-friendly slug columns to entities with detail pages, backfill existing rows.
-- Idempotent: safe to re-run if interrupted.

CREATE EXTENSION IF NOT EXISTS unaccent;

-- ---------------------------------------------------------------------------
-- centres (source: name)
-- ---------------------------------------------------------------------------
ALTER TABLE "centres" ADD COLUMN IF NOT EXISTS "slug" text;

WITH base AS (
  SELECT
    id,
    NULLIF(
      trim(both '-' from regexp_replace(lower(unaccent(name)), '[^a-z0-9]+', '-', 'g')),
      ''
    ) AS base_slug,
    created_at
  FROM "centres"
  WHERE slug IS NULL
),
numbered AS (
  SELECT
    id,
    COALESCE(base_slug, 'item-' || substr(id::text, 1, 8)) AS base_slug,
    row_number() OVER (
      PARTITION BY COALESCE(base_slug, 'item-' || substr(id::text, 1, 8))
      ORDER BY created_at
    ) AS rn
  FROM base
)
UPDATE "centres" c
SET slug = CASE WHEN n.rn = 1 THEN n.base_slug ELSE n.base_slug || '-' || n.rn END
FROM numbered n
WHERE c.id = n.id;

ALTER TABLE "centres" ALTER COLUMN "slug" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "centres" ADD CONSTRAINT "centres_slug_unique" UNIQUE ("slug");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- schools (source: name)
-- ---------------------------------------------------------------------------
ALTER TABLE "schools" ADD COLUMN IF NOT EXISTS "slug" text;

WITH base AS (
  SELECT
    id,
    NULLIF(
      trim(both '-' from regexp_replace(lower(unaccent(name)), '[^a-z0-9]+', '-', 'g')),
      ''
    ) AS base_slug,
    created_at
  FROM "schools"
  WHERE slug IS NULL
),
numbered AS (
  SELECT
    id,
    COALESCE(base_slug, 'item-' || substr(id::text, 1, 8)) AS base_slug,
    row_number() OVER (
      PARTITION BY COALESCE(base_slug, 'item-' || substr(id::text, 1, 8))
      ORDER BY created_at
    ) AS rn
  FROM base
)
UPDATE "schools" s
SET slug = CASE WHEN n.rn = 1 THEN n.base_slug ELSE n.base_slug || '-' || n.rn END
FROM numbered n
WHERE s.id = n.id;

ALTER TABLE "schools" ALTER COLUMN "slug" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "schools" ADD CONSTRAINT "schools_slug_unique" UNIQUE ("slug");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- articles (source: title)
-- ---------------------------------------------------------------------------
ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "slug" text;

WITH base AS (
  SELECT
    id,
    NULLIF(
      trim(both '-' from regexp_replace(lower(unaccent(title)), '[^a-z0-9]+', '-', 'g')),
      ''
    ) AS base_slug,
    created_at
  FROM "articles"
  WHERE slug IS NULL
),
numbered AS (
  SELECT
    id,
    COALESCE(base_slug, 'item-' || substr(id::text, 1, 8)) AS base_slug,
    row_number() OVER (
      PARTITION BY COALESCE(base_slug, 'item-' || substr(id::text, 1, 8))
      ORDER BY created_at
    ) AS rn
  FROM base
)
UPDATE "articles" a
SET slug = CASE WHEN n.rn = 1 THEN n.base_slug ELSE n.base_slug || '-' || n.rn END
FROM numbered n
WHERE a.id = n.id;

ALTER TABLE "articles" ALTER COLUMN "slug" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "articles" ADD CONSTRAINT "articles_slug_unique" UNIQUE ("slug");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- sections (source: title)
-- ---------------------------------------------------------------------------
ALTER TABLE "sections" ADD COLUMN IF NOT EXISTS "slug" text;

WITH base AS (
  SELECT
    id,
    NULLIF(
      trim(both '-' from regexp_replace(lower(unaccent(title)), '[^a-z0-9]+', '-', 'g')),
      ''
    ) AS base_slug,
    created_at
  FROM "sections"
  WHERE slug IS NULL
),
numbered AS (
  SELECT
    id,
    COALESCE(base_slug, 'item-' || substr(id::text, 1, 8)) AS base_slug,
    row_number() OVER (
      PARTITION BY COALESCE(base_slug, 'item-' || substr(id::text, 1, 8))
      ORDER BY created_at
    ) AS rn
  FROM base
)
UPDATE "sections" s
SET slug = CASE WHEN n.rn = 1 THEN n.base_slug ELSE n.base_slug || '-' || n.rn END
FROM numbered n
WHERE s.id = n.id;

ALTER TABLE "sections" ALTER COLUMN "slug" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "sections" ADD CONSTRAINT "sections_slug_unique" UNIQUE ("slug");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- photos (source: title)
-- ---------------------------------------------------------------------------
ALTER TABLE "photos" ADD COLUMN IF NOT EXISTS "slug" text;

WITH base AS (
  SELECT
    id,
    NULLIF(
      trim(both '-' from regexp_replace(lower(unaccent(title)), '[^a-z0-9]+', '-', 'g')),
      ''
    ) AS base_slug,
    created_at
  FROM "photos"
  WHERE slug IS NULL
),
numbered AS (
  SELECT
    id,
    COALESCE(base_slug, 'item-' || substr(id::text, 1, 8)) AS base_slug,
    row_number() OVER (
      PARTITION BY COALESCE(base_slug, 'item-' || substr(id::text, 1, 8))
      ORDER BY created_at
    ) AS rn
  FROM base
)
UPDATE "photos" p
SET slug = CASE WHEN n.rn = 1 THEN n.base_slug ELSE n.base_slug || '-' || n.rn END
FROM numbered n
WHERE p.id = n.id;

ALTER TABLE "photos" ALTER COLUMN "slug" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "photos" ADD CONSTRAINT "photos_slug_unique" UNIQUE ("slug");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- videos (source: title)
-- ---------------------------------------------------------------------------
ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "slug" text;

WITH base AS (
  SELECT
    id,
    NULLIF(
      trim(both '-' from regexp_replace(lower(unaccent(title)), '[^a-z0-9]+', '-', 'g')),
      ''
    ) AS base_slug,
    created_at
  FROM "videos"
  WHERE slug IS NULL
),
numbered AS (
  SELECT
    id,
    COALESCE(base_slug, 'item-' || substr(id::text, 1, 8)) AS base_slug,
    row_number() OVER (
      PARTITION BY COALESCE(base_slug, 'item-' || substr(id::text, 1, 8))
      ORDER BY created_at
    ) AS rn
  FROM base
)
UPDATE "videos" v
SET slug = CASE WHEN n.rn = 1 THEN n.base_slug ELSE n.base_slug || '-' || n.rn END
FROM numbered n
WHERE v.id = n.id;

ALTER TABLE "videos" ALTER COLUMN "slug" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "videos" ADD CONSTRAINT "videos_slug_unique" UNIQUE ("slug");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- activities (source: title)
-- ---------------------------------------------------------------------------
ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "slug" text;

WITH base AS (
  SELECT
    id,
    NULLIF(
      trim(both '-' from regexp_replace(lower(unaccent(title)), '[^a-z0-9]+', '-', 'g')),
      ''
    ) AS base_slug,
    created_at
  FROM "activities"
  WHERE slug IS NULL
),
numbered AS (
  SELECT
    id,
    COALESCE(base_slug, 'item-' || substr(id::text, 1, 8)) AS base_slug,
    row_number() OVER (
      PARTITION BY COALESCE(base_slug, 'item-' || substr(id::text, 1, 8))
      ORDER BY created_at
    ) AS rn
  FROM base
)
UPDATE "activities" a
SET slug = CASE WHEN n.rn = 1 THEN n.base_slug ELSE n.base_slug || '-' || n.rn END
FROM numbered n
WHERE a.id = n.id;

ALTER TABLE "activities" ALTER COLUMN "slug" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "activities" ADD CONSTRAINT "activities_slug_unique" UNIQUE ("slug");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
