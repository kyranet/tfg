import { defineEventHandler, createError } from 'h3';
import {obtenerUsuarioSinRolPorId,getPathAvatar} from '../../utils/database/services/daos/daoUsuario';

export default defineEventHandler(async (event) => {
  try {
    const uid = event.context.params.uid as unknown as number;
    let usuario = await obtenerUsuarioSinRolPorId(uid);
    let usuarioPath = await getPathAvatar(uid);
    usuario.origin_img = usuarioPath; 
    return { ok: true, usuario };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
