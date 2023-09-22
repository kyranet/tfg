const daoDemanda = require('./../database/services/daos/daoDemanda');
const TDemanda = require('./../database/services/transfers/TDemandaServicio');

const UNEXPECTED_ERROR = 'Error inesperado';

const getAreasservicio = async (req, res) => {
    try {
        areasServicio = await daoDemanda.obtenerListaAreasServicio();

        return res.status(200).json({
            ok: true,
            areasServicio
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const getTitulaciones = async (req, res) => {
    try {
        titulacionLocal = await daoDemanda.obtenerListaTitulacionLocal();
        return res.status(200).json({
            ok: false,
            titulacionLocal
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

/****/
const getDemandasAreaServicio = async (req, res = response) => {
    try {
        const id = req.params.id;
        let demandas = [];
        demandas = await daoDemanda.obtenerDemandaPorAreaServicio(id);
        return res.status(200).json({
            ok: true,
            demandas
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const getDemandasNecesidadSocial = async (req, res = response) => {
    try {
        const id = req.params.id;
        let demandas = [];
        demandas = await daoDemanda.obtenerDemandaPorNecesidadSocial(id);
        return res.status(200).json({
            ok: true,
            demandas
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};
/****/

const getNecesidades = async (req, res) => {
    try {
        necesidadSocial = await daoDemanda.obtenerListaNecesidadSocial();

        return res.status(200).json({
            ok: true,
            necesidadSocial
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const crearDemanda = async (req, res = response) => {//continuar
    try {
        let areas = [];
        req.body.area_servicio.forEach(data => {
            areas.push(data.id);
        });
        let titulaciones = [];
        req.body.titulacion_local.forEach(data => {
            titulaciones.push(data.id);
        });
        const demanda = new TDemanda(
            null,
            req.body.titulo,
            req.body.descripcion,
            req.body.imagen,
            null,
            null,
            req.current_user.uid,
            req.body.ciudad,
            req.body.objetivo,
            req.body.fechaDefinicionIni,
            req.body.fechaDefinicionFin,
            req.body.fechaEjecucionIni,
            req.body.fechaEjecucionFin,
            req.body.fechaFin,
            req.body.observaciones,
            req.body.necesidad_social,
            titulaciones,
            areas,
            req.body.comunidadBeneficiaria,
            0
        );
        let demandaId = await daoDemanda.crearDemanda(demanda);
        demanda.id = demandaId;

        return res.status(200).json({
            ok: true,
            demanda: demanda
        });
    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const obtenerDemandas = async (req, res = response) => {
    try {
        let demandas = await daoDemanda.obtenerTodasDemandasServicio();
        let total = await daoDemanda.contarTodasDemandasServicio();
        return res.status(200).json({
            ok: true,
            demandas,
            total: total
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const obtenerDemanda = async (req, res) => {
    try {
        const demanda = await daoDemanda.obtenerDemandaServicio(req.params.id);
        return res.status(200).json({
            ok: true,
            demanda
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: UNEXPECTED_ERROR
        });
    }
};

module.exports = {
    getAreasservicio,
    getNecesidades,
    getTitulaciones,
    crearDemanda,
    obtenerDemanda,
    obtenerDemandas,
    getDemandasNecesidadSocial,
    getDemandasAreaServicio
};
