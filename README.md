# API REST

Cette API a pour but de stocker des films et des personnes avec la possiblité d'organiser les personnes sous forme d'acteur et/ou réalisateur

## Démarrer avec NodeJS

### Prérequis

- nodejs : [installation](https://nodejs.org/en/download)
- npm : Inclus dans l'installation de nodejs

### Déploiement de la BDD 

Afin de pouvoir utilise l'API, il est nécessaire de la connecter à une BDD MySQL, pour ce faire, créer la BDD avec les requêtes suivantes : 

````
CREATE DATABASE `api-rest`;

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
````
### Installation 

Cloner le repo 

````
git clone https://github.com/MrTanguy/api-rest.git
cd api-rest
git checkout dev 
````

Créer à la racine du projet, un fichier .env dans lequel il faut rentrer les identifiants de connexion à la BDD.

````
MYSQL_HOST = "localhost"
MYSQL_USER = "root"
MYSQL_PWD = ""
````

### Installer les dépendances

````
npm install
````

### Démarrer le projet 

````
node .\index.js
````

### Documentation et tests 

````
http://localhost:3000/api-docs
````

## Démarrer avec Docker

- WSL2 : [installation](https://learn.microsoft.com/fr-fr/windows/wsl/install)
- Docker : [installation](https://www.docker.com/products/docker-desktop/)
- Postman : [installation](https://www.postman.com/downloads/)

### Initialisation 

Recupérer le repository via `git clone https://github.com/MrTanguy/api-rest.git`

Se rendre dans le dossier `cd .\apt-rest\`

Utiliser la branch dev `git checkout dev`

Lancer la commande `docker-compose up`

Se rendre sur `http://localhost:3000/api-docs/` pour découvrir les routes disponibles.

Pour tester, utiliser postman avec les différentes requêtes possibles. 

PS : Un nouveau container devrait apparaître dans Docker Desktop