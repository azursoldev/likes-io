INSERT INTO "User" (id, email, password, name, role, "isBlocked", "createdAt", "updatedAt")
VALUES ('admin-1', 'admin@example.com', '$2b$10$0iod6RpNaWaEUmT7.DB0hOnzzJWngtm4k.1V9K51rYiDYpGvlTBu2', 'Admin User', 'ADMIN', false, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

