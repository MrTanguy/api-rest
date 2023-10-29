const express = require('express');
const app = express ();
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon API avec Swagger',
      version: '1.0.0',
    },
  },
  // Chemin vers les fichiers API
  apis: ['./routes/*/*.js'],
};

const specs = swaggerJsdoc(options);
const swaggerUi = require('swagger-ui-express');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());

const port = 3000
const path = '/api'

const person = require('./routes/person/person.js');
const movie = require('./routes/movie/movie.js');


app.listen(port, () => {
    console.log('Server Listening on PORT:', port);
});


// --- PERSON ---
// create
app.post(`${path}/person`, person.createOne);

// read
app.get(`${path}/person`, person.readAll);
app.get(`${path}/person/:id`, person.readOne); 

// update
app.patch(`${path}/person/:id`, person.updateOne);

// delete
app.delete(`${path}/person/:id`, person.deleteOne);


// --- MOVIE ---
// create
app.post(`${path}/movie`, movie.createOne);

// read
app.get(`${path}/movie`, movie.readAll);
app.get(`${path}/movie/:id`, movie.readOne); 

// update
app.patch(`${path}/movie/:id`, movie.updateOne);

// delete
app.delete(`${path}/movie/:id`, movie.deleteOne);

