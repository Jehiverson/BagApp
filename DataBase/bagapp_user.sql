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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `idUser` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tipoRol` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `idCliente` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `idUser` (`idUser`),
  KEY `idCliente` (`idCliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (38,'Arnoldo','arnoldo@gmail.com','$2a$10$sdt94lVYq9cNGeZr6I6YA./KHuX2mhfoLJWK34I6Ov26YjpmqGFzW','Cliente','2023-09-26 16:33:14','2023-09-26 16:33:14','453'),(47,'Tester1','tester1@gmail.com','$2a$10$PDSItqm68gcf98pGlxmP5um9884sJDSf7FkQk.uc1svLFYaK4JESS','Administrador','2023-09-13 21:23:59','2023-09-13 21:23:59','963'),(52,'Maria Rodriquez','marirodri@gmail.com','$2a$10$FErZPYb37wP9dfpx9Lht2Ol/JRkIQZzatbgjzzmfb5grv6JQODjZa','Cliente','2023-09-26 16:42:04','2023-09-26 16:42:04','957'),(71,'Alicia','alicia@gmail.com','$2a$10$XOZ5AIduPh33S6etQJ8mAukzO0q4bnswWXVtoTMQEChvwewLiR3DS','Cliente','2023-09-26 16:00:37','2023-09-26 16:00:37','783'),(97,'Narcisa','narcisa@gmail.com','$2a$10$7svtry8igwj3VH8wayp4YuCTvcphq7H3XfJ8Yva/5BOVlIICneNni','Cliente','2023-09-26 15:54:21','2023-09-26 15:54:21','991'),(116,'Velveth','velveth@gmail.com','$2a$10$geI2RELa0WW2q53xZr3hLuKRRUeu2ZTlS7pegBlTfJThG1iowNHSa','Cliente','2023-09-26 16:35:30','2023-09-26 16:35:30','777'),(202,'Tester2','tester2@gmail.com','$2a$10$PDSItqm68gcf98pGlxmP5um9884sJDSf7FkQk.uc1svLFYaK4JESS','Cliente','2023-09-11 17:26:56','2023-09-11 17:26:56','446'),(221,'Nidya','nidya@gmail.com','$2a$10$RpkVWVtDHDpScf5rvi.RaenLiR9alSyzih5Yj7LHBkZjQz5WQQMbW','Cliente','2023-09-26 16:03:03','2023-09-26 16:03:03','687'),(230,'Marta','marta@gmail.com','$2a$10$2o6i2v3Eg4DG22LnTWIQz.jtOoxJTNGTRfgRgxf6fBpnsxO6P5zsS','Cliente','2023-09-26 15:49:06','2023-09-26 15:49:06','20'),(236,'Margarita','margarita@gmail.com','$2a$10$cOJtSxznkKq76n60xajvDeW9CovksOB0hzUl1sznw7a5/rtGJpTAC','Cliente','2023-09-26 15:56:53','2023-09-26 15:56:53','651'),(238,'Tester3','tester3@gmail.com','$2a$10$PDSItqm68gcf98pGlxmP5um9884sJDSf7FkQk.uc1svLFYaK4JESS','Usuario','2023-09-08 20:41:53','2023-09-08 20:41:53','834'),(268,'Adelaida','adelaida@gmail.com','$2a$10$enbpTCPisdjBWbmp5odhmuhs0e3Y3pRi4betH8QwjGVclWYcNRNP.','Cliente','2023-09-26 16:24:54','2023-09-26 16:24:54','408'),(269,'Clara','clara@gmail.com','$2a$10$eyqLQCjxVYwooheqdJZSY.SDnRnUHKgG8mhdAKkCfdfZQi5xNSB/W','Cliente','2023-09-26 16:45:59','2023-09-26 16:45:59','260'),(272,'Brenda','brenda@gmail.com','$2a$10$ZKvvj5kWQGp7yhkJgotcveMKn1yUJJ8Amhop.AyYD/HEptfFSpZkK','Cliente','2023-09-26 16:51:37','2023-09-26 16:51:37','46'),(276,'Fin','finelhumano@gmail.com','$2a$10$I8r9rkBhi5gtYWp9NEy.sum7a3/Ah6YJ/88nLQhbqvOLRgKgtsrve','Cliente','2023-09-27 03:57:36','2023-09-27 03:57:36','e89d1611-c2e9-4e07-8302-6f713ca7dc4f'),(334,'Irma','irma@gmail.com','$2a$10$jzI2EMlcTtEvej37M6dtt.3qMSiB3ycMqFYAxW05CjiQMzyKhDxXW','Cliente','2023-09-26 16:06:33','2023-09-26 16:06:33','477'),(342,'Cindy','cindy@gmail.com','$2a$10$kPjCk1c6LiMkApK5K7N9q.LZqQrEQLoVKLqbijcEbM8FbCrI9RngW','Cliente','2023-09-26 16:22:49','2023-09-26 16:22:49','985'),(427,'Maria','maria@gmail.com','$2a$10$ETHXNDZVOaqp9A40gkF/muFrDWBX9Ui7aaKwaRXtZFCRwGyzq.tkK','Cliente','2023-09-26 15:52:20','2023-09-26 15:52:20','918'),(500,'Ana','ana@gmail.com','$2a$10$tVC0QtIJTULcNmV7k8pW.uyDEUpETjmpzS3MpHEmO176D5ILA7VX.','Cliente','2023-09-26 16:54:30','2023-09-26 16:54:30','108'),(501,'Vilma','vilma@gmail.com','$2a$10$ElKbv5dK3GCd76OlpiBb1OasTRfPbpJAeZi76ufVRcaODyPAbtTue','Cliente','2023-09-26 16:57:24','2023-09-26 16:57:24','127'),(525,'Evelyn','evelyn@gmail.com','$2a$10$S3uShq842vgyyQPOMz9iU.rl.8qHiYbnhJ98OtO35v2yEoPjrtk/q','Cliente','2023-09-26 16:13:04','2023-09-26 16:13:04','283'),(579,'Orfania','orfania@gmail.com','$2a$10$iYOiN3ekwCnZeoBxk0BSXe6FgG44dNw/BHCc7ZF97aGIDDBu0H4kC','Cliente','2023-09-26 16:09:52','2023-09-26 16:09:52','399'),(626,'Miriam','mirian@gmail.com','$2a$10$zpeq7jZmhqZ8sY8PFtq/Ru/hbFcJneqoVefLTdbkM2iQcoMR9VboS','Cliente','2023-09-26 16:40:35','2023-09-26 16:40:35','375'),(636,'Blanca','blanca@gmail.com','$2a$10$IylRxr0gW4o8HoAQAVpbg.i09gNfVN6l9KwtLCB51Pl21MOSJM6YW','Cliente','2023-09-26 16:18:44','2023-09-26 16:18:44','807'),(645,'Jose','jose@gmail.com','$2a$10$OHf2PLePKNi8Ck10afJcsu3/Ie0Yl9VgQEHUf97PX0g5dRJ1SmiF.','Cliente','2023-09-26 16:27:17','2023-09-26 16:27:17','393'),(669,'Martiza','martiza@gmail.com','$2a$10$778s8Fk5fpQ5fwtuNfygNOolFo9sEGDK1Uzx3bxXuArOPF7O9Ich2','Cliente','2023-09-26 16:49:59','2023-09-26 16:49:59','970'),(789,'Marcelina','ignacia@gmail.com','$2a$10$wja2AJLT8S5jcftOjb7heOzdaf/y4HBifUNogCJbIDCx/eexXEN5m','Cliente','2023-09-26 17:47:41','2023-09-26 17:47:41','f3673c02-0b2b-4d0e-b441-dd280d438b28'),(813,'Azucena','azucena@gmail.com','$2a$10$QKkjBnX43QjqZ/lATZGJT.RcfNPgibFmGAsyz604T32oMb9N.31uu','Cliente','2023-09-26 16:43:54','2023-09-26 16:43:54','466'),(816,'Luz','luz@gmail.com','$2a$10$IFVKHTro1/zxJEqTj2WH1e0vMZEGcwEG/Tl/tarZ9pLcdVP7iwrfS','Cliente','2023-09-26 16:29:14','2023-09-26 16:29:14','321'),(824,'Aura','aura@gmail.com','$2a$10$wN/1XNAYHEww3Vs1jOAgFuL6qrTLgLI4ZpbRSiE/QXqLWR7PiEmce','Cliente','2023-09-26 16:15:24','2023-09-26 16:15:24','948'),(825,'Prueba','prueba1@gmail.com','$2a$10$SDWQazuK4v5Jz3NqkBUNqeSO2vb6pUqMtnmuXul1RJdug23rNTauC','Usuario','2023-09-27 04:01:07','2023-09-27 04:01:07','b2df1e1d-179e-4d56-964e-e474f2318b86'),(841,'Karen','karen@gmail.com','$2a$10$grI6SuPDfea014nHukUXVu.NFin4dughSpvSf3jZKeobR4p0MEKEG','Cliente','2023-09-26 16:39:02','2023-09-26 16:39:02','842'),(897,'Mirna','mirna@gmail.com','$2a$10$NGzoWrwy.TVy0.eOFWDHxu1wkMMpck8kIuo3s2RwAH6pepcAaRlwq','Cliente','2023-09-26 16:31:19','2023-09-26 16:31:19','204'),(944,'Laura','laura@gmail.com','$2a$10$TpJAR1Ocj12WAS5p4Ho5/enkKIopvbEqPYLFHs0VOuD/DYUtcXJce','Cliente','2023-09-26 16:20:33','2023-09-26 16:20:33','732'),(960,'Elizabeth','elizabeth@gmail.com','$2a$10$XRjwxLeoTv5U2p9YphUUXOipIEzNK8K0Iml5PftoucnZeDuXo07Te','Cliente','2023-09-26 16:37:30','2023-09-26 16:37:30','787'),(979,'Juana','juana@gmail.com','$2a$10$K4hzehDqCxdgUePopWMBXO2jQj9LrvfX29msBn8efLXo8hrsdlgwe','Cliente','2023-09-26 16:48:04','2023-09-26 16:48:04','29');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
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
