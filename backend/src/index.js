import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:dwello123@localhost:27018/dwello?authSource=admin';
let db = null;

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('dwello');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: db ? 'connected' : 'disconnected'
  });
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { email, password, firstName, lastName, userType = 'homeowner' } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, first name, and last name are required'
      });
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      email,
      passwordHash,
      firstName,
      lastName,
      userType,
      status: 'active',
      emailVerified: false,
      phoneVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        bio: '',
        specialties: [],
        serviceAreas: {
          type: 'Polygon',
          coordinates: [[[-74.1, 40.7], [-74, 40.7], [-74, 40.8], [-74.1, 40.8], [-74.1, 40.7]]]
        },
        availabilitySchedule: {},
        emergencyAvailable: false
      },
      addresses: []
    };

    const result = await db.collection('users').insertOne(userData);
    const newUser = await db.collection('users').findOne({ _id: result.insertedId });

    // Remove password hash from response
    delete newUser.passwordHash;

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, userType: newUser.userType },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Remove password hash from response
    delete user.passwordHash;

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        user,
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const users = await db.collection('users').find({}).toArray();
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { ObjectId } = await import('mongodb');
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// Create user
app.post('/api/users', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const userData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const result = await db.collection('users').insertOne(userData);
    const newUser = await db.collection('users').findOne({ _id: result.insertedId });

    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { ObjectId } = await import('mongodb');
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { ObjectId } = await import('mongodb');
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

// Search users
app.get('/api/users/search', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const users = await db.collection('users').find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).toArray();

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search users'
    });
  }
});

// Get users by type
app.get('/api/users/type/:type', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { type } = req.params;
    const users = await db.collection('users').find({ userType: type }).toArray();

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users by type:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users by type'
    });
  }
});

// Database stats
app.get('/api/database/stats', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const totalUsers = await db.collection('users').countDocuments();
    const usersByType = await db.collection('users').aggregate([
      { $group: { _id: '$userType', count: { $sum: 1 } } }
    ]).toArray();

    const stats = {
      totalUsers,
      usersByType: usersByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching database stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch database stats'
    });
  }
});

// ==================== JOB POSTING ENDPOINTS ====================

// Create a new job posting
app.post('/api/jobs', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { title, description, serviceType, scope, timeline, budget, location, urgency, specialRequirements, estimatedDuration, skillsRequired, postedBy } = req.body;

    // Validate required fields
    if (!title || !description || !serviceType || !postedBy) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, service type, and postedBy are required'
      });
    }

    // Get poster information
    const { ObjectId } = await import('mongodb');
    const poster = await db.collection('users').findOne({ _id: new ObjectId(postedBy) });
    if (!poster) {
      return res.status(404).json({
        success: false,
        error: 'Poster not found'
      });
    }

    const jobData = {
      title,
      description,
      serviceType,
      scope: scope || 'To be determined',
      timeline: timeline || 'Flexible',
      budget: budget || 'To be discussed',
      location: location || 'Location to be provided',
      urgency: urgency || 'medium',
      specialRequirements: specialRequirements || [],
      estimatedDuration: estimatedDuration || '1-3 days',
      skillsRequired: skillsRequired || [],
      status: 'open',
      postedBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      posterInfo: {
        name: `${poster.firstName} ${poster.lastName}`,
        email: poster.email,
        phone: poster.phone || ''
      }
    };

    const result = await db.collection('jobs').insertOne(jobData);
    const newJob = await db.collection('jobs').findOne({ _id: result.insertedId });

    res.status(201).json({
      success: true,
      data: newJob,
      message: 'Job posted successfully'
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create job'
    });
  }
});

// Get all jobs (for service providers to browse)
app.get('/api/jobs', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { status = 'open', serviceType, limit = 50, skip = 0 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (serviceType) query.serviceType = serviceType;

    const jobs = await db.collection('jobs')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();

    // Get bid counts for each job
    const jobsWithBids = await Promise.all(jobs.map(async (job) => {
      const bidCount = await db.collection('bids').countDocuments({ jobId: job._id.toString() });
      return { ...job, bidCount };
    }));

    res.json({
      success: true,
      data: jobsWithBids
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch jobs'
    });
  }
});

// Get jobs posted by a specific user
app.get('/api/jobs/user/:userId', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { ObjectId } = await import('mongodb');
    const jobs = await db.collection('jobs')
      .find({ postedBy: req.params.userId })
      .sort({ createdAt: -1 })
      .toArray();

    // Get bids for each job
    const jobsWithBids = await Promise.all(jobs.map(async (job) => {
      const bids = await db.collection('bids')
        .find({ jobId: job._id.toString() })
        .toArray();
      return { ...job, bids };
    }));

    res.json({
      success: true,
      data: jobsWithBids
    });
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user jobs'
    });
  }
});

