import type { Iniciativa } from '../../types/Iniciativa';
import type { Matching } from '../../types/Matching';
import type { NecesidadSocial } from '../../types/NecesidadSocial';

export interface FormattedIniciativa extends ReturnType<typeof formatIniciativa> {}
export function formatIniciativa(data: Iniciativa.Value) {
	return {
		id: data.id,
		title: data.titulo,
		description: data.descripcion,
		demandId: data.id_demanda,
		studentId: data.id_estudiante,
		socialNeed: data.necesidad_social
	};
}

export interface FormattedMatch extends ReturnType<typeof formatMatch> {}
export function formatMatch(data: Matching.Value) {
	return {
		offerId: data.id_oferta,
		demandId: data.id_demanda,
		processed: data.procesado,
		matching: data.emparejamiento
	};
}

export interface FormattedNecesidadSocial extends ReturnType<typeof formatNecesidadSocial> {}
export function formatNecesidadSocial(area: NecesidadSocial.Value) {
	return { id: area.id, name: area.nombre };
}
