CREATE TABLE `api-rest`.`person` (
	`id_person` INT NOT NULL AUTO_INCREMENT , 
	`lastname` VARCHAR(255) NOT NULL , 
	`firstname` VARCHAR(255) NOT NULL , 
	`birthdate` DATE NOT NULL , 
	PRIMARY KEY (`id_person`)
) ENGINE = InnoDB;

INSERT INTO `api-rest`.`person` (`lastname`, `firstname`, `birthdate`) 
VALUES 
    ('Doe', 'John', '1990-01-15'),
    ('Smith', 'Alice', '1985-05-22'),
    ('Johnson', 'Bob', '1978-11-10'),
    ('Williams', 'Emily', '1995-08-03'),
    ('Brown', 'Michael', '1982-04-28'),
    ('Jones', 'Olivia', '1998-09-17'),
    ('Davis', 'William', '1970-12-07'),
    ('Miller', 'Sophia', '1989-06-14'),
    ('Wilson', 'Daniel', '1992-03-25'),
    ('Moore', 'Ava', '1975-07-31'),
	('Anderson', 'Ethan', '1993-02-18'),
    ('Clark', 'Emma', '1987-06-05'),
    ('Moore', 'Liam', '1996-09-22'),
    ('White', 'Mia', '1979-12-15'),
    ('Hall', 'Noah', '1984-04-09'),
    ('Baker', 'Ava', '1991-11-26'),
    ('Adams', 'Logan', '1980-08-13'),
    ('Martin', 'Grace', '1994-03-29'),
    ('Garcia', 'Owen', '1973-07-04'),
    ('Scott', 'Sophie', '1988-10-20');

CREATE TABLE `api-rest`.`movie` (
	`id_movie` INT NOT NULL AUTO_INCREMENT , 
	`name` VARCHAR(128) NOT NULL , 
	`description` TEXT NOT NULL , 
	`release_date` DATE NOT NULL , 
	PRIMARY KEY (`id_movie`)
) ENGINE = InnoDB;

INSERT INTO `api-rest`.`movie` (`name`, `description`, `release_date`) 
VALUES 
    ('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', '1994-09-10'),
    ('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', '1972-03-24'),
    ('The Dark Knight', 'When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.', '2008-07-18'),
    ('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', '1994-10-14'),
    ("Schindler's List", 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', '1993-12-15'),
    ('Forrest Gump', 'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other history unfold through the perspective of an Alabama man with an IQ of 75.', '1994-07-06'),
    ('Fight Club', 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.', '1999-10-15'),
    ('The Matrix', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', '1999-03-24'),
    ('The Silence of the Lambs', 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.', '1991-02-14'),
    ('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', '2010-07-16');


CREATE TABLE `api-rest`.`role` (
	`id_role` INT NOT NULL AUTO_INCREMENT, 
	`id_movie` INT NOT NULL, 
	`id_person` INT NOT NULL, 
	`role` INT NOT NULL,
	PRIMARY KEY (`id_role`),
	FOREIGN KEY (`id_movie`) REFERENCES `movie`(`id_movie`) ON DELETE CASCADE ON UPDATE RESTRICT,
	FOREIGN KEY (`id_person`) REFERENCES `person`(`id_person`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB;

INSERT INTO `api-rest`.`role` (`id_movie`, `id_person`, `role`) 
VALUES 
    (1, 1, 1),   -- Film 1, Personne 1, Rôle 1
    (1, 2, 2),   -- Film 1, Personne 2, Rôle 2
    (1, 3, 3),   -- Film 1, Personne 3, Rôle 3
    (2, 4, 1),   -- Film 2, Personne 4, Rôle 1
    (2, 5, 2),   -- Film 2, Personne 5, Rôle 2
    (2, 6, 3),   -- Film 2, Personne 6, Rôle 3
    (3, 7, 1),   -- Film 3, Personne 7, Rôle 1
    (3, 8, 2),   -- Film 3, Personne 8, Rôle 2
    (3, 9, 3),   -- Film 3, Personne 9, Rôle 3
    (4, 10, 1),  -- Film 4, Personne 10, Rôle 1
    (4, 11, 2),  -- Film 4, Personne 11, Rôle 2
    (4, 12, 3),  -- Film 4, Personne 12, Rôle 3
    (5, 13, 1),  -- Film 5, Personne 13, Rôle 1
    (5, 14, 2),  -- Film 5, Personne 14, Rôle 2
    (5, 15, 3),  -- Film 5, Personne 15, Rôle 3
    (6, 16, 1),  -- Film 6, Personne 16, Rôle 1
    (6, 17, 2),  -- Film 6, Personne 17, Rôle 2
    (6, 18, 3),  -- Film 6, Personne 18, Rôle 3
    (7, 19, 1),  -- Film 7, Personne 19, Rôle 1
    (7, 20, 2),  -- Film 7, Personne 20, Rôle 2
    (7, 1, 3),   -- Film 7, Personne 1, Rôle 3
    (8, 2, 1),   -- Film 8, Personne 2, Rôle 1
    (8, 3, 2),   -- Film 8, Personne 3, Rôle 2
    (8, 4, 3),   -- Film 8, Personne 4, Rôle 3
    (9, 5, 1),   -- Film 9, Personne 5, Rôle 1
    (9, 6, 2),   -- Film 9, Personne 6, Rôle 2
    (9, 7, 3),   -- Film 9, Personne 7, Rôle 3
    (10, 8, 1),  -- Film 10, Personne 8, Rôle 1
    (10, 9, 2),  -- Film 10, Personne 9, Rôle 2
    (10, 10, 3); -- Film 10, Personne 10, Rôle 3