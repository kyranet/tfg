import { z } from 'zod';

export const DemandaBody = z.object({
	areaServicio: z.number().int().array(),
	titulacionesLocales: z.number().int().array(),
	titulo: z.string(),
	descripcion: z.string(),
	imagen: z.string(),
	ciudad: z.string(),
	finalidad: z.string(),
	fechas: z.object({
		definition: z.object({
			start: z.coerce.date(),
			end: z.coerce.date()
		}),
		execution: z.object({
			start: z.coerce.date(),
			end: z.coerce.date()
		}),
		end: z.coerce.date()
	}),
	observaciones: z.string(),
	necesidadSocial: z.number().int(),
	comunidadBeneficiaria: z.string()
});
