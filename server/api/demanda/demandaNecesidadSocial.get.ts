import {obtenerDemandaPorNecesidadSocial } from '../../utils/database/services/daos/daoDemanda';
import { defineEventHandler,createError } from 'h3';

export const getDemandasNecesidadSocial=defineEventHandler(async (event) => {
  try {
    const id = event.context.params.id as unknown as number;
    const demandas = await obtenerDemandaPorNecesidadSocial(id);
    return { ok: true, demandas };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error al obtener Demandas por necesidad social' });
  }
  });