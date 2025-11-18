import * as fs from 'fs';

interface ImpactData {
  number: number;
  title: string;
  subtitle: string;
  active: boolean;
  sortOrder: number;
}

const impacts: ImpactData[] = [
  {
    number: 110,
    title: 'Nombre de filles orpheline',
    subtitle: 'Nombre de garçons orphelins pris en charge et qui étudient chez la FCRA',
    active: true,
    sortOrder: 2,
  },
  {
    number: 200,
    title: 'Nombre d’étudiants sortants',
    subtitle: 'Total des étudiants sortants par an',
    active: true,
    sortOrder: 0,
  },
  {
    number: 10,
    title: 'Nombre d’élèves envoyés à l’étranger',
    subtitle: 'Nombre d’élèves envoyés à l’étranger par an',
    active: true,
    sortOrder: 0,
  },
  {
    number: 4,
    title: 'Nombre d’écoles',
    subtitle: 'Nombre d’écoles réparties à Madagascar',
    active: true,
    sortOrder: 0,
  },
  {
    number: 300,
    title: 'Étudiants Universitaires',
    subtitle: 'Enfants universitaires par an',
    active: true,
    sortOrder: 1,
  },
  {
    number: 4,
    title: 'Les Centres de Fcra',
    subtitle: 'Centres, lieux d’aide et d’éducation pour le développement de Madagascar',
    active: true,
    sortOrder: 2,
  },
  {
    number: 250,
    title: 'Orphelins prise en charge',
    subtitle: 'Nomre totale des orphelins en FCRA dans tous Madagascar',
    active: true,
    sortOrder: 0,
  },
  {
    number: 140,
    title: 'Nombre de Garçons Orphelin',
    subtitle: 'Nombre de garçons orphelins qui étudient chez la FCRA',
    active: true,
    sortOrder: 1,
  },
];

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function formatBoolean(value: boolean): string {
  return value ? 'true' : 'false';
}

function main() {
  if (impacts.length === 0) {
    console.log('No impacts to process.');
    return;
  }

  const sql = `INSERT INTO impact (number, title, subtitle, active, sort_order) VALUES
${impacts
  .map((impact, index) => {
    const comma = index < impacts.length - 1 ? ',' : ';';
    const number = impact.number;
    const title = `'${escapeSql(impact.title)}'`;
    const subtitle = `'${escapeSql(impact.subtitle)}'`;
    const active = formatBoolean(impact.active);
    const sortOrder = impact.sortOrder;

    return `  (${number}, ${title}, ${subtitle}, ${active}, ${sortOrder})${comma}`;
  })
  .join('\n')}`;

  console.log('\n=== SQL INSERT STATEMENTS ===\n');
  console.log(sql);
  fs.writeFileSync('impact-insert.sql', sql);
  console.log('\n✓ SQL saved to impact-insert.sql');
  console.log(`\n✓ Successfully prepared ${impacts.length} impact record(s)`);
}

main();


