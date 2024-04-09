import { z } from 'zod';
import { actualizarEstadoPartenariado, obtenerPartenariado } from '~/server/utils/database/services/daos/daoColaboracion';
import { PartenariadoStatus } from '~/server/utils/database/services/types/Partenariado';

// NOTE: This route is unnecessary, `index.patch.ts` can be used instead
const schemaParams = z.object({ id: z.coerce.number().int() });
const schemaBody = z.object({
	estado: z.enum([PartenariadoStatus.EnNegociacion, PartenariadoStatus.Acordado, PartenariadoStatus.Suspendido, PartenariadoStatus.EnCreacion])
});
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);
	const body = await readValidatedBody(event, schemaBody.parse);

	const partenariado = await obtenerPartenariado(id);
	partenariado.estado = body.estado;
	await actualizarEstadoPartenariado(partenariado);
	return partenariado;
});