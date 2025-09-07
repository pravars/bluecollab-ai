-- Dwello Platform Seed Data
-- Initial data for development and testing

-- =============================================
-- SYSTEM SETTINGS
-- =============================================

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('platform_name', 'Dwello', 'string', 'Platform name', true),
('platform_fee_percentage', '5.0', 'number', 'Platform fee percentage', false),
('max_bid_radius_miles', '50', 'number', 'Maximum bid radius in miles', true),
('job_expiry_days', '30', 'number', 'Days before job expires', true),
('bid_expiry_days', '7', 'number', 'Days before bid expires', true),
('min_bid_amount', '50.00', 'number', 'Minimum bid amount', true),
('max_photos_per_job', '10', 'number', 'Maximum photos per job', true),
('email_verification_required', 'true', 'boolean', 'Require email verification', false),
('phone_verification_required', 'false', 'boolean', 'Require phone verification', false),
('auto_approve_providers', 'false', 'boolean', 'Auto-approve new providers', false);

-- =============================================
-- FEATURE FLAGS
-- =============================================

INSERT INTO feature_flags (flag_name, is_enabled, target_users, rollout_percentage, description) VALUES
('ai_bidding_enabled', true, '{"userTypes": ["service_provider"], "minRating": 4.0}', 50, 'Enable AI-powered bidding'),
('video_calls_enabled', false, '{"userTypes": ["homeowner", "service_provider"]}', 0, 'Enable video call feature'),
('advanced_analytics', true, '{"userTypes": ["admin"]}', 100, 'Enable advanced analytics dashboard'),
('mobile_app_notifications', true, '{"platforms": ["ios", "android"]}', 100, 'Enable mobile push notifications'),
('escrow_payments', true, '{"regions": ["US", "CA"]}', 100, 'Enable escrow payment system');

-- =============================================
-- SERVICE CATEGORIES
-- =============================================

-- Main categories
INSERT INTO service_categories (id, name, description, icon_url, is_active, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Home Services', 'General home maintenance and repair services', 'https://bluecollab.ai/icons/home.svg', true, 1),
('550e8400-e29b-41d4-a716-446655440002', 'Home Financing', 'Mortgages, refinancing, and home loans', 'https://bluecollab.ai/icons/finance.svg', true, 2),
('550e8400-e29b-41d4-a716-446655440003', 'Home Insurance', 'Property and liability insurance', 'https://bluecollab.ai/icons/insurance.svg', true, 3),
('550e8400-e29b-41d4-a716-446655440004', 'Real Estate', 'Buying, selling, and property management', 'https://bluecollab.ai/icons/real-estate.svg', true, 4);

-- Subcategories for Home Services
INSERT INTO service_categories (id, name, description, parent_id, icon_url, is_active, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'Painting & Decorating', 'Interior and exterior painting services', '550e8400-e29b-41d4-a716-446655440001', 'https://bluecollab.ai/icons/painting.svg', true, 1),
('550e8400-e29b-41d4-a716-446655440012', 'Plumbing', 'Plumbing repairs and installations', '550e8400-e29b-41d4-a716-446655440001', 'https://bluecollab.ai/icons/plumbing.svg', true, 2),
('550e8400-e29b-41d4-a716-446655440013', 'Electrical', 'Electrical work and installations', '550e8400-e29b-41d4-a716-446655440001', 'https://bluecollab.ai/icons/electrical.svg', true, 3),
('550e8400-e29b-41d4-a716-446655440014', 'Cleaning Services', 'House cleaning and maintenance', '550e8400-e29b-41d4-a716-446655440001', 'https://bluecollab.ai/icons/cleaning.svg', true, 4),
('550e8400-e29b-41d4-a716-446655440015', 'HVAC', 'Heating, ventilation, and air conditioning', '550e8400-e29b-41d4-a716-446655440001', 'https://bluecollab.ai/icons/hvac.svg', true, 5),
('550e8400-e29b-41d4-a716-446655440016', 'Landscaping', 'Garden and outdoor maintenance', '550e8400-e29b-41d4-a716-446655440001', 'https://bluecollab.ai/icons/landscaping.svg', true, 6),
('550e8400-e29b-41d4-a716-446655440017', 'Flooring', 'Floor installation and repair', '550e8400-e29b-41d4-a716-446655440001', 'https://bluecollab.ai/icons/flooring.svg', true, 7),
('550e8400-e29b-41d4-a716-446655440018', 'Handyman', 'General repair and maintenance', '550e8400-e29b-41d4-a716-446655440001', 'https://bluecollab.ai/icons/handyman.svg', true, 8);

-- =============================================
-- SAMPLE USERS
-- =============================================

-- Sample Homeowner
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, user_type, status, email_verified, phone_verified, profile_image_url) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'sarah.mitchell@example.com', '$2b$10$rQZ8vF7kL9mN2pQ1sT3uOeXyZ4aB5cD6eF7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZ', 'Sarah', 'Mitchell', '+14155551234', 'homeowner', 'active', true, true, 'https://bluecollab.ai/avatars/sarah.jpg');

