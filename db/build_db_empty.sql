-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: localhost    Database: build_db
-- ------------------------------------------------------
-- Server version	5.7.11-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

UNLOCK TABLES;
DROP DATABASE IF EXISTS `build_db`;
CREATE DATABASE `build_db`;
USE `build_db`;


-- --------------------------------------
-- Table structure for table `skills`
-- --------------------------------------
DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `skills` (
	`skill_id` int(50) NOT NULL AUTO_INCREMENT,
    `skill_title` varchar(255) NOT NULL,
    PRIMARY KEY (`skill_id`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--
LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,'Welcome'),(2,'Building Trust'),(3,'Consultative Selling Skills'),(4,'Recommending Solutions Post Sale'),(5,'Handling Objections With Empathy'),(6,'Asking For The Business'), (7,'The Power Of Thank You');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;


-- -----------------------------------------
-- Table structure for table `behaviours`
--  -----------------------------------------
DROP TABLE IF EXISTS `behaviours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `behaviours` (
  `behaviour_id` int(50) NOT NULL AUTO_INCREMENT,
    `skill_id` int(50) NOT NULL,
  `behaviour_desc` varchar(255) NOT NULL,
  PRIMARY KEY (`behaviour_id`),
  CONSTRAINT `behaviours_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `behaviours`
--
LOCK TABLES `behaviours` WRITE;
/*!40000 ALTER TABLE `behaviours` DISABLE KEYS */;
INSERT INTO `behaviours` VALUES 
(1, 1, 'If all reps are busy, the sales rep acknowledged and welcomed the customer into the store quoting a time that someone can help them.'),
(2, 1, 'If reps are free, they offer a genuine, warm welcome into the store using positive body language.'),
(3, 1, 'Shook the customer’s hand, introduced themselves and asked the customer’s name.'),
(4, 2, 'Began to build the relationship with the customer by asking non-business questions to establish rapport, make the customer feel comfortable and personalize the conversation.'),
(5, 2, 'Showed Credibility, Reliability, Intimacy (made the session personalized) & reduced Self-Orientation.'),
(6, 3, 'Asked open-ended lifestyle questions using trigger verbs and the FORE model.'),
(7, 3, 'Asked follow up, probing questions to clarify understanding.'),
(8, 3, 'Confirmed customer’s needs by paraphrasing back often.'),
(9, 3, 'Checked-in with the customer to ensure paraphrase was correct.'),
(10, 3, 'Resisted the temptation to respond with a recommendation and during the conversation in general, allowing the customer time to speak and feel listened to.'),
(11, 3, 'Took notes during the interaction to ensure accuracy and understanding.'),
(12, 3, 'Actively listened and drew out additional solution needs to offer life solutions.'),
(13, 4, 'Seamlessly recommended a packaged life solution.'),
(14, 4, 'Reminded the customer of the values uncovered before introducing the product aligned to lifestyle benefits.'),
(15, 4, 'Recommended an additional product by painting a picture by showing them how to use a specific feature of the product to solve a need, want or desire.'),
(16, 4, 'Recommended an additional product by demonstrating the feature the most directly meets the customer\'s needs.'),
(17, 4, 'Recommended an additional product by linking features to day-to-day life benefits.'),
(18, 4, 'Painted a picture by showing them how to use a specific feature of the product to solve a need, want or desire.'),
(19, 4, 'Demonstrated the feature that most directly meets the customer’s needs.'),
(21, 4, 'Linked features to day-to-day life benefits.'),
(22, 4, 'Used exciting, positive language when speaking about the recommendation.'),
(23, 4, 'Avoided using the words “could”, “maybe” and “if”. Instead used “will”, “definitely” and “when”.'),
(24, 4, 'Reused the customer’s words or used similar language when walking them through recommendation.'),
(25, 4, 'Used the words “you” and “your” often to personalize the recommendation.'),
(26, 4, 'Whenever describing a feature, followed up with a benefit of that feature related to the customer’s day-to-day, or a “what it’s going to do for you” statement.'),
(27, 4, 'Recognized that the product may not be part of the solution now, but is something to keep in mind as their needs change if the sale cannot be closed.'),
(28, 5, 'Acknowledged the customers objection beyond simply saying “I hear you’ or “I empathy understand’ and gave the customer proof that they understood the objections.'),
(29, 5, 'Demonstrated empathy and made the customer feel that it is ok to have objections.'),
(30, 5, 'Asked questions to better understand the reason behind the objections and probed further, confirming and paraphrasing along the way.'),
(31, 5, 'Circled back to the recommendation to build more value and attempted to close the sale for a second time.'),
(32, 6, 'Attempted to ask for the business.'),
(33, 6, 'Told the customer they made a good decision and followed up with why in order to limit buyers remorse.'),
(34, 6, 'Completed Smart Start and made the customer feel comfortable in leaving with their new solution.'),
(35, 6, 'Offered a TELUS Learning Session if the customer wanted to learn more about the solution.'),
(36, 6, 'Offered a TELUS appointment because further needs were drawn out to be touched on at a later date.'),
(37, 7, 'Thanked the customer in a genuine way after the session and/or sale for their time and business.'),
(38, 7, 'Welcomed the customer to return with any other concerns or issues with the solution(s).'),
(39, 7, 'Gave the customer their contact information'),
(40, 7, 'Walked the customer out of the store and shook their hand again.');
/*!40000 ALTER TABLE `behaviours` ENABLE KEYS */;
UNLOCK TABLES;


-- -------------------------------------------
-- Table structure for table `observations`
-- -------------------------------------------
DROP TABLE IF EXISTS `observations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `observations` (
  `observation_id` int(50) NOT NULL AUTO_INCREMENT,
  `behaviour_id` int(50) NOT NULL,
  `assigned_to` varchar(7) NOT NULL,
  `assigned_by` varchar(7) NOT NULL,
  `observation_date` datetime NOT NULL,
  -- obervation_type determines if the observation is positive (1) or negative (0)
  `observation_type` tinyint(1) NOT NULL,
  `observation_comment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`observation_id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `behaviour_id` (`behaviour_id`),
  CONSTRAINT `observations_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`t_number`),
  CONSTRAINT `observations_ibfk_2` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`t_number`),
  CONSTRAINT `observations_ibfk_3` FOREIGN KEY (`behaviour_id`) REFERENCES `behaviours` (`behaviour_id`)
  ON DELETE CASCADE

) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


