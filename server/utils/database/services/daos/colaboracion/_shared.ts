import type { Colaboracion } from '../../types/Colaboracion';
import type { Nota } from '../../types/Nota';
import type { Partenariado } from '../../types/Partenariado';
import type { Proyecto } from '../../types/Proyecto';

export interface FormattedPartenariado extends ReturnType<typeof formatPartenariado> {}
export function formatPartenariado(entry: Colaboracion.Value & Partenariado.Value) {
	return {
		id: entry.id,
		titulo: entry.titulo,
		descripcion: entry.descripcion,
		imagen: entry.imagen,
		admiteExternos: entry.admite_externos,
		responsableId: entry.responsable,
		demandaId: entry.id_demanda,
		ofertaId: entry.id_oferta,
		estado: entry.estado
	};
}

export interface FormattedProyecto extends ReturnType<typeof formatProyecto> {}
export function formatProyecto(entry: Colaboracion.Value & Proyecto.Value) {
	return {
		id: entry.id,
		titulo: entry.titulo,
		descripcion: entry.descripcion,
		imagen: entry.imagen,
		admiteExternos: entry.admite_externos,
		estado: entry.estado,
		url: entry.url,
		partenariadoId: entry.id_partenariado,
		responsableId: entry.responsable
	};
}

export interface FormattedNota extends ReturnType<typeof formatNota> {}
export function formatNota(entry: Nota.Value) {
	return {
		id: entry.id,
		nota: entry.nota,
		estudianteId: entry.id_estudiante,
		proyectoId: entry.id_proyecto
	};
}
