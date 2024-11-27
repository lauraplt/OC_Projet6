require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');

const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

const app = express();

// Normalize the port
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
};
const port = normalizePort(process.env.PORT || '4000');

// Connecting to MongoDB Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Middleware : interpret JSON data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares : routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Middleware : images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Creating the server
const server = http.createServer(app);

// Error handler for the server
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Handles server errors
server.on('error', errorHandler);

// Displays a message when the server starts listening on the port
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

// The server is listening on the specified port
server.listen(port);

module.exports = app;

