import { countInitiatives, searchInitiatives } from '~/server/utils/database/services/daos/daoIniciativa';
import { SearchQuery } from '~/server/utils/validators/shared';

const schemaQuery = SearchQuery;
export default eventHandler(async (event) => {
	const [initiatives, total] = await Promise.all([
		searchInitiatives(await getValidatedQuery(event, schemaQuery.parse)), //
		countInitiatives()
	]);

	return { initiatives, total };
});
