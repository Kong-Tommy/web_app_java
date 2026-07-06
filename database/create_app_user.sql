-- Chay doan nay bang tai khoan root/admin MySQL hien co (vi du trong MySQL Workbench)
-- de tao rieng mot user cho webapp, khong dung chung voi root.

CREATE USER IF NOT EXISTS 'shopuser'@'localhost' IDENTIFIED BY 'ShopPass#2025';
GRANT ALL PRIVILEGES ON sum2025productinventorydb.* TO 'shopuser'@'localhost';
FLUSH PRIVILEGES;
