const dotenv = require('dotenv');
const Joi = require('joi');
const mysql = require('mysql2');
dotenv.config();

/**
 * @swagger
 * tags:
 *   name: person
 *   description: Opérations liées aux personnes
 */


const connection = () => {
    return mysql.createConnection({
        host: process.env.MYSQL_HOST || "host.docker.internal",
            user: process.env.MYSQL_USER || "mysql",
            password: process.env.MYSQL_PWD || "Password123",
            database: "api-rest"
    });
}

const convertDate = (date) => {
    let day = date.getDate()
    if (day <= 9) {
        day = `0${day}`
    }
    let month = date.getMonth() + 1
    if (month <= 9) {
        month = `0${month}`
    }
    const year = date.getFullYear()

    return `${year}-${month}-${day}`
}


/**
 * @swagger
 * /api/person:
 *   post:
 *     tags: [person]
 *     summary: Crée une nouvelle personne
 *     description: Ajoute une nouvelle personne à la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - birthdate
 *             properties:
 *               firstname:
 *                 type: string
 *                 maxLength: 255
 *                 description: Prénom de la personne.
 *               lastname:
 *                 type: string
 *                 maxLength: 255
 *                 description: Nom de la personne.
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: Date de naissance de la personne. Doit suivre le format YYYY-MM-DD.
 *     responses:
 *       201:
 *         description: Personne créée avec succès.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "[id : 1] Doe John created!"
 *       400:
 *         description: Une erreur est survenue
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Birthdate must follow this format : YYYY-MM-DD"
 */
function createOne(request, response) {

    const person = Joi.object({
        firstname: Joi.string().max(255).required(),
        lastname: Joi.string().max(255).required(),
        birthdate: Joi.date().iso().required()
    })

    // On vérifie la donnée
    const validator = person.validate(request.body) 

    // On retourne des erreurs 
    if (validator.error) {
        if (validator.error.details[0].message.includes("birthdate")) {
            return response.status(400).send("Birthdate must follow this format : YYYY-MM-DD");
        } else {
            return response.status(400).send(validator.error.details[0].message)
        }
    } else {

        const db = connection()

        // On envoie les données en BDD
        db.connect(function(err) {
            if (err) {
                return response.status(400).send('Something wrong happened !\n' + err);
            }
            db.query(
                `INSERT INTO \`api-rest\`.\`person\` (lastname, firstname, birthdate) VALUES ('${request.body.lastname}', '${request.body.firstname}', DATE('${request.body.birthdate}'));`, 
                (err, result) => {
                    if (err) {
                        return response.status(400).send('Something wrong happened !\n' + err)
                    } else {
                        return response.status(201).send(`[id : ${result['insertId']}] ${request.body.lastname} ${request.body.firstname} created !`)
                    }
                }
            );
        });
    }    
}


/**
 * @swagger
 * /api/person/{id}:
 *   get:
 *     tags: [person]
 *     summary: Récupère les détails d'une personne spécifique
 *     description: Retourne les détails d'une personne par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la personne à récupérer.
 *     responses:
 *       200:
 *         description: Détails de la personne.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_person:
 *                   type: integer
 *                   description: ID de la personne.
 *                 lastname:
 *                   type: string
 *                   description: Nom de la personne.
 *                 firstname:
 *                   type: string
 *                   description: Prénom de la personne.
 *                 birthdate:
 *                   type: string
 *                   format: date
 *                   description: Date de naissance de la personne.
 *       400:
 *         description: Une erreur est survenue
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Something wrong happened !\nError Message"
 *       404:
 *         description: Personne non trouvée.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Id : 1 not found"
 */
function readOne(request, response) {

    const db = connection()

    db.connect(function(err) {
        if (err) {
            return response.send('Something wrong happened !\n' + err);
        }
        db.query(
            `SELECT id_person, lastname, firstname, birthdate FROM \`api-rest\`.\`person\` WHERE id_person = ${request.params.id}`,
            (err, result) => {
                db.end()
                if (err) {
                    return response.status(400).send('Something wrong happened !\n' + err)
                } else if (result.length === 0){
                    return response.status(200).send(`Id : ${request.params.id} not found`)
                } else {
                    result[0]["birthdate"] = convertDate(result[0]["birthdate"])
                    return response.status(200).send(result)
                }
            }
        );
    });
}


