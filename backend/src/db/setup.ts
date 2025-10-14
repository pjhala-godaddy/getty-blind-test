import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { mkdirSync } from 'fs';
import db from './connection';

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Create data directory if it doesn't exist
    const dataDir = join(__dirname, '../../data');
    mkdirSync(dataDir, { recursive: true });
    
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    db.exec(schema);
    
    console.log('✓ Database schema created successfully');
    console.log(`✓ Database file: ${db.name}`);
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
