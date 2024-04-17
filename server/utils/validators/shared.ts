import { z } from 'zod';

export const CoercedIntegerId = z.coerce.number().int().min(1);
export const SearchQuery = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(25),
	skip: z.coerce.number().int().min(0).default(0)
});
