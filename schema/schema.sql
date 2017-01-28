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

INSERT INTO items (category, name, item_group, price, size, color, description, sku, quantity, imageurl, status) VALUES
    ('hats', 'Awesome Tophat', 'awesome_tophat', 99.99, 'S', 'blue', 'A really cool hat', 'nanj712', 3, 'https://patinaclothing.s3.amazonaws.com/topHat.jpg', 'active'),
    ('hats', 'Awesome Tophat', 'awesome_tophat', 99.99, 'S', 'green', 'A really cool hat', 'nanj713', 3, 'https://patinaclothing.s3.amazonaws.com/topHat.jpg', 'active'),
    ('hats', 'Awesome Tophat', 'awesome_tophat', 99.99, 'S', 'red', 'A really cool hat', 'nanj714', 3, 'https://patinaclothing.s3.amazonaws.com/topHat.jpg', 'active'),
    ('hats', 'Awesome Tophat', 'awesome_tophat', 99.99, 'M', 'blue', 'A really cool hat', 'nanj715', 4, 'https://patinaclothing.s3.amazonaws.com/topHat.jpg', 'active'),
    ('hats', 'Awesome Tophat', 'awesome_tophat', 99.99, 'M', 'green', 'A really cool hat', 'nanj716', 4, 'https://patinaclothing.s3.amazonaws.com/topHat.jpg', 'active'),
    ('hats', 'Awesome Tophat', 'awesome_tophat', 99.99, 'M', 'red', 'A really cool hat', 'nanj717', 4, 'https://patinaclothing.s3.amazonaws.com/topHat.jpg', 'active'),
    ('hats', 'Awesome Tophat', 'awesome_tophat', 99.99, 'L', 'blue', 'A really cool hat', 'nanj718', 5, 'https://patinaclothing.s3.amazonaws.com/topHat.jpg', 'active'),
    ('hats', 'Awesome Tophat', 'awesome_tophat', 99.99, 'L', 'green', 'A really cool hat', 'nanj719', 5, 'https://patinaclothing.s3.amazonaws.com/topHat.jpg', 'active'),
    ('hats', 'Awesome Tophat', 'awesome_tophat', 99.99, 'L', 'red', 'A really cool hat', 'nanj720', 5, 'https://patinaclothing.s3.amazonaws.com/topHat.jpg', 'active'),

    ('hats', 'British Bowler Hat', 'british_bowler_hat', 97.92, 'M', 'gray', 'desciption', 'jnhgy67', 6, 'https://patinaclothing.s3.amazonaws.com/blackBowlerHat.jpg', 'active'),

    ('hats', 'Sombrero', 'sombrero', 130.19, 'M', 'tan', 'desciption', 'wqd234', 3, 'https://patinaclothing.s3.amazonaws.com/strawSombrero.jpg', 'active'),

    ('hats', 'Yellow Fedora', 'yellow_fedora', 22.22, 'L', 'yellow', 'desciption', '9087yu', 1, 'https://patinaclothing.s3.amazonaws.com/yellowFedora.jpg', 'active'),

    ('tops', 'ZZ Top', 'zz_top', 245.54, 'L', 'purple', 'desciption', '0291euh9', 2, 'https://patinaclothing.s3.amazonaws.com/zzTop.jpg', 'active'),

    ('bottoms', 'Blue Jeans', 'blue_jeans', 60.10, 'L', 'pink', 'desciption', 'gy678', 12, 'https://patinaclothing.s3.amazonaws.com/blueJeans.jpg', 'active'),

    ('bottoms', 'Suede Trousers', 'suede_trousers', 199.99, 'S', 'tan', 'Some pretty neat pants', 'gdft3', 2, 'https://patinaclothing.s3.amazonaws.com/suedeTrousers.jpeg', 'active'),
    ('bottoms', 'Suede Trousers', 'suede_trousers', 199.99, 'M', 'tan', 'Some pretty neat pants', 'gdft3', 4, 'https://patinaclothing.s3.amazonaws.com/suedeTrousers.jpeg', 'active'),
    ('bottoms', 'Suede Trousers', 'suede_trousers', 199.99, 'L', 'tan', 'Some pretty neat pants', 'gdft3', 2, 'https://patinaclothing.s3.amazonaws.com/suedeTrousers.jpeg', 'active'),

    ('bottoms', 'Purple Silk Trousers', 'purple_silk_trousers', 99.99, 'S', 'blue', 'desciption', 'fgr5', 5, 'https://patinaclothing.s3.amazonaws.com/pants.jpg', 'active'),

    ('bottoms', 'Black Slacks', 'black_slacks', 80.12, 'S', 'blue', 'desciption', '7ubhr', 7, 'https://patinaclothing.s3.amazonaws.com/blkpants.jpg', 'active'),

    ('bottoms', 'Grey Sweats', 'grey_sweats', 20.41, 'M', 'green', 'desciption', 'hdw22pp', 8, 'https://patinaclothing.s3.amazonaws.com/greySweatPants.jpeg', 'active'),

    ('dresses', 'Green Silk Dress', 'green_silk_dress', 44.99, 'M', 'green', 'desciption', '31ft', 3, 'https://patinaclothing.s3.amazonaws.com/greenSilkDress.jpg', 'active'),

    ('dresses', 'Orange Knit Dress', 'orange_knit_dress', 73.99, 'M', 'red', 'desciption', '90ug1y2', 2, 'https://patinaclothing.s3.amazonaws.com/orangeKnitDress.jpg', 'active'),

    ('dresses', 'Blue Summer Dress', 'blue_summer_dress', 123.99, 'XS', 'red', 'desciption', '175tuyg', 4, 'https://patinaclothing.s3.amazonaws.com/blueSummerDress.jpg', 'active'),

    ('accessories', 'Mumbo Jumbo Necklace', 'mumbo_jumbo_necklace', 1199.99, 'XS', 'red', 'desciption', '9i9ik', 1, 'https://patinaclothing.s3.amazonaws.com/necklace.jpg', 'active'),

    ('other', 'Kangaroo', 'kangaroo', 5000.01, 'XL', 'orange', 'desciption', 'kang5kftw', 1, 'https://patinaclothing.s3.amazonaws.com/kdHornets-2.jpg', 'active'),

    ('other', 'Deactivated Invisible Item', 'deactivated_invisible_item', 9.99, 'XL', 'brown', 'desciption', 'deact99', 1, 'https://patinaclothing.s3.amazonaws.com/gordosupercarnitas.jpg', 'inactive');
