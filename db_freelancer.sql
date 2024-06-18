-- -------------------------------------------------------------
-- TablePlus 6.0.8(562)
--
-- https://tableplus.com/
--
-- Database: db_freelancer
-- Generation Time: 2024-06-18 23:38:32.7050
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `Certifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `certi_name` varchar(200) NOT NULL,
  `user_id` int NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Certifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ChildTypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_type_name` varchar(255) NOT NULL,
  `type_id` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `ChildTypes_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `Types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Comments` (
  `user_id` int NOT NULL,
  `job_id` int NOT NULL,
  `content` text NOT NULL,
  `rate` int NOT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`job_id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `Comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
  CONSTRAINT `Comments_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `Jobs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Hires` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `isDone` tinyint(1) DEFAULT '0',
  `user_confirm` tinyint(1) DEFAULT '0',
  `method` varchar(100) NOT NULL,
  `user_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `Hires_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`),
  CONSTRAINT `Hires_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `Services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_name` varchar(255) NOT NULL,
  `job_desc` text,
  `job_image` varchar(255) DEFAULT NULL,
  `rate` int DEFAULT '0',
  `stars` int DEFAULT '0',
  `isDeleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `sub_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sub_id` (`sub_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Jobs_ibfk_1` FOREIGN KEY (`sub_id`) REFERENCES `Subs` (`id`),
  CONSTRAINT `Jobs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `PublicKeys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `public_key` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  `service_desc` varchar(255) NOT NULL,
  `service_benefit` varchar(255) NOT NULL,
  `service_level` varchar(100) DEFAULT 'BASIC',
  `delivery_date` int NOT NULL,
  `job_id` int NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  CONSTRAINT `Services_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `Jobs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(200) NOT NULL,
  `user_id` int NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Subs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sub_name` varchar(255) NOT NULL,
  `child_type_id` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `child_type_id` (`child_type_id`),
  CONSTRAINT `Subs_ibfk_1` FOREIGN KEY (`child_type_id`) REFERENCES `ChildTypes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(100) DEFAULT 'user',
  `joinAt` date NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  `isBlocked` tinyint(1) DEFAULT '0',
  `avatar` varchar(255) DEFAULT NULL,
  `facebook_app_id` varchar(255) DEFAULT NULL,
  `google_app_id` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `account_balance` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ChildTypes` (`id`, `child_type_name`, `type_id`, `isDeleted`) VALUES
(1, 'logo-&-brand-identity', 1, 0),
(2, 'web-&-app-design', 1, 0),
(3, 'visual-design', 1, 0),
(4, 'architecture-&-building-design', 1, 0),
(5, 'product-&-gaming', 1, 0),
(7, 'website-development', 2, 0),
(8, 'ai-development', 2, 0),
(9, 'mobile-app-development', 2, 0),
(10, 'software-development', 2, 0),
(11, 'search', 3, 0),
(12, 'methods-&-techniques', 3, 0),
(13, 'analytics-&-strategy', 3, 0),
(14, 'industry-&-purpose-specific', 3, 0),
(15, 'editing-&-post-production', 5, 0),
(16, 'animation', 5, 0),
(17, 'explainer-videos', 5, 0),
(18, 'social-&-marketing-videos', 5, 0),
(19, 'content-writing', 4, 0),
(20, 'book-&-ebook-publishing', 4, 0),
(21, 'business-&-marketing-copy', 4, 0),
(22, 'translation-&-transcription', 4, 0),
(23, 'ai-development', 6, 0),
(24, 'ai-video', 6, 0),
(25, 'ai-artists', 6, 0),
(26, 'music-production-&-writing', 7, 0),
(27, 'voice-over-&-narration', 7, 0),
(28, 'streaming-&-audio', 7, 0),
(29, 'general-&-administrative', 8, 0),
(30, 'business-management', 8, 0),
(31, 'accounting-&-finance', 8, 0),
(32, 'sales-&-customer-care', 8, 0),
(33, 'business-consultants', 9, 0),
(34, 'marketing-strategy', 9, 0),
(35, 'coaching-&-advice', 9, 0),
(36, 'data-consulting', 9, 0);

