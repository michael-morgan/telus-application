--
-- Table structure for table `stores`
CREATE TABLE `stores`
(
`store_id` varchar(4) NOT NULL,
`store_name` varchar(255) NOT NULL,
`store_region` varchar(5) NOT NULL,
PRIMARY KEY (`store_id`)
);

-- Dumping data for table `stores`
INSERT INTO `stores` (`store_id`, `store_name`, `store_region`) VALUES
('6529','Barrie', 'GNO');



--
-- Table structure for table `stats`
CREATE TABLE `stats`
(
`stat_id` int(50) NOT NULL AUTO_INCREMENT,
`t_number` int(7) NOT NULL,
`store_id` varchar(4) NOT NULL,
`controllable_transactions` varchar(255) NOT NULL,
`actual` int(10) NOT NULL,
`goal` int(10) NOT NULL, 
`revenue` int(10) NOT NULL,
`warranty` int(10) NOT NULL,
`date_added` date NOT NULL,
`behaviours` varchar(255),
PRIMARY KEY (`stat_id`),
FOREIGN KEY (`t_number`) REFERENCES users(`t_number`),
FOREIGN KEY (`store_id`) REFERENCES stores(`store_id`)
);

-- Dumping data for table `stats`
INSERT INTO `stats` (`t_number`, `store_id`, `controllable_transactions`, `actual`, `goal`, `revenue`, `warranty`, `date_added`) VALUES
('t901159','6529', 'GNO');



--
-- Table structure for table `behaviours`
CREATE TABLE `behaviours`
(
`behaviours_id` INT(5) NOT NULL AUTO_INCREMENT,
`behaviours_text` varchar(255) NOT NULL,
`behaviours_type` varchar(10) NOT NULL,
PRIMARY KEY (`behaviours_id`)

);

-- Dumping data for table `behaviours`
INSERT INTO `behaviours` (`observation_text`, `behaviours`) VALUES
('Employee was prompt with arrival time', 'positive');



--
-- Table structure for table `observations`
CREATE TABLE `observations`
(
`observations_id` INT(5) NOT NULL AUTO_INCREMENT,
`behaviours_id` varchar(255) NOT NULL,
`t_number` varchar(6),
PRIMARY KEY (`observations_id`),
FOREIGN KEY (`behaviours_id`) REFERENCES behaviours(`behaviours_id`)

);

-- Dumping data for table `behaviours`
INSERT INTO `behaviours` (`observation_text`) VALUES
('Employee was prompt with arrival time');


--
-- Table structure for table `users`
CREATE TABLE IF NOT EXISTS `users` 
(
  `t_number` varchar(7) NOT NULL,
  `username` varchar(8) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `privileged` tinyint(1) NOT NULL DEFAULT '0',
  `store_id` varchar(4) NOT NULL,
  PRIMARY KEY (`t_number`),
  FOREIGN KEY (`store_id`) REFERENCES stores(`store_id`)
);
-- query that concats the last name and first name into the username
-- SELECT CONCAT(SUBSTRING('last_name', 1, 6), SUBSTRING('first_name', 1, 2)) username

-- Dumping data for table `users`
INSERT INTO `users` (`t_number`, `username`, `password`, `email`, `first_name`, `last_name`, `privileged`, `store_id`) VALUES
('t901159', 'T901159', 'password', 'patrick.richey@telus.com', 'Patrick', 'Richey', 1, '6529');