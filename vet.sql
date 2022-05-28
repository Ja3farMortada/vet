-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2022 at 03:05 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vet`
--

-- --------------------------------------------------------

--
-- Table structure for table `animals`
--

CREATE TABLE `animals` (
  `animal_ID` int(11) NOT NULL,
  `animal_name` varchar(50) NOT NULL,
  `species` varchar(100) NOT NULL,
  `breed` varchar(50) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `animal_status` tinyint(1) NOT NULL DEFAULT 1,
  `owner_name` varchar(50) DEFAULT NULL,
  `owner_phone` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `assets` int(11) NOT NULL,
  `dollar_assets` double NOT NULL DEFAULT 0,
  `exchange_rate` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `assets`
--

INSERT INTO `assets` (`assets`, `dollar_assets`, `exchange_rate`) VALUES
(0, 0, 27000);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_ID` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(15) DEFAULT NULL,
  `customer_address` varchar(20) DEFAULT NULL,
  `customer_debit` decimal(6,2) NOT NULL DEFAULT 0.00,
  `customer_status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `customer_payments`
--

CREATE TABLE `customer_payments` (
  `payment_ID` int(11) NOT NULL,
  `customer_ID_FK` int(11) NOT NULL,
  `payment_amount` float NOT NULL,
  `payment_date` date NOT NULL,
  `payment_time` time NOT NULL,
  `dollar_exchange` float NOT NULL,
  `payment_notes` varchar(50) DEFAULT NULL,
  `payment_status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `debts`
--

