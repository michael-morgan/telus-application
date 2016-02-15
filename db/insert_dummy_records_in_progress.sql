-- Dumping data for table behaviours
INSERT INTO behaviours (behaviour_desc)
VALUES ('Greeting clients'), ('Top-down selling'), ('Another one'), ('Another one');

-- Dumping data for table stores
INSERT INTO stores (store_id, store_name, store_region) VALUES
('6529','Georgian Mall', 'GNO');

-- Dumping data for table users
INSERT INTO users (t_number, username, `password`, email, first_name, last_name, privileged, store_id) VALUES
('t901159', 'T901159', 'password', 'patrick.richey@telus.com', 'Patrick', 'Richey', 1, '6529'),
('t123456', 'T123456', 'password', 'michael.morgan@telus.com', 'Michael', 'Morgan', 1, '6529');

-- Dumping data for table stats
INSERT INTO stats (t_number, store_id, controllable_transactions, actual, goal, revenue, warranty, date_added) VALUES
('t901159','6529', 'GNO', 1, 1, 1, 1, '016-02-01'),
('t123456','6529', 'GNO', 1, 1, 1, 1, '016-02-01');

-- Dumping data for table observations
INSERT INTO observations (behaviour_id, t_number, observation_date, observation_type, observation_comment)
VALUES (1, 't901159', '2016-02-01', 1, 'Employee greeted all customers as they entered the store'), (1, 't901159', '2016-02-01', 1, 'Employee greeted all customers as they entered the store');