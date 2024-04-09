import { z } from 'zod';
import { readByStartWithWord } from '~/server/utils/database/services/daos/daoTags';

const schema = z.object({ text: z.string() });
export default eventHandler(async (event) => {
	const { text } = await getValidatedQuery(event, schema.parse);
	return readByStartWithWord(text);
});
