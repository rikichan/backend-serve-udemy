// Requires, se impotar la libreria express
var express = require('express');
var mongoose = require('mongoose');


// inicializar variables, donde se va a llamar la libreria
var app = express(); // definido el servidor express

// conexión a la DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

    if (err) throw err;

    console.log('Base de datos:\x1b[32m%s\x1b[0m', ' online');
})

//Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })
})


// escuchar peticiones, lo mismos ue app.listen(3000, funtion(){}).... el 3000 es el puerto
app.listen(3000, () => {
    console.log('Express server puerto 3000:\x1b[32m%s\x1b[0m', ' online');
});