import { defineEventHandler, createError } from 'h3';
import cargarNotificacion from '../../utils/database/services/daos/daoNotificacion';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const notificacion = await cargarNotificacion(id);
    return {
      ok: true,
      notificacion,
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado (al intentar obtenerNotificacion)' });
  }
});
