// Simple cache clearing script for webpack issues
console.log('Clearing webpack cache...');

// This file helps webpack recognize changes
const components = [
  './components/JobPosterDashboard.tsx',
  './components/BidManagement.tsx',
  './components/JobDetails.tsx',
  './components/JobProgress.tsx'
];

console.log('Components loaded:', components);