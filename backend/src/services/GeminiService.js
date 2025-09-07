// Google Gemini AI Service for Material Estimation
import OpenAI from 'openai';
import { ExtractedMaterial } from '../models/MaterialEstimate.js';

class OpenAIService {
  constructor() {
    console.log('🔑 OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');
    console.log('🔑 OPENAI_MODEL:', process.env.OPENAI_MODEL || 'NOT SET');
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  }

  async extractMaterials(request) {
    const prompt = this.buildMaterialExtractionPrompt(request);
    
    try {
      console.log('🤖 Sending request to OpenAI...');
      const startTime = Date.now();
      
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert construction material estimator. Extract materials from job descriptions and return them in the specified JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      });
      
      const text = completion.choices[0].message.content;
      const processingTime = Date.now() - startTime;
      console.log(`✅ OpenAI response received in ${processingTime}ms`);
      
      const parsed = this.parseOpenAIResponse(text);
      return {
        materials: this.validateAndCleanMaterials(parsed.materials || []),
        confidence: parsed.confidence || 70,
        reasoning: parsed.reasoning || '',
        processingTime
      };
    } catch (error) {
      console.error('❌ OpenAI API Error:', error);
      throw new Error('Failed to extract materials from job description');
    }
  }

  buildMaterialExtractionPrompt(request) {
    return `
You are a construction materials expert. Analyze this job description and extract all required materials with precise quantities and specifications.

JOB DETAILS:
- Description: "${request.jobDescription}"
- Service Type: "${request.serviceType}"
- Location: "${request.location || 'Not specified'}"
- Urgency: "${request.urgency || 'Not specified'}"
- Budget: "${request.budget ? `$${request.budget}` : 'Not specified'}"

INSTRUCTIONS:
1. Identify ALL materials needed for this job
2. Provide exact quantities and units
3. Include specific specifications (size, material type, quality)
4. Consider the service type and job complexity
5. Be thorough but realistic

OUTPUT FORMAT:
Return a JSON object with this structure:
{
  "materials": [
    {
      "category": "plumbing|electrical|hardware|lumber|paint|tools|other",
      "name": "Specific product name",
      "quantity": 25,
      "unit": "feet|each|gallons|pounds|square feet|linear feet",
      "specifications": ["1/2 inch", "copper", "type L"],
      "estimatedSize": "small|medium|large",
      "quality": "basic|mid-grade|premium",
      "notes": "Additional context or requirements"
    }
  ],
  "confidence": 85,
  "reasoning": "Brief explanation of material choices"
}

FOCUS ON:
- Exact quantities needed
- Specific product specifications
- Common brand preferences
- Size requirements
- Quality level appropriate for the job
- Safety requirements
- Code compliance needs

IMPORTANT: Return ONLY valid JSON, no additional text or formatting.
`;
  }

  parseOpenAIResponse(text) {
    try {
      // Clean the response text
      let cleanedText = text.trim();
      
      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '');
      }
      
      // Find JSON object in the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('❌ Error parsing OpenAI response:', error);
      console.log('Raw response:', text);
      
      // Fallback: try to extract materials manually
      return this.fallbackParse(text);
    }
  }

  fallbackParse(text) {
    // Simple fallback parsing for when JSON parsing fails
    const materials = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('material') || line.includes('pipe') || line.includes('wire')) {
        materials.push({
          category: 'other',
          name: line.trim(),
          quantity: 1,
          unit: 'each',
          specifications: [],
          estimatedSize: 'medium',
          quality: 'mid-grade',
          notes: 'AI extracted'
        });
      }
    }
    
    return {
      materials,
      confidence: 50,
      reasoning: 'Fallback parsing used'
    };
  }

  validateAndCleanMaterials(materials) {
    return materials.map(material => {
      // Ensure required fields
      const cleaned = {
        category: material.category || 'other',
        name: material.name || 'Unknown material',
        quantity: Math.max(1, parseInt(material.quantity) || 1),
        unit: material.unit || 'each',
        specifications: Array.isArray(material.specifications) ? material.specifications : [],
        estimatedSize: material.estimatedSize || 'medium',
        quality: material.quality || 'mid-grade',
        notes: material.notes || ''
      };
      
      return new ExtractedMaterial(cleaned);
    });
  }
}

export default OpenAIService;
