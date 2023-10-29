const dotenv = require('dotenv');
const Joi = require('joi');
const mysql = require('mysql');
dotenv.config();


const connection = () => {
    return mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PWD
    });
}

function createOne (request, response) {
   
    const movie = Joi.object({
        name: Joi.string().max(128).required(),
        description: Joi.string().max(2048).required(),
        release_date: Joi.date().iso().required(),
        actors: Joi.array().optional(),
        realisators: Joi.array().optional()
    })

    // On vérifie la donnée
    const validator = movie.validate(request.body) 

    // On retourne des erreurs 
    if (validator.error) {
        if (validator.error.details[0].message.includes("release_date")) {
            return response.status(400).send("Release_date must follow this format : YYYY-MM-DD");
        } else {
            return response.status(400).send(validator.error.details[0].message)
        }
    } else {

        let sqlResult = ""

        const db = connection()

        // On se connecte à la BDD
        db.connect(function(err) {
            if (err) {
                return response.status(400).send('Something wrong happened !\n' + err);
            }

            // Enregistre le film
            db.query(
                `INSERT INTO \`api-rest\`.\`movie\` (name, description, release_date) VALUES ('${request.body.name}', '${request.body.description}', DATE('${request.body.release_date}'));`, 
                (err, resultMovie) => {
                    if (err) {
                        return response.status(400).send('Something wrong happened !\n' + err)
                    } else {

                        sqlResult += "Movie : registered !\n"

                        if (request.body.actors) {

                            for (const id_person of request.body.actors) {

                                let role = 1
                                if (request.body.realisators) {
                                    if (request.body.realisators.includes(id_person)) {
                                        role = 3
                                        request.body.realisators.pop(id_person)
                                    }
                                }
                                
                                db.query (
                                    `INSERT INTO \`api-rest\`.\`role\` (id_movie, id_person, role) VALUES ('${resultMovie['insertId']}', '${id_person}', '${role}')`,
                                    (err, _) => {
                                        if (err) {
                                            sqlResult += `${id_person} with role ${role} : ${err}\n`
                                        } else {
                                            sqlResult += `${id_person} with role ${role} : successfully linked to the ${request.body.name}\n`
                                        }
                                    }
                                )
                            }
                        }

                        if (request.body.realisators) {

                            for (const id_person of request.body.realisators) {

                                let role = 2
                                
                                db.query (
                                    `INSERT INTO \`api-rest\`.\`role\` (id_movie, id_person, role) VALUES ('${resultMovie['insertId']}', '${id_person}', '${role}')`,
                                    (err, _) => {
                                        if (err) {
                                            sqlResult += `${id_person} with role ${role} : ${err}\n`
                                        } else {
                                            sqlResult += `${id_person} with role ${role} : successfully linked to the ${request.body.name}\n`
                                        }
                                    }
                                )
                            }
                        }
                        }
                    }
                
            );
        })
        return response.status(200).send(sqlResult)
    }    
}

function readOne (request, response) {
    
    const db = connection()

    db.connect(function(err) {
        if (err) {
            return response.send('Something wrong happened !\n' + err);
        }

        db.query(

            `SELECT
                m.id_movie,
                m.name,
                m.description,
                m.release_date,
                p.id_person,
                p.firstname,
                p.lastname,
                r.role
            FROM \`api-rest\`.\`movie\` m
            LEFT JOIN \`api-rest\`.\`role\` r ON m.id_movie = r.id_movie
            LEFT JOIN \`api-rest\`.\`person\` p ON r.id_person = p.id_person
            WHERE m.id_movie = ${request.params.id}`,

            (err, result) => {
                db.end()
                if (err) {
                    return response.status(400).send('Something wrong happened !\n' + err)
                } else {

                    const movie = {
                        id_movie: result[0].id_movie,
                        name: result[0].name,
                        description: result[0].description,
                        release_date: result[0].release_date
                    }

                    let actors = []
                    let realisators = []

                    for (let person of result) {
                        if (person.role === 1) {
                            actors.push({
                                id_person: person.id_person,
                                firstname: person.firstname,
                                lastname: person.lastname
                            })
                        } else if (person.role === 2) {
                            realisators.push({
                                id_person: person.id_person,
                                firstname: person.firstname,
                                lastname: person.lastname
                            })
                        } else if (person.role === 3) {
                            const both = {
                                id_person: person.id_person,
                                firstname: person.firstname,
                                lastname: person.lastname
                            }
                            actors.push(both)
                            realisators.push(both)
                        }
                    }

                    movie.actors = actors
                    movie.realisators = realisators


                    return response.send(movie)
                }
            }
        );
    });
}

function readAll (request, response) {

    // Gestion du possible query parameter limit
    const limit = () => {
        if (!isNaN(request.query.limit) && parseInt(request.query.limit) == request.query.limit) {
            return request.query.limit
        } else {
            return 20
        }
    }

    const db = connection();

    db.connect(function(err) {
        if (err) {
            return response.send('Something wrong happened !\n' + err);
        }

        db.query(
            `SELECT
                m.id_movie,
                m.name,
                m.description,
                m.release_date,
                p.id_person,
                p.firstname,
                p.lastname,
                r.role
            FROM (
                SELECT * FROM \`api-rest\`.\`movie\` 
                LIMIT ${limit()}
            ) AS m
            LEFT JOIN \`api-rest\`.\`role\` r ON m.id_movie = r.id_movie
            LEFT JOIN \`api-rest\`.\`person\` p ON r.id_person = p.id_person;`,
            (err, result) => {
                db.end();
                if (err) {
                    return response.status(400).send('Something wrong happened !\n' + err);
                } else {
                    const movies = {};

                    for (let row of result) {
                        if (!movies[row.id_movie]) {
                            movies[row.id_movie] = {
                                id_movie: row.id_movie,
                                name: row.name,
                                description: row.description,
                                release_date: row.release_date,
                                actors: [],
                                realisators: []
                            };
                        }

                        const person = {
                            id_person: row.id_person,
                            firstname: row.firstname,
                            lastname: row.lastname
                        };

                        if (row.role === 1) {
                            movies[row.id_movie].actors.push(person);
                        } else if (row.role === 2) {
                            movies[row.id_movie].realisators.push(person);
                        } else if (row.role === 3) {
                            movies[row.id_movie].actors.push(person);
                            movies[row.id_movie].realisators.push(person);
                        }
                    }

                    return response.send(Object.values(movies));
                }
            }
        );
    });
}


function updateOne (request, response) {

}

function deleteOne (request, response) {

}

module.exports = {
    createOne,
    readOne,
    readAll,
    updateOne,
    deleteOne
};

