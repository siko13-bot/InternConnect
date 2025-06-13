-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2025 at 07:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `internship_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `account_type` enum('student','employer','admin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `account_type`, `created_at`) VALUES
(1, 'sikolethu', 'sikomkhabela@gmail.com', '$2y$10$PPeIv/c.fqehpxz/xQ/RNuOHfEQK2XewXOk8gCvtzgG4zR2yMEky6', 'student', '2025-05-27 16:36:39'),
(2, 'vusi', 'vusi@gmail.com', '$2y$10$5EhMllp6Do5VIt5LSHpLTuFoM.wckBeceJ4qKSdF3JHycxon3T/Pa', 'student', '2025-05-27 16:49:26'),
(3, 'admin', 'admin@gmail.com', '$2y$10$6/xdRe5E8HmzkEHMbS8Rh.IdYf6x6aEep9kq0M7XAF8FZ0UHQKYW2', 'admin', '2025-05-27 17:02:51'),
(4, 'company', 'company@gmail.com', '$2y$10$ykk4DLEfHPdoS39.yjsh5uIKW3r.YeAchVs3dzRfUwASti4Di9mQO', 'employer', '2025-05-27 17:12:24');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
