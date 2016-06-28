DROP DATABASE IF EXISTS `build_eps`;
CREATE DATABASE `build_eps`;
USE `build_eps`;

--
-- Table structure for table `selling_hours_schedule`
--

DROP TABLE IF EXISTS `selling_hours_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `selling_hours_schedule` (
	`hours_id` int(255) NOT NULL AUTO_INCREMENT,
	`team_member` varchar(7) NOT NULL,
    `date` date NOT NULL,
	`store_id` varchar(4) NOT NULL,
    `selling_hours` float, 
    PRIMARY KEY (`hours_id`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selling_hours_schedule`
--

LOCK TABLES `selling_hours_schedule` WRITE;
/*!40000 ALTER TABLE `selling_hours_schedule` DISABLE KEYS */;
INSERT INTO `selling_hours_schedule` VALUES (1,'t123456','0016-02-01', '6587', 5),(2,'t123456','0016-02-02', '6587', 6),(3,'t123456','0016-02-03', '6587', 4),(4,'t123456','0016-02-04', '6587', 9),(5,'t123456','0016-02-05', '6587', 3);
/*!40000 ALTER TABLE `selling_hours_schedule` ENABLE KEYS */;
UNLOCK TABLES;

-- select * from selling_hours_schedule


--
-- Table structure for table `discount_tracking`
--

