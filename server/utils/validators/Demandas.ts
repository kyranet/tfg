import { z } from 'zod';

export const DemandaBody = z.object({
	city: z.string().min(1).max(200).default('online'),
	purpose: z.string().min(1).max(200),
	periodDefinitionStart: z.coerce.date().nullable().default(null),
	periodDefinitionEnd: z.coerce.date().nullable().default(null),
	periodExecutionStart: z.coerce.date().nullable().default(null),
	periodExecutionEnd: z.coerce.date().nullable().default(null),
	periodDeadline: z.coerce.date().nullable().default(null),
	temporaryObservations: z.string().max(1200).nullable().default(null),
	beneficiaryCommunity: z.string().min(1).max(200),
	title: z.string().min(1).max(200),
	description: z.string().min(1).max(1200),
	socialNeed: z.number().int().min(1),
	serviceAreas: z.array(z.number().int().min(1)).optional(),
	degrees: z.array(z.number().int().min(1)).optional()
});