INSERT INTO `Comments` (`user_id`, `job_id`, `content`, `rate`, `createdAt`) VALUES
(2, 1, 'I highly recommend hiring Explorance for your logo needs. She was incredible to work with! I started with sending her a rather chaotic description of what I had in mind, and by the end, she exceeded my expectations.', 3, '2024-06-18 14:02:13'),
(3, 1, 'I highly recommend hiring Explorance for your logo needs. She was incredible to work with! I started with sending her a rather chaotic description of what I had in mind, and by the end, she exceeded my expectations.', 5, '2024-06-18 14:03:36'),
(6, 1, 'I highly recommend hiring Explorance for your logo needs. She was incredible to work with! I started with sending her a rather chaotic description of what I had in mind, and by the end, she exceeded my expectations. She was patient and accommodating with all my revision requests, and really paid attention to the small details I wanted tweaked. Communication was prompt and professional, which made this is a completely stress-free experience for me. I am beyond happy with my logo (and the whole package of files I received). This was an amazing value and worth every dollar', 4, '2024-06-18 09:49:05'),
(7, 1, 'I highly recommend hiring Explorance for your logo needs. She was incredible to work with! I started with sending her a rather chaotic description of what I had in mind, and by the end, she exceeded my expectations.', 5, '2024-06-18 14:00:42');

INSERT INTO `Hires` (`id`, `price`, `createdAt`, `isDone`, `user_confirm`, `method`, `user_id`, `service_id`) VALUES
(1, 900000, '2024-06-18 05:28:41', 1, 1, 'VNPay', 11, 2),
(2, 900000, '2024-06-18 05:33:51', 0, 0, 'VNPay', 3, 2),
(3, 3000000, '2024-06-18 05:34:12', 0, 0, 'VNPay', 4, 3),
(4, 900000, '2024-06-18 05:53:06', 0, 0, 'VNPay', 3, 2),
(5, 3000000, '2024-06-18 05:54:48', 0, 0, 'VNPay', 3, 3),
(6, 200000, '2024-06-18 05:55:42', 0, 0, 'VNPay', 3, 10),
(7, 120000, '2024-06-18 06:57:07', 1, 1, 'VNPay', 12, 17),
(8, 1650000, '2024-06-18 07:04:16', 1, 1, 'VNPay', 12, 8),
(9, 670000, '2024-06-18 08:36:08', 1, 1, 'balance', 9, 11);