DROP TABLE IF EXISTS `discount_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discount_tracking` (
	
	`team_member` varchar(7) NOT NULL,
    `pocket25` int(255) NOT NULL,
    `pocket50` int(255) NOT NULL,
    `pocket75` int(255) NOT NULL,
    `pocket100` int(255) NOT NULL,
    `inc25` int(255) NOT NULL,
    `inc50` int(255) NOT NULL,
	`store_id` varchar(4) NOT NULL,
    PRIMARY KEY (`team_member`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selling_hours_schedule`
--

LOCK TABLES `discount_tracking` WRITE;
/*!40000 ALTER TABLE `discount_tracking` DISABLE KEYS */;
INSERT INTO `discount_tracking` VALUES ('t123456',25,25,25,25,50,50,'6587'),('t111111',25,25,25,25,50,50,'6587');
/*!40000 ALTER TABLE `discount_tracking` ENABLE KEYS */;
UNLOCK TABLES;

-- SELECT * FROM discount_tracking


--
-- Table structure for table `discount_tracking`
--

DROP TABLE IF EXISTS `results_to_send`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `results_to_send` (
	`result_id` int(255) NOT NULL AUTO_INCREMENT,
	`cont_transcations` int(255) NOT NULL,
    `cont_revenue` int(255) NOT NULL,
    `connected_hs` int(255) NOT NULL,
    `acc_units_per_transaction` int(255) NOT NULL,
    `basket_size` int (255) NOT NULL,
    `learning_sessions` int(255) NOT NULL,
    `aotm` int(255) NOT NULL,
    `telus_credit_card` int(255) NOT NULL,
    `sbs_activations` int(255) NOT NULL,
    `tablets` int(255) NOT NULL,
    `warranty_percentage` float NOT NULL,
    `backpocket` int(255) NOT NULL,
    `inc_coupons` int(255) NOT NULL,
    `date` date NOT NULL,
	`store_id` varchar(4) NOT NULL,
    PRIMARY KEY (`result_id`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selling_hours_schedule`
--

LOCK TABLES `results_to_send` WRITE;
/*!40000 ALTER TABLE `results_to_send` DISABLE KEYS */;
INSERT INTO `results_to_send` VALUES (1,1,1,1,1,1,1,1,1,1,1,75,1,1,'0016-01-02','6587');
/*!40000 ALTER TABLE `results_to_send` ENABLE KEYS */;
UNLOCK TABLES;

-- SELECT * FROM results_to_send

--
-- Table structure for table `wps_day`
--

DROP TABLE IF EXISTS `wps_day`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wps_day` (
	`wps_id` int(255) NOT NULL AUTO_INCREMENT,
	`num_of_transactions` int(255) NOT NULL,
    `controllable_transactions` int(255) NOT NULL,
    `controllable_revenue` int(255) NOT NULL,
    `accessory_units_per_transaction` int(255) NOT NULL,
    `basket_size` int (255) NOT NULL,
    `learning_sessions` int(255) NOT NULL,
    `learning_sessions_percentage_to_handsets` int(255) NOT NULL,
    `aotm` int(255) NOT NULL,
    `telus_credit_card` int(255) NOT NULL,
    `sbs_activations` int(255) NOT NULL,
    `tablets` int(255) NOT NULL,
    `device_care_warranty_percentage` float NOT NULL,
    `apple_care_warranty_percentage` float NOT NULL,
    `overall_warranty_percentage` float NOT NULL,
    `num_of_devices` int(255) NOT NULL,
    `num_of_iphone` int(255) NOT NULL,
    `num_of_android` int(255),
    `num_of_others` int(255) NOT NULL,
    `backpocket` int(255) NOT NULL,
    `inc_coupons` int(255) NOT NULL,
    `critters` int(255) NOT NULL,
    `donations` float NOT NULL,
    `date` date NOT NULL,
	`store_id` varchar(4) NOT NULL,
    PRIMARY KEY (`wps_id`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selling_hours_schedule`
--

LOCK TABLES `wps_day` WRITE;
/*!40000 ALTER TABLE `wps_day` DISABLE KEYS */;
INSERT INTO `wps_day` VALUES (1,1,1,1,1,1,1,1,1,1,1,1,75,76,77,1,1,1,1,1,1,1,65,'0016-01-02','6587');
/*!40000 ALTER TABLE `wps_day` ENABLE KEYS */;
UNLOCK TABLES;

select * FROM wps_day;




--
-- table for transaction types
--
DROP TABLE IF EXISTS `transaction_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaction_types` (
	
	`device` varchar(255) NOT NULL,
    `accessory` varchar(255) NOT NULL,
    `outright_sim` varchar(255) NOT NULL,
    `vpin` varchar(255) NOT NULL,
    `repair_return` varchar(255) NOT NULL,
    `other_elligable_return` varchar(255) NOT NULL,
    PRIMARY KEY (`team_member`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selling_hours_schedule`
--

LOCK TABLES `transaction_types` WRITE;
/*!40000 ALTER TABLE `transaction_types` DISABLE KEYS */;
INSERT INTO `transaction_types` VALUES ();
/*!40000 ALTER TABLE `transaction_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- table schema for transactions

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stats` (
  `transaction_id` int(255) NOT NULL AUTO_INCREMENT,
  `t_number` varchar(7) NOT NULL,
  `store_id` varchar(4) NOT NULL,
  `transaction_date` datetime NOT NULL,
  `transaction_type` varchar(50) NOT NULL,
  `activation_type` varchar(50) NOT NULL,
  `device_type` varchar (50) NOT NULL,
  `warranty_type` varchar(50) NOT NULL,
  `attachments` bit NOT NULL,
  `revenue` float NOT NULL,
  `number_of_accessories` int(255) NOT NULL,
  `sbs_return_exchange_discount` varchar(50) NOT NULL,
  `learning_sessions_aotm_appointments` varchar(50) NOT NULL,
  `critters_donations_creditcard` varchar(50) NOT NULL,
  PRIMARY KEY (`transaction_id`),
  KEY `t_number` (`t_number`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `stats_ibfk_1` FOREIGN KEY (`t_number`) REFERENCES `users` (`t_number`),
  CONSTRAINT `stats_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stats`
--
USE build_db;
LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (777,'t901159','6529','GNO',1,1,1,1,'0016-02-01'),(778,'t901159','6529','GNO',1,1,1,1,'0016-02-01');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

