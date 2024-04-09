import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { esGestor } from '~/helpers/auth';
import { generarJWT } from '~/helpers/jwt';
import { actualizarUsuario, obtenerUsuarioSinRolPorEmail, obtenerUsuarioSinRolPorId } from '../../utils/database/services/daos/daoUsuario';

const paramsSchema = z.object({ id: z.number({ coerce: true }).int() });
export default eventHandler(async (event) => {
	const { id } = await getValidatedQuery(event, paramsSchema.parse);
	const body = await readBody(event);

	const usuario = await obtenerUsuarioSinRolPorId(id);

	if (!usuario) {
		throw createError({ statusCode: 404, statusMessage: 'El usuario no existe' });
	}

	// Asume la implementación de esGestor para verificar si el usuario actual es un gestor
	if (id !== usuario.id && !esGestor(event)) {
		throw createError({ statusCode: 403, statusMessage: 'Operación no autorizada, solo gestores.' });
	}

	const campos = { ...body };

	// comprobar si quiere cambiar su email
	if (campos.email && usuario.email === campos.email) {
		delete campos.email;
	}
	// En el codigo original solo se puede cambiar el email en cuentas creadas desde el propio portal. Se mantiene?
	if (campos.email && usuario.origin_login !== 'Portal ApS') {
		throw createError({
			statusCode: 403,
			statusMessage: `No está permitido cambiar el email para cuentas que han utilizado el SSO de ${usuario.origin_login}.`
		});
	}

	//Comprobar que no exista
	if (campos.email) {
		const existeEmail = await obtenerUsuarioSinRolPorEmail(campos.email);
		if (existeEmail && id !== existeEmail.id) {
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

	return { token, usuario: usuarioActualizado };
});
