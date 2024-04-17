import { z } from 'zod';
import { obtenerUsuarioSinRolPorId } from '~/server/utils/database/services/daos/daoUsuario';

const schema = z.object({ id: CoercedIntegerId });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schema.parse);
	return await obtenerUsuarioSinRolPorId(id);
});
