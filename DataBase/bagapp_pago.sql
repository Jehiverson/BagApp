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
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `idPago` varchar(45) NOT NULL,
  `idCliente` varchar(150) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `fechaPago` datetime DEFAULT NULL,
  `monto` int NOT NULL,
  `idActividad` int NOT NULL,
  `noVoucher` int DEFAULT NULL,
  `tipoPago` varchar(255) NOT NULL,
  `nit` int DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `actividadIdActividad` int DEFAULT NULL,
  `clienteIdCliente` int DEFAULT NULL,
  PRIMARY KEY (`idPago`),
  UNIQUE KEY `idPago` (`idPago`),
  KEY `idActividad` (`idActividad`),
  KEY `actividadIdActividad` (`actividadIdActividad`),
  KEY `pago_clienteIdCliente_foreign_idx` (`clienteIdCliente`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`idActividad`) REFERENCES `actividad` (`idActividad`) ON UPDATE CASCADE,
  CONSTRAINT `pago_ibfk_2` FOREIGN KEY (`actividadIdActividad`) REFERENCES `actividad` (`idActividad`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES ('0','446','Juan','Alberto',NULL,100,68,NULL,'efectivo',NULL,'Pago de Entrada','2023-09-21 16:27:30','2023-09-26 04:27:30',NULL,NULL),('02bb9ec4-2f2a-4c22-a0e6-1ff11ae6cade','20','Marta','Tobar','2023-09-15 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:07:03','2023-09-26 17:07:03',NULL,NULL),('04d2a187-702a-4853-8b98-8f6cc7f88f73','408','Adelaida','Valenzuela','2023-09-19 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:10:01','2023-09-26 17:10:01',NULL,NULL),('0d458c63-130b-46b1-9475-4544cdbc14cd','393','Jorge','Ubico',NULL,100,776,NULL,'efectivo',NULL,'Pago de Entrada','2023-09-27 20:59:46','2023-09-27 20:59:46',NULL,NULL),('1','450','Marco','Diaz','2023-10-12 00:00:00',150,353,111,'voucher',123456,'Dinero para Tonito','2023-09-20 14:47:18','2023-09-20 14:47:18',NULL,NULL),('141252c2-51fa-41cf-8bd5-a96077a12a3f','477','Irma','Sucup','2023-09-25 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:12:13','2023-09-26 17:12:13',NULL,NULL),('15403820','141','Jesus','Gonzales','2023-09-12 00:00:00',1000,226,NULL,'efectivo',NULL,'Pago de esto ','2023-09-13 17:12:26','2023-09-13 17:12:26',NULL,NULL),('1b862c91-42a8-4b68-a6aa-9e46889104d6','283','Evelyn','Perdomo','2023-09-22 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:16:57','2023-09-26 17:16:57',NULL,NULL),('1c3d92c3-e6c8-4d85-ac6b-69882bbf4c03','393','Jose','Monroy','2023-09-22 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:19:55','2023-09-26 17:19:55',NULL,NULL),('1db5151a-5857-48ce-8a12-171b8526dc22','375','Miriam','Osoy','2023-09-23 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:18:38','2023-09-26 17:18:38',NULL,NULL),('1faab925-f088-4d97-9ead-b5cc54f04153','842','Karen','Avedaño','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:24:09','2023-09-26 17:24:09',NULL,NULL),('2147483647','110','Aroldo','Escobar','2023-09-13 00:00:00',250,279,123,'voucher',123456,'Pago de partido','2023-09-13 17:07:44','2023-09-13 17:07:44',NULL,NULL),('23','574','Bucky','Balboa','2023-09-20 00:00:00',50,598,123,'efectivo',112233,'Pago de Entrada','2023-09-07 15:31:54','2023-09-27 05:22:42',NULL,NULL),('2f8e86a6-18a5-4aa5-abfa-e9e9fb852fb3','260','Clara','Lopez','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:10:50','2023-09-26 17:10:50',NULL,NULL),('387650f2-7830-48fa-a3a7-b6f16b801faa','466','Azucena','Morales','2023-09-24 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:22:03','2023-09-26 17:22:03',NULL,NULL),('3950799e-fc7a-496d-b0a3-27ee4cfeb7c5','446','Rodrigo','Monzo','2023-09-20 00:00:00',150,668,123,'efectivo',0,'Pago','2023-09-25 20:30:17','2023-09-28 14:53:35',NULL,NULL),('40aa62f3-d832-4d48-b2e3-7ec7e633785f','46','Brenda','Fuentes','2023-09-24 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:11:30','2023-09-26 17:11:30',NULL,NULL),('45e67b3f-ba30-40be-a7bd-dbea2438d8df','687','Nidya','Gonzales','2023-09-13 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:06:22','2023-09-26 17:06:22',NULL,NULL),('46','828','Pedro','Casasola','2023-09-20 14:31:28',150,279,0,'efectivo',0,'Pago de Entrada','2023-09-20 14:34:57','2023-09-20 14:34:57',NULL,NULL),('5','18','Oscar','Perez','2023-09-04 22:16:08',100,598,0,'efectivo',0,'Pago','2023-09-07 22:16:23','2023-09-07 22:16:23',NULL,NULL),('5680b746-aeac-4732-bb39-32397b530e50','991','Narcisa','Cardona','2023-09-21 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:04:30','2023-09-26 17:04:30',NULL,NULL),('58939062-c689-4019-987e-1e0110b6a9ee','29','Juana','Silvestre','2023-09-12 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:27:17','2023-09-26 17:27:17',NULL,NULL),('6','446','Ramon','Villa','2023-09-21 16:30:28',100,68,0,'efectivo',0,'Pagar con Dinero','2023-09-21 16:31:13','2023-09-25 20:38:51',NULL,NULL),('6699a135-5b89-44d3-95ee-f0b734a597f2','732','Laura','Escobar','2023-09-21 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:25:31','2023-09-26 17:25:31',NULL,NULL),('696f7aa9-9966-45f7-9ce5-c3ce33678b9a','260','Clara','Luz','2023-04-10 00:00:00',125,232,0,'efectivo',0,'Ir a la excursion','2023-10-04 22:04:53','2023-10-04 22:04:53',NULL,NULL),('69910d63-0e3f-4ee4-af5c-a6769a1be932','948','Aura','Esquivel','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:23:22','2023-09-26 17:23:22',NULL,NULL),('6ec629d4-aa8f-4fad-8845-05f23635acc5','20','Marta','Paola','2023-04-10 00:00:00',100,226,0,'efectivo',0,'Pago de Kermes','2023-10-04 21:58:04','2023-10-04 21:58:04',NULL,NULL),('7','792','Oscar','Perez','2023-09-10 22:13:08',100,598,0,'efectivo',0,'Pagando todo','2023-09-07 22:13:38','2023-09-07 22:13:38',NULL,NULL),('7211','446','Dato','Prueba',NULL,150,353,NULL,'efectivo',NULL,'Pago de Actividad','2023-09-21 16:00:08','2023-09-21 17:32:57',NULL,NULL),('738','679','Mynor','Espinoza','2023-09-08 00:00:00',150,598,NULL,'efectivo',NULL,'Pago de Entrada','2023-09-20 14:31:28','2023-09-28 14:53:57',NULL,NULL),('750a5a4b-dcb3-460a-8551-d71d4165ac79','777','Velveth','Muñoz','2023-09-12 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:05:43','2023-09-26 17:05:43',NULL,NULL),('761','446','Pepito','Perez',NULL,100,181,NULL,'efectivo',NULL,'Pagar','2023-09-21 16:30:28','2023-09-21 17:22:39',NULL,NULL),('76741cf7-9f12-4460-b35c-f668a4fb2acb','807','Blanca','Rueda','2023-09-16 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:19:20','2023-09-26 17:19:20',NULL,NULL),('7745bd57-6ec7-45b6-b1db-d5ee474f130f','2','Aroldo','Escobar','2023-02-10 00:00:00',150,370,123,'voucher',112233,'Pago de Entrada','2023-10-02 14:59:59','2023-10-02 14:59:59',NULL,NULL),('7e46f75f-b9f2-4e2c-bc17-1058124bbbcf','453','Arnoldo','Suruy','2023-09-21 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:01:19','2023-09-26 17:01:19',NULL,NULL),('8119c90c-ca62-48b3-abdb-161b77d154bf','321','Luz','Lopez','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:22:40','2023-09-26 17:22:40',NULL,NULL),('84','590','David','Escobar','2023-09-13 00:00:00',250,598,NULL,'efectivo',NULL,'Pago para las bebidas','2023-09-13 17:09:35','2023-09-13 17:09:35',NULL,NULL),('86','446','Mishel','Alvarado',NULL,150,181,NULL,'efectivo',NULL,'Pago de Entrada','2023-09-20 20:03:51','2023-09-28 14:54:18',NULL,NULL),('879c61c6-bdaa-4721-aa28-0033895b54a7','393','Mario','Padilla',NULL,150,226,NULL,'efectivo',NULL,'Pago de Entrada','2023-09-26 21:47:09','2023-09-26 21:47:09',NULL,NULL),('8ce73244-7cd8-4c69-9601-22ff02950a1d','651','Margarita','Camey','2023-09-18 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:07:48','2023-09-26 17:07:48',NULL,NULL),('96','977','Mary','Jane',NULL,50,353,NULL,'efectivo',NULL,'Pago de Entrada','2023-09-20 14:46:18','2023-09-20 14:46:18',NULL,NULL),('964465','137','Maria','Gutierrez',NULL,160,181,NULL,'efectivo',NULL,'Pago de Entrada','2023-09-20 14:50:18','2023-09-20 14:50:18',NULL,NULL),('97425905','127','Ramon','Villa','2023-09-20 14:34:57',50,226,0,'efectivo',0,'Pago de Entrada','2023-09-20 14:35:47','2023-09-20 14:35:47',NULL,NULL),('97e50a4d-4f52-4092-b4b1-57fed4d83ae9','29','Mynor','Monzo','2023-09-20 00:00:00',150,298,1819,'voucher',178338,'Pago de Entrada','2023-09-26 21:48:55','2023-09-26 21:48:55',NULL,NULL),('990a775b-67b3-4c6f-927c-ce4a444b1ab2','127','Vilma','Rangel','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:16:00','2023-09-26 17:16:00',NULL,NULL),('a4658ffd-df5e-45a4-9404-09ea2b04566f','985','Cindy','Amperez','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:13:43','2023-09-26 17:13:43',NULL,NULL),('a54ac65a-b7a0-4964-aa5f-4fd929d9b045','0','Jorge','Ubico',NULL,50,68,NULL,'efectivo',NULL,'Pago de Entrada','2023-09-26 21:42:01','2023-09-26 21:42:01',NULL,NULL),('a560a988-30c1-4f88-9b5c-ceb22c24912e','957','Maria','Rodriguez','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 16:59:49','2023-09-26 16:59:49',NULL,NULL),('aade174c-6aac-4ab3-ba42-88a315aaac8a','446','Aroldo David','Escobar Lopez','2023-09-20 00:00:00',50,68,123,'voucher',1456,'Pago de Entrada','2023-09-26 21:58:15','2023-09-26 21:58:15',NULL,NULL),('aec2055a-2b4c-4341-9a57-5bb221962999','3','Aroldo','Escobar ','0000-00-00 00:00:00',150,181,123,'voucher',112233,'Pago de Entrada ','2023-10-01 05:32:22','2023-10-01 05:32:22',NULL,NULL),('b06d6883-fff5-432a-9ed4-0b2e7e0711cf','108','Ana','Altamirano','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:15:18','2023-09-26 17:15:18',NULL,NULL),('b5b00a21-cb09-4294-a8be-9404c08d62ca','204','Mirna','Suruy','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:24:46','2023-09-26 17:24:46',NULL,NULL),('c4e54aef-21f2-44c8-9524-c2236ddcb80d','970','Martiza','Serech','2023-09-16 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:21:12','2023-09-26 17:21:12',NULL,NULL),('c9aa0f88-f245-4939-87bd-47276f16f86c','963','Aroldo','Escobar','2023-09-19 00:00:00',150,298,123,'voucher',112233,'Pago de Entrada','2023-09-26 03:17:37','2023-09-26 03:17:37',NULL,NULL),('cb33030c-aed3-4ee3-a1b2-f541fb9fec62','918','Maria','Perez','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:14:32','2023-09-26 17:14:32',NULL,NULL),('cd5ae194-6896-4adb-b07e-6abf53da40c7','787','Elizabeth','Maica','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:26:36','2023-09-26 17:26:36',NULL,NULL),('ce594739-6cd1-4296-b187-4b0d5292f4e2','399','Orfania','Perdomo','2023-09-22 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:17:47','2023-09-26 17:17:47',NULL,NULL),('d4278617-dfe1-4243-ac72-c40a6b2d6116','783','Alicia','Ramirez','2023-09-20 00:00:00',180,318,123,'voucher',123,'Pago de Entrada','2023-09-26 17:02:19','2023-09-26 17:02:19',NULL,NULL),('e375b7ce-32f6-44ed-8f40-243218e88c32','2','Aroldo','Escobar ','0000-00-00 00:00:00',150,181,123,'voucher',112233,'Pago de Entrada ','2023-10-01 05:31:03','2023-10-01 05:31:03',NULL,NULL),('f9ef0a06-6ffa-4ee2-865f-fdc6138ebde7','963','Merary','Ahn','2023-09-20 00:00:00',150,181,123,'voucher',112233,'Pago de Entrada','2023-09-26 04:35:02','2023-09-26 04:35:02',NULL,NULL);
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
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
