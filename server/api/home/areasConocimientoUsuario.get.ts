import { defineEventHandler, createError } from 'h3';
import {obtenerAreasConocimientoUsuario} from '../../utils/database/services/daos/daoUsuario';

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id as unknown as number;
    const areasUsuario = await obtenerAreasConocimientoUsuario(id);

    return {
      ok: true,
      areasUsuario,
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
