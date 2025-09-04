import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      success: true,
      message: 'User Service is healthy',
      data: {
        service: 'user-service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: {
          status: dbStatus,
          name: mongoose.connection.db?.databaseName || 'unknown'
        },
        uptime: process.uptime()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
