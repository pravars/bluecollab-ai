# Dwello Database Architecture

This directory contains the complete database schema and supporting files for the Dwello platform.

## 📁 File Structure

```
database/
├── schema.sql              # PostgreSQL schema with all tables, indexes, and constraints
├── mongodb-schema.js       # MongoDB document schema for NoSQL implementation
├── seed-data.sql           # Sample data for development and testing
├── relationships.md        # Entity relationships and architecture documentation
└── README.md              # This file
```

## 🗄️ Database Systems Supported

### 1. **PostgreSQL (Primary)**
- **File**: `schema.sql`
- **Features**: Full ACID compliance, JSONB support, PostGIS for geospatial data
- **Use Case**: Production system with complex queries and transactions

### 2. **MongoDB (Alternative)**
- **File**: `mongodb-schema.js`
- **Features**: Document-based storage, flexible schema, horizontal scaling
- **Use Case**: High-volume read operations, rapid development

## 🏗️ Database Design Principles

### **Domain-Driven Design**
- Each table represents a business concept
- Clear separation of concerns
- Ubiquitous language throughout schema

### **Scalability**
- Horizontal partitioning strategies
- Optimized indexing for common queries
- Efficient data archiving

### **Performance**
- Strategic indexing on foreign keys and search fields
- Composite indexes for complex queries
- Geographic indexing for location-based searches

### **Data Integrity**
- Foreign key constraints for referential integrity
- Check constraints for business rules
- Triggers for automatic timestamp updates

## 📊 Core Entities

### **User Management**
- `users` - Base user table with authentication
- `user_profiles` - Extended profile information
- `user_addresses` - Multiple addresses per user

### **Job Management**
- `jobs` - Service requests from homeowners
- `service_categories` - Hierarchical service categorization
- `job_requirements` - Dynamic job requirements

### **Bidding System**
- `bids` - Provider proposals for jobs
- `bid_materials` - Detailed material estimates
- `ai_bidding_agents` - AI-powered bidding configuration

### **Communication**
- `messages` - User-to-user messaging
- `notifications` - System notifications
- `reviews` - Rating and review system

### **Financial**
- `transactions` - Payment processing
- `payment_methods` - User payment methods
- `escrow_accounts` - Secure payment holding

### **AI & Analytics**
- `ai_agent_activity` - AI decision logging
- `user_activity_logs` - User behavior tracking
- `platform_metrics` - Business intelligence data

## 🔧 Setup Instructions

### **PostgreSQL Setup**

1. **Create Database**
```sql
CREATE DATABASE dwello;
\c dwello;
```

2. **Enable Extensions**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

3. **Run Schema**
```bash
psql -d dwello -f schema.sql
```

4. **Load Sample Data**
```bash
psql -d dwello -f seed-data.sql
```

### **MongoDB Setup**

1. **Start MongoDB**
```bash
mongod --dbpath /path/to/data
```

2. **Load Schema and Data**
```bash
mongo dwello < mongodb-schema.js
```

## 📈 Performance Considerations

### **Indexing Strategy**
- Primary keys on all tables
- Foreign key indexes for joins
- Composite indexes for common query patterns
- Geographic indexes for location searches
- Full-text search indexes for content

### **Query Optimization**
- Use EXPLAIN ANALYZE for query optimization
- Monitor slow query logs
- Regular VACUUM and ANALYZE operations
- Connection pooling for high concurrency

### **Scaling Strategies**
- Read replicas for read-heavy workloads
- Partitioning by date for log tables
- Sharding by user_id for user data
- Caching frequently accessed data

## 🔒 Security Features

### **Data Protection**
- Encryption at rest for sensitive fields
- Row-level security for multi-tenancy
- Audit trails for all data changes
- PII data anonymization

### **Access Control**
- Role-based permissions
- API key management
- Database user isolation
- Network security groups

## 📋 Maintenance Tasks

### **Daily**
- Monitor database performance
- Check error logs
- Verify backup completion

### **Weekly**
- Analyze query performance
- Update table statistics
- Review security logs

### **Monthly**
- Database maintenance (VACUUM, REINDEX)
- Archive old data
- Review and optimize indexes
- Security audit

## 🚀 Migration Strategy

### **Schema Changes**
1. Create migration scripts
2. Test on staging environment
3. Backup production data
4. Apply changes during maintenance window
5. Verify data integrity

### **Data Migration**
1. Export data from source
2. Transform data format
3. Validate data integrity
4. Import to target database
5. Verify migration success

## 📊 Monitoring & Alerting

### **Key Metrics**
- Database connection count
- Query response times
- Disk usage
- Replication lag
- Error rates

### **Alerts**
- High CPU usage
- Slow queries (>1s)
- Disk space <20%
- Connection limit >80%
- Replication lag >5s

## 🔄 Backup & Recovery

### **Backup Strategy**
- Daily full backups
- Continuous WAL archiving
- Cross-region replication
- Point-in-time recovery

### **Recovery Procedures**
- Test restore procedures monthly
- Document recovery steps
- Maintain recovery runbooks
- Regular disaster recovery drills

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl.html)
- [Performance Tuning Guide](https://www.postgresql.org/docs/current/performance-tips.html)
