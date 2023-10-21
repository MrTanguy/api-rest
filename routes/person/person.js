const dotenv = require('dotenv');
const Joi = require('joi');
const mysql = require('mysql');
dotenv.config();

const person = Joi.object({
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
    birthdate: Joi.date().iso().required()
})

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD
});

function createOne(request, response) {

    // On vérifie la donnée
    const validator = person.validate(request.body) 

    // On retourne des erreurs 
    if (validator.error) {
        if (validator.error.details[0].message.includes("birthdate")) {
            response.send("Birthdate must follow this format : YYYY-MM-DD");
        } else {
            response.send(validator.error.details[0].message)
        }
    } else {

        // On envoie les données en BDD
        db.connect(function(err) {
            if (err) {
                response.send('Something wrong happened !\n' + err);
            }
            db.query(
                `INSERT INTO \`api-rest\`.\`person\` (lastname, firstname, birthdate) VALUES ('${request.body.lastname}', '${request.body.firstname}', DATE('${request.body.birthdate}'));`, 
                (err, result) => {
                    if (err) {
                        response.send('Something wrong happened !\n' + err)
                    } else {
                        response.send(`${request.body.lastname} ${request.body.firstname} created !`)
                    }
                }
            );
        });
    }    
}

function readOne(request, response) {
    // request.params.id
    // ...
}

function readAll(request, response) {
    // ...
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

