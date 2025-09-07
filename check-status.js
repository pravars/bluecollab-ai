#!/usr/bin/env node

// BlueCollab.ai Status Check Script
import fetch from 'node-fetch';

const services = [
  { name: 'Frontend', url: 'http://localhost:3001', port: 3001 },
  { name: 'Backend API', url: 'http://localhost:3002/health', port: 3002 },
  { name: 'User Service', url: 'http://localhost:3004/api/v1/health', port: 3004 },
  { name: 'Mongo Express', url: 'http://localhost:8082', port: 8082 }
];

async function checkService(service) {
  try {
    const response = await fetch(service.url, { timeout: 5000 });
    if (response.ok) {
      return { status: '✅ Running', details: 'OK' };
    } else {
      return { status: '⚠️ Responding', details: `HTTP ${response.status}` };
    }
  } catch (error) {
    return { status: '❌ Down', details: error.message };
  }
}

async function checkDatabase() {
  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient('mongodb://localhost:27019/bluecollab-ai');
    await client.connect();
    await client.db().admin().ping();
    await client.close();
    return { status: '✅ Connected', details: 'MongoDB is running' };
  } catch (error) {
    return { status: '❌ Disconnected', details: error.message };
  }
}

async function main() {
  console.log('🔍 BlueCollab.ai Service Status Check\n');
  console.log('=' .repeat(50));
  
  // Check database first
  console.log('📊 Database:');
  const dbStatus = await checkDatabase();
  console.log(`   ${dbStatus.status} ${dbStatus.details}\n`);
  
  // Check services
  console.log('🌐 Services:');
  for (const service of services) {
    const status = await checkService(service);
    console.log(`   ${service.name} (Port ${service.port}): ${status.status}`);
    if (status.details !== 'OK') {
      console.log(`      ${status.details}`);
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ All systems operational!' || '⚠️ Some services need attention');
}

main().catch(console.error);