CREATE TABLE `debts` (
  `debt_ID` int(11) NOT NULL,
  `customer_ID_FK` int(11) NOT NULL,
  `item_type` varchar(10) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `amount` float NOT NULL,
  `remaining` float NOT NULL,
  `debt_date` date NOT NULL,
  `notes` varchar(100) DEFAULT NULL,
  `debt_status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `debts_payments`
--

CREATE TABLE `debts_payments` (
  `payment_ID` int(11) NOT NULL,
  `debt_ID_FK` int(11) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_time` time DEFAULT NULL,
  `payment_amount` int(11) NOT NULL,
  `payment_notes` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `invoice_ID` int(11) NOT NULL,
  `customer_ID_FK` int(11) DEFAULT NULL,
  `invoice_date` date NOT NULL,
  `invoice_time` time NOT NULL,
  `invoice_total_cost` double NOT NULL,
  `total_average_cost` double NOT NULL,
  `invoice_total_price` double NOT NULL,
  `dollar_exchange` float DEFAULT NULL,
  `invoice_status` tinyint(4) NOT NULL DEFAULT 1,
  `UID_FK` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_details`
--

CREATE TABLE `invoice_details` (
  `record_ID` int(11) NOT NULL,
  `invoice_ID_FK` int(11) NOT NULL,
  `item_ID_FK` int(11) NOT NULL,
  `supplier_ID_FK` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `cost` double NOT NULL,
  `average_cost` decimal(6,2) DEFAULT NULL,
  `price` double NOT NULL,
  `record_status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_ID` int(11) NOT NULL,
  `payment_title` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `payment_currency` varchar(10) CHARACTER SET utf8 NOT NULL DEFAULT 'lira',
  `category` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `notes` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE `reminders` (
  `reminder_ID` int(11) NOT NULL,
  `reminder_title` varchar(100) NOT NULL,
  `reminder_text` text DEFAULT NULL,
  `reminder_type` varchar(15) NOT NULL DEFAULT 'text',
  `due_date` date DEFAULT NULL,
  `due_time` time DEFAULT NULL,
  `repeat_reminder` varchar(10) DEFAULT NULL,
  `reminder_status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_ID` int(11) NOT NULL,
  `service_type` varchar(20) NOT NULL,
  `service_description` text DEFAULT NULL,
  `service_date` date NOT NULL,
  `service_time` time NOT NULL,
  `payment_received` float NOT NULL,
  `exchange_rate` float NOT NULL,
  `animal_ID_FK` int(11) NOT NULL,
  `service_status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `setting_ID` int(11) NOT NULL,
  `setting_name` varchar(50) NOT NULL,
  `value` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `IID` int(11) NOT NULL,
  `supplier_ID_FK` int(11) DEFAULT NULL,
  `item_name` varchar(100) DEFAULT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `item_qty` int(11) DEFAULT NULL,
  `minimum_qty` int(11) NOT NULL DEFAULT 0,
  `item_currency` varchar(10) NOT NULL,
  `item_cost` float DEFAULT NULL,
  `average_cost` decimal(6,2) DEFAULT 0.00,
  `item_price` float DEFAULT NULL,
  `notes` varchar(200) DEFAULT NULL,
  `is_hidden` tinyint(1) NOT NULL DEFAULT 0,
  `item_status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `supplier_ID` int(11) NOT NULL,
  `supplier_name` varchar(100) NOT NULL,
  `supplier_phone` varchar(15) DEFAULT NULL,
  `supplier_address` varchar(50) DEFAULT NULL,
  `supplier_debit` decimal(6,2) NOT NULL DEFAULT 0.00,
  `supplier_status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_payments`
--

CREATE TABLE `supplier_payments` (
  `payment_ID` int(11) NOT NULL,
  `supplier_ID_FK` int(11) NOT NULL,
  `payment_amount` double NOT NULL,
  `payment_date` date NOT NULL,
  `payment_time` time NOT NULL,
  `dollar_exchange` float NOT NULL,
  `payment_notes` varchar(50) DEFAULT NULL,
  `payment_status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `supply_invoice`
--

CREATE TABLE `supply_invoice` (
  `record_ID` int(11) NOT NULL,
  `supplier_ID_FK` int(11) DEFAULT NULL,
  `record_date` date NOT NULL,
  `record_time` time NOT NULL,
  `total_cost` double NOT NULL,
  `dollar_exchange` float DEFAULT NULL,
  `record_status` tinyint(1) NOT NULL DEFAULT 1,
  `UID_FK` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `supply_invoice_map`
--

CREATE TABLE `supply_invoice_map` (
  `record_ID` int(11) NOT NULL,
  `invoice_ID_FK` int(11) NOT NULL,
  `item_ID_FK` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `cost` double NOT NULL,
  `currency` varchar(10) NOT NULL,
  `record_status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- Table structure for table `treatments`
--

CREATE TABLE `treatments` (
  `treatment_ID` int(11) NOT NULL,
  `treatment_type` varchar(20) NOT NULL,
  `treatment_description` text NOT NULL,
  `treatment_date` date NOT NULL,
  `treatment_time` time NOT NULL,
  `payment_received` float(20,0) NOT NULL,
  `exchange_rate` float(10,0) NOT NULL,
  `animal_ID_FK` int(10) NOT NULL,
  `treatment_status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UID` int(11) NOT NULL,
  `username` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'user',
  `owner` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `canAddService` tinyint(1) NOT NULL DEFAULT 0,
  `canAddItem` tinyint(1) NOT NULL DEFAULT 0,
  `canViewCustomers` tinyint(1) NOT NULL DEFAULT 0,
  `canViewPayments` tinyint(1) NOT NULL DEFAULT 0,
  `user_status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UID`, `username`, `password`, `type`, `owner`, `canAddService`, `canAddItem`, `canViewCustomers`, `canViewPayments`, `user_status`) VALUES
(1, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'admin', 'admin', 1, 1, 1, 1, 1),
(2, 'user', 'ee11cbb19052e40b07aac0ca060c23ee', 'user', 'user', 1, 1, 1, 0, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `animals`
--
ALTER TABLE `animals`
  ADD PRIMARY KEY (`animal_ID`) USING BTREE;

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_ID`) USING BTREE;

--
-- Indexes for table `customer_payments`
--
ALTER TABLE `customer_payments`
  ADD PRIMARY KEY (`payment_ID`) USING BTREE,
  ADD KEY `customer_ID_FK` (`customer_ID_FK`) USING BTREE;

--
-- Indexes for table `debts`
--
ALTER TABLE `debts`
  ADD PRIMARY KEY (`debt_ID`) USING BTREE,
  ADD KEY `customer_ID_FK` (`customer_ID_FK`) USING BTREE;

--
-- Indexes for table `debts_payments`
--
ALTER TABLE `debts_payments`
  ADD PRIMARY KEY (`payment_ID`) USING BTREE,
  ADD KEY `debt_ID_FK` (`debt_ID_FK`) USING BTREE;

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`invoice_ID`) USING BTREE,
  ADD KEY `customer_ID_FK` (`customer_ID_FK`) USING BTREE,
  ADD KEY `UID_FK` (`UID_FK`) USING BTREE;

--
-- Indexes for table `invoice_details`
--
ALTER TABLE `invoice_details`
  ADD PRIMARY KEY (`record_ID`) USING BTREE,
  ADD KEY `inv_det_IID` (`item_ID_FK`) USING BTREE,
  ADD KEY `inv_id` (`invoice_ID_FK`) USING BTREE;

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_ID`) USING BTREE;

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`reminder_ID`) USING BTREE;

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_ID`),
  ADD KEY `services_ibfk_1` (`animal_ID_FK`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`setting_ID`) USING BTREE;

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`IID`) USING BTREE;

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`supplier_ID`) USING BTREE;

