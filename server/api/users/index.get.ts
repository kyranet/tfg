import { z } from 'zod';
import { countUsers, searchUsers } from '~/server/utils/database/services/daos/daoUsuario';
import { SearchQuery } from '~/server/utils/validators/shared';

const schemaQuery = z //
	.object({ query: z.string().trim().optional() })
	.merge(SearchQuery);

export default eventHandler(async (event) => {
	const [users, total] = await Promise.all([
		searchUsers(await getValidatedQuery(event, schemaQuery.parse)), //
		countUsers()
	]);

	return { users, total };
});
