-- Table structure for table stores
CREATE TABLE stores
(
store_id varchar(4) NOT NULL,
store_name varchar(255) NOT NULL,
store_region varchar(5) NOT NULL,
PRIMARY KEY (store_id)
);




-- Table structure for table stats
CREATE TABLE stats
(
stat_id int(50) NOT NULL AUTO_INCREMENT,
t_number int(7) NOT NULL,
store_id varchar(4) NOT NULL,
controllable_transactions varchar(255) NOT NULL,
actual int(10) NOT NULL,
goal int(10) NOT NULL, 
revenue int(10) NOT NULL,
warranty int(10) NOT NULL,
date_added date NOT NULL,
PRIMARY KEY (stat_id),
FOREIGN KEY (t_number) REFERENCES users(t_number),
FOREIGN KEY (store_id) REFERENCES stores(store_id)
);




-- Table structure for table behaviours
CREATE TABLE behaviours
(
behaviour_id int(50) NOT NULL AUTO_INCREMENT,
behaviour_desc varchar(255) NOT NULL,
PRIMARY KEY (behaviour_id)
);




-- Table structure for table observations
CREATE TABLE observations
(
observation_id int(50) NOT NULL AUTO_INCREMENT,
behaviour_id int(50) NOT NULL
t_number int(7) NOT NULL,
observation_date date NOT NULL,
observation_type tinyint(1) NOT NULL,
observation_comment varchar(100),
PRIMARY KEY (observation_id),
FOREIGN KEY (t_number) REFERENCES users(t_number),
FOREIGN KEY (behaviour_id) REFERENCES behaviours(behaviour_id)
);




-- Table structure for table users
CREATE TABLE users
(
  t_number varchar(7) NOT NULL,
  username varchar(8) NOT NULL,
  `password` varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  privileged tinyint(1) NOT NULL DEFAULT '0',
  store_id varchar(4) NOT NULL,
  PRIMARY KEY (t_number),
  FOREIGN KEY (store_id) REFERENCES stores(store_id)
);