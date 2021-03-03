CREATE INDEX user_account_email ON user_account(email);

CREATE FULLTEXT INDEX idx_product_name ON product(product_name);

CREATE INDEX idx_product_category ON product(category_id);
