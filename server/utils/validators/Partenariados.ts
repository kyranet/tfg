import { z } from 'zod';

export const PartenariadoBody = z.object({
	profesores: z.string().array(),
	titulo: z.string(),
	descripcion: z.string(),
	admiteExternos: z.boolean(),
	responsable: z.string(),
	demanda: z.number().int(),
	oferta: z.number().int()
});