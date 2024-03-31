import { defineEventHandler, getQuery, createError } from 'h3';
import obtenerNotificaciones from '../../utils/database/services/daos/daoNotificacion';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    let notificaciones = await obtenerNotificaciones(query.idUser);
    return {
      ok: true,
      notificaciones,
      total: notificaciones.length
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
