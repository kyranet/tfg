import keyword_extractor from 'keyword-extractor';
import { z } from 'zod';

const schema = z.object({ text: z.string().trim() });
export default eventHandler(async (event) => {
	const { text } = await getValidatedQuery(event, schema.parse);
	return keyword_extractor.extract(text, {
		language: 'spanish',
		remove_digits: true,
		return_changed_case: true,
		remove_duplicates: true
	});
});
