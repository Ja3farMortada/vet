ALTER TABLE `treatments` ADD `treatment_notes` VARCHAR(255) NULL AFTER `treatment_description`;

ALTER TABLE `services` ADD `service_notes` VARCHAR(255) NULL AFTER `service_description`;

ALTER TABLE `reminders` ADD `animal_ID_FK` INT NULL AFTER `reminder_ID`;