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
-- Table structure for table `behaviours`
--

DROP TABLE IF EXISTS `behaviours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `behaviours` (
  `behaviour_id` int(50) NOT NULL AUTO_INCREMENT,
  `behaviour_desc` varchar(255) NOT NULL,
  PRIMARY KEY (`behaviour_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `behaviours`
--

LOCK TABLES `behaviours` WRITE;
/*!40000 ALTER TABLE `behaviours` DISABLE KEYS */;
INSERT INTO `behaviours` VALUES (1,'Greeting clients'),(2,'Top-down selling'),(3,'Another one'),(4,'Another one');
/*!40000 ALTER TABLE `behaviours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observations`
--

DROP TABLE IF EXISTS `observations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `observations` (
  `observation_id` int(50) NOT NULL AUTO_INCREMENT,
  `behaviour_id` int(50) NOT NULL,
  `t_number` varchar(7) NOT NULL,
  `observation_date` date NOT NULL,
  `observation_type` tinyint(1) NOT NULL,
  `observation_comment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`observation_id`),
  KEY `t_number` (`t_number`),
  KEY `behaviour_id` (`behaviour_id`),
  CONSTRAINT `observations_ibfk_1` FOREIGN KEY (`t_number`) REFERENCES `users` (`t_number`),
  CONSTRAINT `observations_ibfk_2` FOREIGN KEY (`behaviour_id`) REFERENCES `behaviours` (`behaviour_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observations`
--

LOCK TABLES `observations` WRITE;
/*!40000 ALTER TABLE `observations` DISABLE KEYS */;
INSERT INTO `observations` VALUES (3,1,'t901159','2016-02-01',1,'Employee greeted all customers as they entered the store'),(4,1,'t901159','2016-02-01',1,'Employee greeted all customers as they entered the store');
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
INSERT INTO `stores` VALUES ('6529','Georgian Mall','GNO');
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
INSERT INTO `users` VALUES ('t123456','T123456','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','michael.morgan@telus.com','Michael','Morgan',1,'6529'),('t654321','t654321','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','personal.michaelmorgan@gmail.com','Brad','Haveman',0,NULL),('t901159','T901159','$2a$10$J7gMv/aF5C.qTfL6EOQFluUiOuAFB7/HyotXpXAiifKhIK9GdK03q','patrick.richey@telus.com','Patrick','Richey',1,'6529');
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