-- Sample Service Providers
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, user_type, status, email_verified, phone_verified, profile_image_url) VALUES
('650e8400-e29b-41d4-a716-446655440002', 'mike.painter@example.com', '$2b$10$rQZ8vF7kL9mN2pQ1sT3uOeXyZ4aB5cD6eF7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZ', 'Mike', 'Johnson', '+14155552345', 'service_provider', 'active', true, true, 'https://bluecollab.ai/avatars/mike.jpg'),
('650e8400-e29b-41d4-a716-446655440003', 'elite.services@example.com', '$2b$10$rQZ8vF7kL9mN2pQ1sT3uOeXyZ4aB5cD6eF7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZ', 'David', 'Martinez', '+14155553456', 'service_provider', 'active', true, true, 'https://bluecollab.ai/avatars/david.jpg'),
('650e8400-e29b-41d4-a716-446655440004', 'admin@bluecollab.ai', '$2b$10$rQZ8vF7kL9mN2pQ1sT3uOeXyZ4aB5cD6eF7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZ', 'Admin', 'User', '+14155554567', 'admin', 'active', true, true, 'https://bluecollab.ai/avatars/admin.jpg');

-- User Profiles
INSERT INTO user_profiles (user_id, bio, company_name, years_experience, specialties, service_areas, emergency_available, insurance_info, license_info) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Homeowner looking for quality home services', NULL, NULL, ARRAY['homeowner'], '{"type": "Polygon", "coordinates": [[[-122.5, 37.7], [-122.3, 37.7], [-122.3, 37.9], [-122.5, 37.9], [-122.5, 37.7]]]}', false, NULL, NULL),
('650e8400-e29b-41d4-a716-446655440002', 'Professional painter with 8+ years experience', 'Mike\'s Professional Painting', 8, ARRAY['painting', 'interior', 'exterior'], '{"type": "Polygon", "coordinates": [[[-122.5, 37.7], [-122.3, 37.7], [-122.3, 37.9], [-122.5, 37.9], [-122.5, 37.7]]]}', true, '{"provider": "State Farm", "policyNumber": "SF123456", "expirationDate": "2024-12-31"}', '{"licenses": [{"type": "General Contractor", "number": "GC123456", "state": "CA", "expirationDate": "2024-12-31"}]}'),
('650e8400-e29b-41d4-a716-446655440003', 'Full-service home improvement contractor', 'Elite Home Services', 12, ARRAY['painting', 'plumbing', 'electrical', 'handyman'], '{"type": "Polygon", "coordinates": [[[-122.5, 37.7], [-122.3, 37.7], [-122.3, 37.9], [-122.5, 37.9], [-122.5, 37.7]]]}', true, '{"provider": "Allstate", "policyNumber": "AS789012", "expirationDate": "2024-12-31"}', '{"licenses": [{"type": "General Contractor", "number": "GC789012", "state": "CA", "expirationDate": "2024-12-31"}]}');

-- User Addresses
INSERT INTO user_addresses (user_id, address_type, street_address, city, state, postal_code, latitude, longitude, is_primary) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'home', '123 Main Street', 'San Francisco', 'CA', '94102', 37.7749, -122.4194, true),
('650e8400-e29b-41d4-a716-446655440002', 'business', '456 Oak Avenue', 'San Francisco', 'CA', '94103', 37.7849, -122.4094, true),
('650e8400-e29b-41d4-a716-446655440003', 'business', '789 Pine Street', 'San Francisco', 'CA', '94104', 37.7949, -122.3994, true);

-- =============================================
-- SAMPLE JOBS
-- =============================================

