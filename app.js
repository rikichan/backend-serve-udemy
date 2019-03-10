// Requires, se impotar la libreria express
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// inicializar variables, donde se va a llamar la libreria
var app = express(); // definido el servidor express

//body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');



// conexión a la DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos:\x1b[32m%s\x1b[0m', ' online');
})

//Rutas
app.use('/usuario', usuarioRoutes); // primero que '/' por q sino entra primero en '/'
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// escuchar peticiones, lo mismos ue app.listen(3000, funtion(){}).... el 3000 es el puerto
app.listen(3000, () => {
    console.log('Express server puerto 3000:\x1b[32m%s\x1b[0m', ' online');
});