DROP TABLE IF EXISTS items;

CREATE TABLE items(
  id SERIAL PRIMARY KEY NOT NULL,
  category VARCHAR(32) NOT NULL,
  name VARCHAR(64) NOT NULL,
  price NUMERIC(7,2) NOT NULL,
  sku VARCHAR(32) NOT NULL,
  quantity SMALLINT NOT NULL,
  imageurl VARCHAR(128) NOT NULL,
  date_created date NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_updated date NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO items (category, name, price, sku, quantity, imageurl) VALUES
    ('hats', 'Awesome Tophat', 99.99, 'nanj712', 1, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),
    ('hats', 'British Bowler Hat', 97.92, 'jnhgy67', 6, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),
    ('hats', 'Sombrero', 130.19, 'wqd234', 3, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),
    ('hats', 'Yellow Fedora', 22.22, '9087yu', 1, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),

    ('pants', 'Blue Jeans', 60.10, 'gy678', 12, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),
    ('pants', 'Suede Trousers', 199.99, 'gdft3', 4, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),
    ('pants', 'Purple Silk Trousers', 99.99, 'fgr5', 5, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),
    ('pants', 'Black Slacks', 80.12, '7ubhr', 7, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),
    ('pants', 'Grey Sweats', 20.41, 'hdw22pp', 8, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),

    ('dresses', 'Green Silk Dress', 44.99, '31ft', 3, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),
    ('dresses', 'Orange Knit Dress', 73.99, '90ug1y2', 2, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),
    ('dresses', 'Blue Summer Dress', 123.99, '175tuyg', 4, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg'),

    ('other', 'Mumbo Jumbo Necklace', 5000.01, '9i9ik', 1, 'https://s3.amazonaws.com/patinaclothing/kangaroo.jpg');
