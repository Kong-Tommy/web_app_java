USE webappjava;

UPDATE Product SET ImageUrl = '/products/electronics.svg' WHERE ProductID IN (1, 2);
UPDATE Product SET ImageUrl = '/products/wearables.svg' WHERE ProductID IN (3, 8);
UPDATE Product SET ImageUrl = '/products/home-appliances.svg' WHERE ProductID IN (4, 9);
UPDATE Product SET ImageUrl = '/products/books.svg' WHERE ProductID IN (5, 10);
UPDATE Product SET ImageUrl = '/products/gaming.svg' WHERE ProductID IN (6, 7);