INSERT INTO jobs (id, homeowner_id, title, description, category_id, budget_min, budget_max, urgency, status, location_id, preferred_start_date, preferred_end_date, estimated_duration_hours, materials_provided, materials_description, special_requirements, photos, is_emergency, published_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Kitchen Cabinet Painting', 'Need professional to paint 15 kitchen cabinets. All prep work will be done by homeowner. Looking for high-quality finish with attention to detail.', '550e8400-e29b-41d4-a716-446655440011', 800.00, 1200.00, 'medium', 'open', '750e8400-e29b-41d4-a716-446655440001', '2024-02-01', '2024-02-05', 16, true, 'Homeowner will provide paint and supplies', 'Must be licensed and insured, 3+ years experience', '["https://bluecollab.ai/jobs/kitchen1.jpg", "https://bluecollab.ai/jobs/kitchen2.jpg"]', false, '2024-01-15 10:00:00'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Bathroom Plumbing Repair', 'Leaky faucet and running toilet need immediate attention. Prefer same-day service if possible.', '550e8400-e29b-41d4-a716-446655440012', 200.00, 400.00, 'urgent', 'open', '750e8400-e29b-41d4-a716-446655440001', '2024-01-20', '2024-01-20', 4, false, 'Contractor provides parts', 'Licensed plumber, emergency availability', '["https://bluecollab.ai/jobs/bathroom1.jpg"]', true, '2024-01-20 08:00:00'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'Deck Staining Project', 'Large composite deck needs professional staining. Approximately 400 sq ft. Weather dependent project.', '550e8400-e29b-41d4-a716-446655440016', 600.00, 900.00, 'low', 'open', '750e8400-e29b-41d4-a716-446655440001', '2024-03-01', '2024-03-03', 12, true, 'Stain provided by homeowner', 'Outdoor experience, own equipment', '["https://bluecollab.ai/jobs/deck1.jpg", "https://bluecollab.ai/jobs/deck2.jpg"]', false, '2024-01-18 14:00:00');

-- Job Requirements
INSERT INTO job_requirements (job_id, requirement_type, requirement_value, is_mandatory) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'license', 'General Contractor License', true),
('750e8400-e29b-41d4-a716-446655440001', 'insurance', 'General Liability Insurance', true),
('750e8400-e29b-41d4-a716-446655440001', 'experience', '3+ years painting experience', true),
('750e8400-e29b-41d4-a716-446655440002', 'license', 'Plumbing License', true),
('750e8400-e29b-41d4-a716-446655440002', 'experience', 'Emergency plumbing experience', true),
('750e8400-e29b-41d4-a716-446655440003', 'experience', 'Outdoor staining experience', true),
('750e8400-e29b-41d4-a716-446655440003', 'equipment', 'Power washer and staining equipment', true);

-- =============================================
-- SAMPLE BIDS
-- =============================================

