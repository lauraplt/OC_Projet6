const express = require ('express');

const app = express ();

app.use((req,res, next) => {
    console.log('Requête reçue !');
    next(); //pour passer sur le second middleware, car sinon on ne renvoie pas de réponse et la requête ne se termine pas
});

app.use((req, res, next) => {
    res.json({message: 'Votre requête a bien été reçue'});
    });

module.exports = app;


