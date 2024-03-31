import { defineEventHandler, createError } from 'h3';
import { obtenerUsuarioSinRolPorId,borrarUsuario} from '../../utils/database/services/daos/daoUsuario'; 
import { esGestor } from '~/helpers/auth';

export default defineEventHandler(async (event) => {
  const uid = event.context.params.id as unknown as number;
  const currentUser = event.context.req.currentUser; 

  try {
    const usuario = await obtenerUsuarioSinRolPorId(uid);

    if (!usuario) {
      throw createError({ statusCode: 404, statusMessage: 'El usuario no existe' });
    }

    if (!esGestor(currentUser)) {
      throw createError({ statusCode: 403, statusMessage: 'Operación no autorizada, solo gestores.' });
    }

    if (uid === currentUser.uid) {
      throw createError({ statusCode: 403, statusMessage: 'Operación no autorizada, no se puede borrar a uno mismo.' });
    }

    await borrarUsuario(uid); 

    return { ok: true, message: 'Usuario borrado correctamente' };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