INSERT INTO bids (id, job_id, provider_id, bid_amount, timeline_days, description, status, materials_included, materials_cost, labor_cost, warranty_months, special_terms, submitted_at, expires_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 950.00, 3, 'I specialize in interior painting with 8+ years experience. I use premium Benjamin Moore paints and provide all necessary prep work including hole filling and surface preparation. Includes color consultation and cleanup.', 'pending', false, 150.00, 800.00, 24, 'Includes color consultation and cleanup', '2024-01-15 14:30:00', '2024-01-22 14:30:00'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 1100.00, 2, 'Full-service painting contractor offering premium finishes. We include color consultation and use eco-friendly paints. All work comes with a 2-year warranty and includes cleanup.', 'pending', false, 200.00, 900.00, 24, 'Eco-friendly paints, 2-year warranty', '2024-01-15 16:45:00', '2024-01-22 16:45:00'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', 350.00, 1, 'Licensed plumber with emergency availability. Can start within 2 hours. Will provide all necessary parts and complete repair same day.', 'pending', true, 50.00, 300.00, 12, 'Same-day emergency service', '2024-01-20 09:15:00', '2024-01-27 09:15:00');

-- Bid Materials
INSERT INTO bid_materials (bid_id, store_name, item_name, quantity, unit_price, total_price, store_url) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Home Depot', 'Benjamin Moore Eggshell Paint (2 gallons)', 2.00, 89.98, 179.96, 'https://homedepot.com/paint1'),
('850e8400-e29b-41d4-a716-446655440001', 'Home Depot', 'Primer (1 gallon)', 1.00, 28.99, 28.99, 'https://homedepot.com/primer1'),
('850e8400-e29b-41d4-a716-446655440001', 'Home Depot', 'Brushes & Rollers Set', 1.00, 24.99, 24.99, 'https://homedepot.com/brushes1'),
('850e8400-e29b-41d4-a716-446655440002', 'Lowes', 'Sherwin Williams ProClassic Paint (2 gallons)', 2.00, 95.98, 191.96, 'https://lowes.com/paint1'),
('850e8400-e29b-41d4-a716-446655440002', 'Lowes', 'High-Quality Primer (1 gallon)', 1.00, 32.99, 32.99, 'https://lowes.com/primer1'),
('850e8400-e29b-41d4-a716-446655440002', 'Lowes', 'Professional Brush Set', 1.00, 35.99, 35.99, 'https://lowes.com/brushes1');

-- =============================================
-- AI BIDDING AGENTS
-- =============================================

INSERT INTO ai_bidding_agents (id, provider_id, is_active, bidding_strategy, max_bid_radius_miles, max_bids_per_day, min_project_value, max_project_value, preferred_categories, win_rate, total_bids, won_bids) VALUES
('950e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', true, 'balanced', 15, 8, 200.00, 2000.00, ARRAY['550e8400-e29b-41d4-a716-446655440011'], 26.8, 127, 34),
('950e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', true, 'premium', 20, 12, 300.00, 5000.00, ARRAY['550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440012'], 35.2, 89, 31);

-- =============================================
-- SAMPLE MESSAGES
-- =============================================

INSERT INTO messages (sender_id, recipient_id, job_id, subject, content, message_type, is_read, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Question about painting timeline', 'Hi Sarah, I have a question about the estimated timeline for your kitchen cabinet painting project. Would it be possible to start a day earlier?', 'text', false, '2024-01-15 15:30:00'),
('650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'Re: Question about painting timeline', 'Hi Mike, yes that should work fine. I can have the kitchen cleared by Monday morning. Looking forward to working with you!', 'text', true, '2024-01-15 16:00:00');

-- =============================================
-- SAMPLE NOTIFICATIONS
-- =============================================

INSERT INTO notifications (user_id, type, title, message, data, is_read, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'bid_received', 'New bid received', 'You received a new bid for Kitchen Cabinet Painting', '{"jobId": "750e8400-e29b-41d4-a716-446655440001", "bidId": "850e8400-e29b-41d4-a716-446655440001", "bidAmount": 950, "providerName": "Mike Johnson"}', false, '2024-01-15 14:30:00'),
('650e8400-e29b-41d4-a716-446655440001', 'bid_received', 'New bid received', 'You received a new bid for Kitchen Cabinet Painting', '{"jobId": "750e8400-e29b-41d4-a716-446655440001", "bidId": "850e8400-e29b-41d4-a716-446655440002", "bidAmount": 1100, "providerName": "Elite Home Services"}', false, '2024-01-15 16:45:00'),
('650e8400-e29b-41d4-a716-446655440002', 'message_received', 'New message received', 'You received a new message from Sarah Mitchell', '{"jobId": "750e8400-e29b-41d4-a716-446655440001", "messageId": "750e8400-e29b-41d4-a716-446655440001"}', false, '2024-01-15 16:00:00');

-- =============================================
-- SAMPLE REVIEWS
-- =============================================

INSERT INTO reviews (job_id, reviewer_id, reviewee_id, rating, title, comment, is_public, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 5, 'Excellent work!', 'Mike did an amazing job painting our kitchen cabinets. Very professional and clean work. Highly recommend!', true, '2024-02-10 10:00:00'),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 5, 'Great client!', 'Sarah was a pleasure to work with. Clear communication and fair expectations. Would work with again!', true, '2024-02-10 10:30:00');

-- =============================================
-- PLATFORM METRICS
-- =============================================

INSERT INTO platform_metrics (metric_name, metric_value, metric_date, dimensions) VALUES
('daily_active_users', 1250, '2024-01-15', '{"userType": "all"}'),
('daily_active_users', 800, '2024-01-15', '{"userType": "homeowner"}'),
('daily_active_users', 450, '2024-01-15', '{"userType": "service_provider"}'),
('jobs_posted_today', 45, '2024-01-15', '{"region": "california"}'),
('bids_submitted_today', 127, '2024-01-15', '{"region": "california"}'),
('revenue_today', 12500.00, '2024-01-15', '{"currency": "USD"}'),
('average_job_value', 850.00, '2024-01-15', '{"category": "home_services"}'),
('provider_win_rate', 28.5, '2024-01-15', '{"timeframe": "monthly"}');
