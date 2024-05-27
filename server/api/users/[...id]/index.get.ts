import { z } from 'zod';
import { obtenerUsuarioSinRolPorId } from '~/server/utils/database/services/daos/usuario/get';

const schema = z.object({ id: CoercedIntegerId.or(z.literal('@me')) });
export default eventHandler(async (event) => {
	let { id } = await getValidatedRouterParams(event, schema.parse);
	if (id === '@me') {
		const session = await requireAuthSession(event);
		id = session.data.id;
	}

	return await obtenerUsuarioSinRolPorId(id);
});
