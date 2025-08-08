-- Add published_at column to articles for explicit publication date
alter table if exists public.articles
  add column if not exists published_at timestamp with time zone null;

-- Backfill published_at for already published articles if missing
update public.articles
set published_at = coalesce(published_at, created_at)
where status = 'published' and published_at is null;

-- Optional: index to sort/filter by published_at efficiently
create index if not exists articles_published_at_idx on public.articles (published_at desc);

