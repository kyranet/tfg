import { z } from 'zod';
import { countPartnerships, getAllPartnerships } from '~/server/utils/database/services/daos/daoColaboracion';
import { ProyectoEstado } from '~/server/utils/database/services/types/Proyecto';

const schema = SearchQuery.merge(
	z.object({
		title: z.string().optional(),
		acceptsInternals: z.coerce.boolean().optional(),
		status: z
			.enum([
				ProyectoEstado.EnCreacion,
				ProyectoEstado.AbiertoProfesores,
				ProyectoEstado.AbiertoEstudiantes,
				ProyectoEstado.EnCurso,
				ProyectoEstado.Cerrado
			])
			.optional(),
		manager: CoercedIntegerId.optional(),
		city: z.string().optional()
	})
);
export default eventHandler(async (event) => {
	const [entries, count] = await Promise.all([getAllPartnerships(await getValidatedQuery(event, schema.parse)), countPartnerships()]);
	return { entries, count };
});
