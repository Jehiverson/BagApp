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
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `idCliente` varchar(150) NOT NULL,
  `nombreClient` varchar(255) NOT NULL,
  `apellidoClient` varchar(255) NOT NULL,
  `fechaNacimiento` datetime NOT NULL,
  `dpi` int NOT NULL,
  `telefono` int DEFAULT NULL,
  `genero` varchar(255) NOT NULL,
  `estadoCivil` varchar(255) NOT NULL,
  `trabajando` varchar(255) NOT NULL,
  `ocupacion` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `cantidadHijos` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `actividadIdActividad` int DEFAULT NULL,
  `userIdUser` int DEFAULT NULL,
  `hijoIdHijo` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`idCliente`),
  UNIQUE KEY `idCliente` (`idCliente`),
  KEY `cliente_hijoIdHijo_foreign_idx` (`hijoIdHijo`),
  KEY `actividadIdActividad` (`actividadIdActividad`),
  KEY `userIdUser` (`userIdUser`),
  CONSTRAINT `cliente_ibfk_69` FOREIGN KEY (`actividadIdActividad`) REFERENCES `actividad` (`idActividad`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `cliente_ibfk_70` FOREIGN KEY (`userIdUser`) REFERENCES `user` (`idUser`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES ('108','Ana Margarita','Altamirano','1963-09-15 00:00:00',2147483647,56233370,'M','Soltero/a','No','Ama de Casas','Lote 6 manz 1 sector Norte colonia Milagro de Amor TN 2',9,'2023-09-26 16:54:29','2023-09-26 16:54:29',NULL,NULL,NULL),('127','Vilma Floridalma','Rangel Garcia','1966-04-26 00:00:00',2147483647,42397449,'M','Divorciado/a','Si','Confeccion','Lote 16 sec, Frontera Tierra Nueva 1',4,'2023-09-26 16:57:24','2023-09-26 16:57:24',NULL,NULL,NULL),('20','Marta Paola','Tobar Balcaercel','1988-05-12 00:00:00',2147483647,56831543,'M','Soltero/a','No','Ama de Casa','Manz 41 Lote 10 Sector 3 T.N. 1',3,'2023-09-26 15:49:06','2023-09-26 15:49:06',NULL,NULL,NULL),('204','Mirna Patricia','Suruy Conde','1977-08-17 00:00:00',2147483647,59456706,'M','Soltero/a','Si','Maestra','sec.29 lote 29 \"el esfuerzo\" tierra nueva 1',3,'2023-09-26 16:31:19','2023-09-26 16:31:19',NULL,NULL,NULL),('260','Clara Luz','Lopez Escobar','1983-05-11 00:00:00',2147483647,46236922,'M','Casado/a','No','Ama de Casa','12 calle 14-81 Lo de fuentes Zona 11 de Mixco',6,'2023-09-26 16:45:59','2023-09-26 16:45:59',NULL,NULL,NULL),('283','Evelyn','Georgina Perdomo','1974-10-25 00:00:00',2147483647,41516872,'M','Casado/a','Si','Subjefe en Oficina de RH','MANZANA 10 LOTE 13-B TIERRA NUEVA 1',6,'2023-09-26 16:13:04','2023-09-26 16:13:04',NULL,NULL,NULL),('29','Juana Yolanda','Silvestre Cuy','1984-05-16 00:00:00',2147483647,57831911,'M','Casado/a','No','Ama de Casa','lote 7 sector municipal complejo arnoldo medrano T.N 2',6,'2023-09-26 16:48:03','2023-09-26 16:48:03',NULL,NULL,NULL),('321','Marta Luz','Conde Alvanzaes','1954-04-12 00:00:00',2147483647,56245293,'M','Viudo/a','Si','Conserje','MANZANA 29 LOTE 5 TIERRA NUEVA 1',4,'2023-09-26 16:29:14','2023-09-26 16:29:14',NULL,NULL,NULL),('375','Miriam Rosely','Osoy Pompa','1989-08-16 00:00:00',2147483647,57921241,'M','Viudo/a','Si','Secretaria','sector B-4 manzana A lote 2 Tierra Nueva 2',2,'2023-09-26 16:40:35','2023-09-26 16:40:35',NULL,NULL,NULL),('393','Jose Antonio','Monroy Sosa','1949-10-22 00:00:00',2147483647,48513802,'H','Casado/a','No','Jubilado','Manzana k Lote 38 M.Primero de mayo Zona 11 de Mixco',3,'2023-09-26 16:27:16','2023-09-26 16:27:16',NULL,NULL,NULL),('399','Orfania','Alvarez Perdomo','1965-03-20 00:00:00',2147483647,41729256,'M','Soltero/a','Si','Maestra','Manzana 10 Lote 13 Tierra Nueva 1',4,'2023-09-26 16:09:52','2023-09-26 16:09:52',NULL,NULL,NULL),('408','Maria Adelaida','Mendizabal Valenzuela','1957-04-14 00:00:00',2147483647,42141969,'M','Casado/a','No','Ama de Casa','Manz H Lote 15 Col. 1ero de mayo zona 11 de Mixco',3,'2023-09-26 16:24:54','2023-09-26 16:24:54',NULL,NULL,NULL),('446','Aroldo','Lopez','2004-08-06 00:00:00',123456,54224703,'M','Soltero/a','No','','1av 29-11',1,'2023-09-06 17:39:10','2023-09-06 18:06:16',NULL,NULL,NULL),('453','José Arnoldo','Suruy conde','1985-01-05 00:00:00',2147483647,42436292,'H','Soltero/a','Si','Piloto','16av 20-82 z.12 reformita',4,'2023-09-26 16:33:14','2023-09-26 16:33:14',NULL,NULL,NULL),('46','Brenda Guisela','De Leon Fuentes','1978-09-13 00:00:00',2147483647,34988981,'M','Soltero/a','Si','En casas','MANZANA 13 lote 21 sector la isla tierra nueva 1 ',3,'2023-09-26 16:51:37','2023-09-26 16:51:37',NULL,NULL,NULL),('466','Azucena','Morales de Salvador','1975-05-16 00:00:00',2147483647,59981397,'M','Casado/a','No','Ama de Casa','Lote 177 Manz 7 Sec. Sur Milagro de Amor T.N. 2',5,'2023-09-26 16:43:53','2023-09-26 16:43:53',NULL,NULL,NULL),('477','Irma ','Sucup Tecú','1988-10-22 00:00:00',2147483647,36041494,'M','Soltero/a','Si','Maquila','colonia nuevo amanecer tierra nueva 2 lote 14a',5,'2023-09-26 16:06:33','2023-09-26 16:06:33',NULL,NULL,NULL),('651','Margarita','Camey Bernardino','1985-10-16 00:00:00',2147483647,59198137,'M','Casado/a','No','Ama de Casa','13 calle B 13-36 Planes de Minerva 4',4,'2023-09-26 15:56:53','2023-09-26 15:56:53',NULL,NULL,NULL),('687','Nidya Betzabe','De Leon Gonzales','0000-00-00 00:00:00',2147483647,52100616,'M','Soltero/a','Si','Empleada Domestica','Manz 9 Lote 3 Loma Linda TN1',4,'2023-09-26 16:03:02','2023-09-26 16:03:02',NULL,NULL,NULL),('732','Laura Marina','Escobar chanquin','1988-10-18 00:00:00',2147483647,42883376,'M','Casado/a','Si','Venta de Comida','Lote 26 MH Primero de Mayo',3,'2023-09-26 16:20:33','2023-09-26 16:20:33',NULL,NULL,NULL),('777','Velveth Marisol','Muñoz Maica ','1980-05-19 00:00:00',2147483647,42191159,'M','Casado/a','Si','Comerciante','Lote 9 sec la montañita Tierra Nueva 1',4,'2023-09-26 16:35:29','2023-09-26 16:35:29',NULL,NULL,NULL),('783','Alicia Rosa','Ramirez Lopez','1981-05-16 00:00:00',2147483647,47689563,'M','Soltero/a','Si','Secretaria en Maquinaria','SEC.29 LOTE 32 TIERRA NUEVA 1 ZONA 0 CHINAUTLA',6,'2023-09-26 16:00:37','2023-09-26 16:00:37',NULL,NULL,NULL),('787','Blanca Elizabeth ','Maica Mejia','1955-05-18 00:00:00',2147483647,56008120,'M','Casado/a','No','Ama de Casa','Manz 21 Lote 6 Tierra Nueva 1 Sec. 2',4,'2023-09-26 16:37:29','2023-09-26 16:37:29',NULL,NULL,NULL),('807','Blanca Del Carmen','Rueda Quijada','1993-04-22 00:00:00',2147483647,57125986,'M','Soltero/a','No','Ama de Casa','M.6 Lote 29 Sector la Isla TN1',5,'2023-09-26 16:18:44','2023-09-26 16:18:44',NULL,NULL,NULL),('834','Oscar','Perez','1999-09-18 00:00:00',123789,54667815,'M','Casado/a','No','','1av 29-11',0,'2023-09-07 22:10:52','2023-09-07 22:10:52',NULL,NULL,NULL),('842','Karen Rosaura','Avendaño Dionicio','1993-08-26 00:00:00',2147483647,35699794,'M','Soltero/a','No','Ama de Casa','lote 142 sec. D nuevo Amanecer T.N.2 el complejo',2,'2023-09-26 16:39:02','2023-09-26 16:39:02',NULL,NULL,NULL),('918','Maria Magdalena','Perez Ramires','1962-08-12 00:00:00',2147483647,41706670,'M','Viudo/a','No','Ama de Casa','4 calle lote 11 s.b -2 manz. TN chinautla',4,'2023-09-26 15:52:20','2023-09-26 15:52:20',NULL,NULL,NULL),('948','Aura Maribel ','Esquivel Ramos','1974-05-14 00:00:00',2147483647,50367002,'M','Casado/a','Si','Costurera','LOTE 21 SECTOR LA FRANJA TIERRA NUEVA 1',4,'2023-09-26 16:15:23','2023-09-26 16:15:23',NULL,NULL,NULL),('957','Maria','Rodriguez','1978-11-06 00:00:00',2147483647,42847948,'M','Soltero/a','Si','Limpieza','Manzana 13 lote 4 sector 2 Tierra Nueva 1',2,'2023-09-26 16:42:03','2023-09-26 16:42:03',NULL,NULL,NULL),('963','Merary','Ahn','2000-04-05 00:00:00',123456789,54224703,'M','Soltero/a','No',NULL,'1av 29-11',2,'2023-09-22 20:46:35','2023-09-22 20:46:35',NULL,NULL,NULL),('970','Eva Martiza','Serech Cuy','1992-09-10 00:00:00',2147483647,58833092,'M','Casado/a','No','Ama de Casa','Manz 7 lote 3 sector la isla TN 1',4,'2023-09-26 16:49:59','2023-09-26 16:49:59',NULL,NULL,NULL),('985','Cindy Judith','Amperez Portillo','1993-02-19 00:00:00',2147483647,35785403,'M','Casado/a','No','Ama de Casa','Manz 5 lote 19 sec. montañita Tierra Nueva 1',5,'2023-09-26 16:22:49','2023-09-26 16:22:49',NULL,NULL,NULL),('991','Narcisa Lucila','Cardona Ramires','1969-06-13 00:00:00',2147483647,41722339,'M','Viudo/a','No','Ama de Casa','Lote 10 Manz D. sec. B-2 T. N. 2',2,'2023-09-26 15:54:21','2023-09-26 15:54:21',NULL,NULL,NULL),('b2df1e1d-179e-4d56-964e-e474f2318b86','Prueba','Estado','2001-06-06 00:00:00',123456789,55442233,'H','Soltero/a','Si','Tester','1av 29-11',0,'2023-09-27 04:01:07','2023-09-27 04:01:07',NULL,NULL,NULL),('e89d1611-c2e9-4e07-8302-6f713ca7dc4f','Fin','Humano','2000-04-13 00:00:00',123456789,54224703,'H','Soltero/a','Si','Heroe','1av 29-11',0,'2023-09-27 03:57:36','2023-09-27 03:57:36',NULL,NULL,NULL),('f3673c02-0b2b-4d0e-b441-dd280d438b28','Marcelina Ignacia','Velasquez Poncio','1972-05-18 00:00:00',2147483647,54221356,'M','Casado/a','No','Ama de Casa','Lote 2 Manz E colonia 10 de febrero',4,'2023-09-26 17:47:41','2023-09-26 17:47:41',NULL,NULL,NULL);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-05 11:34:35
