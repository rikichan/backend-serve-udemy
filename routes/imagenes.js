var express = require('express');

var app = express();
const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {


    var tipo = req.params.tipo;
    var img = req.params.img;

    // __dirname me ayuda a saber la ruta completa automaticamente, libreria propia de node
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    // revisa si la ruta de la img existe
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);

    }

})

module.exports = app;