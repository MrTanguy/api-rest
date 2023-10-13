const express = require('express');
const app = express ();
app.use(express.json());

const port = 3000
const path = '/api'

import * as actor from './routes/actor/actor.js';
import * as movie from './routes/movie/movie.js';
import * as realisator from './routes/realisator/realisator.js';


app.listen(port, () => {
    console.log('Server Listening on PORT:', port);
});


// --- ACTOR ---
// create
app.post(`${path}/actor`, actor.createOne(request, response));

// read
app.get(`${path}/actor`, actor.readOne(request, response));
app.get(`${path}/actor/:id`, actor.readAll(request, response)); 

// update
app.patch(`${path}/actor/:id`, actor.updateOne(request, response));

// delete
app.delete(`${path}/actor/:id`, actor.deleteOne(request, response));


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


// --- REALISATOR ---
// create
app.post(`${path}/realisator`, realisator.createOne(request, response));

// read
app.get(`${path}/realisator`, realisator.readOne(request, response));
app.get(`${path}/realisator/:id`, realisator.readAll(request, response)); 

// update
app.patch(`${path}/realisator/:id`, realisator.updateOne(request, response));

// delete
app.delete(`${path}/realisator/:id`, realisator.deleteOne(request, response));
