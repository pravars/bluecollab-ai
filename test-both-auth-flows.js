// Test both homeowner and service provider authentication flows
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

async function testBothAuthFlows() {
  console.log('🧪 Testing Both Authentication Flows...\n');

  try {
    // Test 1: Register a homeowner
    console.log('1️⃣ Testing homeowner registration...');
    const homeownerRegisterResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'homeowner-test@example.com',
        password: 'homeowner123',
        firstName: 'John',
        lastName: 'Doe',
        userType: 'homeowner'
      })
    });

    const homeownerRegisterData = await homeownerRegisterResponse.json();
    if (homeownerRegisterData.success) {
      console.log('✅ Homeowner registration successful');
      console.log(`   User Type: ${homeownerRegisterData.data.user.userType}`);
    } else {
      console.log('❌ Homeowner registration failed:', homeownerRegisterData.error);
      return;
    }

    // Test 2: Register a service provider
    console.log('\n2️⃣ Testing service provider registration...');
    const providerRegisterResponse = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'provider-test@example.com',
        password: 'provider123',
        firstName: 'ABC Plumbing',
        lastName: 'Plumbing Services',
        userType: 'service_provider'
      })
    });

    const providerRegisterData = await providerRegisterResponse.json();
    if (providerRegisterData.success) {
      console.log('✅ Service provider registration successful');
      console.log(`   User Type: ${providerRegisterData.data.user.userType}`);
    } else {
      console.log('❌ Service provider registration failed:', providerRegisterData.error);
      return;
    }

    // Test 3: Login homeowner with correct password
    console.log('\n3️⃣ Testing homeowner login with correct password...');
    const homeownerLoginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'homeowner-test@example.com',
        password: 'homeowner123'
      })
    });

    const homeownerLoginData = await homeownerLoginResponse.json();
    if (homeownerLoginData.success) {
      console.log('✅ Homeowner login successful');
      console.log(`   User: ${homeownerLoginData.data.user.firstName} ${homeownerLoginData.data.user.lastName}`);
    } else {
      console.log('❌ Homeowner login failed:', homeownerLoginData.error);
    }

    // Test 4: Login service provider with correct password
    console.log('\n4️⃣ Testing service provider login with correct password...');
    const providerLoginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'provider-test@example.com',
        password: 'provider123'
      })
    });

    const providerLoginData = await providerLoginResponse.json();
    if (providerLoginData.success) {
      console.log('✅ Service provider login successful');
      console.log(`   User: ${providerLoginData.data.user.firstName} ${providerLoginData.data.user.lastName}`);
    } else {
      console.log('❌ Service provider login failed:', providerLoginData.error);
    }

    // Test 5: Try to login homeowner with wrong password
    console.log('\n5️⃣ Testing homeowner login with wrong password...');
    const homeownerWrongLoginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'homeowner-test@example.com',
        password: 'wrongpassword'
      })
    });

    const homeownerWrongLoginData = await homeownerWrongLoginResponse.json();
    if (!homeownerWrongLoginData.success) {
      console.log('✅ Homeowner wrong password correctly rejected');
      console.log(`   Error: ${homeownerWrongLoginData.error}`);
    } else {
      console.log('❌ Homeowner wrong password was accepted (security issue!)');
    }

    // Test 6: Try to login service provider with wrong password
    console.log('\n6️⃣ Testing service provider login with wrong password...');
    const providerWrongLoginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'provider-test@example.com',
        password: 'wrongpassword'
      })
    });

    const providerWrongLoginData = await providerWrongLoginResponse.json();
    if (!providerWrongLoginData.success) {
      console.log('✅ Service provider wrong password correctly rejected');
      console.log(`   Error: ${providerWrongLoginData.error}`);
    } else {
      console.log('❌ Service provider wrong password was accepted (security issue!)');
    }

    // Test 7: Check both users appear in database
    console.log('\n7️⃣ Checking if both users appear in database...');
    const usersResponse = await fetch(`${API_BASE}/api/users`);
    const usersData = await usersResponse.json();
    
    if (usersData.success) {
      const homeowner = usersData.data.find(user => user.email === 'homeowner-test@example.com');
      const provider = usersData.data.find(user => user.email === 'provider-test@example.com');
      
      if (homeowner) {
        console.log('✅ Homeowner found in database');
        console.log(`   Name: ${homeowner.firstName} ${homeowner.lastName}`);
        console.log(`   Type: ${homeowner.userType}`);
      } else {
        console.log('❌ Homeowner not found in database');
      }
      
      if (provider) {
        console.log('✅ Service provider found in database');
        console.log(`   Name: ${provider.firstName} ${provider.lastName}`);
        console.log(`   Type: ${provider.userType}`);
      } else {
        console.log('❌ Service provider not found in database');
      }
    } else {
      console.log('❌ Failed to fetch users:', usersData.error);
    }

    console.log('\n🎉 Both authentication flows test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testBothAuthFlows();