/**
 * @swagger
 * /api/person:
 *   get:
 *     tags: [person]
 *     summary: Récupère les détails de toutes les personnes
 *     description: Retourne les détails de toutes les personnes jusqu'à une limite spécifiée ou par défaut à 20.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         required: false
 *         description: Limite du nombre de personnes à récupérer.
 *     responses:
 *       200:
 *         description: Liste des détails des personnes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_person:
 *                     type: integer
 *                     description: ID de la personne.
 *                   lastname:
 *                     type: string
 *                     description: Nom de la personne.
 *                   firstname:
 *                     type: string
 *                     description: Prénom de la personne.
 *                   birthdate:
 *                     type: string
 *                     format: date
 *                     description: Date de naissance de la personne.
 *       400:
 *         description: Une erreur est survenue
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Something wrong happened !\nError Message"
 */
function readAll(request, response) {

    // Gestion du possible query parameter limit
    const limit = () => {
        if (!isNaN(request.query.limit) && parseInt(request.query.limit) == request.query.limit) {
            return request.query.limit
        } else {
            return 20
        }
    }

    const db = connection()

    db.connect(function(err) {
        if (err) {
            return response.send('Something wrong happened !\n' + err);
        }
        db.query(
            `SELECT id_person, lastname, firstname, birthdate FROM \`api-rest\`.\`person\` LIMIT ${limit()}`,
            (err, result) => {
                db.end()
                if (err) {
                    return response.status(400).send('Something wrong happened !\n' + err)
                } else {
                    for (const person of result) {
                        person["birthdate"] = convertDate(person["birthdate"])
                    }
                    return response.status(200).send(result)
                }
            }
        );
    });
}


/**
 * @swagger
 * /api/person/{id}:
 *   patch:
 *     tags: [person]
 *     summary: Met à jour les détails d'une personne
 *     description: Met à jour les détails d'une personne spécifiée par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la personne à mettre à jour.
 *       - in: body
 *         name: person
 *         schema:
 *           type: object
 *           properties:
 *             firstname:
 *               type: string
 *               maxLength: 255
 *               description: Prénom de la personne.
 *             lastname:
 *               type: string
 *               maxLength: 255
 *               description: Nom de la personne.
 *             birthdate:
 *               type: string
 *               format: date
 *               description: Date de naissance de la personne.
 *         required: false
 *         description: Détails de la personne à mettre à jour.
 *     responses:
 *       200:
 *         description: Personne mise à jour avec succès.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "User updated !"
 *       400:
 *         description: Une erreur est survenue lors de la mise à jour.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Something wrong happened !\nError Message"
 */
function updateOne(request, response) {

    const person = Joi.object({
        firstname: Joi.string().max(255).optional(),
        lastname: Joi.string().max(255).optional(),
        birthdate: Joi.date().iso().optional()
    })
    
    // On vérifie la donnée
    const validator = person.validate(request.body) 

    // On retourne des erreurs 
    if (validator.error) {
        if (validator.error.details[0].message.includes("birthdate")) {
            return response.status(400).send("Birthdate must follow this format : YYYY-MM-DD");
        } else {
            return response.status(400).send(validator.error.details[0].message)
        }
    } else {

        // Création de la string avec les paramètres
        let params = ""
        for (const element in request.body) {
            params += `${element} = '${request.body[element]}', `
        }
        params = params.slice(0, params.length-2)

        const db = connection()

        // Envoie en BDD
        db.connect(function(err) {
            if (err) {
                return response.send('Something wrong happened !\n' + err);
            }
            db.query(
                `UPDATE \`api-rest\`.\`person\` SET ${params} WHERE id_person = ${request.params.id}`,
                (err, _) => {
                    db.end()
                    if (err) {
                        return response.status(400).send('Something wrong happened !\n' + err)
                    } else {
                        return response.status(200).send('User updated !')
                    }
                }
            );
        });
    }
}


/**
 * @swagger
 * /api/person/{id}:
 *   delete:
 *     tags: [person]
 *     summary: Supprime une personne
 *     description: Supprime une personne spécifiée par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la personne à supprimer.
 *     responses:
 *       200:
 *         description: Personne supprimée avec succès.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "User deleted !"
 *       400:
 *         description: Une erreur est survenue lors de la suppression.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Something wrong happened !\nError Message"
 */
function deleteOne(request, response) {
    
    const db = connection()

    db.connect(function(err) {
        if (err) {
            return response.send('Something wrong happened !\n' + err);
        }
        db.query(
            `DELETE FROM \`api-rest\`.\`person\` WHERE id_person = ${request.params.id}`,
            (err, result) => {
                db.end()
                if (err) {
                    return response.status(400).send('Something wrong happened !\n' + err)
                } else {
                    return response.status(200).send('User deleted !')
                }
            }
        );
    });
}

module.exports = {
    createOne,
    readOne,
    readAll,
    updateOne,
    deleteOne
};

