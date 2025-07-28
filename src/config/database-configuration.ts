export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
      ? parseInt(process.env.DB_PORT, 10)
      : 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    databaseName: process.env.DB_DATABASE_NAME || 'financial_hub',
  },
});
