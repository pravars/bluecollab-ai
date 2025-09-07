// Direct test of Gemini integration
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testDirectGemini() {
  console.log('🧪 Testing Direct Gemini Integration...\n');
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key loaded:', apiKey ? '✅ Yes' : '❌ No');
    
    if (!apiKey) {
      console.error('❌ No API key found in environment variables');
      return;
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
    Analyze this job description and extract materials needed:
    
    Job: "Fix leaky kitchen faucet and replace corroded pipes"
    Service Type: "plumbing"
    
    Return a JSON object with materials array, each containing:
    - category: string
    - name: string  
    - quantity: number
    - unit: string
    - specifications: array of strings
    
    Example format:
    {
      "materials": [
        {
          "category": "plumbing",
          "name": "1/2 inch copper pipe",
          "quantity": 10,
          "unit": "feet",
          "specifications": ["1/2 inch", "copper", "type L"]
        }
      ]
    }
    `;
    
    console.log('🤖 Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini Response:');
    console.log(text);
    
    // Try to parse JSON
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('\n✅ Parsed JSON:');
        console.log(JSON.stringify(parsed, null, 2));
      }
    } catch (parseError) {
      console.log('⚠️ Could not parse JSON from response');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDirectGemini();
