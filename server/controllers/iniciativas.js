const { response } = require('express');
const bcrypt = require('bcryptjs');
const Iniciativa = require('./../models/iniciativa.model');
const Usuario = require('./../models/usuario.model');
const { generarJWT } = require('../helpers/jwt');
const { esGestor } = require('../helpers/auth');
const { ROL_GESTOR } = require('./../models/rol.model');
const Partenariado = require('../models/partenariado.model');



const getIniciativas = async(req, res) => {
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

       // filtro por tipo rol proponedor
        if(filtros.proponedor !== '') {
            const usuarios_con_rol = await Usuario.find({rol: filtros.proponedor}).distinct('_id');
            conditions.push({proponedor: { $in: usuarios_con_rol}});
        }

       // filtro por usuario creador
        if(filtros.creador !== '') {
            conditions.push({creador: { $in: filtros.creador}});
        }

        const [iniciativas, filtradas, total] = await Promise.all([
            Iniciativa
                .find(conditions.length ? { $and: conditions} : {})
                .sort('-createdAt')
                .skip(skip)
                .limit(limit)
                .populate('proponedor', '_id nombre apellidos sector universidad titulacion rol'),

            Iniciativa.find(conditions.length ? { $and: conditions} : {}).countDocuments(),

            Iniciativa.countDocuments(),
        ]);

        return res.status(200).json({
            ok: true,
            iniciativas,
            filtradas: filtradas,
            total: total,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const getIniciativa = async(req, res) => {
    try {

        const id = req.params.id;
        const iniciativa = await Iniciativa.findById(id).populate('proponedor', 'nombre apellidos sector universidad titulacion rol').populate('archivos', '_id client_name');

        return res.status(200).json({
            ok: true,
            iniciativa,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const respaldarIniciativa = async(req, res) => {
    try {
        const id = req.params.id;
        const iniciativa = await Iniciativa.findById(id).populate('proponedor', 'rol');

        if(!iniciativa) {
            return res.status(200).json({
                ok: false,
                msg: 'La iniciativa no existe',
            });
        }

        if( !req.current_user) {
            return res.status(200).json({
                ok: false,
                msg: 'Es necesario estar logueado para realizar esta acción',
            });
        }

        if( req.current_user.rol !== 'ROL_GESTOR' && req.current_user.rol !== 'ROL_PROFESOR' &&  req.current_user.rol !== 'ROL_SOCIO_COMUNITARIO') {
            return res.status(200).json({
                ok: false,
                msg: 'Una iniciativa solo puede ser respaldada por un profesor o un socio comunitario',
            });
        }

        if(iniciativa.proponedor.rol === 'ROL_SOCIO_COMUNITARIO' && req.current_user.rol !== 'ROL_GESTOR' && req.current_user.rol !== 'ROL_PROFESOR') {
            return res.status(200).json({
                ok: false,
                msg: 'Una iniciativa presentada por un socio comunitario solo puede ser respaldada por un profesor',
            });
        }

        if(iniciativa.proponedor.rol === 'ROL_PROFESOR' && req.current_user.rol === 'ROL_GESTOR' && req.current_user.rol === 'ROL_SOCIO_COMUNITARIO') {
            return res.status(200).json({
                ok: false,
                msg: 'Una iniciativa presentada por un profesor solo puede ser respaldada por un socio comunitario',
            });
        }

        // creamos el partenariado a partir de la iniciativa
        const partenariado = new Partenariado;

        partenariado.estado = 'En negociación';
        partenariado.titulo = iniciativa.titulo;
        partenariado.descripcion = iniciativa.descripcion;
        partenariado.rama = iniciativa.rama;
        partenariado.ciudad = iniciativa.ciudad;
        partenariado.iniciativa = iniciativa._id;

        if(iniciativa.proponedor.rol === 'ROL_PROFESOR' || iniciativa.proponedor.rol === 'ROL_GESTOR') {
            partenariado.profesores.push(iniciativa.proponedor);
        } else {
            partenariado.sociosComunitarios.push(iniciativa.proponedor);
        }

        if(req.current_user.rol === 'ROL_PROFESOR' || req.current_user.rol === 'ROL_GESTOR') {
            partenariado.profesores.push(req.current_user.uid);
        } else {
            partenariado.sociosComunitarios.push(req.current_user.uid);
        }

        partenariado.mensajes = [];
        partenariado.archivos = [];
        partenariado.proponedor = iniciativa.proponedor;
        partenariado.creador = req.current_user.uid;

        await partenariado.save();

        // referencia cruzada
        iniciativa.partenariados.push(partenariado._id);
        await iniciativa.save();


        return res.status(200).json({
            ok: true,
            iniciativa,
            partenariado,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });7
    }
}



const crearIniciativa = async(req, res = response) => {

    try {

        const iniciativa = new Iniciativa({ estado: 'Abierta', creador: req.current_user.uid, ...req.body });

        const titulo_trimmed = iniciativa.titulo.trim();
        iniciativa.titulo = titulo_trimmed;

        const existeTitulo = await Iniciativa.findOne({ titulo_trimmed });

        if(existeTitulo) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe una iniciativa con dicho título',
            });
        }

        // si no hay proponedor o no soy gestor, pongo el proponedor como el usuario logueado
        if(!req.proponedor || !esGestor(req)) {
            iniciativa.proponedor = req.current_user.uid;
        }

        await iniciativa.save();

        return res.status(200).json({
            ok: true,
            iniciativa: iniciativa,
        });
    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const actualizarIniciativa = async(req, res = response) => {

    const id = req.params.id;

    try {
        const iniciativa = await Iniciativa.findById(id);

        if(!iniciativa) {
            return res.status(404).json({
                ok: false,
                msg: 'La iniciativa no existe',
            });
        }

        // solo puede modificar la iniciativa un gestor o el proponedor
        if(req.current_user.uid != iniciativa.proponedor && !esGestor(req)) {
            return res.status(401).json({
                ok: false,
                msg: 'Solo el proponedor de la iniciativa o un gestor pueden modificarla.',
            });
        }


        const campos = req.body;

        // comprobar si quiere cambiar su titulo
        const titulo_trimmed = campos.titulo.trim();
        campos.titulo = titulo_trimmed;
        if( iniciativa.titulo === campos.titulo ) {
            delete campos.titulo;
        }
        // si lo quiere cambiar, comprobar que no existe uno igual
        if(campos.titulo) {
            const existeTitulo = await Iniciativa.findOne({ titulo: titulo_trimmed });

            if(existeTitulo) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe una iniciativa con dicho título',
                });
            }
        }

        // solo el gestor puede cambiar el proponedor
        if(!esGestor(req)) {
            delete campos.proponedor;
        }

        // borrar campos que no deberian modificarse nunca
        delete campos.creador;

        const iniciativaActualizada = await Iniciativa.findByIdAndUpdate(iniciativa.id, campos, { new: true });

        return res.status(200).json({
            ok: true,
            iniciativa: iniciativaActualizada,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const archivarIniciativa = async(req, res = response) => {

    const id = req.params.id;

    try {
        const iniciativa = await Iniciativa.findById(id);

        if(!iniciativa) {
            return res.status(404).json({
                ok: false,
                msg: 'La iniciativa no existe',
            });
        }

        // solo puede archivar la iniciativa un gestor o el proponedor
        if(req.current_user.uid != iniciativa.proponedor && !esGestor(req)) {
            return res.status(401).json({
                ok: false,
                msg: 'Solo el proponedor de la iniciativa o un gestor pueden archivarla.',
            });
        }

        // borrado real
        // const iniciativaBorrada = await Iniciativa.findByIdAndDelete(id);

        // archivado
        const iniciativaArchivada = await Iniciativa.findByIdAndUpdate(iniciativa.id, {estado: 'Archivada'}, { new: true });

        return res.status(200).json({
            ok: true,
            iniciativa: iniciativaArchivada
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const desarchivarIniciativa = async(req, res = response) => {

    const id = req.params.id;

    try {
        const iniciativa = await Iniciativa.findById(id);

        if(!iniciativa) {
            return res.status(404).json({
                ok: false,
                msg: 'La iniciativa no existe',
            });
        }

        // solo puede desarchivar la iniciativa un gestor
        if(!esGestor(req)) {
            return res.status(401).json({
                ok: false,
                msg: 'Solo el proponedor de la iniciativa o un gestor pueden abrir de nuevo la iniciativa.',
            });
        }

        // desarchivado
        const iniciativaDesarchivada = await Iniciativa.findByIdAndUpdate(iniciativa.id, {estado: 'Abierta'}, { new: true });

        return res.status(200).json({
            ok: true,
            iniciativa: iniciativaDesarchivada
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
    getIniciativas,
    getIniciativa,
    respaldarIniciativa,
    crearIniciativa,
    actualizarIniciativa,
    archivarIniciativa,
    desarchivarIniciativa,
}