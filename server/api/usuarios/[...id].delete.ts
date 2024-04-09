import { z } from 'zod';
import { esGestor } from '~/helpers/auth';
import { borrarUsuario, obtenerUsuarioSinRolPorId } from '~/server/utils/database/services/daos/daoUsuario';

const schema = z.object({ id: z.coerce.number().int() });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schema.parse);
	const currentUser = await requireAuthSession(event);

	const usuario = await obtenerUsuarioSinRolPorId(id);
	if (!usuario) {
		throw createError({ statusCode: 404, statusMessage: 'El usuario no existe' });
	}

	if (!esGestor(currentUser)) {
		throw createError({ statusCode: 403, statusMessage: 'Operación no autorizada, solo gestores.' });
	}

	// FIXME: Update the types of auth.data
	if (id === (currentUser.data.id as any)) {
		throw createError({ statusCode: 403, statusMessage: 'Operación no autorizada, no se puede borrar a uno mismo.' });
	}

	await borrarUsuario(id);
	return null;
});
