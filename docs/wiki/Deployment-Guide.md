# Deployment Guide

## Overview
This guide covers deploying the Dwello application to production environments, including cloud platforms, containerization, and environment configuration.

## Prerequisites

### System Requirements
- **Node.js**: v16 or higher
- **MongoDB**: v4.4 or higher
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 10GB free space
- **CPU**: 2+ cores recommended

### External Services
- **Stripe Account**: For payment processing
- **Domain Name**: For production URL
- **SSL Certificate**: For HTTPS
- **Email Service**: For notifications (optional)

## Environment Setup

### Production Environment Variables
Create a `.env.production` file:

```env
# Application
NODE_ENV=production
PORT=3002
API_VERSION=v1

# Database
MONGODB_URI=mongodb://username:password@your-mongodb-host:27017/bluecollab-ai
MONGODB_DB_NAME=bluecollab-ai

# Security
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=https://your-domain.com
CORS_CREDENTIALS=true

# Stripe (Production)
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key

# Email Service
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@your-domain.com

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Redis (Optional)
REDIS_URL=redis://your-redis-host:6379
REDIS_PASSWORD=your-redis-password
```

## Deployment Options

### 1. Traditional VPS Deployment

#### Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y
```

#### Application Deployment
```bash
# Clone repository
git clone https://github.com/pravars/bluecollab-ai.git
cd bluecollab-ai

# Install dependencies
npm install
cd backend && npm install
cd ../microservices/user-service && npm install

# Build frontend
npm run build

# Start services with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/bluecollab-ai
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /path/to/bluecollab-ai/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # User Service
    location /user-service {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Docker Deployment

#### Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production image
FROM node:18-alpine AS production

WORKDIR /app

# Install PM2
RUN npm install -g pm2

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/microservices ./microservices
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production
RUN cd backend && npm ci --only=production
RUN cd microservices/user-service && npm ci --only=production

# Copy PM2 configuration
COPY ecosystem.config.js ./

EXPOSE 3001 3002 3003

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
```

#### Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
      - "3002:3002"
      - "3003:3003"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/bluecollab-ai
    depends_on:
      - mongo
      - redis
    volumes:
      - ./logs:/app/logs

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  mongo_data:
  redis_data:
```

#### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'bluecollab-ai-frontend',
      script: 'npm',
      args: 'run preview',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'bluecollab-ai-backend',
      script: 'src/index.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    },
    {
      name: 'bluecollab-ai-user-service',
      script: 'src/index.ts',
      cwd: './microservices/user-service',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      }
    }
  ]
};
```

### 3. Cloud Platform Deployment

#### Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create apps
heroku create bluecollab-ai-frontend
heroku create bluecollab-ai-backend
heroku create bluecollab-ai-user-service

# Add MongoDB addon
heroku addons:create mongolab:sandbox --app bluecollab-ai-backend

# Set environment variables
heroku config:set NODE_ENV=production --app bluecollab-ai-backend
heroku config:set STRIPE_SECRET_KEY=sk_live_... --app bluecollab-ai-backend

# Deploy
git push heroku main
```

#### AWS Deployment
```bash
# Install AWS CLI
pip install awscli

# Configure AWS
aws configure

# Deploy with Elastic Beanstalk
eb init
eb create production
eb deploy
```

#### DigitalOcean App Platform
```yaml
# .do/app.yaml
name: bluecollab-ai
services:
- name: frontend
  source_dir: /
  github:
    repo: pravars/bluecollab-ai
    branch: main
  run_command: npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
  envs:
  - key: NODE_ENV
    value: production

- name: backend
  source_dir: /backend
  github:
    repo: pravars/bluecollab-ai
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /api
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: ${db.CONNECTIONSTRING}

databases:
- name: db
  engine: MONGODB
  version: "5"
```

## Database Setup

### MongoDB Production Configuration
```javascript
// mongod.conf
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 0.0.0.0

security:
  authorization: enabled

replication:
  replSetName: "bluecollab-ai-rs"
```

### Database Initialization
```bash
# Connect to MongoDB
mongo

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "secure-password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

# Create application user
use bluecollab-ai
db.createUser({
  user: "bluecollab-ai-user",
  pwd: "app-password",
  roles: ["readWrite"]
})
```

## SSL/HTTPS Setup

### Let's Encrypt with Certbot
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Rest of configuration...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring and Logging

### PM2 Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-logrotate
pm2 install pm2-server-monit

# View logs
pm2 logs
pm2 monit
```

### Application Monitoring
```javascript
// Add to backend/src/index.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Error handling
app.use(Sentry.requestHandler());
app.use(Sentry.errorHandler());
```

### Log Rotation
```bash
# /etc/logrotate.d/bluecollab-ai
/var/log/bluecollab-ai/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Backup Strategy

### Database Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="bluecollab-ai"

mkdir -p $BACKUP_DIR

# Create backup
mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE

# Compress backup
tar -czf $BACKUP_DIR/$DATE.tar.gz -C $BACKUP_DIR $DATE
rm -rf $BACKUP_DIR/$DATE

# Upload to cloud storage (optional)
aws s3 cp $BACKUP_DIR/$DATE.tar.gz s3://your-backup-bucket/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### Application Backup
```bash
#!/bin/bash
# app-backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/app"
APP_DIR="/path/to/bluecollab-ai"

mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C $APP_DIR .

# Clean old backups
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +7 -delete
```

## Security Checklist

### Server Security
- [ ] Firewall configured (UFW/iptables)
- [ ] SSH key authentication only
- [ ] Regular security updates
- [ ] Fail2ban installed
- [ ] Non-root user for application

### Application Security
- [ ] Environment variables secured
- [ ] JWT secrets rotated regularly
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled

### Database Security
- [ ] Authentication enabled
- [ ] Network access restricted
- [ ] Regular backups
- [ ] Encryption at rest
- [ ] Audit logging enabled

## Performance Optimization

### Frontend Optimization
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
});
```

### Backend Optimization
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Enable caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache middleware
const cache = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    client.get(key, (err, result) => {
      if (result) {
        res.send(JSON.parse(result));
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          client.setex(key, duration, JSON.stringify(body));
          res.sendResponse(body);
        };
        next();
      }
    });
  };
};
```

## Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
pm2 logs bluecollab-ai-backend

# Check port availability
netstat -tulpn | grep :3002

# Check environment variables
pm2 env 0
```

#### Database Connection Issues
```bash
# Test MongoDB connection
mongo --host your-mongodb-host --port 27017 -u username -p password

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

#### Performance Issues
```bash
# Check system resources
htop
df -h
free -m

# Check PM2 status
pm2 monit
```

## Maintenance

### Regular Tasks
- **Daily**: Check application logs and error rates
- **Weekly**: Review performance metrics and user feedback
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and update backup strategies

### Update Process
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install
cd backend && npm install

# Build frontend
npm run build

# Restart services
pm2 restart all

# Verify deployment
curl https://your-domain.com/health
```

This deployment guide provides comprehensive instructions for deploying Dwello to various environments. Choose the deployment method that best fits your infrastructure and requirements.
