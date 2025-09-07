import dotenv from 'dotenv';

console.log('Before dotenv.config():');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

dotenv.config();

console.log('After dotenv.config():');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Try loading from backend directory
process.chdir('./backend');
dotenv.config();

console.log('After changing to backend directory and dotenv.config():');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