--
-- Indexes for table `supplier_payments`
--
ALTER TABLE `supplier_payments`
  ADD PRIMARY KEY (`payment_ID`) USING BTREE,
  ADD KEY `supplier_ID_FK` (`supplier_ID_FK`) USING BTREE;

--
-- Indexes for table `supply_invoice`
--
ALTER TABLE `supply_invoice`
  ADD PRIMARY KEY (`record_ID`) USING BTREE;

--
-- Indexes for table `supply_invoice_map`
--
ALTER TABLE `supply_invoice_map`
  ADD PRIMARY KEY (`record_ID`) USING BTREE;

--
-- Indexes for table `treatments`
--
ALTER TABLE `treatments`
  ADD PRIMARY KEY (`treatment_ID`),
  ADD KEY `animal_ID_FK` (`animal_ID_FK`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UID`) USING BTREE,
  ADD UNIQUE KEY `username` (`username`) USING BTREE,
  ADD UNIQUE KEY `username_2` (`username`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `animals`
--
ALTER TABLE `animals`
  MODIFY `animal_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer_payments`
--
ALTER TABLE `customer_payments`
  MODIFY `payment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `debts`
--
ALTER TABLE `debts`
  MODIFY `debt_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `debts_payments`
--
ALTER TABLE `debts_payments`
  MODIFY `payment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice_details`
--
ALTER TABLE `invoice_details`
  MODIFY `record_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `reminder_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `setting_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `IID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `supplier_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_payments`
--
ALTER TABLE `supplier_payments`
  MODIFY `payment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supply_invoice`
--
ALTER TABLE `supply_invoice`
  MODIFY `record_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supply_invoice_map`
--
ALTER TABLE `supply_invoice_map`
  MODIFY `record_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `treatments`
--
ALTER TABLE `treatments`
  MODIFY `treatment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer_payments`
--
ALTER TABLE `customer_payments`
  ADD CONSTRAINT `customer_payments_ibfk_1` FOREIGN KEY (`customer_ID_FK`) REFERENCES `customers` (`customer_ID`);

--
-- Constraints for table `debts`
--
ALTER TABLE `debts`
  ADD CONSTRAINT `debts_ibfk_1` FOREIGN KEY (`customer_ID_FK`) REFERENCES `customers` (`customer_ID`);

--
-- Constraints for table `debts_payments`
--
ALTER TABLE `debts_payments`
  ADD CONSTRAINT `debts_payments_ibfk_1` FOREIGN KEY (`debt_ID_FK`) REFERENCES `debts` (`debt_ID`);

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`customer_ID_FK`) REFERENCES `customers` (`customer_ID`),
  ADD CONSTRAINT `invoice_ibfk_2` FOREIGN KEY (`UID_FK`) REFERENCES `users` (`UID`);

--
-- Constraints for table `invoice_details`
--
ALTER TABLE `invoice_details`
  ADD CONSTRAINT `invoice_details_ibfk_1` FOREIGN KEY (`item_ID_FK`) REFERENCES `stock` (`IID`),
  ADD CONSTRAINT `invoice_details_ibfk_2` FOREIGN KEY (`invoice_ID_FK`) REFERENCES `invoice` (`invoice_ID`);

--
-- Constraints for table `supplier_payments`
--
ALTER TABLE `supplier_payments`
  ADD CONSTRAINT `supplier_payments_ibfk_1` FOREIGN KEY (`supplier_ID_FK`) REFERENCES `suppliers` (`supplier_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
