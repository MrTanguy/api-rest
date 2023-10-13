const express = require('express');
const app = express ();
app.use(express.json());

const port = 3000
const path = '/api'

import * as person from './routes/person/person.js';
import * as movie from './routes/movie/movie.js';


app.listen(port, () => {
    console.log('Server Listening on PORT:', port);
});


// --- PERSON ---
// create
app.post(`${path}/person`, person.createOne(request, response));

// read
app.get(`${path}/person`, person.readOne(request, response));
app.get(`${path}/person/:id`, person.readAll(request, response)); 

// update
app.patch(`${path}/person/:id`, person.updateOne(request, response));

// delete
app.delete(`${path}/person/:id`, person.deleteOne(request, response));


// --- MOVIE ---
// create
app.post(`${path}/movie`, movie.createOne(request, response));

// read
app.get(`${path}/movie`, movie.readOne(request, response));
app.get(`${path}/movie/:id`, movie.readAll(request, response)); 

// update
app.patch(`${path}/movie/:id`, movie.updateOne(request, response));

// delete
app.delete(`${path}/movie/:id`, movie.deleteOne(request, response));

