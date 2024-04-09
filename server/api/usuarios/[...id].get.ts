import { z } from 'zod';
import { getPathAvatar, obtenerUsuarioSinRolPorId } from '~/server/utils/database/services/daos/daoUsuario';

const schema = z.object({ id: z.coerce.number().int() });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schema.parse);
	const usuario = await obtenerUsuarioSinRolPorId(id);
	return { ...usuario, origin_img: await getPathAvatar(id) };
});
