import { constants, createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { z } from 'zod';

const Root = resolve('./data/avatars');

const FormatSchema = z.enum(['png', 'webp']);
const SchemaQuery = z.object({
	size: z.enum(['64', '128', '256', '512']).default('512')
});
export default eventHandler(async (event) => {
	let id = getRouterParam(event, 'id')!;
	const query = await getValidatedQuery(event, SchemaQuery.parse);

	let format: 'png' | 'webp';
	let dotIndex = id.indexOf('.');
	if (dotIndex !== -1) {
		format = FormatSchema.parse(id.substring(dotIndex + 1));
		id = id.substring(0, dotIndex);
	} else {
		format = 'webp';
	}

	const path = join(Root, `${id}.png`);
	const canRead = await access(path, constants.R_OK)
		.then(() => true)
		.catch(() => false);
	if (!canRead) {
		throwNotFoundError(`El avatar especificado no existe (${id})`);
	}

	const stream =
		format === 'webp' && query.size === '512' //
			? getFileStream(path)
			: getProcessedFileStream(path, format, query.size);

	const now = new Date();
	setHeader(event, 'Cache-Control', 'public, max-age=31536000');
	setHeader(event, 'Date', now.toUTCString());
	setHeader(event, 'Expires', new Date(now.getTime() + 31536000000).toUTCString());
	setHeader(event, 'Content-Type', format === 'webp' ? 'image/webp' : 'image/png');
	setHeader(event, 'Vary', 'Accept-Encoding');
	setHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive, nocache, noimageindex, noodp');

	return sendStream(event, stream);
});

function getFileStream(path: string) {
	return createReadStream(path);
}

function getProcessedFileStream(path: string, format: 'png' | 'webp', size: '64' | '128' | '256' | '512') {
	const transformer = sharp(path);
	if (format === 'png') transformer.png();
	if (size !== '512') transformer.resize(Number(size), Number(size), { fit: 'cover' });

	return transformer;
}
