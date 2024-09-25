const express = require ('express');
const mongoose = require('mongoose');
const app = express ();
app.use(express.json());
const books = require('./models/book');


//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  mongoose.connect('mongodb+srv://lauraplt:hello2024@cluster0.cqmwn.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.post('/api/stuff', (req, res, next) => {
    delete req.body._id;
    const book = new books({
      ...req.body
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });

  app.use('/api/stuff', (req, res, next) => {
    books.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
  });

 
    module.exports = app;

    //lauraplt:<db_password>@cluster0.cqmwn.mongodb.net/?

   