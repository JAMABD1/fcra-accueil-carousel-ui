import * as fs from 'fs';

interface CentreData {
  name: string;
  description: string;
  address: string;
  active: boolean;
  sortOrder: number;
}

const centres: CentreData[] = [
  {
    name: 'Centre FCRA Andakana',
    description: 'Le Centre FCRA Andakana est situé dans la commune rurale d’Andakana. Il représente aujourd’hui le plus grand complexe du réseau FCRA à Madagascar.Doté d’infrastructures modernes, le centre d’Andakana symbolise l’ambition du FCRA : offrir à la jeunesse malgache un accès équitable à une éducation de qualité, dans un cadre propice à l’épanouissement personnel et collectif.',
    address: 'Andakana',
    active: true,
    sortOrder: 1,
  },
  {
    name: 'Centres FCRA Manakara',
    description: 'Créés il y a bientôt trois ans, les centres FCRA de Manakara et Sakoana incarnent la volonté du FCRA d’élargir son action éducative dans des zones stratégiques, souvent négligées, en accompagnant les jeunes vers un avenir meilleur.',
    address: 'Manakara',
    active: true,
    sortOrder: 2,
  },
  {
    name: 'Centres FCRA Sakoana',
    description: 'Créés il y a bientôt trois ans, les centres FCRA de Sakoana incarnent la volonté du FCRA d’élargir son action éducative dans des zones stratégiques, souvent négligées, en accompagnant les jeunes vers un avenir meilleur.',
    address: 'Sakoana',
    active: true,
    sortOrder: 3,
  },
  {
    name: 'Centre FCRA Antohomadinika',
    description: 'Le Centre FCRA Antaniavo est situé à Antohomadinika, et constitue le siège social de l’ensemble des structures FCRA. Il joue un rôle central dans la coordination des actions sociales, éducatives et humanitaires menées à travers le pays.',
    address: 'III D 36 Ter , Antaniavo Antohomadinika Antananarivo',
    active: true,
    sortOrder: 4,
  },
];

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function formatBoolean(value: boolean): string {
  return value ? 'true' : 'false';
}

function main() {
  if (centres.length === 0) {
    console.log('No centres to process.');
    return;
  }

  const sql = `INSERT INTO centres (name, description, address, sort_order, active) VALUES
${centres
  .map((centre, index) => {
    const comma = index < centres.length - 1 ? ',' : ';';
    const name = `'${escapeSql(centre.name)}'`;
    const description = `'${escapeSql(centre.description)}'`;
    const address = `'${escapeSql(centre.address)}'`;
    const sortOrder = centre.sortOrder;
    const active = formatBoolean(centre.active);

    return `  (${name}, ${description}, ${address}, ${sortOrder}, ${active})${comma}`;
  })
  .join('\n')}`;

  console.log('\n=== SQL INSERT STATEMENTS ===\n');
  console.log(sql);
  fs.writeFileSync('centres-insert.sql', sql);
  console.log('\n✓ SQL saved to centres-insert.sql');
  console.log(`\n✓ Successfully prepared ${centres.length} centre record(s)`);
}

main();


