var express = require('express');
var bcrypt = require('bcryptjs'); // libreria para encriptar
// var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

// var SEED = require('../config/config').SEED; // seed o semilla del token


var app = express();


var Usuario = require('../models/usuario');

//obtener todos los usuarios
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            })


});


// se pego en la carpeta middlewares/ autenticación

// // Verificar Token -middleware... si el token no es valido o enviado no se puede accedera ninguno de los metos debajos del middleware
// app.use('/', (req, res, next) => {

//     var token = req.query.token;

//     jwt.verify(token, SEED, (err, decoded) => {

//         if (err) {
//             return res.status(401).json({
//                 ok: false,
//                 mensaje: 'Token incorrecto',
//                 errors: err
//             });
//         }

//         next(); // si pasa el next le dice que puede continuar con las demas funciones debajo
//     });
// });



// Actualizar Usuario, put o patch para actualizar
app.put('/:id', mdAutenticacion.verificaToken, (req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuaio',
                errors: err
            });
        }

        if (!usuario) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuaro con el id' + id + ' no existe',
                    errors: {
                        message: 'No existe usuario con ese ID'
                    }
                });
            }
        }


        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usurio',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});


// Crear nuevo usurio
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });



});

// Borrar usuario por id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: {
                    message: 'No existe un usuario con ese id'
                }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});


module.exports = app;