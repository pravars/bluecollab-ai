// Material Estimation Service - Main orchestrator
import OpenAIService from './OpenAIService.js';
import { MaterialEstimate, MaterialTemplate } from '../models/MaterialEstimate.js';
import { MongoClient } from 'mongodb';

class MaterialEstimationService {
  constructor() {
    this.openaiService = new OpenAIService();
    this.client = null;
    this.db = null;
  }

  async connect() {
    if (!this.db) {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27019/bluecollab-ai';
      this.client = new MongoClient(mongoUri);
      await this.client.connect();
      this.db = this.client.db('bluecollab-ai');
      console.log('✅ Connected to MongoDB for material estimation');
    }
  }

  async generateMaterialEstimate(jobId, request) {
    const startTime = Date.now();
    
    try {
      await this.connect();
      
      // Check for existing templates first
      const template = await this.findTemplate(request.serviceType);
      
      // Extract materials using Gemini AI
      console.log('🔍 Extracting materials with OpenAI...');
      const aiResult = await this.openaiService.extractMaterials(request);
      
      // Calculate confidence based on template match and material completeness
      const confidence = this.calculateConfidence(aiResult.materials, template);
      
      // Estimate total cost (basic calculation)
      const totalEstimatedCost = this.estimateTotalCost(aiResult.materials);
      
      const estimate = new MaterialEstimate({
        jobId,
        extractedMaterials: aiResult.materials,
        totalEstimatedCost,
        confidence,
        createdAt: new Date(),
        lastUpdated: new Date(),
        aiModel: 'gemini-1.5-flash',
        processingTime: Date.now() - startTime
      });

      // Save to database
      await this.saveEstimate(estimate);
      
      console.log(`✅ Material estimate generated for job ${jobId} with ${aiResult.materials.length} materials`);
      return estimate;
    } catch (error) {
      console.error('❌ Material estimation error:', error);
      throw new Error('Failed to generate material estimate');
    }
  }

  async getEstimate(jobId) {
    try {
      await this.connect();
      const collection = this.db.collection('materialEstimates');
      const estimate = await collection.findOne({ jobId });
      
      if (estimate) {
        return new MaterialEstimate(estimate);
      }
      return null;
    } catch (error) {
      console.error('❌ Error retrieving estimate:', error);
      throw new Error('Failed to retrieve material estimate');
    }
  }

  async saveEstimate(estimate) {
    try {
      await this.connect();
      const collection = this.db.collection('materialEstimates');
      
      if (estimate._id) {
        await collection.updateOne(
          { _id: estimate._id },
          { $set: estimate },
          { upsert: true }
        );
      } else {
        const result = await collection.insertOne(estimate);
        estimate._id = result.insertedId;
      }
    } catch (error) {
      console.error('❌ Error saving estimate:', error);
      throw new Error('Failed to save material estimate');
    }
  }

  async findTemplate(serviceType) {
    try {
      await this.connect();
      const collection = this.db.collection('materialTemplates');
      const template = await collection.findOne({ serviceType });
      
      if (template) {
        return new MaterialTemplate(template);
      }
      return null;
    } catch (error) {
      console.error('❌ Error finding template:', error);
      return null;
    }
  }

  async saveTemplate(template) {
    try {
      await this.connect();
      const collection = this.db.collection('materialTemplates');
      await collection.updateOne(
        { serviceType: template.serviceType },
        { $set: template },
        { upsert: true }
      );
    } catch (error) {
      console.error('❌ Error saving template:', error);
      throw new Error('Failed to save material template');
    }
  }

  async initializeTemplates() {
    try {
      await this.connect();
      
      const templates = [
        new MaterialTemplate({
          serviceType: 'plumbing',
          keywords: ['pipe', 'faucet', 'toilet', 'sink', 'drain', 'water', 'leak'],
          commonMaterials: [
            { category: 'plumbing', name: '1/2 inch copper pipe', quantity: 10, unit: 'feet', specifications: ['1/2 inch', 'copper', 'type L'] },
            { category: 'plumbing', name: 'Pipe fittings', quantity: 5, unit: 'each', specifications: ['1/2 inch', 'copper'] },
            { category: 'hardware', name: 'Pipe hangers', quantity: 3, unit: 'each', specifications: ['1/2 inch'] }
          ],
          lastUpdated: new Date(),
          usageCount: 0
        }),
        new MaterialTemplate({
          serviceType: 'electrical',
          keywords: ['wire', 'outlet', 'switch', 'breaker', 'electrical', 'power'],
          commonMaterials: [
            { category: 'electrical', name: '12 AWG wire', quantity: 50, unit: 'feet', specifications: ['12 AWG', 'copper'] },
            { category: 'electrical', name: 'Electrical outlets', quantity: 3, unit: 'each', specifications: ['GFCI', '20A'] },
            { category: 'hardware', name: 'Wire nuts', quantity: 10, unit: 'each', specifications: ['red'] }
          ],
          lastUpdated: new Date(),
          usageCount: 0
        }),
        new MaterialTemplate({
          serviceType: 'painting',
          keywords: ['paint', 'brush', 'roller', 'primer', 'wall', 'ceiling'],
          commonMaterials: [
            { category: 'paint', name: 'Interior paint', quantity: 2, unit: 'gallons', specifications: ['satin finish', 'white'] },
            { category: 'tools', name: 'Paint brushes', quantity: 3, unit: 'each', specifications: ['2 inch', 'angled'] },
            { category: 'tools', name: 'Paint rollers', quantity: 2, unit: 'each', specifications: ['9 inch', 'smooth'] }
          ],
          lastUpdated: new Date(),
          usageCount: 0
        })
      ];

      for (const template of templates) {
        await this.saveTemplate(template);
      }
      
      console.log('✅ Material templates initialized');
    } catch (error) {
      console.error('❌ Error initializing templates:', error);
      throw new Error('Failed to initialize material templates');
    }
  }

  calculateConfidence(materials, template) {
    let confidence = 70; // Base confidence
    
    // Increase confidence for more materials (more thorough analysis)
    if (materials.length > 5) confidence += 10;
    if (materials.length > 10) confidence += 10;
    
    // Increase confidence if template matches
    if (template) {
      const templateMatch = this.calculateTemplateMatch(materials, template);
      confidence += templateMatch * 20;
    }
    
    // Decrease confidence for incomplete specifications
    const incompleteSpecs = materials.filter(m => m.specifications.length === 0);
    confidence -= (incompleteSpecs.length / materials.length) * 30;
    
    return Math.min(100, Math.max(0, confidence));
  }

  calculateTemplateMatch(materials, template) {
    const templateCategories = new Set(template.commonMaterials.map(m => m.category));
    const materialCategories = new Set(materials.map(m => m.category));
    
    const intersection = new Set([...templateCategories].filter(x => materialCategories.has(x)));
    return intersection.size / templateCategories.size;
  }

  estimateTotalCost(materials) {
    // Basic cost estimation based on material categories
    const categoryCosts = {
      'plumbing': 15,
      'electrical': 25,
      'hardware': 5,
      'lumber': 8,
      'paint': 12,
      'tools': 20,
      'other': 10
    };

    return materials.reduce((total, material) => {
      const baseCost = categoryCosts[material.category] || 10;
      const qualityMultiplier = material.quality === 'premium' ? 1.5 : 
                               material.quality === 'basic' ? 0.7 : 1.0;
      return total + (material.quantity * baseCost * qualityMultiplier);
    }, 0);
  }

  async close() {
    if (this.client) {
      await this.client.close();
    }
  }
}

export default MaterialEstimationService;
