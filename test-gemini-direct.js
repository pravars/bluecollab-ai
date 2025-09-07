import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
console.log('GEMINI_MODEL:', process.env.GEMINI_MODEL || 'NOT SET');

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set!');
  process.exit(1);
}

try {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });
  
  console.log('✅ Gemini client created successfully');
  
  // Test with a simple prompt
  const result = await model.generateContent('Hello, how are you?');
  const response = await result.response;
  const text = response.text();
  
  console.log('✅ Gemini API test successful!');
  console.log('Response:', text);
} catch (error) {
  console.error('❌ Gemini API test failed:', error.message);
}
