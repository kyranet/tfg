import { z } from 'zod';
import { getTagsStartingWith } from '~/server/utils/database/services/daos/oferta/get';

const schema = z.object({ text: z.string() });
export default eventHandler(async (event) => {
	const { text } = await getValidatedQuery(event, schema.parse);
	return getTagsStartingWith(text);
});
