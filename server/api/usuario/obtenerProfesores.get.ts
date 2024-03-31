import { defineEventHandler, createError } from 'h3';
import {obtenerProfesores} from '../../utils/database/services/daos/daoUsuario';

export default defineEventHandler(async () => {
  try {
    const profesores = await obtenerProfesores();
    return { ok: true, profesores };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
