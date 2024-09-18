const http = require ('http');
const server = http.createServer((req, res) => {
    res.end('voilà la réponse du premier serveur');
}); 

//serveur prêt mais doit attendre les requetes envoyées, pour ceci on utilise la methode listen() du serveur. 


server.listen(process.env.PORT || 3000);
