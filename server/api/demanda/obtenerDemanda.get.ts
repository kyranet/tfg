import { defineEventHandler,createError } from 'h3';
import { obtenerDemandaServicio } from '../../utils/database/services/daos/daoDemanda';

export default defineEventHandler(async (event) => {
  try {
    //Hay forma mejor de castear???
    const id = event.context.params.id as unknown as number;
    const demanda = await obtenerDemandaServicio(id);
    return { ok: true, demanda };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener demanda' });
  }
});
