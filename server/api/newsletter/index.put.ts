import { z } from 'zod';
import { putNewsletter } from '~/server/utils/database/services/daos/comunicacion/insert';

const schemaBody = z.object({ email: z.string().max(200) });
export default eventHandler(async (event) => {
	const body = await readValidatedBody(event, schemaBody.parse);
	await putNewsletter({ mailTo: body.email });
	return null;
});
