import { obtenerListaTitulacionLocal } from "../../utils/database/services/daos/daoDemanda";
import { defineEventHandler,createError } from 'h3';

// Manejar GET /api/demanda/titulaciones
export const getTitulaciones = defineEventHandler(async (event) => {
    try {
      const titulacionLocal = await obtenerListaTitulacionLocal();
      return { ok: true, titulacionLocal };
    } catch (error) {
      console.error(error);
      throw createError({ statusCode: 500, statusMessage: 'Error al obtener las titulaciones' });
    }
  });