var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED; // seed o semilla del token


var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                message: 'Email incorrecto'
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                message: 'Password incorrecta'
            });
        }

        // crear un token!!!
        usuarioDB.password = ':)';
        // var token = jwt.sign({ usuario: usuarioDB }, '@este -es@-un seed-dificil', { expiresIn: 14400 }); // el seed es la semilla que hace que el token sea unico, 14400 son 4 horas para expiración

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // el seed es la semilla que hace que el token sea unico, 14400 son 4 horas para expiración


        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    });


});




module.exports = app;