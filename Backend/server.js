const http = require ('http');

const app = require('./App');

const server = http.createServer(app);

// const server = http.createServer((req, res) => { res.end('voilà la réponse du premier serveur');}); 
//serveur prêt mais doit attendre les requetes envoyées, pour ceci on utilise la methode listen() du serveur. 

// dire à l'application sur quel port elle va tourner
app.set('port', process.env.PORT || 3000)


server.listen(process.env.PORT || 3000);
