-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 17, 2026 at 11:04 AM
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `library_mgt`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text,
  `quantity_total` int(11) NOT NULL DEFAULT '1',
  `quantity_available` int(11) NOT NULL DEFAULT '1',
  `qr_code` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `category`, `description`, `quantity_total`, `quantity_available`, `qr_code`, `created_at`, `updated_at`) VALUES
(2, 'Clean Code', 'Robert C. Martin', 'Software Engineering', 'A handbook of agile software craftsmanship', 3, 1, 'BOOK-5348b13b-f408-437e-9dd6-41fb75bceb72', '2025-12-13 15:20:09', '2025-12-22 13:06:30'),
(13, 'Clean Architecture', 'Robert C. Martin', 'Software Engineering', 'A guide to building maintainable and scalable software systems', 4, 4, 'BOOK-56569b4d-f6ec-4d7d-96e6-57a8e247bf7c', '2025-12-18 21:10:45', '2025-12-18 21:10:45'),
(14, 'Introduction to Algorithms', 'Thomas H. Cormen', 'Computer Science', 'Comprehensive textbook covering modern algorithms', 5, 5, 'BOOK-2540d0ba-5df5-4edd-bc4d-62e1b5bd5659', '2025-12-18 21:11:17', '2025-12-18 21:11:17'),
(15, 'Design Patterns', 'Erich Gamma', 'Software Engineering', 'Elements of reusable object-oriented software', 2, 1, 'BOOK-9b706032-cae6-41bb-aa80-c1d1b9d21826', '2025-12-18 21:11:26', '2025-12-20 13:53:52'),
(16, 'You Don''t Know JS', 'Kyle Simpson', 'Web Development', 'Deep dive into the core mechanisms of JavaScript', 6, 6, 'BOOK-647d2c14-379f-4eb9-805c-778868d40bca', '2025-12-18 21:11:41', '2025-12-18 21:11:41'),
(17, 'The Pragmatic Programmer', 'Andrew Hunt', 'Software Engineering', 'Journey to mastery for modern software developers', 3, 3, 'BOOK-cafa6899-b3a4-47a7-994c-a30a09975cd3', '2025-12-18 21:11:50', '2025-12-18 21:11:50'),
(18, 'Database System Concepts', 'Abraham Silberschatz', 'Databases', 'Fundamentals of database systems and design', 4, 4, 'BOOK-483db4d3-a48c-4648-877b-e93cc995938f', '2025-12-18 21:12:00', '2025-12-18 21:12:00'),
(19, 'Operating System Concepts', 'Abraham Silberschatz', 'Computer Science', 'Introduction to operating system principles and design', 5, 5, 'BOOK-2c228061-4d11-4822-8817-a6a878f2df61', '2025-12-18 21:12:09', '2025-12-18 21:12:09'),
(20, 'Refactoring', 'Martin Fowler', 'Software Engineering', 'Improving the design of existing code', 3, 3, 'BOOK-8fabfcde-388d-4148-b7d3-3c65948cea10', '2025-12-18 21:12:19', '2025-12-18 21:12:19'),
(21, 'Computer Networks', 'Andrew S. Tanenbaum', 'Networking', 'Detailed explanation of computer networking concepts', 4, 4, 'BOOK-7c8ea715-84e8-4eda-b71c-58cc8011e822', '2025-12-18 21:12:28', '2026-01-17 02:48:40'),
(22, 'Artificial Intelligence: A Modern Approach', 'Stuart Russell', 'Artificial Intelligence', 'Comprehensive introduction to artificial intelligence', 2, 2, 'BOOK-a0503d43-4982-4ef8-a480-30a14860874c', '2025-12-18 21:12:40', '2025-12-18 21:12:40'),
(27, 'Itdtx', 'Tdry', 'Djttj', 'Xcykcg', 2, 2, 'BOOK-b188c605-0e04-4798-b0f5-b4c308de73fa', '2025-12-20 14:15:02', '2025-12-20 14:15:02'),
(28, '6iftxt', 'Ycgckgc', 'Fkyckc', 'Ffychgjfi', 2, 2, 'BOOK-64085241-2a77-4d93-a6fe-b3f2e80d3009', '2025-12-20 14:17:30', '2025-12-20 14:17:30'),
(31, 'Hssjdnddn', 'Jsejej', 'Jsjej', 'Ejejskdjdh', 2, 2, 'BOOK-5ce5e8cb-247d-4570-9f9e-d40f6696bbc5', '2025-12-20 15:16:54', '2025-12-20 15:16:54');

-- --------------------------------------------------------

--
-- Table structure for table `borrow_records`
--

