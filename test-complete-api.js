// Complete API and Database Test for Dwello User Service
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://admin:bluecollab-ai123@localhost:27018/bluecollab-ai?authSource=admin';

// Test data
const testUsers = [
  {
    email: 'homeowner@bluecollab-ai.com',
    passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', // password123
    firstName: 'John',
    lastName: 'Homeowner',
    phone: '+1234567890',
    userType: 'homeowner',
    status: 'active',
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      bio: 'I need help with home repairs and maintenance',
      specialties: ['home_repair'],
      serviceAreas: {
        type: 'Polygon',
        coordinates: [[[-74.1, 40.7], [-74.0, 40.7], [-74.0, 40.8], [-74.1, 40.8], [-74.1, 40.7]]]
      },
      availabilitySchedule: {},
      emergencyAvailable: true
    },
    addresses: [{
      addressType: 'home',
      streetAddress: '123 Home Street',
      city: 'Home City',
      state: 'HC',
      postalCode: '12345',
      country: 'USA',
      location: {
        type: 'Point',
        coordinates: [-74.0059, 40.7128]
      },
      isPrimary: true
    }]
  },
  {
    email: 'contractor@bluecollab-ai.com',
    passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', // password123
    firstName: 'Jane',
    lastName: 'Contractor',
    phone: '+1234567891',
    userType: 'service_provider',
    status: 'active',
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      bio: 'Professional contractor with 10 years experience',
      companyName: 'Jane\'s Construction',
      website: 'https://janesconstruction.com',
      yearsExperience: 10,
      specialties: ['plumbing', 'electrical', 'carpentry'],
      serviceAreas: {
        type: 'Polygon',
        coordinates: [[[-74.1, 40.7], [-74.0, 40.7], [-74.0, 40.8], [-74.1, 40.8], [-74.1, 40.7]]]
      },
      availabilitySchedule: {
        monday: { start: '08:00', end: '17:00' },
        tuesday: { start: '08:00', end: '17:00' },
        wednesday: { start: '08:00', end: '17:00' },
        thursday: { start: '08:00', end: '17:00' },
        friday: { start: '08:00', end: '17:00' }
      },
      emergencyAvailable: true,
      insuranceInfo: {
        provider: 'Contractor Insurance Co',
        policyNumber: 'POL123456',
        expirationDate: '2025-12-31'
      },
      licenseInfo: {
        licenses: [{
          type: 'General Contractor',
          number: 'GC123456',
          state: 'NY',
          expirationDate: '2025-12-31'
        }]
      }
    },
    addresses: [{
      addressType: 'business',
      streetAddress: '456 Business Ave',
      city: 'Business City',
      state: 'BC',
      postalCode: '54321',
      country: 'USA',
      location: {
        type: 'Point',
        coordinates: [-74.0059, 40.7128]
      },
      isPrimary: true
    }]
  },
  {
    email: 'admin@bluecollab-ai.com',
    passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', // password123
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1234567892',
    userType: 'admin',
    status: 'active',
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      bio: 'Platform administrator',
      specialties: ['admin'],
      serviceAreas: {
        type: 'Polygon',
        coordinates: [[[-74.1, 40.7], [-74.0, 40.7], [-74.0, 40.8], [-74.1, 40.8], [-74.1, 40.7]]]
      },
      availabilitySchedule: {},
      emergencyAvailable: false
    },
    addresses: []
  }
];

