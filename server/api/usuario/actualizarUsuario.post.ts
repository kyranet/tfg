import { defineEventHandler, readBody, createError, useQuery } from 'h3';
import bcrypt from 'bcryptjs';
import { generarJWT } from '~/helpers/jwt';
import { obtenerUsuarioSinRolPorId,obtenerUsuarioSinRolPorEmail,actualizarUsuario,insertarProfesorExterno } from '../../utils/database/services/daos/daoUsuario'; 
import { esGestor } from '~/helpers/auth';
import TUsuario from '../../utils/database/services/Transfer/tUsuario';

export default defineEventHandler(async (event) => {
  const uid = event.context.params.id as unknown as number;
  const body= await readBody(event);

  try {
    const usuario = await obtenerUsuarioSinRolPorId(uid);

    if (!usuario) {
      throw createError({ statusCode: 404, statusMessage: 'El usuario no existe' });
    }

    // Asume la implementación de esGestor para verificar si el usuario actual es un gestor
    if (uid !== usuario.id && !esGestor(event)) {
      throw createError({ statusCode: 403, statusMessage: 'Operación no autorizada, solo gestores.' });
    }

    const campos = { ...body };

    // comprobar si quiere cambiar su email
    if (campos.email && usuario.email === campos.email) {
      delete campos.email;
    }
   // En el codigo original solo se puede cambiar el email en cuentas creadas desde el propio portal. Se mantiene?
    if (campos.email && usuario.origin_login !== 'Portal ApS') {
      throw createError({ statusCode: 403, statusMessage: `No está permitido cambiar el email para cuentas que han utilizado el SSO de ${usuario.origin_login}.` });
    }

    //Comprobar que no exista
    if (campos.email) {
      const existeEmail = await obtenerUsuarioSinRolPorEmail(campos.email);
      if (existeEmail && uid !== existeEmail.id) {
        throw createError({ statusCode: 400, statusMessage: 'El correo ya está registrado' });
      }
    }

   // En el codigo original si la contraseña no viene vacia, es que la quiere cambiar. Mantenemos?
    if (campos.password) {
      campos.password = bcrypt.hashSync(campos.password, bcrypt.genSaltSync());
    } else {
      delete campos.password;
    }

    // En el original nunca se puede cambiar el campo origin_login: UNED lo determina el tipo de login desde el SSO de la UNED, o google lo determina GOOGLE. Mantenemos?
    delete campos.origin_login;

    if (!esGestor(event)) {
      delete campos.rol;
    }

    //La forma en la que se actualiza el usuario en el codigo original es bastante extraña. Revisar.
    const usuarioActualizado = await actualizarUsuario(usuario);

    const token = await generarJWT(usuarioActualizado);

    return { ok: true, token, usuario: usuarioActualizado };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error inesperado' });
  }
});
