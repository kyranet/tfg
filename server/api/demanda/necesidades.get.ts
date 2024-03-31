import { obtenerListaNecesidadSocial } from "../../utils/database/services/daos/daoDemanda";
import { defineEventHandler,createError } from 'h3';

// Manejar GET /api/demanda/necesidades
export const getNecesidades = defineEventHandler(async (event) => {
    try {
      const necesidadSocial = await obtenerListaNecesidadSocial();
      return { ok: true, necesidadSocial };
    } catch (error) {
      console.error(error);
      throw createError({ statusCode: 500, statusMessage: 'Error al obtener las necesidades sociales' });
    }
  });