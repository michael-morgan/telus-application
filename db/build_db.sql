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

DROP DATABASE IF EXISTS `build_db`;
CREATE DATABASE `build_db`;
USE `build_db`;

--
-- Table structure for table `skills`
--

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



--
-- Table structure for table `behaviours`
--

DROP TABLE IF EXISTS `behaviours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `behaviours` (
  `behaviour_id` int(50) NOT NULL AUTO_INCREMENT,
    `skill_id` int(50) NOT NULL,
  `behaviour_desc` varchar(255) NOT NULL,
  PRIMARY KEY (`behaviour_id`),
  CONSTRAINT `behaviours_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`)
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
(12, 3, 'Activity listened and drew out additional solution needs to offer life solutions.'),
(13, 4, 'Seamlessly recommended a packaged life solution.'),
(14, 4, 'Reminded the customer of the values uncovered before introducing the product aligned to lifestyle benefits.'),
(15, 4, 'Recommended an additional product by painting a picture by showing them how to use a specific feature of the product to solve a need, want or desire.'),
(16, 4, 'Recommended an additional product by demonstrating the feature the most directly meets the customer\'s needs.'),
(17, 4, 'Recommended an additional product by linking features to day-to-day life benefits.'),
(18, 4, 'Painted a picture by showing them how to use a specific feature of the product to solve a need, want or desire.'),
(19, 4, 'Demonstrated the feature the most directly meets the customer’s needs.'),
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
(34, 6, 'Completed Smart Start and made the customer feel comfortable in leaving with their new solution'),
(35, 6, 'Offered a TELUS Learning Session if the customer wanted to learn more about thesolution.'),
(36, 6, 'Offered a TELUS appointment because further needs were drawn out to be touched on ata later date.'),
(37, 7, 'Thanked the customer in a genuine way after the session and/or sale for their time and business'),
(38, 7, 'Welcomed the customer to return with any other concerns or issues with the solution(s).'),
(39, 7, 'Gave the customer their contact information'),
(40, 7, 'Walked the customer out of the store and shook their hand again.');
/*!40000 ALTER TABLE `behaviours` ENABLE KEYS */;
UNLOCK TABLES;



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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observations`
--

LOCK TABLES `observations` WRITE;
/*!40000 ALTER TABLE `observations` DISABLE KEYS */;
INSERT INTO `observations` VALUES (3,1,'t901159', 't111111', '2016-02-01 18:57:44',1,'Employee greeted all customers as they entered the store'),(4,8,'t901159', 't901159', '2016-02-01',1,'Employee greeted all customers as they entered the store');
/*!40000 ALTER TABLE `observations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stats`
--

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

--
-- Dumping data for table `stats`
--

LOCK TABLES `stats` WRITE;
/*!40000 ALTER TABLE `stats` DISABLE KEYS */;
INSERT INTO `stats` VALUES (1,'t901159','6529','GNO',1,1,1,1,'0016-02-01'),(2,'t123456','6529','GNO',1,1,1,1,'0016-02-01');
/*!40000 ALTER TABLE `stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

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

--
-- Table structure for table `tokens`
--

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

--
-- Table structure for table `users`
--

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
  `store_id` varchar(4) DEFAULT NULL,
  PRIMARY KEY (`t_number`),
  KEY `users_ibfk_1` (`store_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES 
('t111111','T111111','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','michael.morgan@telus.com','Michael','Morgan',1,'6529'),
('t222222','T222222','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','nick.lovsin@telus.com','Nick','Lovsin',1,'6530'),
('t333333','T333333','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','lorna.chapman@telus.com','Lorna','Chapman',1,'6529'),
('t444444','T444444','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','steve.urkel@telus.com','Steve','Urkel',0,'6529'),
('t555555','T555555','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','bob.dylan@telus.com','Bob','Dylan',0,'6530'),
('t666666','T666666','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','john.doe@telus.com','John','Doe',0,'6530'),
('t777777','T777777','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','will.bill@telus.com','Will','Bill',0,'6529'),
('t888888','T888888','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','brad.haveman@telus.com','Bradley','Haveman',1,'6529'),
('t999999','T999999','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','jacob.amaral@telus.com','Jacob','Amaral',1,'6529'),
('t901159','T901159','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','patrick.richey@telus.com','Patrick','Richey',1,'6529');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-15 19:38:29
