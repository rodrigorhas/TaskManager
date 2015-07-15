CREATE DATABASE  IF NOT EXISTS `cacpcontabilid01` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `cacpcontabilid01`;
-- MySQL dump 10.13  Distrib 5.5.43, for debian-linux-gnu (i686)
--
-- Host: mysql.cacpcontabilidade.com    Database: cacpcontabilid01
-- ------------------------------------------------------
-- Server version	5.5.43-log

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

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `note` text,
  `group` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `done` tinyint(10) DEFAULT '0',
  `unread` tinyint(10) DEFAULT '1',
  `deleted` tinyint(255) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,'Rodrigo Silva','Lorem ipsum dolor sit amet, consecusdam incidunt ab voluptatibus vero.','CACP','1425415599382',0,0,0),(2,'Alan Dutra','ctetur adipisicing elit. Officia alias, eum enim lor. Quis quibusdam incidunt ab voluptatibus vero.','ADA','1425442599555',1,0,0),(3,'Carla Aragao','sum dolor sit amet, consectetur adipisicing elit. Officia alias, eum enim in dolor. Qui','NR','1425242588382',1,0,0),(4,'Junior Abnael','Lorem ipsum dolor sit amet, consectetur adipisicin','TRULYNOLLEN','1425442999382',1,0,0);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `note` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (157,'O ticket N° 2 foi reaberto','1436963166776','Alan'),(158,'O ticket N° 2 foi fechado.','1436963264559','Alan'),(159,'O ticket N° 1 foi fechado.','1436964044374','Alan'),(160,'O ticket N° 1 foi reaberto','1436964049498','Alan'),(161,'O ticket N° 1 foi marcado como não lido','1436964265992','Alan'),(162,'O ticket N° 1 foi marcado como lido','1436964277925','Alan'),(163,'O ticket N° 1 foi fechado.','1436964289878','Alan'),(164,'O ticket N° 1 foi reaberto','1436964303807','Alan');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment` text,
  `owner` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `ticketReference` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'Lorem ipsum dolor viasc kisj poret smorm','Rodrigo','1425700873835',1),(2,'Lorem ipsum dolor viasc kisj ','Alan','1425700899835',1),(6,'Porra caralho','Alan','1425824392646',1),(7,'Teste mensagem','Alan','1425824893470',1),(8,'Outro teste  de mensagem','Alan','1425825013228',1),(10,'pa','Alan','1425825214335',1),(11,'r','Alan','1425825235639',1),(12,'ceiro','Alan','1425825238416',1),(13,'lol','Alan','1425825329159',1),(14,'h','Alan','1425825580006',2),(15,'a','Alan','1425825708596',1),(16,'a','Alan','1425825814187',1),(17,'ab','Alan','1425825829355',1),(18,'i viado','Alan','1425825861646',1),(19,'aff','Alan','1425825866278',1),(20,'po man','Alan','1425825922959',1),(21,'hu3','Alan','1425825950759',1),(22,'t1','Alan','1425826098412',1),(23,'Gay','Alan','1425827823558',1),(24,'Po mano','Alan','1425828974398',1),(25,'Voltando','Alan','1425829037975',1),(26,'Ne filhao','Alan','1425829044447',1),(27,'ba','Alan','1425829051208',1),(37,'\"a\"','Alan','1436907589112',1),(38,'\"b\"','Alan','1436907596421',1),(39,'\"c\"','Alan','1436907617182',1),(40,'d','Alan','1436907685282',1),(41,'asd','Alan','1436907721874',1),(42,'my cock is much bigger than yours','Alan','1436964090530',1),(43,'TETA MLK','Alan','1436964156352',1),(44,'undefined','asd','1436980570184',3);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-07-15 14:29:49