-- ------------------------------------
-- Table structure for table `stats`
-- ------------------------------------
DROP TABLE IF EXISTS `stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stats` (
  `stat_id` int(50) NOT NULL AUTO_INCREMENT,
  `t_number` varchar(7) NOT NULL,
  `store_id` varchar(4) NOT NULL,
  `controllable_transactions` varchar(255) NOT NULL,
  `actual` int(10) NOT NULL,
  `goal` int(10) NOT NULL,
  `revenue` int(10) NOT NULL,
  `warranty` int(10) NOT NULL,
  `date_added` date NOT NULL,
  PRIMARY KEY (`stat_id`),
  KEY `t_number` (`t_number`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `stats_ibfk_1` FOREIGN KEY (`t_number`) REFERENCES `users` (`t_number`),
  CONSTRAINT `stats_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


-- -------------------------------------
-- Table structure for table `tokens`
-- -------------------------------------
DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tokens` (
  `tokenid` int(11) NOT NULL AUTO_INCREMENT,
  `t_number` varchar(7) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`tokenid`),
  UNIQUE KEY `id_UNIQUE` (`tokenid`),
  UNIQUE KEY `t_number_UNIQUE` (`t_number`),
  UNIQUE KEY `token_UNIQUE` (`token`),
  CONSTRAINT `t_number` FOREIGN KEY (`t_number`) REFERENCES `users` (`t_number`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;


-- -------------------------------------
-- Table structure for table `stores`
-- -------------------------------------
DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stores` (
  `store_id` varchar(4) NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `store_region` varchar(5) NOT NULL,
  PRIMARY KEY (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES ('6529','Alliston Mills','GNO'), ('6530','Georgian Mall','GNO');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

-- -------------------------------------
-- Table structure for table `users`
-- -------------------------------------
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `t_number` varchar(7) NOT NULL,
  `username` varchar(8) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `privileged` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`t_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES 
('t111111','T111111','$2a$08$MZ8HGYyrdA56JXZBJBJQpOb9fX7fwTxsEK6vAaJWnUBDsJr.dUL0O','super.user@telus.com','Super','User',5),
('t866502','T866502','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','elaine.king@telus.com','Elaine','King',1),
('t896347','T896347','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','heather.charles@telus.com','Heather','Charles',1),
('t913750','T913750','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','cesar.regalado@telus.com','Cesar','Regalado',1),
('t914435','T914435','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','daniel.bailey@telus.com','Daniel','Bailey',1),
('t846956','T846956','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','lorna.chapman@telus.com','Lorna','Chapman',3),
('t901159','T901159','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','patrick.richey@telus.com','Patrick','Richey',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


-- -------------------------------------
-- Table structure for table `stores_util`
-- -------------------------------------
DROP TABLE IF EXISTS `stores_util`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stores_util` (
  `stores_util_id` INT NOT NULL AUTO_INCREMENT,
  `t_number` varchar(255) NOT NULL,
  `store_id` varchar(4) NOT NULL,
  PRIMARY KEY (`stores_util_id`),
  KEY `stores_util_ibfk_2` (`t_number`),
  KEY `stores_util_ibfk_1` (`store_id`),
  CONSTRAINT `stores_util_ibfk_2` FOREIGN KEY (`t_number`) REFERENCES `users` (`t_number`),
  CONSTRAINT `stores_util_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `stores_util`
--

LOCK TABLES `stores_util` WRITE;
/*!40000 ALTER TABLE `stores_util` DISABLE KEYS */;
INSERT INTO `stores_util` (t_number, store_id) VALUES 
('t111111','6529'),
('t866502','6529'),
('t896347','6529'),
('t913750','6529'),
('t914435','6529'),
('t846956','6529'),
('t901159','6529');
/*!40000 ALTER TABLE `stores_util` ENABLE KEYS */;
UNLOCK TABLES;


-- ------------------------------------------------------
-- Table structure for table `selling_hours_schedule`
-- ------------------------------------------------------
DROP TABLE IF EXISTS `selling_hours_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `selling_hours_schedule` (
	`hours_id` int NOT NULL AUTO_INCREMENT,
	`team_member` varchar(7) NOT NULL,
    `date` date NOT NULL,
	`store_id` varchar(4) NOT NULL,
    `selling_hours` float, 
    PRIMARY KEY (`hours_id`),
	CONSTRAINT `selling_hours_ibfk_1` FOREIGN KEY (`team_member`) REFERENCES `stores_util` (`t_number`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


-- ------------------------------------------------
-- Table structure for table `discount_tracking`
-- ------------------------------------------------
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



-- ----------------------------------------------
-- Table structure for table `results_to_send'
-- ----------------------------------------------
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



-- *** *** *** FOR LATER USE, NOT FOR SPRINT - JUNE 28th 2016 *** *** ***
-- --------------------------------------
-- Table structure for table `wps_day'
-- --------------------------------------
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


-- ------------------------------------------------
-- Table structure for table `transaction_types'
-- ------------------------------------------------
DROP TABLE IF EXISTS `transaction_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaction_types` (
	`transaction_type_id` int(255) NOT NULL AUTO_INCREMENT,
	`transaction_types` enum('Device', 'Accessory', 'Outright Sim', 'VPIN', 'Repair/Return', 'Other Elligable Transaction') NOT NULL,
    PRIMARY KEY (`transaction_type_id`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_types`
--
LOCK TABLES `transaction_types` WRITE;
/*!40000 ALTER TABLE `transaction_types` DISABLE KEYS */;
INSERT INTO `transaction_types` VALUES (1,'Device'),(2,'Accessory'),(3,'Outright Sim'),(4,'VPIN'),(5,'Repair/Return'),(6,'Other Elligable Transaction');
/*!40000 ALTER TABLE `transaction_types` ENABLE KEYS */;
UNLOCK TABLES;


-- ------------------------------------------------
-- Table structure for table `activation_types'
-- ------------------------------------------------
DROP TABLE IF EXISTS `activation_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activation_types` (
	`activation_type_id` int(255) NOT NULL AUTO_INCREMENT,
	`activation_types` enum('New Activation', 'Renewal', 'Prepaid', 'Outright') NOT NULL,
    PRIMARY KEY (`activation_type_id`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selling_hours_schedule`
--
LOCK TABLES `activation_types` WRITE;
/*!40000 ALTER TABLE `activation_types` DISABLE KEYS */;
INSERT INTO `activation_types` VALUES (1,'New Activation'),(2,'Renewal'),(3,'Prepaid'),(4,'Outright');
/*!40000 ALTER TABLE `activation_types` ENABLE KEYS */;
UNLOCK TABLES;


-- --------------------------------------------
-- Table structure for table `device_types'
-- --------------------------------------------
DROP TABLE IF EXISTS `device_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `device_types` (
	`device_type_id` int(255) NOT NULL AUTO_INCREMENT,
	`device_types` enum('iPhone', 'Android', 'Blackberry', 'Other Device', 'SIM', 'Tablet', 'iPad', 'Mobile Internet') NOT NULL,
    PRIMARY KEY (`device_type_id`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_types`
--
LOCK TABLES `device_types` WRITE;
/*!40000 ALTER TABLE `device_types` DISABLE KEYS */;
INSERT INTO `device_types` VALUES (1,'iPhone'),(2,'Android'),(3,'Blackberry'),(4,'Other Device'),(5,'SIM'),(6,'Tablet'),(7,'iPad'),(8,'Mobile Internet');
/*!40000 ALTER TABLE `device_types` ENABLE KEYS */;
UNLOCK TABLES;


-- ---------------------------------------------
-- Table structure for table `warranty_types'
-- ---------------------------------------------
DROP TABLE IF EXISTS `warranty_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warranty_types` (
	`warranty_type_id` int(255) NOT NULL AUTO_INCREMENT,
	`warranty_types` enum('Device Care', 'Device Care & T-UP', 'AppleCare+' , 'AppleCare+ & T-UP') NOT NULL,
    PRIMARY KEY (`warranty_type_id`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warranty_types`
--
LOCK TABLES `warranty_types` WRITE;
/*!40000 ALTER TABLE `warranty_types` DISABLE KEYS */;
INSERT INTO `warranty_types` VALUES (1,'Device Care'),(2,'Device Care & T-UP'),(3,'AppleCare+'),(4,'AppleCare+ & T-UP');
/*!40000 ALTER TABLE `warranty_types` ENABLE KEYS */;
UNLOCK TABLES;


-- -------------------------------------------------
-- Table structure for table `additional_metrics'
-- -------------------------------------------------
DROP TABLE IF EXISTS `additional_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `additional_metrics` (
	`additional_metrics_type_id` int(255) NOT NULL AUTO_INCREMENT,
	`additional_metrics_types` enum('Learning Sessions', 'AOTM', 'Appointments' ,'Critters' ,'Donations' ,'Credit Card') NOT NULL,
    PRIMARY KEY (`additional_metrics_type_id`)
)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `additional_metrics`
--
LOCK TABLES `additional_metrics` WRITE;
/*!40000 ALTER TABLE `additional_metrics` DISABLE KEYS */;
INSERT INTO `additional_metrics` VALUES (1,'Learning Sessions'),(2,'AOTM'),(3,'Appointments'),(4,'Critters'),(5,'Donations'),(6,'Credit Card');
/*!40000 ALTER TABLE `additional_metrics` ENABLE KEYS */;
UNLOCK TABLES;


-- --------------------------------------------
-- Table structure for table `transactions'
-- --------------------------------------------
DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `transaction_id` int(255) NOT NULL AUTO_INCREMENT,
  `t_number` varchar(7) NOT NULL,
  `store_id` varchar(4) NOT NULL,
  `transaction_date` datetime NOT NULL,
  `transaction_type` int(255) NOT NULL,
  
  PRIMARY KEY (`transaction_id`),
  KEY `t_number` (`t_number`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `transactions_tfk_1` FOREIGN KEY (`t_number`) REFERENCES `users` (`t_number`),
  CONSTRAINT `transactions_tfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`),
  CONSTRAINT `transactions_tfk_3` FOREIGN KEY (`transaction_type`) REFERENCES `transaction_types` (`transaction_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


-- ------------------------------------------------
-- Table structure for table `transaction_items'
-- ------------------------------------------------
DROP TABLE IF EXISTS `transaction_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaction_items` (
  `transaction_items_id` int(255) NOT NULL AUTO_INCREMENT,
  `transaction_id` int(255),
  `activation_type` int(255),
  `device_type` int(255),
  `warranty_type` int(255),
  `attached` varchar(3),
  `revenue` float(10,2),
  `num_of_accessories` int(255),
  `sbs_activation` bool,
  
  PRIMARY KEY (`transaction_items_id`),
  KEY `transaction_id` (`transaction_id`),
  CONSTRAINT `transactions_items_tfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`),
  CONSTRAINT `transactions_items_tfk_2` FOREIGN KEY (`activation_type`) REFERENCES `activation_types` (`activation_type_id`),
  CONSTRAINT `transactions_items_tfk_3` FOREIGN KEY (`device_type`) REFERENCES `device_types` (`device_type_id`),
  CONSTRAINT `transactions_items_tfk_4` FOREIGN KEY (`warranty_type`) REFERENCES `warranty_types` (`warranty_type_id`)

) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;



-- -----------------------------------------------------
-- Table structure for table `addition_metrics_items'
-- -----------------------------------------------------
DROP TABLE IF EXISTS `addition_metrics_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `addition_metrics_items` (
	`additional_metrics_items_id` int(255) NOT NULL AUTO_INCREMENT,
	`additional_metrics_items_type` int(255),
    `additional_metrics_items_count` int(255) NOT NULL,
    `transaction_id` int(255),
    PRIMARY KEY (`additional_metrics_items_id`),
    KEY `transaction_id` (`transaction_id`),
	CONSTRAINT `addition_metrics_items_tfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`transaction_id`),
    CONSTRAINT `addition_metrics_items_tfk_2` FOREIGN KEY (`additional_metrics_items_type`) REFERENCES `additional_metrics` (`additional_metrics_type_id`)

)	ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


-- -----------------------------------------------------
-- Table structure for table `budgets'
-- -----------------------------------------------------
DROP TABLE IF EXISTS `budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budgets` (
	`budget_id` int NOT NULL AUTO_INCREMENT,
	`CTs` float(10,2),
    `revenue` int(255) ,
    `aotm` float(10,3),
    `ls` int(255),
    `date` date,
    `store_id` varchar(4),
    PRIMARY KEY (`budget_id`)

)	ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


