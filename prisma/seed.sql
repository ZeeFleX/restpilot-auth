SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;

-- Создание базовых ролей
INSERT INTO Role (name, description, createdAt, updatedAt) VALUES
('ADMIN', 'Системный администратор с полным доступом', NOW(), NOW()),
('OWNER', 'Владелец ресторана', NOW(), NOW()),
('EMPLOYEE', 'Сотрудник ресторана', NOW(), NOW()),
('CLIENT', 'Клиент ресторана', NOW(), NOW());

-- Создание базовых разрешений
INSERT INTO Permission (name, description, createdAt, updatedAt) VALUES
-- Управление пользователями
('user.create', 'Создание пользователей', NOW(), NOW()),
('user.read', 'Просмотр пользователей', NOW(), NOW()),
('user.update', 'Обновление пользователей', NOW(), NOW()),
('user.delete', 'Удаление пользователей', NOW(), NOW()),

-- Управление меню
('menu.create', 'Создание элементов меню', NOW(), NOW()),
('menu.read', 'Просмотр меню', NOW(), NOW()),
('menu.update', 'Обновление элементов меню', NOW(), NOW()),
('menu.delete', 'Удаление элементов меню', NOW(), NOW()),

-- Управление заказами
('order.create', 'Создание заказов', NOW(), NOW()),
('order.read', 'Просмотр заказов', NOW(), NOW()),
('order.update', 'Обновление заказов', NOW(), NOW()),
('order.delete', 'Удаление заказов', NOW(), NOW()),

-- Управление ролями и разрешениями
('role.manage', 'Управление ролями и разрешениями', NOW(), NOW());

-- Назначение разрешений для ADMIN
INSERT INTO RolePermission (roleId, permissionId, createdAt, updatedAt)
SELECT 
    (SELECT id FROM Role WHERE name = 'ADMIN'),
    id,
    NOW(),
    NOW()
FROM Permission;

-- Назначение разрешений для OWNER
INSERT INTO RolePermission (roleId, permissionId, createdAt, updatedAt)
SELECT 
    (SELECT id FROM Role WHERE name = 'OWNER'),
    id,
    NOW(),
    NOW()
FROM Permission
WHERE name IN (
    'menu.create', 'menu.read', 'menu.update', 'menu.delete',
    'order.read', 'order.update',
    'user.read', 'user.update'
);

-- Назначение разрешений для EMPLOYEE
INSERT INTO RolePermission (roleId, permissionId, createdAt, updatedAt)
SELECT 
    (SELECT id FROM Role WHERE name = 'EMPLOYEE'),
    id,
    NOW(),
    NOW()
FROM Permission
WHERE name IN (
    'menu.read',
    'order.create', 'order.read', 'order.update'
);

-- Назначение разрешений для CLIENT
INSERT INTO RolePermission (roleId, permissionId, createdAt, updatedAt)
SELECT 
    (SELECT id FROM Role WHERE name = 'CLIENT'),
    id,
    NOW(),
    NOW()
FROM Permission
WHERE name IN (
    'menu.read',
    'order.create', 'order.read'
);
