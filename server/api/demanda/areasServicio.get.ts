import TAreaServicio from '../../utils/database/services/Transfer/tAreaServicio';
import { obtenerListaAreasServicio } from '../../utils/database/services/daos/daoDemanda';
import { defineEventHandler, createError } from 'h3';

// Manejar GET /api/demanda/areasServicio
export const getAreasServicio = defineEventHandler(async (event) => {
  try {
    const areasServicio: TAreaServicio[] = await obtenerListaAreasServicio();
    return { ok: true, areasServicio };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener las áreas de servicio' });
  }
});
