// Material Estimation API Routes
import express from 'express';
import MaterialEstimationService from '../services/MaterialEstimationService.js';
import { MaterialExtractionRequest } from '../models/MaterialEstimate.js';

const router = express.Router();
let materialService = null;

// Lazy initialization of material service
const getMaterialService = () => {
  if (!materialService) {
    materialService = new MaterialEstimationService();
  }
  return materialService;
};

// Generate material estimate for a job
router.post('/estimate', async (req, res) => {
  try {
    const { jobId, jobDescription, serviceType, location, urgency, budget } = req.body;
    
    if (!jobId || !jobDescription || !serviceType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: jobId, jobDescription, serviceType'
      });
    }

    const request = new MaterialExtractionRequest({
      jobDescription,
      serviceType,
      location,
      urgency,
      budget
    });

    console.log(`🔍 Generating material estimate for job: ${jobId}`);
    const estimate = await getMaterialService().generateMaterialEstimate(jobId, request);
    
    res.json({
      success: true,
      data: estimate
    });
  } catch (error) {
    console.error('❌ Material estimation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate material estimate'
    });
  }
});

// Get existing estimate for a job
router.get('/estimate/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const estimate = await getMaterialService().getEstimate(jobId);
    
    if (!estimate) {
      return res.status(404).json({
        success: false,
        error: 'No material estimate found for this job'
      });
    }

    res.json({
      success: true,
      data: estimate
    });
  } catch (error) {
    console.error('❌ Get estimate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve material estimate'
    });
  }
});

// Initialize material templates
router.post('/templates/init', async (req, res) => {
  try {
    await getMaterialService().initializeTemplates();
    res.json({
      success: true,
      message: 'Material templates initialized successfully'
    });
  } catch (error) {
    console.error('❌ Template initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize material templates'
    });
  }
});

// Get all material templates
router.get('/templates', async (req, res) => {
  try {
    await getMaterialService().connect();
    const collection = getMaterialService().db.collection('materialTemplates');
    const templates = await collection.find({}).toArray();
    
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('❌ Get templates error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve material templates'
    });
  }
});

// Health check for material estimation service
router.get('/health', async (req, res) => {
  try {
    await getMaterialService().connect();
    res.json({
      success: true,
      service: 'material-estimation',
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      service: 'material-estimation',
      status: 'unhealthy',
      error: error.message
    });
  }
});

export default router;
