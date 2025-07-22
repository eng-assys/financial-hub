import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/entity/*.entity.js'],
  migrations: ['dist/typeorm/migrations/*.js'],
  // entities: [join(__dirname, '**/**', '*.entity.{ts,js}')],
});

export default dataSource;
