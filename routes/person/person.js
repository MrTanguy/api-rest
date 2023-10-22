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

const person = Joi.object({
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
    birthdate: Joi.date().iso().required()
})

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


function createOne(request, response) {

    const db = connection()

    // On vérifie la donnée
    const validator = person.validate(request.body) 

    // On retourne des erreurs 
    if (validator.error) {
        if (validator.error.details[0].message.includes("birthdate")) {
            response.status(400).send("Birthdate must follow this format : YYYY-MM-DD");
        } else {
            response.status(400).send(validator.error.details[0].message)
        }
    } else {

        // On envoie les données en BDD
        db.connect(function(err) {
            if (err) {
                response.status(400).send('Something wrong happened !\n' + err);
            }
            db.query(
                `INSERT INTO \`api-rest\`.\`person\` (lastname, firstname, birthdate) VALUES ('${request.body.lastname.toUpperCase()}', '${request.body.firstname.toLowerCase()}', DATE('${request.body.birthdate}'));`, 
                (err, _) => {
                    if (err) {
                        response.status(400).send('Something wrong happened !\n' + err)
                    } else {
                        response.status(201).send(`${request.body.lastname} ${request.body.firstname} created !`)
                    }
                }
            );
        });
    }    
}

function readOne(request, response) {

    const db = connection()

    db.connect(function(err) {
        if (err) {
            response.send('Something wrong happened !\n' + err);
        }
        db.query(
            `SELECT id_person, lastname, firstname, birthdate FROM \`api-rest\`.\`person\` WHERE id_person = ${request.params.id}`,
            (err, result) => {
                db.end()
                if (err) {
                    return response.status(400).send('Something wrong happened !\n' + err)
                } else {
                    result[0]["birthdate"] = convertDate(result[0]["birthdate"])
                    return response.status(200).send(result)
                }
            }
        );
    });
}

function readAll(request, response) {

    const db = connection()

    db.connect(function(err) {
        if (err) {
            response.send('Something wrong happened !\n' + err);
        }
        db.query(
            `SELECT id_person, lastname, firstname, birthdate FROM \`api-rest\`.\`person\` LIMIT 20`,
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

function updateOne(request, response) {
    // ...
}

function deleteOne(request, response) {
    // ...
}

module.exports = {
    createOne,
    readOne,
    readAll,
    updateOne,
    deleteOne
};

