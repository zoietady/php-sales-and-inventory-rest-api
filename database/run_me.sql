-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 14, 2021 at 01:30 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `software project final`
--

-- --------------------------------------------------------

--
-- Table structure for table `authenticationtable`
--

DROP TABLE IF EXISTS authenticationtable;
DROP TABLE IF EXISTS productinformationtable;

DROP TABLE IF EXISTS productinventorytable;
DROP TABLE IF EXISTS recievingtable;

DROP TABLE IF EXISTS salesordertable;
DROP TABLE IF EXISTS supplierinformationtable;

CREATE TABLE `authenticationtable` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `admin` boolean NOT NULL,
  `password` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `authenticationtable`
--

INSERT INTO `authenticationtable` (`user_id`, `password`, `first_name`, `last_name`, `admin`) VALUES
(1, '$2b$10$0ynj8tx05yxmrx6cFbhphOe1iKmxmrjOxR.Lw85IfI7wsQ.eDDf0G', 'admin', 'super', true);

-- --------------------------------------------------------

--
-- Table structure for table `productinformationtable`
--

CREATE TABLE `productinformationtable` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `product_group` varchar(50) NOT NULL,
  `product_description` varchar(50) NOT NULL,
  `product_price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `productinformationtable`
--

INSERT INTO `productinformationtable` (`product_id`, `product_name`, `product_group`, `product_description`, `product_price`) VALUES
(1, 'MedicineTest1', 'MedicineGroupTest1', 'This is medicine', 4.99),
(2, 'MedicineTest1', 'MedicineGroupTest1', 'This is medicine', 4.99),
(3, 'MedicineTest1', 'MedicineGroupTest1', 'This is medicine', 4.99);

-- --------------------------------------------------------

--
-- Table structure for table `productinventorytable`
--

CREATE TABLE `productinventorytable` (
  `update_index` int(10) UNSIGNED NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `current_stock` int(11) NOT NULL,
  `max_stock_capacity` int(11) NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `productinventorytable`
--

INSERT INTO `productinventorytable` (`update_index`, `product_id`, `current_stock`, `max_stock_capacity`, `date_time`) VALUES
(2, 2, 0, 0, '2021-09-14 11:24:51'),
(3, 2, 0, 0, '2021-09-14 11:25:05');

-- --------------------------------------------------------

--
-- Table structure for table `recievingtable`
--

CREATE TABLE `recievingtable` (
  `recieving_id` int(10) UNSIGNED NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `delivery_date` date NOT NULL,
  `product_price` float NOT NULL,
  `quantity` int(11) NOT NULL,
  `arrived` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `recievingtable`
--

INSERT INTO `recievingtable` (`recieving_id`, `supplier_id`, `product_id`, `delivery_date`, `product_price`, `quantity`, `arrived`) VALUES
(3, 1, 2, '2021-09-14', 1.25, 4000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `salesordertable`
--

CREATE TABLE `salesordertable` (
  `sales_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity_sold` int(11) NOT NULL,
  `date_time` date NOT NULL,
  `dispatched` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `salesordertable`
--

INSERT INTO `salesordertable` (`sales_id`, `product_id`, `quantity_sold`, `date_time`, `dispatched`) VALUES
(1, 2, 50, '2021-09-14', 1);

-- --------------------------------------------------------

--
-- Table structure for table `supplierinformationtable`
--

CREATE TABLE `supplierinformationtable` (
  `supplier_id` int(11) NOT NULL,
  `supplier_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `supplierinformationtable`
--

INSERT INTO `supplierinformationtable` (`supplier_id`, `supplier_name`) VALUES
(1, 'SupplierTest1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authenticationtable`
--
ALTER TABLE `authenticationtable`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `productinformationtable`
--
ALTER TABLE `productinformationtable`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `productinventorytable`
--
ALTER TABLE `productinventorytable`
  ADD PRIMARY KEY (`update_index`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `recievingtable`
--
ALTER TABLE `recievingtable`
  ADD PRIMARY KEY (`recieving_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `salesordertable`
--
ALTER TABLE `salesordertable`
  ADD PRIMARY KEY (`sales_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `supplierinformationtable`
--
ALTER TABLE `supplierinformationtable`
  ADD PRIMARY KEY (`supplier_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `authenticationtable`
--
ALTER TABLE `authenticationtable`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `productinformationtable`
--
ALTER TABLE `productinformationtable`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `productinventorytable`
--
ALTER TABLE `productinventorytable`
  MODIFY `update_index` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `recievingtable`
--
ALTER TABLE `recievingtable`
  MODIFY `recieving_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `salesordertable`
--
ALTER TABLE `salesordertable`
  MODIFY `sales_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `supplierinformationtable`
--
ALTER TABLE `supplierinformationtable`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `productinventorytable`
--
ALTER TABLE `productinventorytable`
  ADD CONSTRAINT `productinventorytable_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `productinformationtable` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `recievingtable`
--
ALTER TABLE `recievingtable`
  ADD CONSTRAINT `recievingtable_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplierinformationtable` (`supplier_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recievingtable_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `productinformationtable` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `salesordertable`
--
ALTER TABLE `salesordertable`
  ADD CONSTRAINT `salesordertable_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `productinformationtable` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