// Get a specific job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { ObjectId } = await import('mongodb');
    const job = await db.collection('jobs').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Get bids for this job
    const bids = await db.collection('bids')
      .find({ jobId: req.params.id })
      .toArray();

    res.json({
      success: true,
      data: { ...job, bids }
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job'
    });
  }
});

// Update job status
app.put('/api/jobs/:id/status', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { status, acceptedBid } = req.body;
    const { ObjectId } = await import('mongodb');

    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (acceptedBid) {
      updateData.acceptedBid = acceptedBid;
    }

    const result = await db.collection('jobs').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job status updated successfully'
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update job status'
    });
  }
});

// ==================== BIDDING ENDPOINTS ====================

// Create a new bid
app.post('/api/bids', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { jobId, bidderId, amount, timeline, description } = req.body;

    // Validate required fields
    if (!jobId || !bidderId || !amount || !timeline) {
      return res.status(400).json({
        success: false,
        error: 'Job ID, bidder ID, amount, and timeline are required'
      });
    }

    // Check if job exists and is open
    const { ObjectId } = await import('mongodb');
    const job = await db.collection('jobs').findOne({ _id: new ObjectId(jobId) });
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: 'Job is no longer accepting bids'
      });
    }

    // Check if bidder already bid on this job
    const existingBid = await db.collection('bids').findOne({ 
      jobId, 
      bidderId 
    });
    if (existingBid) {
      return res.status(400).json({
        success: false,
        error: 'You have already bid on this job'
      });
    }

    // Get bidder information
    const bidder = await db.collection('users').findOne({ _id: new ObjectId(bidderId) });
    if (!bidder) {
      return res.status(404).json({
        success: false,
        error: 'Bidder not found'
      });
    }

    const bidData = {
      jobId,
      bidderId,
      amount: parseFloat(amount),
      timeline,
      description: description || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bidderInfo: {
        name: `${bidder.firstName} ${bidder.lastName}`,
        email: bidder.email,
        phone: bidder.phone || '',
        rating: 0, // TODO: Calculate from reviews
        reviewCount: 0
      }
    };

    const result = await db.collection('bids').insertOne(bidData);
    const newBid = await db.collection('bids').findOne({ _id: result.insertedId });

    res.status(201).json({
      success: true,
      data: newBid,
      message: 'Bid submitted successfully'
    });
  } catch (error) {
    console.error('Error creating bid:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create bid'
    });
  }
});

// Get bids for a specific job
app.get('/api/jobs/:jobId/bids', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const bids = await db.collection('bids')
      .find({ jobId: req.params.jobId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      data: bids
    });
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bids'
    });
  }
});

// Get bids by a specific bidder
app.get('/api/bids/bidder/:bidderId', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const bids = await db.collection('bids')
      .find({ bidderId: req.params.bidderId })
      .sort({ createdAt: -1 })
      .toArray();

    // Get job information for each bid
    const bidsWithJobs = await Promise.all(bids.map(async (bid) => {
      const { ObjectId } = await import('mongodb');
      const job = await db.collection('jobs').findOne({ _id: new ObjectId(bid.jobId) });
      return { ...bid, job };
    }));

    res.json({
      success: true,
      data: bidsWithJobs
    });
  } catch (error) {
    console.error('Error fetching bidder bids:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bidder bids'
    });
  }
});

// Accept a bid
app.put('/api/bids/:bidId/accept', async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        error: 'Database not connected'
      });
    }

    const { ObjectId } = await import('mongodb');
    
    // Update bid status to accepted
    await db.collection('bids').updateOne(
      { _id: new ObjectId(req.params.bidId) },
      { 
        $set: { 
          status: 'accepted',
          updatedAt: new Date().toISOString()
        }
      }
    );

    // Get the bid to find the job
    const bid = await db.collection('bids').findOne({ _id: new ObjectId(req.params.bidId) });
    
    // Update job status and set accepted bid
    await db.collection('jobs').updateOne(
      { _id: new ObjectId(bid.jobId) },
      { 
        $set: { 
          status: 'in_progress',
          acceptedBid: req.params.bidId,
          updatedAt: new Date().toISOString()
        }
      }
    );

    // Reject all other bids for this job
    await db.collection('bids').updateMany(
      { 
        jobId: bid.jobId,
        _id: { $ne: new ObjectId(req.params.bidId) }
      },
      { 
        $set: { 
          status: 'rejected',
          updatedAt: new Date().toISOString()
        }
      }
    );

    res.json({
      success: true,
      message: 'Bid accepted successfully'
    });
  } catch (error) {
    console.error('Error accepting bid:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to accept bid'
    });
  }
});

// Start server
async function startServer() {
  await connectToDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Backend API server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}

startServer().catch(console.error);
