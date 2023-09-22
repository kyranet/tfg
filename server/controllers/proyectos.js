const { response } = require('express');
const bcrypt = require('bcryptjs');
const Proyecto = require('./../models/proyecto.model');
const Usuario = require('./../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');
const { esGestor } = require('../helpers/auth');
const { ROL_GESTOR } = require('./../models/rol.model');
const { ESTADOS_PROYECTOS } = require('../../src/app/models/estado-proyecto.model');
const ObjectId = require('mongodb').ObjectId;

const getProyectos = async(req, res) => {
    try {
        const skip = Number(req.query.skip) || 0;
        const limit = Number(req.query.limit) || Number.MAX_SAFE_INTEGER;

        const filtros = JSON.parse(req.query.filtros || '{}');

        let conditions = [];

        // filtro por texto (titulo)
        if(filtros.terminoBusqueda.trim() !== '') {
            conditions.push({titulo: new RegExp( filtros.terminoBusqueda.trim(), 'i')});
        }

        // filtro por rama
        let ramaFilter = [];
        Object.entries(filtros.ramas).forEach(entry => { const [rama, selected] = entry; if(selected) {ramaFilter.push(rama);} });
        if(ramaFilter.length) { conditions.push({rama: { $in: ramaFilter}}); }

        // filtro por ciudad
        let ciudadFilter = [];
        Object.entries(filtros.ciudades).forEach(entry => { const [ciudad, selected] = entry; if(selected) {ciudadFilter.push(ciudad);} });
        if(ciudadFilter.length) { conditions.push({ciudad: { $in: ciudadFilter}}); }

        // filtro por estado
        if(filtros.estado !== '') {
            conditions.push({estado: filtros.estado});
        }

        // filtro por usuario creador, profesores o entidades
        if(filtros.creador !== '') {
            conditions.push({ $or: [ {profesores: { $in: filtros.creador }}, {entidades: { $in: new ObjectId(filtros.creador) }}, {estudiantes: { $in: new ObjectId(filtros.creador) }}, {creador: { $in: filtros.creador }} ]  });
        }

        const [proyectos, filtradas, total] = await Promise.all([
            Proyecto
                .find(conditions.length ? { $and: conditions } : {})
                .sort('-createdAt')
                .skip(skip)
                .limit(limit)
                .populate('profesores', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('entidades', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('estudiantes', '_id nombre apellidos email sector universidad titulacion rol'),

            Proyecto.find(conditions.length ? { $and: conditions} : {}).countDocuments(),

            Proyecto.countDocuments(),
        ]);

        return res.status(200).json({
            ok: true,
            proyectos,
            filtradas: filtradas,
            total: total,
            filtros
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const getProyecto = async(req, res) => {
    try {

        const id = req.params.id;
        const proyecto = await Proyecto.findById(id)
                .populate('profesores', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('entidades', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('estudiantes', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('proponedor', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('creador', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('archivos', '_id client_name');


        return res.status(200).json({
            ok: true,
            proyecto,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}


const cambiarEstadoProyecto = async(req, res) => {

    try {

        const id = req.params.id;
        const proyecto = await Proyecto.findById(id)
                .populate('profesores', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('entidades', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('proponedor', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('estudiantes', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('creador', '_id nombre apellidos email sector universidad titulacion rol')
                .populate('archivos', '_id client_name');

        const estado = req.body.estado;

        if(!ESTADOS_PROYECTOS.includes(estado)) {
            return res.status(200).json({
                ok: false,
                msg: 'El estado ' + estado + ' no es un estado admitido',
            });
        }

        if(estado === 'Abierto' && !esGestor(req)) {
            return res.status(200).json({
                ok: false,
                msg: 'Solo el gestor puede volver a abrir el proyecto',
            });
        }

        proyecto.estado = estado;
        await proyecto.save();


        return res.status(200).json({
            ok: true,
            proyecto,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }

}


const enviarMensajeProyecto = async(req, res) => {

    try {

        const id = req.params.id;
        const texto = req.body.mensaje;
        const uid = req.current_user.uid;
        const email = req.current_user.email;
        const nombre = req.current_user.nombre;
        const apellidos = req.current_user.apellidos;
        const rol = req.current_user.rol;

        const proyecto = await Proyecto.findById(id);

        if(proyecto.estado !== 'En curso' && proyecto.estado !== 'Abierto') {
            return res.status(200).json({
                ok: false,
                msg: 'No se pueden enviar mensajes a un proyecto que no está en curso',
            });
        }

        const mensaje = { texto, uid, email, nombre, apellidos, rol, fecha: new Date() };
        await Proyecto.updateOne(
            { _id: id },
            { $push: { mensajes: { $each: [mensaje], $position: 0 } } },
        );

        return res.status(200).json({
            ok: true,
            proyecto,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }

}





module.exports = {
    getProyectos,
    getProyecto,
    cambiarEstadoProyecto,
    enviarMensajeProyecto,
}