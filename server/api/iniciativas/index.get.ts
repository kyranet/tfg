import { countInitiatives, searchInitiatives } from '~/server/utils/database/services/daos/daoIniciativa';
import { SearchQuery } from '~/server/utils/validators/shared';

const schemaQuery = SearchQuery;
export default eventHandler(async (event) => {
	const [entries, total] = await Promise.all([
		searchInitiatives(await getValidatedQuery(event, schemaQuery.parse)), //
		countInitiatives()
	]);

	return { entries, total };
});
