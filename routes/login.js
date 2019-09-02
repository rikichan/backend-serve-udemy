var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED; // seed o semilla del token


var app = express();
var Usuario = require('../models/usuario');


// Google
var CLIENT_ID = require('../config/config').CLIENT_ID; // CLIENT_ID Google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// Autenticación Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
        // payload: payload
        // payload // es lo mismo que la linea de arriba
    }
}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    // envio el tokn recibido en la petición a la función verify, el await funciona como una promesa
    // ara poder utilizar el await es obligatoro que se ejecute dentro de una función async como la de arriba
    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no valido'
            });
        });



    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticación normal'
                });
            } else {

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // el seed es la semilla que hace que el token sea unico, 14400 son 4 horas para expiración

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });

            }
        } else {
            // el usuario no existe hay que crearlo
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';


            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuarios',
                        errors: err
                    });
                }

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // el seed es la semilla que hace que el token sea unico, 14400 son 4 horas para expiración

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id
                });

            });
        }


    });


    // return res.status(200).json({
    //     ok: true,
    //     mensaje: 'ok',
    //     googleUser: googleUser
    // });

});







// Autentcación Normal
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