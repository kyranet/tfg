const Proyecto = require("../models/proyecto.model");
const Partenariado = require("../models/partenariado.model");
const Iniciativa = require("../models/iniciativa.model");
const dao_colaboracion = require("./../database/services/daos/daoColaboracion");
const dao_usuario = require("./../database/services/daos/daoUsuario");

const getDatosHome = async(req, res) => {
    try {
        const [ count_proyectos, count_partenariados, count_iniciativas] = await Promise.all([
            dao_colaboracion.contarProyectos(),
            dao_colaboracion.contarPartenariados(),
            dao_colaboracion.contarIniciativas(),
        ]);

        return res.status(200).json({
            ok: true,
            count_proyectos,
            count_partenariados,
            count_iniciativas,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const getUniversidades = async(req, res) => {
    try {
        codeList = await dao_usuario.obtenerUniversidades();
        
        return res.status(200).json({
            ok: true,
            codeList,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const getAreasConocimientoUsuario = async(req, res) => {
    try {
        areasUsuario = await dao_usuario.obtenerAreasConocimientoUsuario(req.params.id);
        
        return res.status(200).json({
            ok: true,
            areasUsuario,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const getAreasConocimiento = async(req, res) => {
    
    try {
        areas = await dao_usuario.obtenerAreasConocimiento();
     
        
        return res.status(200).json({
            ok: true,
            areas,
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
    getDatosHome,
    getUniversidades,
    getAreasConocimiento,
    getAreasConocimientoUsuario
}