INSERT INTO `Jobs` (`id`, `job_name`, `job_desc`, `job_image`, `rate`, `stars`, `isDeleted`, `createdAt`, `sub_id`, `user_id`) VALUES
(1, 'i-will-do-custom-minimalist-unique-modern-brand-or-business-logo-design', 'Are you in search of an exceptional logo design for your brand? Look no further! I\'m Alexandra, a seasoned Logo/Graphic Designer with over 5 years of experience and a strong dose of creativity. My primary professional goals revolve around seeking opportunities to tackle challenging projects and assisting small to medium businesses in distinguishing themselves with outstanding designs.', 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718645948/db_freelancer/xtgze891dvvxvikls3s4.jpg', 4, 4, 0, '2024-06-17 17:15:11', 1, 9),
(2, 'i-will-do-modern-line-art-text-or-badge-logo-design', 'Hi, I am Abhi, a passionate flat graphic designer, and a creative thinker. I have been working on Fiverr for the last 4 years and have successfully developed 50K+ Brand logos and worked for EA Sports, Fiverr Internal communication, etc.Exclusively Premium, Simple, Minimal, Line art, Typography Brand logo design are here to blow you away. You are paying a quality gig to receive perfect quality service and design.', 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718645909/db_freelancer/eafsgbbpmtf01c0zld3u.jpg', 0, 0, 0, '2024-06-17 17:19:19', 1, 10),
(3, 'i-will-do-3-modern-minimalist-logo-design-for-business', 'Hi, I am Abhi, a passionate flat graphic designer, and a creative thinker. I have been working on Fiverr for the last 4 years and have successfully developed 50K+ Brand logos and worked for EA Sports, Fiverr Internal communication, etc.Exclusively Premium, Simple, Minimal, Line art, Typography Brand logo design are here to blow you away. You are paying a quality gig to receive perfect quality service and design.', 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718645872/db_freelancer/q8iy1onpus9ejmdvfa4g.jpg', 0, 0, 0, '2024-06-17 17:22:08', 1, 10),
(4, 'i-will-create-modern-minimalist-and-luxury-logo-design', 'In today\'s crowded market, a modern minimalist logo is a game changer. It sets your brand apart from the rest, making it easier for customers to recognize and remember. With a sleek and simple design, your logo will have the power to attract customers and skyrocket your sales. As a well experienced logo maker, I will craft a 100% custom made design that uses clean geometric shapes and boasts a minimalist design that exudes luxury. Trust me to help you take your brand to the next level.', 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718645832/db_freelancer/jmqjerwjxor7xkjfz1qc.jpg', 0, 0, 0, '2024-06-17 17:23:32', 1, 10),
(5, 'i-will-create-luxury-business-card-design', '\"Design can be done Ready to upload VistaPrint\" or MOO even you can print it from any other places too. ( Please leave a note which one you will use exactly. then design can be fit 100%)', 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718645716/db_freelancer/bpvm9prai11lnaqssxrx.jpg', 0, 0, 0, '2024-06-17 17:25:56', 3, 6),
(6, 'i-will-record-a-pro-romanian-female-voice-over', 'I\'m AVOA aka Alexandra Voice Over Artist-full time VO with over 10 years of acting experience', 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718693706/db_freelancer/ar7tg9zdh5m8tsuqf4di.jpg', 0, 0, 0, '2024-06-18 06:54:25', 91, 9);

INSERT INTO `Services` (`id`, `price`, `service_desc`, `service_benefit`, `service_level`, `delivery_date`, `job_id`, `isDeleted`) VALUES
(1, 800000, '2 Logo Concepts + JPG, PNG File', '2 concepts included, Logo transparency, Printable file, Include 3D mockup', 'BASIC', 1, 1, 0),
(2, 900000, '3 Logo Concepts + JPG, PNG, AI, EPS, PDF, PSD SVG File Formats', '3 concepts included, Logo transparency, Vector file, Printable file, Include 3D mockup', 'ADVANCED', 3, 1, 0),
(3, 3000000, '5 Logo Concept + All File Formats with Social Media Kit and Stationery Design', '3 concepts included, Logo transparency, Vector file, Printable file, Include 3D mockup', 'PREMIUM', 3, 1, 0),
(4, 500000, 'Hill Package - For Start-up 3 logo design along with white and transparent background (JPEG PNG) Files + Source files', '3 concepts included, Logo transparency, Printable file, Include 3D mockup', 'BASIC', 3, 2, 0),
(5, 1650000, 'Cliff Package - TOP Selling 4 HQ Creative variation with JPEG PNG + SOCIAL MEDIA COVERS + .ai .eps SOURCE VECTOR Files', '3 concepts included, Logo transparency, Vector file, Printable file, Include 3D mockup', 'ADVANCED', 3, 2, 0),
(6, 3000000, 'Mountain Package - For Pros ! 5 Highly Professional variations JPEG PNG + STATIONARY & SOCIAL MEDIA DESIGN + Source files for logo', '3 concepts included, Logo transparency, Vector file, Printable file, Include 3D mockup', 'PREMIUM', 3, 2, 0),
(7, 300000, 'Puppy Dog Package - Starter 3 logo design along with white and transparent background (JPEG PNG) Files + Source files', '3 concepts included, Logo transparency, Printable file, Include 3D mockup', 'BASIC', 3, 3, 0),
(8, 1650000, 'Teen Dog Package - TOP Selling 4 HQ Creative variation with JPEG PNG + SOCIAL MEDIA COVERS + .ai .eps SOURCE VECTOR Files', '3 concepts included, Logo transparency, Vector file, Printable file, Include 3D mockup', 'ADVANCED', 3, 3, 0),
(9, 2400000, 'Guard Dog Package- For Exclusives! 5 Highly Professional variations JPEG PNG + STATIONARY & SOCIAL MEDIA DESIGN + Source files for logo', '3 concepts included, Logo transparency, Vector file, Printable file, Include 3D mockup', 'PREMIUM', 3, 3, 0),
(10, 200000, 'Puppy Dog Package - Starter 3 logo design along with white and transparent background (JPEG PNG) Files + Source files', '3 concepts included, Logo transparency, Printable file, Include 3D mockup', 'BASIC', 3, 4, 0),
(11, 670000, 'Teen Dog Package - TOP Selling 4 HQ Creative variation with JPEG PNG + SOCIAL MEDIA COVERS + .ai .eps SOURCE VECTOR Files', '3 concepts included, Logo transparency, Vector file, Printable file, Include 3D mockup', 'ADVANCED', 3, 4, 0),
(12, 1400000, 'Guard Dog Package- For Exclusives! 5 Highly Professional variations JPEG PNG + STATIONARY & SOCIAL MEDIA DESIGN + Source files for logo', '3 concepts included, Logo transparency, Vector file, Printable file, Include 3D mockup', 'PREMIUM', 3, 4, 0),
(13, 200000, '1 basic Concept ( Logo cost extra) - 1 basic Concept and Print ready PDF files. - 1 person details. Logo cost extra.', '3 concepts included, Logo transparency, Printable file, Include 3D mockup', 'BASIC', 3, 5, 0),
(14, 670000, '1 Pro Concept ( Logo cost extra) - 1 Pro Concepts + - Print Ready PDF files. 1 person details. Logo cost extra', '3 concepts included, Logo transparency, Vector file, Printable file, Include 3D mockup', 'ADVANCED', 3, 5, 0),
(17, 120000, 'HQ audio file (WAV format)', 'HQ audio file (WAV format)', 'BASIC', 1, 6, 0);

INSERT INTO `Subs` (`id`, `sub_name`, `child_type_id`, `isDeleted`) VALUES
(1, 'logo-design', 1, 0),
(2, 'brand-style-guides', 1, 0),
(3, 'business-cards-&-stationery', 1, 0),
(4, 'fonts-&-typography', 1, 0),
(5, 'logo-maker-tool', 1, 0),
(6, 'website-design', 2, 0),
(7, 'app-design', 2, 0),
(8, 'ux-design', 2, 0),
(9, 'landing-page-design', 2, 0),
(10, 'icon-design', 2, 0),
(11, 'image-editing', 3, 0),
(12, 'presentation-design', 3, 0),
(13, 'background-removal', 3, 0),
(14, 'vector-tracing', 3, 0),
(15, 'resume-design', 3, 0),
(16, 'architecture-&-interior-design', 4, 0),
(17, 'landscape-design', 4, 0),
(18, 'building-engineering', 4, 0),
(19, 'vector-tracing', 3, 0),
(20, 'business-websites', 7, 0),
(21, 'e-commerce-development', 7, 0),
(22, 'landing-pages', 7, 0),
(23, 'ai-chatbot', 8, 0),
(24, 'ai-applications', 8, 0),
(25, 'ai-integrations', 8, 0),
(26, 'ai-agents', 8, 0),
(27, 'cross-platform-development', 9, 0),
(28, 'android-app-development', 9, 0),
(29, 'ios-app-development', 9, 0),
(30, 'website-to-app', 9, 0),
(31, 'web-applications', 10, 0),
(32, 'desktop-applications', 10, 0),
(33, 'apis-&-integrations', 10, 0),
(34, 'scripting', 10, 0),
(35, 'search-engine-optimization-(seo)', 11, 0),
(36, 'search-engine-marketing-(sem)', 11, 0),
(37, 'local-seo', 11, 0),
(38, 'e-commerce-seo', 11, 0),
(39, 'video-marketing', 12, 0),
(40, 'e-commerce-marketing', 12, 0),
(41, 'email-marketing', 12, 0),
(42, 'email-automations', 12, 0),
(43, 'guest-posting', 12, 0),
(44, 'marketing-strategy', 13, 0),
(45, 'marketing-concepts-&-ideation', 13, 0),
(46, 'web-analytics', 13, 0),
(47, 'music-promotion', 14, 0),
(48, 'podcast-marketing', 14, 0),
(49, 'book-&-ebook-marketing', 14, 0),
(50, 'video-editing', 15, 0),
(51, 'visual-effects', 15, 0),
(52, 'video-templates-editing', 15, 0),
(53, 'subtitles-&-captions', 15, 0),
(54, 'character-animation', 16, 0),
(55, 'animated-gifs', 16, 0),
(56, 'animation-for-kids', 16, 0),
(57, 'animation-for-streamers', 16, 0),
(58, 'animated-explainers', 17, 0),
(59, 'live-action-explainers', 17, 0),
(60, 'spokesperson-videos', 17, 0),
(61, 'crowdfunding-videos', 17, 0),
(62, 'video-ads-&-commercials', 18, 0),
(63, 'social-media-videos', 18, 0),
(64, 'articles-&-blog-posts', 19, 0),
(65, 'website-content', 19, 0),
(66, 'scriptwriting', 19, 0),
(67, 'podcast-writing', 19, 0),
(68, 'book-&-ebook-writing', 20, 0),
(69, 'book-editing', 20, 0),
(70, 'beta-reading', 20, 0),
(71, 'brand-voice-&-tone', 21, 0),
(72, 'business-names-&-slogans', 21, 0),
(73, 'case-studies', 21, 0),
(74, 'white-papers', 21, 0),
(75, 'product-descriptions', 21, 0),
(76, 'sales-copy', 21, 0),
(77, 'translation', 22, 0),
(78, 'transcription', 22, 0),
(79, 'localization', 22, 0),
(80, 'ai-applications', 23, 0),
(81, 'ai-chatbot', 23, 0),
(82, 'ai-fine-tuning', 23, 0),
(83, 'ai-music-videos', 24, 0),
(84, 'ai-video-art', 24, 0),
(85, 'midjourney-artists', 25, 0),
(86, 'stable-diffusion-artists', 25, 0),
(87, 'music-producers', 26, 0),
(88, 'composers', 26, 0),
(89, 'singers-&-vocalists', 26, 0),
(90, 'songwriters', 26, 0),
(91, 'voice-over', 27, 0),
(92, 'female-voice-over', 27, 0),
(93, 'male-voice-over', 27, 0),
(94, 'podcast-production', 28, 0),
(95, 'audiobook-production', 28, 0),
(96, 'voice-synthesis-&-ai', 28, 0),
(97, 'virtual-assistant', 29, 0),
(98, 'project-management', 29, 0),
(99, 'hr-consulting', 29, 0),
(100, 'business-registration', 30, 0),
(101, 'business-plans', 30, 0),
(102, 'market-research', 30, 0),
(103, 'accounting-&-bookkeeping', 31, 0),
(104, 'tax-consulting', 31, 0),
(105, 'financial-consulting', 31, 0),
(106, 'sales', 32, 0),
(107, 'lead-generation', 32, 0),
(108, 'customer-care', 32, 0),
(109, 'legal-consulting', 33, 0),
(110, 'financial-consulting', 33, 0),
(111, 'business-consulting', 33, 0),
(112, 'hr-consulting', 33, 0),
(113, 'e-commerce-consulting', 33, 0),
(114, 'marketing-strategy', 34, 0),
(115, 'content-strategy', 34, 0),
(116, 'social-media-strategy', 34, 0),
(117, 'video-marketing-consulting', 34, 0),
(118, 'sem-strategy', 34, 0),
(119, 'career-counseling', 35, 0),
(120, 'life-coaching', 35, 0),
(121, 'game-coaching', 35, 0),
(122, 'styling-&-beauty-advice', 35, 0),
(123, 'data-analytics-consulting', 36, 0),
(124, 'databases-consulting', 36, 0),
(125, 'data-visualization-consulting', 36, 0);

INSERT INTO `Types` (`id`, `type_name`, `isDeleted`, `image`) VALUES
(1, 'graphics-&-design', 0, 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718559714/db_freelancer/qlaszfolivgjdwhjsykv.png'),
(2, 'programming-&-tech', 0, 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718607327/db_freelancer/vetdfxrvjmain717hdqm.png'),
(3, 'digital-marketing', 0, 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718607275/db_freelancer/b36e9ksrh9mrh7lk3hjn.png'),
(4, 'writing-&-translation', 0, 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718607175/db_freelancer/tramebsndfhij1x4ypu8.png'),
(5, 'video-&-animation', 0, 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718607138/db_freelancer/bbsfv1ajflnda052c1ej.png'),
(6, 'ai-services', 0, 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718607051/db_freelancer/n9xpnx6r9kifofbsipdp.png'),
(7, 'music-&-audio', 0, 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718606980/db_freelancer/svkustaedq3vahnohfhu.png'),
(8, 'business', 0, 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718606868/db_freelancer/kk6sgqmuis6m6lih1u8r.png'),
(9, 'consulting', 0, 'http://res.cloudinary.com/drfjok8d7/image/upload/v1718606806/db_freelancer/hgocr0rqwwcaimuy8foa.png');

INSERT INTO `Users` (`id`, `full_name`, `email`, `password`, `role`, `joinAt`, `isDeleted`, `isBlocked`, `avatar`, `facebook_app_id`, `google_app_id`, `token`, `account_balance`) VALUES
(2, 'khang-lien', 'chikhang11a18@gmail.com', '$2b$07$hrEv/W7MGVhRclJacotB3e6ziJpjvwU9TF6qb75KVM8K8l7TaLjMy', 'user', '2024-06-15', 0, 0, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE4NzE5MzI3LCJleHAiOjE3MTg3MTk0NDd9.4OLDgjRvLR_vJlL06PEgp5whQnxJLDw74cIBUUdCyzM', 0),
(3, 'khang-seller', 'chikhang12a18@gmail.com', '$2b$07$YEhSEO.9JJHz1BMXh6worOpsRdyqTLbMzb.gXlSM6SW04zIEhfa96', 'seller', '2024-06-16', 0, 0, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3MTg3MTk0MTIsImV4cCI6MTcxODcxOTUzMn0.TIur1tHXwTp362-mi5Z6UP6n6MC7Re0Xrln8HCWnHuI', 0),
(4, 'tom-seller', 'chikhang13a18@gmail.com', '$2b$07$51DoTpQXWOQUZUk/VmQSC.kk6XW67WtUzHxFV9UbDFXdj9xWNWo5S', 'seller', '2024-06-16', 0, 0, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3MTg2ODg4NDYsImV4cCI6MTcxODY4ODk2Nn0.LC_yOvnq4XOTPAGNSuXWPiS7LAWPcTUYlyBEuX09lVs', 0),
(5, 'daniel-seller', 'chikhang14a18@gmail.com', '$2b$07$ZQsapRWGdX0dpKml8ww05uMzSzPvRpb3gjfIAfR/sp5zoq8qOzKx2', 'seller', '2024-06-16', 0, 0, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3MTg3MDQwMTUsImV4cCI6MTcxODcwNDEzNX0.Ebt4kixJDB40Skr3RqSwXqwQ-D6uZb1zjr-FrwQTz9s', 0),
(6, 'tom-seller', 'chikhang15a18@gmail.com', '$2b$07$jAMcFaDHYqjGKT8ssN/Ta.ep61sowkErzcgJG85Dj8cHReaWziOkK', 'seller', '2024-06-16', 0, 0, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3MTg3MDQxNDQsImV4cCI6MTcxODcwNDI2NH0.8S3XvVxY8z7VEPM59D1K-z2LaguPvl2qbPy-WLEoPdU', 0),
(7, 'wesson-seller', 'chikhang156a18@gmail.com', '$2b$07$syyZgx.Q.dQiiZhKzlXm7OMx.LzWL2t4ntZDDHpp4zmuBKgLVFyR6', 'seller', '2024-06-17', 0, 0, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3MTg3MTkzMDYsImV4cCI6MTcxODcxOTQyNn0.JLfUgS-fDq5rK91kixsdywNIN861bjszC2DQlkpoUWw', 0),
(8, 'lien-chi-khang', 'admin@gmail.com', '$2b$07$iaeCv0DwAJFtSM6.DxXgbOq9v3Lparg.imnEq.iaoTURVJjRu7cqS', 'admin', '2024-06-17', 0, 0, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxODYwOTE3NCwiZXhwIjoxNzE4NjA5Mjk0fQ.20vHUtDsm00HgDvCXABQxdjNJYDx0z2SmIkwpmaw6dE', 0),
(9, 'alexandra', 'alexandra123@gmail.com', '$2b$07$Sq7WuFCmJcVornltrhXOweCwalpUWXn39SwpAvkS82iq7diRQ8mVy', 'seller', '2024-06-17', 0, 0, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3MTg3MDAyMjQsImV4cCI6MTcxODcwMDM0NH0.cUQJHNyKJb1yvXe4Ygxv6rIUss4itWvCxM5WevdspoU', 350000),
(10, 'abhi-c', 'abhic@gmail.com', '$2b$07$ivvOX1t0O6s.5elbFBN1kOAQOWPTTMhL1A3sL8YwIX8MjMkHGANBG', 'seller', '2024-06-17', 0, 0, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJyb2xlIjoic2VsbGVyIiwiaWF0IjoxNzE4Njk5OTc5LCJleHAiOjE3MTg3MDAwOTl9.pqfyXj4OXK-H_l__gKbp4HxomDzTyTjseDOZGTovxMc', 2320000),
(11, 'moana', 'test@gmail.com', '$2b$07$EUpaAJcnqEQ3Kh3PtRDu6uhyTFlnfLjer53w/ROa1vlzBunatJFC2', 'user', '2024-06-18', 0, 0, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJyb2xlIjoidXNlciIsImlhdCI6MTcxODcwMjcyOSwiZXhwIjoxNzE4NzAyODQ5fQ.wUPoTlS5owwco0kQ_8be--nfGcN5MHPc5CufwYVjJnM', 0),
(12, 'link-peaceful', 'khang@gmail.com', '$2b$07$t0vGHRaqkUgpE61eOKMlNuHo7ud8SW.jlau9ETVVulZ6syX8zILfm', 'user', '2024-06-18', 0, 0, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJyb2xlIjoidXNlciIsImlhdCI6MTcxODcwMjU2OCwiZXhwIjoxNzE4NzAyNjg4fQ.WgWG4Roups3ln6Cr2uP78eAMpLA7V7ao81zk4gFMnu8', 0);



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;