import Iniciativa from '~/models/iniciativa.model';
import { SearchQuery } from '~/server/utils/validators/shared';

const schemaQuery = SearchQuery;
export default eventHandler(async (event) => {
	const { skip, limit } = await getValidatedQuery(event, schemaQuery.parse);

	// TODO logica filtrado
	const [iniciativas, filtradas, total] = await Promise.all([
		Iniciativa.find().skip(skip).limit(limit),
		Iniciativa.countDocuments(),
		Iniciativa.countDocuments()
	]);

	return {
		ok: true,
		iniciativas,
		filtradas,
		total
	};
});
