const daoOferta = require("./../database/services/daos/daoOferta");
const daoUtils = require("./../database/services/daos/daoUtils");
const TOferta = require("./../database/services/transfers/TOfertaServicio");

const getAreasServicio = async (req, res) => {
    try {
        areasServicio = await daoOferta.obtenerListaAreasServicio();

        return res.status(200).json({
            ok: true,
            areasServicio,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const crearOferta = async (req, res = response) => {
    try {
        let areas = [];
        req.body.area_servicio.forEach(data => {
            areas.push(data.id);
        });
        let oferta = new TOferta(
            null,
            req.body.titulo,
            req.body.descripcion,
            req.body.imagen,
            null,
            null,
            req.body.asignatura,
            req.body.cuatrimestre,
            req.body.anio_academico,
            req.body.fecha_limite,
            req.body.observaciones,
            req.current_user.uid,
            areas,
            req.current_user.uid);

        let ofertaId = await daoOferta.crearOferta(oferta);
        oferta.id = ofertaId;
        if(req.body.tags != undefined){
            for (tagName of req.body.tags) {
                await daoUtils.createAndLinkedTags(tagName, ofertaId, 'oferta');
            }
        }
        console.log(oferta);
        
        return res.status(200).json({
            ok: true,
            oferta: oferta,
        });
    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const obtenerOferta = async (req, res) => {
    try {

        const id = req.params.id;
        const oferta = await daoOferta.obtenerOfertaServicio(id);

        return res.status(200).json({
            ok: true,
            oferta,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado.',
        });
    }
}


const obtenerOfertas = async (req, res = response) => {
    try {
        let ofertas = await daoOferta.obtenerTodasOfertasServicio(req.query.limit, req.query.skip, req.query.filtros);
        let total = await daoOferta.contarTodasOfertasServicio();
        console.log("total de ogertas generadas en la fata desde el controlador");
        console.log(total);
        return res.status(200).json({
            ok: true,
            ofertas,
            total: total
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        })
    }
}
/*****/

const getOfertasAreaServicio = async(req, res = response) => {
    console.log("aaaaaaaa");
    try{
        const id = req.params.id;
        console.log("IDD: " + id);
        let ofertas = [];
        ofertas = await daoOferta.obtenerAnuncioPorAreaServicio(id);
        console.log("ofertas = " + ofertas);
        return res.status(200).json({
            ok: true,
            ofertas
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error inesperado",
        })
    }
}

module.exports = {
    getAreasServicio,
    crearOferta,
    obtenerOferta,
    obtenerOfertas,
    getOfertasAreaServicio
}
