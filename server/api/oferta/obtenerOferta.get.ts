import { defineEventHandler, createError } from 'h3';
import {obtenerOfertaServicio} from '../../utils/database/services/daos/daoOferta';

export default defineEventHandler(async (event) => {
  try {
    //Otra forma mejor?
    const id = event.context.params.id as unknown as number;
    const oferta = await obtenerOfertaServicio(id);
    return { ok: true, oferta };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado.' });
  }
});
