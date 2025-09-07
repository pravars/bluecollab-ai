// Material Estimation Models for BlueCollab.ai

// Material extraction request interface
class MaterialExtractionRequest {
  constructor(data) {
    this.jobDescription = data.jobDescription || '';
    this.serviceType = data.serviceType || '';
    this.location = data.location || '';
    this.urgency = data.urgency || '';
    this.budget = data.budget || null;
  }
}

// Extracted material interface
class ExtractedMaterial {
  constructor(data) {
    this.category = data.category || 'other';
    this.name = data.name || 'Unknown material';
    this.quantity = Math.max(1, data.quantity || 1);
    this.unit = data.unit || 'each';
    this.specifications = Array.isArray(data.specifications) ? data.specifications : [];
    this.estimatedSize = data.estimatedSize || 'medium';
    this.quality = data.quality || 'mid-grade';
    this.notes = data.notes || '';
  }
}

// Material estimate interface
class MaterialEstimate {
  constructor(data) {
    this._id = data._id || null;
    this.jobId = data.jobId || '';
    this.extractedMaterials = (data.extractedMaterials || []).map(m => new ExtractedMaterial(m));
    this.totalEstimatedCost = data.totalEstimatedCost || 0;
    this.confidence = data.confidence || 0;
    this.createdAt = data.createdAt || new Date();
    this.lastUpdated = data.lastUpdated || new Date();
    this.aiModel = data.aiModel || 'gemini-1.5-flash';
    this.processingTime = data.processingTime || 0;
  }
}

// Material template interface
class MaterialTemplate {
  constructor(data) {
    this._id = data._id || null;
    this.serviceType = data.serviceType || '';
    this.keywords = data.keywords || [];
    this.commonMaterials = (data.commonMaterials || []).map(m => new ExtractedMaterial(m));
    this.lastUpdated = data.lastUpdated || new Date();
    this.usageCount = data.usageCount || 0;
  }
}

export {
  MaterialExtractionRequest,
  ExtractedMaterial,
  MaterialEstimate,
  MaterialTemplate
};
