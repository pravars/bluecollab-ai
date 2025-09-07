import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');
console.log('OPENAI_MODEL:', process.env.OPENAI_MODEL || 'NOT SET');

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is not set!');
  process.exit(1);
}

try {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  
  console.log('✅ OpenAI client created successfully');
  
  // Test with a simple prompt
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: 'Hello, how are you?'
      }
    ],
    max_tokens: 50
  });
  
  console.log('✅ OpenAI API test successful!');
  console.log('Response:', completion.choices[0].message.content);
} catch (error) {
  console.error('❌ OpenAI API Error:', error.message);
  process.exit(1);
}
