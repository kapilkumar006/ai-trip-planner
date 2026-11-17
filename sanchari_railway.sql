-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: sanchari
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,'kapil','kapil@example.com','Paris Trip','I need more information about a Paris trip.','2026-09-07 16:55:58'),(2,'kumar','kumar@testing.com','for testing','justing','2026-09-08 03:35:08'),(3,'somu','somu@gmail.com','testing','just for testing','2026-09-22 16:52:20'),(4,'rohit','roht@gmail.com','just for testing','just for testing','2026-09-23 04:08:55'),(5,'roooohit','roooohit@gmail.com','DB testing','for DB testing on 8/10/26','2026-10-08 03:00:20');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_trips`
--

DROP TABLE IF EXISTS `saved_trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `saved_trips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `destination` varchar(255) NOT NULL,
  `trip_type` varchar(100) DEFAULT NULL,
  `budget` varchar(100) DEFAULT NULL,
  `num_days` int(11) DEFAULT NULL,
  `num_people` int(11) DEFAULT NULL,
  `itinerary` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `travel_mode` varchar(100) DEFAULT NULL,
  `health_considerations` text DEFAULT NULL,
  `mongodb_id` varchar(24) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_saved_trips_user` (`user_id`),
  CONSTRAINT `fk_saved_trips_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_trips`
--

