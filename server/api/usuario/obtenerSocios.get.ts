import { defineEventHandler, createError } from 'h3';
import {obtenerSociosComunitarios} from '../../utils/database/services/daos/daoUsuario';

export default defineEventHandler(async () => {
  try {
    const socios = await obtenerSociosComunitarios();
    return { ok: true, socios };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
