import { defineEventHandler, createError } from 'h3';
import {obtenerPartenariado} from '../../utils/database/services/daos/daoColaboracion';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id as unknown as number;
    const partenariado = await obtenerPartenariado(id);
    return { ok: true, partenariado };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