LOCK TABLES `saved_trips` WRITE;
/*!40000 ALTER TABLE `saved_trips` DISABLE KEYS */;
INSERT INTO `saved_trips` VALUES (2,2,'Hyderabad','Paris, France','Couple','5000',2,2,'# 2-Day Romantic Paris Itinerary\n\n---\n\n## Day 1: Classic Icons & Seine River Romance\n\n### Morning\n* **Activities:** Enjoy a relaxed, scenic morning starting at the Trocadéro terrace for sweeping views of the Eiffel Tower, followed by an elevator ascent to the summit. To accommodate asthma, pre-booked summit elevator tickets ensure a comfortable journey without climbing hundreds of stairs.\n* **Places to Visit:** Place du Trocadéro, Eiffel Tower (Elevator Access to the Summit), Champ de Mars gardens.\n* **Suggested Breakfast:** **Carette (Place du Trocadéro)** – Famous for its rich Parisian hot chocolate, freshly baked flaky croissants, and pain au chocolat in a classic French setting.\n\n### Afternoon\n* **Activities:** Take a comfortable taxi ride to the Musée d\'Orsay. Spend the afternoon exploring world-renowned Impressionist works by Monet, Renoir, and Van Gogh. The museum is fully climate-controlled with elevators, making it a comfortable, air-filtered cultural stop.\n* **Places to Visit:** Pont Alexandre III, Musée d\'Orsay.\n* **Suggested Lunch:** **Café Campana (Inside Musée d\'Orsay)** – A charming spot designed by the Campana brothers, located right behind the museum\'s monumental clock face, serving light French seasonal salads and quiches.\n\n### Evening\n* **Activities:** Embark on an evening Seine River dinner cruise. This provides a romantic view of illuminated monuments—including the sparkling Eiffel Tower—without requiring extensive walking.\n* **Places to Visit:** River Seine, viewing Notre-Dame, the Louvre, and Parisian bridges illuminated at dusk.\n* **Suggested Dinner:** **Bateaux Parisiens Prestige Dinner Cruise** – A multi-course French gourmet meal with live musical accompaniment as you drift along the Seine.\n\n**Approximate Expenses for Day 1 (for 2 people):** $420 (Activities & admissions: $170, Meals & dinner cruise: $250)\n\n---\n\n## Day 2: Art Treasures, Historic Islands & Montmartre\n\n### Morning\n* **Activities:** Morning visit to the grand Louvre Museum with timed-entry skip-the-line tickets. Focus on select wings (Mona Lisa, Venus de Milo, Winged Victory) using the museum\'s elevator network to conserve energy and keep the pace leisurely.\n* **Places to Visit:** Cour Napoléon & Glass Pyramid, The Louvre Museum (Denon Wing).\n* **Suggested Breakfast:** **Café Marly** – Overlooks the Louvre courtyard and pyramid; enjoy an espresso, fresh fruit, and warm brioche in an elegant setting.\n\n### Afternoon\n* **Activities:** Take an Uber to the Île de la Cité. Admire the exterior restoration of Notre-Dame Cathedral, followed by a visit to Sainte-Chapelle to gaze at its 13th-century stained-glass windows. Take a relaxing stroll past the open-air book stalls along the riverbank.\n* **Places to Visit:** Notre-Dame Cathedral exterior, Sainte-Chapelle, Île de la Cité flower market.\n* **Suggested Lunch:** **Le Petit Châtelet** – A warm, rustic Parisian bistro near Shakespeare and Company, serving traditional duck confit and grilled fish.\n\n### Evening\n* **Activities:** Head to Montmartre in the late afternoon. Take the **Montmartre Funicular** rather than climbing the 222 steps up to the Sacré-Cœur Basilica. Catch the golden-hour sunset over the Paris skyline, followed by a romantic walk through the cobblestone streets around Place du Tertre.\n* **Places to Visit:** Sacré-Cœur Basilica, Place du Tertre, Montmartre historic lanes.\n* **Suggested Dinner:** **Le Moulin de la Galette** – A historic Montmartre windmill-turned-bistro, offering classic dishes like boeuf bourguignon and warm apple tart in an intimate, candlelit ambiance.\n\n**Approximate Expenses for Day 2 (for 2 people):** $310 (Activities & admissions: $80, Meals & dining: $230)\n\n---\n\n## Trip Overview\nThis curated 2-day trip is designed for a couple seeking a romantic, high-comfort experience in Paris. Originating from Hyderabad, the schedule balances must-see monuments with fine dining and comfortable transit. To ensure health and well-being with asthma, the itinerary emphasizes elevator-accessible monuments, scenic boat journeys, and vehicular transit over strenuous stairways and rushed walks.\n\n---\n\n## Top Attractions\n* **Eiffel Tower (Summit via Lift):** Panoramic views of Paris without the physical exertion of stair climbs.\n* **Musée d\'Orsay:** World-class Impressionist art housed inside a spacious, climate-controlled former railway station.\n* **The Louvre Museum:** The world\'s largest art museum, explored at a gentle, curated pace.\n* **Sainte-Chapelle:** A jewel of Gothic architecture filled with floor-to-ceiling stained glass.\n* **Sacré-Cœur & Montmartre (via Funicular):** Historic hilltop romance with city-wide vistas.\n* **River Seine:** Sightseeing while seated during an evening dinner cruise.\n\n---\n\n## Food Recommendations\n* **Croissants & Pain au Chocolat:** Flaky, all-butter breakfast staples from traditional *boulangeries*.\n* **Duck Confit (*Confit de Canard*):** Crispy, slow-cooked duck leg served with garlic potatoes.\n* **Boeuf Bourguignon:** Slow-simmered beef stew infused with red wine, lardons, and pearl onions.\n* **French Onion Soup (*Soupe à l\'Oignon*):** Warm broth topped with toasted baguette slices and melted Gruyère cheese.\n* **Macarons & Mille-Feuille:** Classic French patisserie treats from Ladurée or Pierre Hermé.\n\n---\n\n## Transportation\n* **From/To Airport:** Pre-book a private airport transfer or take official Parisian taxis from Paris-Charles de Gaulle (CDG) directly to your hotel (flat-rate of approximately €56–€65 each way).\n* **Within the City:** Use **Uber** or **G7 Taxis** for travel between districts. This avoids the long pedestrian tunnels and steep stairs common in the Paris Metro, which can trigger asthma symptoms.\n* **Montmartre Hill:** Use the **Funiculaire de Montmartre** (covered by a standard public transport ticket) to reach Sacré-Cœur effortlessly.\n\n---\n\n## Budget Summary (in USD, for 2 Travelers)\n\n| Category | Cost |\n| :--- | :--- |\n| **Round-Trip Flights (Hyderabad to Paris CDG)** | $2,200 |\n| **Accommodation (2 Nights in a 4-Star Boutique Hotel)** | $900 |\n| **Food & Dining (Including Seine Dinner Cruise)** | $650 |\n| **Activities & Skip-the-Line Tickets** | $250 |\n| **Local Transportation (Airport Taxis + City Taxis/Uber)** | $220 |\n| **Miscellaneous & Buffer (Travel Insurance, Visas, Tips)** | $680 |\n| **Total Estimated Budget** | **$4,900** |\n\n---\n\n## Safety & Health Tips\n* **Asthma Management:**\n  * Paris weather can be brisk and damp depending on the season; keep a scarf handy to cover your mouth and nose against chilly air.\n  * Always carry quick-relief inhalers and a copy of your doctor\'s prescription in your daypack.\n  * Avoid climbing the spiral staircases of the Arc de Triomphe or Notre-Dame towers; rely exclusively on mechanical lifts at the Eiffel Tower and the funicular at Montmartre.\n  * Pharmacies in Paris are identifiable by illuminated green crosses and are well-stocked with over-the-counter and prescription emergency care.\n* **Pickpocket Prevention:** \n  * Be alert around crowded landmarks like the Trocadéro, Eiffel Tower, and Montmartre. Keep phones, passports, and wallets in secure, zippered cross-body bags rather than back pockets.\n* **Emergency Numbers:** \n  * Dial **112** for general EU emergencies, or **15** directly for SAMU (French emergency medical service).\n\n---\n\n## Travel Tips\n* **Advance Bookings:** Pre-purchase skip-the-line timed tickets online for the Louvre, Eiffel Tower summit lift, and Sainte-Chapelle at least 3–4 weeks before travel.\n* **Currency:** France uses the Euro (€). Credit and debit cards with contactless payment are accepted almost everywhere; carry around €50 in cash for small purchases.\n* **Etiquette:** Greet shopkeepers and waitstaff with a polite *\"Bonjour, Madame/Monsieur\"* before starting any conversation or asking for assistance.\n* **Footwear:** Wear cushioned, comfortable walking shoes with good traction, as historic Parisian sidewalks and Montmartre lanes feature uneven cobblestones.','2026-11-09 10:08:36','2026-11-09 10:08:36','Plane','asthma',NULL),(6,2,'Mumbai','Maldives','Couple','8888',2,2,NULL,'2026-11-16 08:49:38','2026-11-16 08:49:38','Plane','asthma','6afac3a126bf1ff3a5305f02'),(7,2,'Dallas','Tokyo, Japan','Couple','444444',2,2,NULL,'2026-11-16 08:51:44','2026-11-16 08:51:44','Plane','asthma','6afac42026bf1ff3a5305f03'),(8,2,'Tokyo','Bali, Indonesia','Friends','333333',2,3,NULL,'2026-11-17 15:50:04','2026-11-17 15:50:04','Plane','none','6afc77ac95ed62add2eb7aea');
/*!40000 ALTER TABLE `saved_trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Kapil','Kumar','kapiltest@example.com','$2b$10$Q8KZx9cGrLIrnW5uxz8NIu.EJfipNL8645MH6dma55kwhfAoVXHSq','2026-09-22 17:57:32'),(2,'Test','User','testuser@example.com','$2b$10$C5ttuKLmUkZECI7yCX4NL.Lv8nWvtMzZpI/83qRPK9BPxZCr32.EW','2026-09-22 18:16:59'),(3,'sri','Kumar','srikumartesting@gmail.com','$2b$10$y3olnO2S9LhWvUOcD.LzR.48L5h/lzBus4D6LFXFYnDr0rx5vRFoS','2026-10-08 03:01:34'),(4,'murali','k','murali@example.com','$2b$10$sIjn5Ju6M.9iEu8z1E1IDu5b72TETqZ8IfYmVLjpi.R9UiZv4VRkS','2026-10-08 03:50:31');
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

-- Dump completed on 2026-11-17 21:22:43
