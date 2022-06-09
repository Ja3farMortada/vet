ALTER TABLE `treatments` ADD `payment_currency` VARCHAR(10) NOT NULL DEFAULT 'lira' AFTER `treatment_time`;

ALTER TABLE `services` ADD `payment_currency` VARCHAR(10) NOT NULL DEFAULT 'lira' AFTER `service_time`;