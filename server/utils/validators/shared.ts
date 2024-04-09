import { z, type ZodTypeAny } from 'zod';

export const CoercedIntegerId = z.coerce.number().int().min(1);
export const SearchQuery = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(25),
	skip: z.coerce.number().int().min(0).default(0)
});

export function stringJSON<ZodSchema extends ZodTypeAny>(schema: ZodSchema) {
	return z.preprocess((arg) => JSON.parse(String(arg)), schema);
}
