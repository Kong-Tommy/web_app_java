-- ============================================================
-- webappjava  (MySQL version, converted from SQL Server)
-- Mo rong them Customer / Cart / Orders de phuc vu webapp ban hang
-- ============================================================

CREATE DATABASE IF NOT EXISTS webappjava
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE webappjava;

-- ------------------------------------------------------------
-- Bang nhan vien he thong (theo dung de bai)
-- Role: 1 = admin, 2 = manager, 3 = analyst, 4 = user thuong (khong duoc cap token)
-- ------------------------------------------------------------
CREATE TABLE SystemAccounts (
    AccountID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role INT NOT NULL,
    IsActive BIT DEFAULT 1
);

INSERT INTO SystemAccounts (AccountID, Username, Email, Password, Role, IsActive) VALUES
(1, 'adminpro', 'admin@system.com', '$2b$10$gZ3.7uI75JFjxdFDgDPrdeeyLenMR0EhFEnrasl7/1LkGeqFxc2Lm', 1, 1),
(2, 'manager1', 'manager@system.com', '$2b$10$gZ3.7uI75JFjxdFDgDPrdeeyLenMR0EhFEnrasl7/1LkGeqFxc2Lm', 2, 1),
(3, 'analyst1', 'analyst@system.com', '$2b$10$gZ3.7uI75JFjxdFDgDPrdeeyLenMR0EhFEnrasl7/1LkGeqFxc2Lm', 3, 1),
(4, 'user1', 'user1@system.com', '$2b$10$gZ3.7uI75JFjxdFDgDPrdeeyLenMR0EhFEnrasl7/1LkGeqFxc2Lm', 4, 1),
(5, 'suspended', 'blocked@system.com', '$2b$10$gZ3.7uI75JFjxdFDgDPrdeeyLenMR0EhFEnrasl7/1LkGeqFxc2Lm', 2, 0);
-- Mat khau goc cho tat ca account demo tren: "123456" (da duoc BCrypt hash, verified voi bcryptjs)

-- ------------------------------------------------------------
-- Danh muc san pham
-- ------------------------------------------------------------
CREATE TABLE Category (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryName VARCHAR(255) NOT NULL,
    Description VARCHAR(500)
);

INSERT INTO Category (CategoryID, CategoryName, Description) VALUES
(1, 'Electronics', 'Electronic devices and accessories'),
(2, 'Wearables', 'Smartwatches, fitness bands'),
(3, 'Home Appliances', 'Appliances for home use'),
(4, 'Books', 'Printed and digital books'),
(5, 'Gaming', 'Consoles, accessories and titles');

-- ------------------------------------------------------------
-- San pham
-- ------------------------------------------------------------
CREATE TABLE Product (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryID INT,
    ProductName VARCHAR(255) NOT NULL,
    Material VARCHAR(100),
    Price DECIMAL(10, 2),
    Quantity INT,
    ReleaseDate DATE,
    ImageUrl VARCHAR(1000),
    CONSTRAINT fk_product_category FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID) ON DELETE CASCADE
);

INSERT INTO Product (ProductID, CategoryID, ProductName, Material, Price, Quantity, ReleaseDate, ImageUrl) VALUES
(1, 1, 'Wireless Earbuds Pro', 'Plastic', 199.99, 100, '2024-01-15', '/products/wireless-earbuds-pro.svg'),
(2, 1, 'Smartphone X10', 'Aluminum & Glass', 999.00, 50, '2024-02-10', '/products/smartphone-x10.svg'),
(3, 2, 'Smartwatch Z3', 'Metal', 149.99, 75, '2024-03-01', '/products/smartwatch-z3.svg'),
(4, 3, 'Air Purifier Pro', 'Steel', 259.00, 40, '2024-01-05', '/products/air-purifier-pro.svg'),
(5, 4, 'Artificial Intelligence 101', 'Paper', 29.99, 200, '2023-12-20', '/products/artificial-intelligence-101.svg'),
(6, 5, 'NextGen Console V', 'Plastic', 499.00, 30, '2024-02-20', '/products/nextgen-console-v.svg'),
(7, 5, 'Wireless Controller 2.0', 'Plastic', 69.99, 150, '2024-01-25', '/products/wireless-controller-2.svg'),
(8, 2, 'Fitness Band Plus', 'Rubber', 89.99, 90, '2024-03-10', '/products/fitness-band-plus.svg'),
(9, 3, 'Robot Vacuum Cleaner', 'Plastic', 299.00, 25, '2024-04-01', '/products/robot-vacuum-cleaner.svg'),
(10, 4, 'Data Structures Guidebook', 'Paper', 45.00, 120, '2024-01-18', '/products/data-structures-guidebook.svg');

-- ------------------------------------------------------------
-- Khach hang (mua sam tren shop) - mo rong ngoai de bai
-- ------------------------------------------------------------
CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(20),
    Address VARCHAR(500),
    AvatarUrl VARCHAR(1000),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Neu DB da ton tai truoc khi co cot nay (ddl-auto: none nen khong tu sinh), chay:
-- ALTER TABLE Customer ADD COLUMN AvatarUrl VARCHAR(1000);

-- ------------------------------------------------------------
-- Gio hang
-- ------------------------------------------------------------
CREATE TABLE CartItem (
    CartItemID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_cart_customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE CASCADE,
    CONSTRAINT fk_cart_product FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE,
    CONSTRAINT uq_cart_customer_product UNIQUE (CustomerID, ProductID)
);

-- ------------------------------------------------------------
-- Don hang
-- ------------------------------------------------------------
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerID INT NOT NULL,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    ShippingAddress VARCHAR(500),
    ShippingPhone VARCHAR(20),
    TotalAmount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_order_customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE CASCADE
);

CREATE TABLE OrderItem (
    OrderItemID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    ProductName VARCHAR(255) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Quantity INT NOT NULL,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_product FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);
