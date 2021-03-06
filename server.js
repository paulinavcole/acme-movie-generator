const { seeder } = require('./db');
const { Movie } = require('./db/Movie');
const express = require('express');
const app = express();
const path = require('path');
const { createRandomMovie } = require('./db/seed-data')

app.use(express.json());
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ err });
});

app.post('/api/movies', async(req, res, next)=> {
  try {
    res.status(201).send(await Movie.create(createRandomMovie()));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/movies', async(req, res, next)=> {
  try {
    res.send(await Movie.findAll({
      order: [
        ['ranking', 'DESC'],
        ['name', 'ASC']
      ]

    }));
  }
  catch(ex){
    next(ex);
  }
});

app.put('/api/movies/:id', async(req, res, next)=> {
  try {
    const movie = await Movie.findByPk(req.params.id);
    await movie.update(req.body);
    res.send(movie);
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/movies/:id', async(req, res, next)=> {
  try {
    const movie = await Movie.findByPk(req.params.id);
    await movie.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});


const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));

const init = async()=> {
  try {
    await seeder()
  }
  catch(ex){
    console.log(ex);
  }
};

init();