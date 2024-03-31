import { defineEventHandler, getQuery, createError } from 'h3';
import {obtenerNotificacionOfertaAceptada,crearNotificacionAceptadacionRechazada} from '../../utils/database/services/daos/daoNotificacion';
import TNotificacion from '../../utils/database/services/Transfer/tNotificacion';

//Del codigo original no logro saber cuales son los que se crean en este punto
//TODO revisar 
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    let ofertaAceptada = await obtenerNotificacionOfertaAceptada(query.idNotificacion);
    const notificacion:TNotificacion={
        id: null,
        idDestino: ofertaAceptada[0].idSocio,
        leido: null,
        titulo: "Peticion rechazada",
        mensaje: "Ops, su peticion ha sido rechazada",
        fecha_fin: null,
        emailOrigen: null,
        idOferta: ofertaAceptada[0].idOferta,
        tituloOferta: null,
        idMatching: 1,
        idDemanda: 0,
        tituloDemanda: '',
        pendiente: false,
        idPartenariado: 0
    };
    let newNotificacion = await crearNotificacionAceptadacionRechazada(notificacion, query.idNotificacion);
    return {
      ok: true
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado (al intentar rechazarSocio)' });
  }
});
