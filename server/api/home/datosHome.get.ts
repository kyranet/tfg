import { defineEventHandler, createError } from 'h3';
import {contarProyectos,contarPartenariados,contarIniciativas} from '../../utils/database/services/daos/daoColaboracion'
export default defineEventHandler(async () => {
  try {
    const [count_proyectos, count_partenariados, count_ofertas] = await Promise.all([
      contarProyectos(),
      contarPartenariados(),
      contarIniciativas(),
    ]);

    return {
      ok: true,
      count_proyectos,
      count_partenariados,
      count_ofertas,
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
