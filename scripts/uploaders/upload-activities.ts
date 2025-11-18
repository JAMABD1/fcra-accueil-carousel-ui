import * as fs from 'fs';

interface ActivityData {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  videoDescription: string | null;
  photoDescription: string | null;
  tagId: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const activities: ActivityData[] = [
  {
    id: '79aacee1-53b7-4ba7-a92d-379ef3461e69',
    title: 'Actions sociales et  humanitaires',
    subtitle: 'Être présent là où les besoins sont les plus urgents',
    description: `# Être présent là où les besoins sont les plus urgents

Au cœur de sa mission, le FCRA place la solidarité envers les plus démunis. Ses actions sociales et humanitaires visent à soulager les souffrances, renforcer la dignité et améliorer durablement les conditions de vie des populations vulnérables.

1. Aide directe aux familles en difficulté:

L FCRA organise régulièrement des distributions de vivres, de produits de première nécessité et d’aides financières, en particulier pendant les périodes critiques (crises économiques, fêtes religieuses, rentrées scolaires, etc.). Ces actions ciblent les familles les plus fragiles, en milieu urbain comme rural.

2. Accès à l’eau potable : un droit fondamental:

Pour répondre aux besoins fondamentaux des communautés, le FCRA met en place des infrastructures essentielles, comme :

*  Des bornes fontaines installées dans des zones défavorisées
* Des forages permettant un accès direct à l’eau potable

Ces projets transforment concrètement la vie de centaines de familles en leur assurant santé, dignité et autonomie.

3. Interventions en situation d’urgence:

Face aux catastrophes naturelles (cyclones, inondations, sécheresses…), le FCRA se mobilise rapidement et efficacement pour porter secours aux sinistrés :

* Distribution de nourriture et vêtements
* Soutien logistique et moral
* Aides financières et matérielles

Au-delà des dons, c’est une présence humaine et solidaire que le FCRA apporte à ceux qui ont tout perdu.
`,
    videoDescription: 'Description Video',
    photoDescription: 'Description Photo',
    tagId: null,
    sortOrder: 0,
    active: true,
    createdAt: '2025-08-20 07:59:49.852765+00',
    updatedAt: '2025-08-20 08:59:28.980526+00',
  },
];

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function formatValue(value: string | null): string {
  return value !== null ? `'${escapeSql(value)}'` : 'NULL';
}

function formatTimestamp(value: string): string {
  return `'${escapeSql(value)}'`;
}

function main() {
  if (activities.length === 0) {
    console.log('No activities to process.');
    return;
  }

  const sql = `INSERT INTO activities (id, title, subtitle, description, video_description, photo_description, tag_id, sort_order, active, created_at, updated_at) VALUES
${activities
  .map((activity, index) => {
    const comma = index < activities.length - 1 ? ',' : ';';
    const id = `'${activity.id}'`;
    const title = `'${escapeSql(activity.title)}'`;
    const subtitle = formatValue(activity.subtitle);
    const description = `'${escapeSql(activity.description)}'`;
    const videoDescription = formatValue(activity.videoDescription);
    const photoDescription = formatValue(activity.photoDescription);
    const tagId = formatValue(activity.tagId);
    const sortOrder = activity.sortOrder;
    const active = activity.active;
    const createdAt = formatTimestamp(activity.createdAt);
    const updatedAt = formatTimestamp(activity.updatedAt);

    return `  (${id}, ${title}, ${subtitle}, ${description}, ${videoDescription}, ${photoDescription}, ${tagId}, ${sortOrder}, ${active}, ${createdAt}, ${updatedAt})${comma}`;
  })
  .join('\n')}`;

  console.log('\n=== SQL INSERT STATEMENTS ===\n');
  console.log(sql);
  fs.writeFileSync('activities-insert.sql', sql);
  console.log('\n✓ SQL saved to activities-insert.sql');
  console.log(`\n✓ Successfully prepared ${activities.length} activity record(s)`);
}

main();


