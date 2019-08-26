var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// Busqueda por colección
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var tabla = req.params.tabla;

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex)
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex)
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex)
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busquedas solo son: Usuarios,Mdicos y Hospitales',
                error: { message: 'Tipo de Tabla/colección no valido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data // Propiedad de objeto computada o proceada []

        });
    });

});


// Busqueda General(todas las colecciones)
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
                res.status(200).json({
                    ok: true,
                    hospitales: respuestas[0], // orden de respuestas segun orden de promesas
                    medicos: respuestas[1],
                    usuarios: respuestas[2]
                });
            }

        )

    // Solo una promesa
    // buscarHospitales(busqueda, regex).then(hospitales => {
    //     res.status(200).json({
    //         ok: true,
    //         hospitales: hospitales
    //     });

    // });

});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email ')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    })
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email ')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    })
}

// buscar endos columnas en los anteriores olo se busca por nombre
function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al buscar usuario', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;