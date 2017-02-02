DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_items;

CREATE TABLE items(
  id SERIAL PRIMARY KEY NOT NULL,
  category VARCHAR(32) NOT NULL,
  name VARCHAR(64) NOT NULL,
  item_group VARCHAR(64) NOT NULL,
  price NUMERIC(9,2) NOT NULL,
  size VARCHAR(32) NOT NULL,
  color VARCHAR(32) NOT NULL,
  description VARCHAR(255) NOT NULL,
  sku VARCHAR(32) NOT NULL,
  quantity SMALLINT NOT NULL,
  imageurl VARCHAR(128) NOT NULL,
  status VARCHAR(64) NOT NULL,
  date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders(
  id SERIAL PRIMARY KEY NOT NULL,
  status VARCHAR(32) NOT NULL,
  customer_first_name VARCHAR(64) NOT NULL,
  customer_last_name VARCHAR(64) NOT NULL,
  customer_email VARCHAR(64) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  currency VARCHAR(32) NOT NULL,
  subtotal_amount NUMERIC(9,2) NOT NULL,
  total_amount NUMERIC(9,2) NOT NULL,
  tax_amount NUMERIC(9,2) NOT NULL,
  shipping_method VARCHAR(32) NOT NULL,
  shipping_amount NUMERIC(9,2) NOT NULL,
  shipping_street_1 VARCHAR(64) NOT NULL,
  shipping_street_2 VARCHAR(64) NOT NULL,
  shipping_city VARCHAR(64) NOT NULL,
  shipping_state VARCHAR(64) NOT NULL,
  shipping_country VARCHAR(64) NOT NULL,
  shipping_postal_code VARCHAR(32) NOT NULL,
  shipping_special_instructions VARCHAR(128) NOT NULL,
  date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items(
  id SERIAL PRIMARY KEY NOT NULL,
  order_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  quantity SMALLINT NOT NULL,
  date_created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
