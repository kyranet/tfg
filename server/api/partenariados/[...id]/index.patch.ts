import { z } from 'zod';
import { actualizarPartenariado } from '~/server/utils/database/services/daos/daoColaboracion';
import { PartenariadoEstado } from '~/server/utils/database/services/types/Partenariado';
import { CoercedIntegerId } from '~/server/utils/validators/shared';

const schemaParams = z.object({ id: CoercedIntegerId });
const schemaBody = z.object({
	demanda: z.coerce.number().int(),
	titulo: z.string(),
	descripcion: z.string(),
	externos: z.boolean(),
	profesores: z.number().int().array(),
	estado: z.enum([PartenariadoEstado.EnNegociacion, PartenariadoEstado.Acordado, PartenariadoEstado.Suspendido, PartenariadoEstado.EnCreacion])
});
export default eventHandler(async (event) => {
	const { id } = await getValidatedRouterParams(event, schemaParams.parse);
	const body = await readValidatedBody(event, schemaBody.parse);
	return actualizarPartenariado({
		id,
		id_demanda: body.demanda,
		titulo: body.titulo,
		descripcion: body.descripcion,
		admite_externos: body.externos,
		profesores: body.profesores,
		estado: body.estado
	});
});
