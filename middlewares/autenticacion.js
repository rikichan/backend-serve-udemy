var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED; // seed o semilla del token



// Verificar Token -middleware... si el token no es valido o enviado no se puede accedera ninguno de los metos debajos del middleware

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next(); // si pasa el next le dice que puede continuar con las demas funciones debajo

        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });

    });

}