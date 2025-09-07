// Simple test for Material Estimation System (without API calls)
import { MaterialExtractionRequest, ExtractedMaterial, MaterialEstimate, MaterialTemplate } from './backend/src/models/MaterialEstimate.js';

console.log('🧪 Testing Material Estimation Models...\n');

// Test 1: MaterialExtractionRequest
console.log('1️⃣ Testing MaterialExtractionRequest...');
const request = new MaterialExtractionRequest({
  jobDescription: 'Fix leaky faucet and replace pipes',
  serviceType: 'plumbing',
  location: 'Kitchen',
  urgency: 'high',
  budget: 500
});
console.log('✅ Request created:', request);

// Test 2: ExtractedMaterial
console.log('\n2️⃣ Testing ExtractedMaterial...');
const material = new ExtractedMaterial({
  category: 'plumbing',
  name: '1/2 inch copper pipe',
  quantity: 25,
  unit: 'feet',
  specifications: ['1/2 inch', 'copper', 'type L'],
  estimatedSize: 'medium',
  quality: 'mid-grade',
  notes: 'For main water line'
});
console.log('✅ Material created:', material);

// Test 3: MaterialEstimate
console.log('\n3️⃣ Testing MaterialEstimate...');
const estimate = new MaterialEstimate({
  jobId: 'test-123',
  extractedMaterials: [material],
  totalEstimatedCost: 375,
  confidence: 85,
  aiModel: 'gemini-1.5-flash',
  processingTime: 1500
});
console.log('✅ Estimate created:', estimate);

// Test 4: MaterialTemplate
console.log('\n4️⃣ Testing MaterialTemplate...');
const template = new MaterialTemplate({
  serviceType: 'plumbing',
  keywords: ['pipe', 'faucet', 'toilet', 'sink'],
  commonMaterials: [material],
  usageCount: 0
});
console.log('✅ Template created:', template);

console.log('\n🎉 All model tests passed!');
console.log('\n📝 Next steps:');
console.log('1. Get a Gemini API key from: https://makersuite.google.com/app/apikey');
console.log('2. Add it to your .env file: GEMINI_API_KEY=your_actual_key');
console.log('3. Start the backend server: cd backend && npm start');
console.log('4. Run the full test: node test-material-estimation.js');
