import { defineEventHandler, readBody, createError } from 'h3';
import {crearNotificacionDemandaRespalda} from '../../utils/database/services/daos/daoNotificacion';
import TNotificacion from '../../utils/database/services/Transfer/tNotificacion';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const notificacion:TNotificacion={
      id: null,
      idDestino: body.idDestino,
      leido: null,
      titulo:"Demanda Respaldada",
      mensaje: "Enhorabuena, un profesor ha respaldado su demanda",
      fecha_fin: null,
      emailOrigen: body.emailOrigen,
      idOferta: null,
      tituloOferta: null,
      idMatching: 1,
      idDemanda: body.idDemanda,
      tituloDemanda: body.tituloDemanda,
      pendiente: true,
      idPartenariado: body.idPartenariado
    };
    await crearNotificacionDemandaRespalda(notificacion);
    return {
      ok: true
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado (al intentar crear notificacionDemandaRespaldada)' });
  }
});
