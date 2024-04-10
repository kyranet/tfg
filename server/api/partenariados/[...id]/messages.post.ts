import { z } from 'zod';
import { crearMensajeColaboracion } from '~/server/utils/database/services/daos/daoComunicacion';
import { CoercedIntegerId } from '~/server/utils/validators/shared';

const schemaParams = z.object({ id: CoercedIntegerId });
const schemaBody = z.object({ mensaje: z.string() });
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);
	const body = await readValidatedBody(event, schemaBody.parse);
	const user = await requireAuthSession(event);

	return crearMensajeColaboracion({ texto: body.mensaje, usuario: user.data.id }, id);
});
