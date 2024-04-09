import {obtenerDemandaPorAreaServicio } from '../../utils/database/services/daos/daoDemanda';
import { defineEventHandler,createError } from 'h3';

export const getDemandasAreaServicio=defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id as unknown as number;
    const demandas = await obtenerDemandaPorAreaServicio(id);
    return { ok: true, demandas };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener Demandas por area de servicio' });
  }
  });