CREATE DATABASE  IF NOT EXISTS `bagapp` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bagapp`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bagapp
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actividad`
--

DROP TABLE IF EXISTS `actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividad` (
  `idActividad` int NOT NULL,
  `nombreActividad` varchar(255) NOT NULL,
  `descripcionActividad` varchar(255) NOT NULL,
  `fechaEntrega` datetime NOT NULL,
  `estadoActividad` varchar(255) NOT NULL,
  `precioActividad` int DEFAULT NULL,
  `lugarActividad` varchar(45) NOT NULL,
  `fechaInicio` datetime NOT NULL,
  `fechaFinal` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`idActividad`),
  UNIQUE KEY `idActividad` (`idActividad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividad`
--

LOCK TABLES `actividad` WRITE;
/*!40000 ALTER TABLE `actividad` DISABLE KEYS */;
INSERT INTO `actividad` VALUES (35,'Mes Pasado','Prueba','2023-08-25 00:00:00','Pendiente',50,'Porque','2023-08-25 00:00:00','2023-08-25 00:00:00','2023-09-27 03:22:08','2023-09-27 03:22:08'),(68,'Tornero de Fut','Gran partido','2023-09-27 00:00:00','Pendiente',50,'','2023-09-27 00:00:00','2023-09-27 00:00:00','2023-09-25 20:36:19','2023-09-26 21:42:01'),(140,'Música','Festival musical','2023-10-09 22:02:20','Pendiente',120,'Teatro la Aurora','2023-10-08 22:02:20','2023-10-09 22:02:20','2023-10-04 22:03:05','2023-10-04 22:03:05'),(181,'Cocina','Es una nueva actividad','2023-09-04 00:00:00','Completa',150,'','2023-09-02 06:00:00','2023-09-04 06:00:00','2023-09-19 14:20:41','2023-09-26 04:35:02'),(226,'Kermes','Actividad recreativa','2023-10-01 00:00:00','Completa',150,'','2023-10-01 00:00:00','2023-10-01 00:00:00','2023-09-08 15:15:24','2023-09-26 21:47:10'),(232,'Excursion','Embárcate en una emocionante excursión de senderismo por las majestuosas montañas y cascadas del Parque Nacional Yosemite, rodeado de impresionante belleza natural.','2023-10-05 00:00:00','Pendiente',35,'Parque Nacional Yosemite, California, Estados','2023-10-05 00:00:00','2023-10-05 00:00:00','2023-10-02 01:19:31','2023-10-02 01:19:31'),(260,'Cumpleaños','Mi cumpleaños','2023-09-06 00:00:00','Pendiente',150,'Mi casa','2023-09-06 00:00:00','2023-09-06 00:00:00','2023-09-27 03:01:48','2023-09-27 03:01:48'),(279,'Futbol','Dia de reta de fut','2023-09-09 00:00:00','Completa',150,'','2023-09-09 00:00:00','2023-09-09 00:00:00','2023-09-08 16:39:21','2023-09-20 14:34:57'),(298,'Bautizo','Bautizo de Jesus','2023-09-12 00:00:00','Completa',150,'','2023-09-13 00:00:00','2023-09-14 00:00:00','2023-09-20 14:41:17','2023-09-26 21:48:55'),(306,'Excursion','Una excursión con todo el grupo a IRTRA','2023-04-10 00:00:00','Pendiente',55,'IRTRA Petapa','2023-04-10 00:00:00','2023-04-10 00:00:00','2023-10-04 16:21:09','2023-10-04 16:21:09'),(318,'Parroquia San Marcos','Parroquia','2023-11-25 00:00:00','Completa',180,'Iglesia de Santo Domingo','2023-11-25 00:00:00','2023-11-25 00:00:00','2023-09-26 15:29:05','2023-09-26 17:27:44'),(332,'Excursion','Viaje a Xocomil','2023-11-16 00:00:00','Pendiente',250,'','2023-11-16 00:00:00','2023-11-16 00:00:00','2023-09-25 16:47:24','2023-09-25 16:47:24'),(353,'Cumpleaños','Cumpleaños de Tonito','2023-10-13 00:00:00','Completa',150,'','2023-10-13 00:00:00','2023-10-13 00:00:00','2023-09-20 14:45:42','2023-09-26 04:30:47'),(370,'Museo','Disfruta de una experiencia cultural en el Museo de Arte Moderno, donde podrás explorar una impresionante colección de arte contemporáneo y obras maestras de artistas mexicanos.','2023-10-03 00:00:00','Pendiente',102,'Museo de Arte Moderno, Ciudad de México, Méxi','2023-10-03 00:00:00','2023-10-03 00:00:00','2023-10-02 01:18:54','2023-10-02 01:18:54'),(439,'Expedición','Iremos a una expedición con todo el salón de clases','2023-04-10 00:00:00','Pendiente',250,'Ruinas de Ixche','2023-04-10 00:00:00','2023-04-10 00:00:00','2023-10-04 16:19:11','2023-10-04 16:19:11'),(506,'Ajedrez','Grandes Partidas de Ajedrez','2023-11-04 00:00:00','Pendiente',75,'','2023-11-02 00:00:00','2023-11-04 00:00:00','2023-09-26 03:26:25','2023-09-26 03:26:25'),(598,'Fiesta','Primer evento','2023-09-10 00:00:00','Pendiente',150,'','2023-09-10 06:00:00','2023-09-12 06:00:00','2023-09-07 15:30:56','2023-09-20 14:31:28'),(612,'Fiesta','Gran fiesta','2023-10-01 00:00:00','Pendiente',75,'Cancha Polideportivo','2023-10-01 00:00:00','2023-10-01 00:00:00','2023-09-29 18:15:46','2023-09-29 18:15:46'),(668,'Evento Grande','Gran Evento','2023-09-29 00:00:00','Pendiente',150,'','2023-09-27 00:00:00','2023-09-29 00:00:00','2023-09-19 18:22:43','2023-09-25 20:30:18'),(776,'Torneo de Rubik','Es un torneo para medir el tiempo de los cubos rubik','2023-11-01 00:00:00','Pendiente',100,'','2023-10-30 00:00:00','2023-11-01 00:00:00','2023-09-25 16:43:51','2023-09-25 16:43:51'),(950,'Paseo','Experimenta la magia del Valle de Napa desde las alturas en un paseo en globo aerostático. Disfruta de vistas panorámicas de los viñedos y degusta vinos locales después del vuelo.','2023-10-08 00:00:00','Pendiente',250,'Valle de Napa, California, Estados Unidos','2023-10-08 00:00:00','2023-10-08 00:00:00','2023-10-02 01:20:01','2023-10-02 01:20:01');
/*!40000 ALTER TABLE `actividad` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-05 11:34:34
