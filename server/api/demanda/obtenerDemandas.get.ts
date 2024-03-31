import { defineEventHandler, getQuery,createError } from 'h3';
import { obtenerTodasDemandasServicio, contarTodasDemandasServicio } from '../../utils/database/services/daos/daoDemanda';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const demandas = await obtenerTodasDemandasServicio(query.limit, query.skip, query.filtros);
    const total = await contarTodasDemandasServicio();
    return { ok: true, demandas, total };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener las demandas' });
  }
});