CREATE TABLE `borrow_records` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `borrowed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `due_date` datetime DEFAULT NULL,
  `returned_at` datetime DEFAULT NULL,
  `status` enum('borrowed','returned','overdue') DEFAULT 'borrowed'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `borrow_records`
--

INSERT INTO `borrow_records` (`id`, `user_id`, `book_id`, `borrowed_at`, `due_date`, `returned_at`, `status`) VALUES
(1, 2, 2, '2025-12-13 16:01:09', '2025-12-27 16:01:09', '2025-12-13 16:24:08', 'returned'),
(2, 2, 2, '2025-12-13 17:30:34', '2025-12-27 17:30:34', '2025-12-13 17:31:52', 'returned'),
(3, 2, 2, '2025-12-13 17:32:46', '2025-12-27 17:32:46', '2025-12-13 17:33:00', 'returned'),
(4, 6, 2, '2025-12-19 03:30:44', '2026-01-02 03:30:44', '2025-12-19 03:31:04', 'returned'),
(5, 6, 2, '2025-12-19 11:11:28', '2026-01-02 11:11:28', '2025-12-19 11:36:51', 'returned'),
(6, 6, 2, '2025-12-19 11:36:58', '2026-01-02 11:36:58', '2025-12-19 11:45:40', 'returned'),
(7, 6, 2, '2025-12-19 11:45:49', '2026-01-02 11:45:49', '2025-12-19 11:45:57', 'returned'),
(8, 6, 2, '2025-12-19 13:09:42', '2026-01-02 13:09:42', '2025-12-20 02:45:36', 'returned'),
(9, 5, 2, '2025-12-20 02:23:03', '2026-01-03 02:23:03', '2025-12-20 02:40:31', 'returned'),
(10, 5, 2, '2025-12-20 02:45:02', '2026-01-03 02:45:02', NULL, 'borrowed'),
(11, 6, 2, '2025-12-20 02:45:46', '2026-01-03 02:45:46', '2025-12-20 02:45:50', 'returned'),
(12, 6, 2, '2025-12-20 02:45:53', '2026-01-03 02:45:53', '2025-12-20 02:45:57', 'returned'),
(13, 6, 2, '2025-12-20 02:48:14', '2026-01-03 02:48:14', '2025-12-20 02:48:18', 'returned'),
(14, 6, 2, '2025-12-20 02:48:22', '2026-01-03 02:48:22', '2025-12-20 02:48:25', 'returned'),
(15, 6, 2, '2025-12-20 02:48:29', '2026-01-03 02:48:29', '2025-12-20 02:48:32', 'returned'),
(16, 6, 2, '2025-12-20 02:48:35', '2026-01-03 02:48:35', '2025-12-20 02:48:39', 'returned'),
(17, 6, 2, '2025-12-20 02:48:42', '2026-01-03 02:48:42', '2025-12-20 02:48:46', 'returned'),
(18, 6, 15, '2025-12-20 13:53:23', '2026-01-03 13:53:23', '2025-12-20 13:53:44', 'returned'),
(19, 6, 15, '2025-12-20 13:53:52', '2026-01-03 13:53:52', NULL, 'borrowed'),
(20, 6, 2, '2025-12-22 13:06:30', '2026-01-05 13:06:30', NULL, 'borrowed'),
(21, 6, 21, '2026-01-17 02:48:19', '2026-01-31 02:48:19', '2026-01-17 02:48:40', 'returned');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
(1, 'John Doe', 'john@example.com', '$2b$10$NOGu1gCPmn01EKzd1WWVF.l5xDewsL6ntcdO/efoo4Ketnwdghbjq', 'user', '2025-12-13 02:23:17', '2025-12-13 02:23:17'),
(2, 'Super Admin', 'admin@library.com', '$2b$10$BhZTZgjN.g3VBdqIXKcLnuCUkBXlilCuDCYH5HMKZHBvfdXT/FJaq', 'admin', '2025-12-13 02:35:49', '2025-12-21 14:53:32'),
(5, 'User2', 'user2@gmail.com', '$2b$10$aQygvGq9KTifTZiTPV4EI./QBQd5keQVU4/CxTiiPteNgcU/IGWau', 'user', '2025-12-18 20:25:52', '2025-12-18 20:25:52'),
(6, 'User One', 'user@gmail.com', '$2b$10$756kFx8ld8kPq5acOSqlSePOUWcjXi0.9KCG9YgGmmGRZ3n3dxLFy', 'user', '2025-12-18 20:30:41', '2025-12-21 03:40:41'),
(7, 'Second Admin', 'admin2@library.com', '$2b$10$rCvwDzrqf0DkNxZPk.YqNuVucKiT8oqAmXtoYjWBuBQfqBfbzhgTe', 'admin', '2025-12-18 20:32:27', '2025-12-26 12:59:07'),
(13, 'Bala Tanko', 'bala@gmail.com', '$2b$10$1YVFv8EV9XinuhrkOiZiwug.qkkAGJcBcd7T9EDuKzNBG7wbHV9K.', 'user', '2025-12-20 05:49:49', '2025-12-20 05:49:49'),
(14, 'Ahmadu Tanko', 'ahmadt@gmail.com', '$2b$10$HUltef9RGkn7B4QwwHlrbecLUka3YtRkwuQc8JyB2/gBaUoAbouNy', 'admin', '2025-12-21 14:05:46', '2025-12-21 14:05:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `qr_code` (`qr_code`);

--
-- Indexes for table `borrow_records`
--
ALTER TABLE `borrow_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `borrow_records`
--
ALTER TABLE `borrow_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `borrow_records`
--
ALTER TABLE `borrow_records`
  ADD CONSTRAINT `borrow_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `borrow_records_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
