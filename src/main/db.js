import { Client } from 'pg';

export default async () => {
  const client = new Client({
    connectionString: 'postgresql://postgres.gloidsvitvconfpaxqcj:3238kolya32@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
    ssl: false
  });

  try {
    await client.connect();
    console.log('Connected!');
    return client;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};


















