/*
 Navicat Premium Data Transfer

 Source Server         : MySQL
 Source Server Type    : MySQL
 Source Server Version : 80026
 Source Host           : localhost:3306
 Source Schema         : vet

 Target Server Type    : MySQL
 Target Server Version : 80026
 File Encoding         : 65001

 Date: 25/05/2022 01:07:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for animals
-- ----------------------------
DROP TABLE IF EXISTS `animals`;
CREATE TABLE `animals`  (
  `animal_ID` int(0) NOT NULL AUTO_INCREMENT,
  `animal_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `species` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `breed` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `birthdate` date NULL DEFAULT NULL,
  `gender` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `notes` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `animal_status` tinyint(1) NOT NULL DEFAULT 1,
  `owner_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone_number` int(0) NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`animal_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of animals
-- ----------------------------
INSERT INTO `animals` VALUES (1, 'Max', 'dog', 'German Sheperd', '2021-10-01', 'male', 'testing notes', 1, 'ali hamdan', 3985654, 'Haris');
INSERT INTO `animals` VALUES (2, 'Jack', 'dog', 'Huskey', '2019-12-04', 'male', NULL, 0, 'hadi', 81455873, 'test');
INSERT INTO `animals` VALUES (3, 'new settings', 'dog', 'Huskey', '2022-05-11', 'male', 'test', 1, 'new owner', 234234234, 'test');
INSERT INTO `animals` VALUES (4, 'testing', 'dog', 'testing', '2022-05-18', 'male', NULL, 0, 'test', 213123123, NULL);
INSERT INTO `animals` VALUES (5, 'test', 'cat', 'test', '2022-05-25', 'female', NULL, 0, 'test', 1235258, 'test');
INSERT INTO `animals` VALUES (6, 'test', 'dog', 'test', '2022-05-10', 'female', NULL, 0, 'test', 123123123, NULL);
INSERT INTO `animals` VALUES (7, 'test', 'cat', 'tauson', '2022-05-10', 'female', NULL, 1, 'test', 23234, NULL);
INSERT INTO `animals` VALUES (8, 'biso', 'dog', 'test', '2022-05-03', 'female', NULL, 1, 'hadi', 123123, NULL);
INSERT INTO `animals` VALUES (9, 'testing date', 'cat', 'tiger', '2022-04-25', 'female', NULL, 0, 'test', 8988998, NULL);
INSERT INTO `animals` VALUES (10, 'testing delete', 'dog', 'test', '2022-05-21', 'male', NULL, 1, 'test', 234234, NULL);
INSERT INTO `animals` VALUES (11, 'test', 'dog', 'test', '2022-05-21', NULL, NULL, 0, 'test', 123123123, NULL);
INSERT INTO `animals` VALUES (12, 'Keto', 'dog', 'Shiba', '2021-06-01', 'female', NULL, 1, 'Hadi', 78880958, 'test');

-- ----------------------------
-- Table structure for assets
-- ----------------------------
DROP TABLE IF EXISTS `assets`;
CREATE TABLE `assets`  (
  `assets` int(0) NOT NULL,
  `dollar_assets` double NOT NULL DEFAULT 0,
  `exchange_rate` float NOT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of assets
-- ----------------------------
INSERT INTO `assets` VALUES (0, 0, 27000);

-- ----------------------------
-- Table structure for customer_payments
-- ----------------------------
DROP TABLE IF EXISTS `customer_payments`;
CREATE TABLE `customer_payments`  (
  `payment_ID` int(0) NOT NULL AUTO_INCREMENT,
  `customer_ID_FK` int(0) NOT NULL,
  `payment_amount` float NOT NULL,
  `payment_date` date NOT NULL,
  `payment_time` time(0) NOT NULL,
  `dollar_exchange` float NOT NULL,
  `payment_notes` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `payment_status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`payment_ID`) USING BTREE,
  INDEX `customer_ID_FK`(`customer_ID_FK`) USING BTREE,
  CONSTRAINT `customer_payments_ibfk_1` FOREIGN KEY (`customer_ID_FK`) REFERENCES `customers` (`customer_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for customers
-- ----------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers`  (
  `customer_ID` int(0) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `customer_phone` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `customer_address` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `customer_debit` decimal(6, 2) NOT NULL DEFAULT 0.00,
  `customer_status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`customer_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for debts
-- ----------------------------
DROP TABLE IF EXISTS `debts`;
CREATE TABLE `debts`  (
  `debt_ID` int(0) NOT NULL AUTO_INCREMENT,
  `customer_ID_FK` int(0) NOT NULL,
  `item_type` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `item_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `amount` float NOT NULL,
  `remaining` float NOT NULL,
  `debt_date` date NOT NULL,
  `notes` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `debt_status` tinyint(1) NOT NULL,
  PRIMARY KEY (`debt_ID`) USING BTREE,
  INDEX `customer_ID_FK`(`customer_ID_FK`) USING BTREE,
  CONSTRAINT `debts_ibfk_1` FOREIGN KEY (`customer_ID_FK`) REFERENCES `customers` (`customer_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for debts_payments
-- ----------------------------
DROP TABLE IF EXISTS `debts_payments`;
CREATE TABLE `debts_payments`  (
  `payment_ID` int(0) NOT NULL AUTO_INCREMENT,
  `debt_ID_FK` int(0) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_time` time(0) NULL DEFAULT NULL,
  `payment_amount` int(0) NOT NULL,
  `payment_notes` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`payment_ID`) USING BTREE,
  INDEX `debt_ID_FK`(`debt_ID_FK`) USING BTREE,
  CONSTRAINT `debts_payments_ibfk_1` FOREIGN KEY (`debt_ID_FK`) REFERENCES `debts` (`debt_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for doctor_payments
-- ----------------------------
DROP TABLE IF EXISTS `doctor_payments`;
CREATE TABLE `doctor_payments`  (
  `payment_ID` int(0) NOT NULL AUTO_INCREMENT,
  `doctor_ID_FK` int(0) NOT NULL,
  `payment_amount` double NOT NULL,
  `payment_date` date NOT NULL,
  `payment_time` time(0) NOT NULL,
  `dollar_exchange` double NOT NULL,
  `payment_notes` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `payment_status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`payment_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for doctors
-- ----------------------------
DROP TABLE IF EXISTS `doctors`;
CREATE TABLE `doctors`  (
  `doctor_ID` int(0) NOT NULL AUTO_INCREMENT,
  `doctor_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `doctor_phone` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `doctor_address` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `doctor_debit` decimal(8, 2) NOT NULL DEFAULT 0.00,
  `doctor_status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`doctor_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for film_invoice
-- ----------------------------
DROP TABLE IF EXISTS `film_invoice`;
CREATE TABLE `film_invoice`  (
  `record_ID` int(0) NOT NULL AUTO_INCREMENT,
  `doctor_ID_FK` int(0) NULL DEFAULT NULL,
  `customer_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `record_date` date NOT NULL,
  `record_time` time(0) NOT NULL,
  `doctor_fee` double NULL DEFAULT NULL,
  `record_value` double NOT NULL,
  `record_status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`record_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for invoice
-- ----------------------------
DROP TABLE IF EXISTS `invoice`;
CREATE TABLE `invoice`  (
  `invoice_ID` int(0) NOT NULL AUTO_INCREMENT,
  `customer_ID_FK` int(0) NULL DEFAULT NULL,
  `invoice_date` date NOT NULL,
  `invoice_time` time(0) NOT NULL,
  `invoice_total_cost` double NOT NULL,
  `total_average_cost` double NOT NULL,
  `invoice_total_price` double NOT NULL,
  `dollar_exchange` float NULL DEFAULT NULL,
  `invoice_status` tinyint(0) NOT NULL DEFAULT 1,
  `UID_FK` int(0) NOT NULL,
  PRIMARY KEY (`invoice_ID`) USING BTREE,
  INDEX `customer_ID_FK`(`customer_ID_FK`) USING BTREE,
  INDEX `UID_FK`(`UID_FK`) USING BTREE,
  CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`customer_ID_FK`) REFERENCES `customers` (`customer_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `invoice_ibfk_2` FOREIGN KEY (`UID_FK`) REFERENCES `users` (`UID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for invoice_details
-- ----------------------------
DROP TABLE IF EXISTS `invoice_details`;
CREATE TABLE `invoice_details`  (
  `record_ID` int(0) NOT NULL AUTO_INCREMENT,
  `invoice_ID_FK` int(0) NOT NULL,
  `item_ID_FK` int(0) NOT NULL,
  `supplier_ID_FK` int(0) NULL DEFAULT NULL,
  `quantity` int(0) NOT NULL,
  `cost` double NOT NULL,
  `average_cost` decimal(6, 2) NULL DEFAULT NULL,
  `price` double NOT NULL,
  `record_status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`record_ID`) USING BTREE,
  INDEX `inv_det_IID`(`item_ID_FK`) USING BTREE,
  INDEX `inv_id`(`invoice_ID_FK`) USING BTREE,
  CONSTRAINT `invoice_details_ibfk_1` FOREIGN KEY (`item_ID_FK`) REFERENCES `stock` (`IID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `invoice_details_ibfk_2` FOREIGN KEY (`invoice_ID_FK`) REFERENCES `invoice` (`invoice_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for payments
-- ----------------------------
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments`  (
  `payment_ID` int(0) NOT NULL AUTO_INCREMENT,
  `payment_title` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `payment_currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'lira',
  `category` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `amount` int(0) NOT NULL,
  `date` date NOT NULL,
  `time` time(0) NOT NULL,
  `notes` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`payment_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for reminders
-- ----------------------------
DROP TABLE IF EXISTS `reminders`;
CREATE TABLE `reminders`  (
  `reminder_ID` int(0) NOT NULL AUTO_INCREMENT,
  `reminder_title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `reminder_text` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `reminder_type` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'text',
  `due_date` date NULL DEFAULT NULL,
  `due_time` time(0) NULL DEFAULT NULL,
  `repeat_reminder` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `reminder_status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`reminder_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for settings
-- ----------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings`  (
  `setting_ID` int(0) NOT NULL AUTO_INCREMENT,
  `setting_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `value` bigint(0) NOT NULL,
  PRIMARY KEY (`setting_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for stock
-- ----------------------------
DROP TABLE IF EXISTS `stock`;
CREATE TABLE `stock`  (
  `IID` int(0) NOT NULL AUTO_INCREMENT,
  `supplier_ID_FK` int(0) NULL DEFAULT NULL,
  `item_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `barcode` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `item_qty` int(0) NULL DEFAULT NULL,
  `minimum_qty` int(0) NOT NULL DEFAULT 0,
  `item_currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `item_cost` float NULL DEFAULT NULL,
  `average_cost` decimal(6, 2) NULL DEFAULT 0.00,
  `item_price` float NULL DEFAULT NULL,
  `notes` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `is_hidden` tinyint(1) NOT NULL DEFAULT 0,
  `item_status` tinyint(1) NOT NULL,
  PRIMARY KEY (`IID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of stock
-- ----------------------------
INSERT INTO `stock` VALUES (4, NULL, 'test', '123', 5, 4, 'dollar', 10, 10.00, 20, NULL, 0, 1);

-- ----------------------------
-- Table structure for supplier_payments
-- ----------------------------
DROP TABLE IF EXISTS `supplier_payments`;
CREATE TABLE `supplier_payments`  (
  `payment_ID` int(0) NOT NULL AUTO_INCREMENT,
  `supplier_ID_FK` int(0) NOT NULL,
  `payment_amount` double NOT NULL,
  `payment_date` date NOT NULL,
  `payment_time` time(0) NOT NULL,
  `dollar_exchange` float NOT NULL,
  `payment_notes` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `payment_status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`payment_ID`) USING BTREE,
  INDEX `supplier_ID_FK`(`supplier_ID_FK`) USING BTREE,
  CONSTRAINT `supplier_payments_ibfk_1` FOREIGN KEY (`supplier_ID_FK`) REFERENCES `suppliers` (`supplier_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for suppliers
-- ----------------------------
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers`  (
  `supplier_ID` int(0) NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `supplier_phone` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `supplier_address` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `supplier_debit` decimal(6, 2) NOT NULL DEFAULT 0.00,
  `supplier_status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`supplier_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for supply_invoice
-- ----------------------------
DROP TABLE IF EXISTS `supply_invoice`;
CREATE TABLE `supply_invoice`  (
  `record_ID` int(0) NOT NULL AUTO_INCREMENT,
  `supplier_ID_FK` int(0) NULL DEFAULT NULL,
  `record_date` date NOT NULL,
  `record_time` time(0) NOT NULL,
  `total_cost` double NOT NULL,
  `dollar_exchange` float NULL DEFAULT NULL,
  `record_status` tinyint(1) NOT NULL DEFAULT 1,
  `UID_FK` int(0) NOT NULL,
  PRIMARY KEY (`record_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for supply_invoice_map
-- ----------------------------
DROP TABLE IF EXISTS `supply_invoice_map`;
CREATE TABLE `supply_invoice_map`  (
  `record_ID` int(0) NOT NULL AUTO_INCREMENT,
  `invoice_ID_FK` int(0) NOT NULL,
  `item_ID_FK` int(0) NOT NULL,
  `quantity` int(0) NOT NULL,
  `cost` double NOT NULL,
  `currency` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `record_status` int(0) NOT NULL DEFAULT 1,
  PRIMARY KEY (`record_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `UID` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT 'user',
  `owner` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `canAddService` tinyint(1) NOT NULL DEFAULT 0,
  `canAddItem` tinyint(1) NOT NULL DEFAULT 0,
  `canViewCustomers` tinyint(1) NOT NULL DEFAULT 0,
  `canViewPayments` tinyint(1) NOT NULL DEFAULT 0,
  `user_status` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`UID`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE,
  UNIQUE INDEX `username_2`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'admin', 'admin', 1, 1, 1, 1, 1);
INSERT INTO `users` VALUES (2, 'user', 'ee11cbb19052e40b07aac0ca060c23ee', 'user', 'user', 1, 1, 1, 0, 1);

SET FOREIGN_KEY_CHECKS = 1;
