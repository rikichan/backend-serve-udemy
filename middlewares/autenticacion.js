var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// ==========================================
//  Verificar token
// ==========================================
exports.verificaToken = function (req, res, next) {

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

        next();


    });

}


// ==========================================
//  Verificar Admin
// ==========================================
exports.verificaADMIN_ROLE = function (req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    }
    else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto- No es un Admin', // no indicar en el mensaje que  no es un admin
            errors: { mensaje: 'No es admin, no puede hacer eso' }
        });
    }
}


// ==========================================
//  Verificar Admin o Mismo Usuario
// ==========================================
exports.verificaADMIN_MismoUsuario = function (req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id; // vine del usuario donde se implementa el MD

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    }
    else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto- No es un Admin ni es el mismo usuario', // no indicar en el mensaje que  no es un admin
            errors: { mensaje: 'No es admin, no puede hacer eso' }
        });
    }

}