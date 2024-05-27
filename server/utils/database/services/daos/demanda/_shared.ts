import type { AnuncioServicio } from '../../types/AnuncioServicio';
import type { DemandaServicio } from '../../types/DemandaServicio';
import { ViewDemand } from '../../types/views/Demand';

export interface FormattedDemanda extends ReturnType<typeof formatDemanda> {}
export function formatDemanda(entry: AnuncioServicio.Value & DemandaServicio.Value) {
	return {
		id: entry.id,
		title: entry.titulo,
		description: entry.descripcion,
		image: entry.imagen,
		createdAt: entry.created_at,
		updatedAt: entry.updated_at,
		dummy: entry.dummy,
		creator: entry.creador,
		city: entry.ciudad,
		purpose: entry.finalidad,
		periods: {
			definicion: { start: entry.periodo_definicion_ini, end: entry.periodo_definicion_fin },
			ejecucion: { start: entry.periodo_ejecucion_ini, end: entry.periodo_ejecucion_fin },
			end: entry.fecha_fin
		},
		temporaryObservations: entry.observaciones_temporales,
		socialNeed: entry.necesidad_social,
		beneficiaryCommunity: entry.comunidad_beneficiaria
	};
}

export function parseViewDemandJsonStringProperties(entry: ViewDemand.RawValue): ViewDemand.Value {
	return {
		...entry,
		serviceAreas: JSON.parse(entry.serviceAreas),
		degrees: JSON.parse(entry.degrees)
	};
}
