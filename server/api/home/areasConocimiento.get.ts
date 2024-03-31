import { defineEventHandler, createError } from 'h3';
import {obtenerAreasConocimiento} from '../../utils/database/services/daos/daoUsuario';

export default defineEventHandler(async () => {
  try {
    const areas = await obtenerAreasConocimiento();
    console.log(areas);

    return {
      ok: true,
      areas,
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
