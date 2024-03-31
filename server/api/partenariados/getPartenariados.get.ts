import { defineEventHandler, getQuery, createError } from 'h3';
import {obtenerPartenariados} from '../../utils/database/services/daos/daoPartenariado';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    let partenariados = await obtenerPartenariados(query.limit as number, query.skip as number, query.filtros as string);
    return { ok: true, partenariados, total: partenariados.length };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
