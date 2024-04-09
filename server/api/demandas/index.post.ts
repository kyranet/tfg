import { z } from 'zod';
import type TDemanda from '~/server/utils/database/services/Transfer/tDemandaServicio';
import { crearDemanda } from '~/server/utils/database/services/daos/daoDemanda';

const schema = z.object({
	areaServicio: z.string().array(),
	titulacionLocal: z.string().array(),
	titulo: z.string(),
	descripcion: z.string(),
	imagen: z.string(),
	ciudad: z.string(),
	objetivo: z.string(),
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
	necesidad_social: z.string(),
	comunidadBeneficiaria: z.string()
});
export const crearDemandas = defineEventHandler(async (event) => {
	const body = await readValidatedBody(event, schema.parse);

	// Crear la instancia de la demanda siguiendo la original
	const demanda: TDemanda = {
		id: null!, // id
		titulo: body.titulo,
		descripcion: body.descripcion,
		imagen: body.imagen,
		created_at: null,
		updated_at: null,
		// NOTE: No hagamos body.current_user, sino que usemos el usuario actual
		// que viene en el evento
		creador: body.current_user.uid, // Esta en el original, correcto?
		ciudad: body.ciudad,
		finalidad: body.objetivo,
		periodo_definicion_ini: body.fechas.definition.start,
		periodo_definicion_fin: body.fechas.definition.end,
		periodo_ejecucion_ini: body.fechas.execution.start,
		periodo_ejecucion_fin: body.fechas.execution.end,
		fecha_fin: body.fechas.end,
		observaciones_temporales: body.observaciones,
		necesidad_social: body.necesidad_social,
		titulacionlocal: body.titulacionLocal,
		area_servicio: body.areaServicio,
		comunidad_beneficiaria: body.comunidadBeneficiaria,
		dummy: 0
	};

	// Llamada al DAO para guardar la nueva demanda
	const id = await crearDemanda(demanda);
	return { ...demanda, id };
});