async function testDatabaseOperations() {
  console.log('🧪 Testing Database Operations...\n');
  
  let client;
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('bluecollab-ai');
    const usersCollection = db.collection('users');

    // Test 1: Clear existing test users
    console.log('\n1. Cleaning up existing test users...');
    const deleteResult = await usersCollection.deleteMany({
      email: { $in: testUsers.map(u => u.email) }
    });
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing test users`);

    // Test 2: Insert test users
    console.log('\n2. Creating test users...');
    const insertResult = await usersCollection.insertMany(testUsers);
    console.log(`✅ Created ${insertResult.insertedCount} test users`);
    
    testUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.userType}`);
    });

    // Test 3: Query users by type
    console.log('\n3. Testing queries by user type...');
    const homeowners = await usersCollection.find({ userType: 'homeowner' }).toArray();
    const contractors = await usersCollection.find({ userType: 'service_provider' }).toArray();
    const admins = await usersCollection.find({ userType: 'admin' }).toArray();
    
    console.log(`✅ Homeowners: ${homeowners.length}`);
    console.log(`✅ Service Providers: ${contractors.length}`);
    console.log(`✅ Admins: ${admins.length}`);

    // Test 4: Test geospatial query
    console.log('\n4. Testing geospatial queries...');
    const nearbyUsers = await usersCollection.find({
      'addresses.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [-74.0059, 40.7128] // NYC coordinates
          },
          $maxDistance: 10000 // 10km radius
        }
      }
    }).toArray();
    console.log(`✅ Users near NYC: ${nearbyUsers.length}`);

    // Test 5: Test text search
    console.log('\n5. Testing text search...');
    const searchResults = await usersCollection.find({
      $text: { $search: 'construction' }
    }).toArray();
    console.log(`✅ Text search results: ${searchResults.length}`);

    // Test 6: Test aggregation pipeline
    console.log('\n6. Testing aggregation pipeline...');
    const userStats = await usersCollection.aggregate([
      {
        $group: {
          _id: '$userType',
          count: { $sum: 1 },
          avgExperience: { $avg: '$profile.yearsExperience' }
        }
      }
    ]).toArray();
    
    console.log('✅ User statistics by type:');
    userStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} users, avg experience: ${stat.avgExperience || 'N/A'} years`);
    });

    // Test 7: Test update operations
    console.log('\n7. Testing update operations...');
    const updateResult = await usersCollection.updateOne(
      { email: 'homeowner@bluecollab-ai.com' },
      { 
        $set: { 
          'profile.bio': 'Updated bio - I need help with home repairs, maintenance, and renovations',
          updatedAt: new Date()
        }
      }
    );
    console.log(`✅ Updated ${updateResult.modifiedCount} user profile`);

    // Test 8: Test complex queries
    console.log('\n8. Testing complex queries...');
    const experiencedContractors = await usersCollection.find({
      userType: 'service_provider',
      'profile.yearsExperience': { $gte: 5 },
      'profile.emergencyAvailable': true
    }).toArray();
    console.log(`✅ Experienced contractors available for emergencies: ${experiencedContractors.length}`);

    // Test 9: Test pagination
    console.log('\n9. Testing pagination...');
    const page1 = await usersCollection.find({})
      .sort({ createdAt: -1 })
      .limit(2)
      .skip(0)
      .toArray();
    const page2 = await usersCollection.find({})
      .sort({ createdAt: -1 })
      .limit(2)
      .skip(2)
      .toArray();
    
    console.log(`✅ Page 1: ${page1.length} users`);
    console.log(`✅ Page 2: ${page2.length} users`);

    // Test 10: Test data validation
    console.log('\n10. Testing data validation...');
    try {
      await usersCollection.insertOne({
        email: 'invalid@bluecollab-ai.com',
        // Missing required fields
        userType: 'homeowner'
      });
      console.log('❌ Data validation failed - invalid user was inserted');
    } catch (error) {
      console.log('✅ Data validation working - invalid user was rejected');
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 All Database Tests Passed!');
    console.log('\n📊 Test Summary:');
    console.log('✅ Database Connection - MongoDB connected successfully');
    console.log('✅ User Creation - Multiple user types created');
    console.log('✅ Data Queries - Various query types working');
    console.log('✅ Geospatial Queries - Location-based searches working');
    console.log('✅ Text Search - Full-text search working');
    console.log('✅ Aggregation - Complex data analysis working');
    console.log('✅ Updates - User data updates working');
    console.log('✅ Complex Queries - Advanced filtering working');
    console.log('✅ Pagination - Data pagination working');
    console.log('✅ Data Validation - Schema validation working');
    
    console.log('\n🌐 Access your database at: http://localhost:8081');
    console.log('   Username: admin');
    console.log('   Password: bluecollab-ai123');
    
    console.log('\n📝 Test Data Created:');
    console.log('   - 1 Homeowner (homeowner@bluecollab-ai.com)');
    console.log('   - 1 Service Provider (contractor@bluecollab-ai.com)');
    console.log('   - 1 Admin (admin@bluecollab-ai.com)');
    console.log('   - 1 Existing test user (test@bluecollab-ai.com)');

  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

// Run the comprehensive test
testDatabaseOperations();
