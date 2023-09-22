
const { response } = require("express");
const daoNotificacion = require("./../database/services/daos/daoNotificacion");
const TNotificacion = require("./../database/services/transfers/TNotificacion");


const obtenerNotificaciones = async(req, res = response) =>{
    try{
        let notificaciones = await daoNotificacion.obtenerNotificaciones(req.query.idUser);
        console.log(req.query.idUser);
        return res.status(200).json({
            ok:true,
            notificaciones,
            total:notificaciones.length
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        })
    }
}

const obtenerNotificacion = async (req, res) =>{
    try{
        const id = req.params.id;
        const notificacion = await daoNotificacion.cargarNotificacion(id);
        return res.status(200).json({
            ok:true,
            notificacion,
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            ok:false,
            msg:'Error inesperado(al intentar obtenerNotificacion)'
        });
    }
}

const crearNotificacionOfertaAceptada = async (req, res = response) =>{
    try{
        const notificacion = new TNotificacion(
            null,
            null,
            null,
            "Oferta Aceptada",
            "Enhorabuena, su oferta ha sido aceptada",
            null,
            null,
            req.query.idOferta,
            null,
            1
        );
        let notificacionid = await daoNotificacion.crearNotificacionOfertaAceptada(notificacion, req.query.idSocio);
        console.log(notificacionid);
        return res.status(200).json({
            ok:true,
            notificacionid
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            ok:false,
            msg:'Error inesperado(al intentar crearNotificacionOfertaAceptada)'
        });
    }
};


const rechazarSocio = async(req, res = response) =>{
    try{
        let ofertaAceptada = await new daoNotificacion.obtenerNotificacionOfertaAceptada(req.query.idNotificacion);
        console.log(ofertaAceptada);
        const notificacion = new TNotificacion(
            null,
            ofertaAceptada[0].idSocio,
            null,
            'Peticion rechazado',
            'Ops, su peticion ha sido rechazado',
            null,
            null,
            ofertaAceptada[0].idOferta,
            null,
            0
        )
        let newNotificacion = await daoNotificacion.crearNotificacionAceptadacionRechazada(notificacion, req.query.idNotificacion);
        return res.status(200).json({
            ok:true
        });
        
    }catch(err){
        console.error(err);
        return res.status(500).json({
            ok:false,
            msg:'Error inesperado(al intentar rechazaSocio)'
        });
    }
}

const aceptarSocio = async(req, res = response) =>{
    try{
        let notificacionResponder = await daoNotificacion.obtenerNotificacionOfertaAceptada(req.query.idNotificacion);
        const notificacion = new TNotificacion(
            null,
            notificacionResponder[0].idSocio,
            null,
            'Peticion aceptada',
            'Enhorabuena,  su peticion ha sido aceptada',
            null,
            null,
            notificacionResponder[0].idOferta,
            null,
            1
        )
        let newNotificacion = await daoNotificacion.crearNotificacionAceptadacionAceptada(notificacion, req.query.idNotificacion, req.query.idPartenariado);

        return res.status(200).json({
            ok:true
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            ok:false,
            msg:'Error inesperado(al intentar aceptarSocio)'
        });
    }
}

const notificarPartenariadoCreado = async(req, res) =>{
    try {
        let notificacion = new TNotificacion(
            "",
            "",
            "",
            "Partenariado creado",
            "Enhorabuena, se ha creado el partenariado",
            "",
            "",
            "",
            "",
            0,
            req.query.idPartenariado
        )
        daoNotificacion.notificarPartenariadoRellenado(notificacion);
        return res.status(200).json({
            ok:true
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok:false,
            msg:'Error inesperado(al intentar crear notificacionPartenariadoCreado)'
        });
        
    }
}

const notificacionDemandaRespaldado = async(req, res)=>{
    try {
        let notificacion = new TNotificacion(
            "",
            req.body.idDestino.id,
            "",
            "Demanda Respaldada",
            "Enhorabuena, un profesor ha respaldado su demanda",
            "",
            req.body.emailOrigen,
            "","",
            1,
            req.body.idPartenariado,
            req.body.idDemanda,
            req.body.tituloDemanda, 
        )
        daoNotificacion.crearNotificacionDemandaRespalda(notificacion);
        return res.status(200).json({
            ok:true
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok:false,
            msg:'Error inesperado(al intentar crear notificacionDemandaRespaldada)'
        });
        
    }


}

module.exports ={
    obtenerNotificaciones,
    obtenerNotificacion,
    crearNotificacionOfertaAceptada,
    rechazarSocio,
    aceptarSocio,
    notificarPartenariadoCreado,
    notificacionDemandaRespaldado
    
}