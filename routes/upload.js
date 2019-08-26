var express = require('express');
var fileUpload = require('express-fileupload');

// libreria fileSystem
var fs = require('fs');

var app = express();

// Modelos
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// libreria cargar archivos
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colección

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no valida',
            errors: { message: 'Tipo de colección no valida' }
        });

    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del rchivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no valida',
            errors: { message: 'La extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // 123433535-123.png
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;


    // Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });
});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'err',
                    error: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }
            var pathViejo = `./uploads/usuarios/${usuario.img}`;

            // copruebo si existe el archivo viejo, elimina img
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo); // se borra el archivo del la carpeta
            }

            usuario.img = nombreArchivo;

            // usuario que esta en el findById
            usuario.save((err, usuarioActualizado) => {

                // Ocultar psw
                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });

        });
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'err',
                    error: err
                });
            }

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Médico no existe',
                    errors: { message: 'Médico no existe' }
                });
            }
            var pathViejo = `./uploads/medicos/${medico.img}`;

            // copruebo si existe el archivo viejo, elimina img
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo); // se borra el archivo del la carpeta
            }

            medico.img = nombreArchivo;

            // usuario que esta en el findById
            medico.save((err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });

            });

        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'err',
                    error: err
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }
            var pathViejo = `./uploads/hospitales/${hospital.img}`;

            // copruebo si existe el archivo viejo, elimina img
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo); // se borra el archivo del la carpeta
            }

            hospital.img = nombreArchivo;

            // usuario que esta en el findById
            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });

            });

        });
    }
}
module.exports = app;