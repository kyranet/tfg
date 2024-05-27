import { z } from 'zod';
import { countNewsletters } from '~/server/utils/database/services/daos/comunicacion/count';
import { getAllNewsletters } from '~/server/utils/database/services/daos/comunicacion/get';

const schemaQuery = z //
	.object({
		email: z.string().max(200).optional(),
		withCounts: z.coerce.boolean().optional()
	})
	.merge(SearchQuery);

export default eventHandler(async (event) => {
	await requireAuthRole(event, ['Admin']);

	const body = await getValidatedQuery(event, schemaQuery.parse);
	const [count, entries] = await Promise.all([
		body.withCounts ? countNewsletters() : undefined, //
		getAllNewsletters(body)
	]);
	return { count, entries };
});
