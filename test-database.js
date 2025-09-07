// Test MongoDB connection and create test data
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://admin:dwello123@localhost:27018/dwello?authSource=admin';

async function testDatabase() {
  console.log('🧪 Testing MongoDB Connection...\n');

  let client;
  try {
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('dwello');
    const usersCollection = db.collection('users');

    // Test 1: Check if users collection exists
    console.log('\n1. Checking users collection...');
    const collections = await db.listCollections().toArray();
    const usersExists = collections.some(col => col.name === 'users');
    console.log('✅ Users collection exists:', usersExists);

    // Test 2: Count existing users
    console.log('\n2. Counting existing users...');
    const userCount = await usersCollection.countDocuments();
    console.log('✅ Total users in database:', userCount);

    // Test 3: Create a test user
    console.log('\n3. Creating test user...');
    const testUser = {
      email: 'test@bluecollab.ai',
      passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', // password: admin123
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      userType: 'homeowner',
      status: 'active',
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        bio: 'Test user for Dwello platform',
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
        streetAddress: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'USA',
        location: {
          type: 'Point',
          coordinates: [-74.0059, 40.7128] // NYC coordinates
        },
        isPrimary: true
      }]
    };

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('⚠️ Test user already exists');
    } else {
      const result = await usersCollection.insertOne(testUser);
      console.log('✅ Test user created with ID:', result.insertedId);
    }

    // Test 4: Query the test user
    console.log('\n4. Querying test user...');
    const foundUser = await usersCollection.findOne({ email: 'test@bluecollab.ai' });
    if (foundUser) {
      console.log('✅ Test user found:');
      console.log('   - Name:', foundUser.firstName, foundUser.lastName);
      console.log('   - Email:', foundUser.email);
      console.log('   - Type:', foundUser.userType);
      console.log('   - Status:', foundUser.status);
      console.log('   - Created:', foundUser.createdAt);
    } else {
      console.log('❌ Test user not found');
    }

    // Test 5: List all users
    console.log('\n5. Listing all users...');
    const allUsers = await usersCollection.find({}).limit(5).toArray();
    console.log('✅ Found', allUsers.length, 'users:');
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.userType}`);
    });

    // Test 6: Test geospatial query
    console.log('\n6. Testing geospatial query...');
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
    console.log('✅ Users near NYC:', nearbyUsers.length);

    console.log('\n🎉 Database test completed successfully!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

// Run the test
testDatabase();
