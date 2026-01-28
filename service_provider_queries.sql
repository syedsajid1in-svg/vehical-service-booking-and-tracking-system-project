-- ============================================
-- SERVICE PROVIDER DATABASE QUERIES
-- Vehicle Booking System
-- ============================================

-- Switch to the database
USE vehicle_booking;

-- ============================================
-- 1. VIEW ALL SERVICE PROVIDERS
-- ============================================
SELECT 
    id,
    name,
    email AS login_email,
    password_hash AS password,
    phone,
    address,
    service_center_id,
    role
FROM users 
WHERE role = 'PROVIDER'
ORDER BY id;

-- ============================================
-- 2. VIEW PROVIDERS WITH SERVICE CENTER DETAILS
-- ============================================
SELECT 
    u.id AS provider_id,
    u.name AS provider_name,
    u.email AS login_email,
    u.password_hash AS password,
    u.phone AS provider_phone,
    u.address AS provider_address,
    sc.id AS center_id,
    sc.name AS service_center_name,
    sc.location AS service_center_location,
    sc.contact AS service_center_contact
FROM users u
LEFT JOIN service_center sc ON u.service_center_id = sc.id
WHERE u.role = 'PROVIDER'
ORDER BY u.id;

-- ============================================
-- 3. VIEW ONLY LOGIN CREDENTIALS
-- ============================================
SELECT 
    id,
    name,
    email AS login_email,
    password_hash AS password
FROM users 
WHERE role = 'PROVIDER';

-- ============================================
-- 4. COUNT PROVIDERS BY SERVICE CENTER
-- ============================================
SELECT 
    sc.name AS service_center,
    sc.location,
    COUNT(u.id) AS total_providers
FROM service_center sc
LEFT JOIN users u ON sc.id = u.service_center_id AND u.role = 'PROVIDER'
GROUP BY sc.id, sc.name, sc.location
ORDER BY total_providers DESC;

-- ============================================
-- 5. VIEW ALL USER ROLES SUMMARY
-- ============================================
SELECT 
    role,
    COUNT(*) AS total_users
FROM users 
GROUP BY role;

-- ============================================
-- 6. VIEW PROVIDERS WITH THEIR BOOKINGS COUNT
-- ============================================
SELECT 
    u.id AS provider_id,
    u.name AS provider_name,
    u.email AS login_email,
    sc.name AS service_center,
    COUNT(b.id) AS total_bookings
FROM users u
LEFT JOIN service_center sc ON u.service_center_id = sc.id
LEFT JOIN booking b ON b.service_center_id = sc.id
WHERE u.role = 'PROVIDER'
GROUP BY u.id, u.name, u.email, sc.name
ORDER BY total_bookings DESC;

-- ============================================
-- 7. INSERT NEW SERVICE PROVIDER (EXAMPLE)
-- ============================================
-- INSERT INTO users (name, email, phone, address, password_hash, role, service_center_id)
-- VALUES ('John Doe', 'john@example.com', '+91-9876543215', 'Mumbai', 'password123', 'PROVIDER', 1);

-- ============================================
-- 8. UPDATE PROVIDER'S SERVICE CENTER
-- ============================================
-- UPDATE users 
-- SET service_center_id = 2 
-- WHERE id = 1 AND role = 'PROVIDER';

-- ============================================
-- 9. DELETE A SERVICE PROVIDER
-- ============================================
-- DELETE FROM users WHERE id = 1 AND role = 'PROVIDER';

-- ============================================
-- 10. VIEW PROVIDERS WITHOUT ASSIGNED CENTER
-- ============================================
SELECT 
    id,
    name,
    email,
    phone
FROM users 
WHERE role = 'PROVIDER' AND service_center_id IS NULL;

-- ============================================
-- 11. VIEW ALL SERVICE CENTERS
-- ============================================
SELECT * FROM service_center ORDER BY id;

-- ============================================
-- 12. VIEW COMPLETE PROVIDER PROFILE
-- ============================================
-- Replace {provider_id} with actual ID
-- SELECT 
--     u.*,
--     sc.name AS service_center_name,
--     sc.location AS service_center_location,
--     sc.contact AS service_center_contact
-- FROM users u
-- LEFT JOIN service_center sc ON u.service_center_id = sc.id
-- WHERE u.id = {provider_id} AND u.role = 'PROVIDER';
