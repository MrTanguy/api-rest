CREATE TABLE `api-rest`.`person` (
	`id_person` INT NOT NULL AUTO_INCREMENT , 
	`lastname` VARCHAR(255) NOT NULL , 
	`firstname` VARCHAR(255) NOT NULL , 
	`birthdate` DATE NOT NULL , 
	PRIMARY KEY (`id_person`)
) ENGINE = InnoDB;

CREATE TABLE `api-rest`.`movie` (
	`id_movie` INT NOT NULL AUTO_INCREMENT , 
	`name` VARCHAR(128) NOT NULL , 
	`description` TEXT NOT NULL , 
	`release_date` DATE NOT NULL , 
	PRIMARY KEY (`id_movie`)
) ENGINE = InnoDB;

CREATE TABLE `api-rest`.`role` (
	`id_role` INT NOT NULL AUTO_INCREMENT, 
	`id_movie` INT NOT NULL, 
	`id_person` INT NOT NULL, 
	`role` INT NOT NULL,
	PRIMARY KEY (`id_role`),
	FOREIGN KEY (`id_movie`) REFERENCES `movie`(`id_movie`) ON DELETE CASCADE ON UPDATE RESTRICT,
	FOREIGN KEY (`id_person`) REFERENCES `person`(`id_person`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB;