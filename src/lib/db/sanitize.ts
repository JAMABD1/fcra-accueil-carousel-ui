import { getTableColumns } from 'drizzle-orm';

// Admin form selects surface "no choice" as an empty string. Postgres rejects ''
// for uuid/integer/timestamp columns ("invalid input syntax for type uuid"), so
// coerce it to NULL for every nullable column that isn't genuinely text-shaped.
// Left alone: text/varchar columns (where '' is a legitimate value) and NOT NULL
// columns (where a stray '' should keep failing loudly rather than become NULL).
const acceptsEmptyString = (column: any) =>
  column.dataType === 'string' && column.columnType !== 'PgUUID';

export const nullifyEmptyStrings = (table: any, data: Record<string, any>) => {
  const columns = getTableColumns(table) as Record<string, any>;
  const cleaned: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    const column = columns[key];
    const isUnusableEmptyString =
      value === '' && column && !column.notNull && !acceptsEmptyString(column);
    cleaned[key] = isUnusableEmptyString ? null : value;
  }

  return cleaned;
};
