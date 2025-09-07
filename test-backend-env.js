import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Looking for .env at:', path.join(__dirname, '../.env'));

// Load .env from parent directory (project root)
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
