import { countInitiatives } from '~/server/utils/database/services/daos/iniciativa/count';
import { searchInitiatives } from '~/server/utils/database/services/daos/iniciativa/get';
import { SearchQuery } from '~/server/utils/validators/shared';

const schemaQuery = SearchQuery;
export default eventHandler(async (event) => {
	const [entries, total] = await Promise.all([
		searchInitiatives(await getValidatedQuery(event, schemaQuery.parse)), //
		countInitiatives()
	]);

	return { entries, total };
});
