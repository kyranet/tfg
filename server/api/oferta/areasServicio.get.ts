import { defineEventHandler, createError } from 'h3';
import {obtenerListaAreasServicio} from '../../utils/database/services/daos/daoOferta';
import TAreaServicio from '../../utils/database/services/Transfer/tAreaServicio';

export default defineEventHandler(async () => {
  try {
    const areasServicio:TAreaServicio[] = await obtenerListaAreasServicio();
    return { ok: true, areasServicio };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
