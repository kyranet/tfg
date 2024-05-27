import { AreaServicio } from '../../types/AreaServicio';
import { AreaServicio_Iniciativa } from '../../types/AreaServicio_Iniciativa';
import { DatosPersonalesExterno } from '../../types/DatosPersonalesExterno';
import { DatosPersonalesInterno } from '../../types/DatosPersonalesInterno';
import { EstudianteExterno } from '../../types/EstudianteExterno';
import { EstudianteInterno } from '../../types/EstudianteInterno';
import { Iniciativa } from '../../types/Iniciativa';
import { Matching } from '../../types/Matching';
import { MatchingArea } from '../../types/MatchingArea';
import { MatchingAreaServicioTitulacion } from '../../types/MatchingAreaServicioTitulacion';
import { NecesidadSocial } from '../../types/NecesidadSocial';
import { FormattedIniciativa, formatIniciativa, formatNecesidadSocial, type FormattedNecesidadSocial } from './_shared';

export interface GetIniciativaResult extends FormattedIniciativa {
	areas: readonly AreaServicio_Iniciativa.Value['id_area'][];
}
export async function obtenerIniciativa(id: number): Promise<GetIniciativaResult> {
	const entry = ensureDatabaseEntry(
		await qb(Iniciativa.Name)
			.where({ id })
			.select(
				Iniciativa.Key('*'),
				qb(AreaServicio_Iniciativa.Name)
					.select(qb.raw(`JSON_ARRAY(${AreaServicio_Iniciativa.Key('id_area')})`))
					.where(AreaServicio_Iniciativa.Key('id_iniciativa'), '=', Iniciativa.Key('id'))
					.as('areas')
			)
			.first()
	);

	return { ...formatIniciativa(entry), areas: entry.areas };
}

export interface GetIniciativasEstudiantesResult {
	id: Iniciativa.Value['id'];
	title: Iniciativa.Value['titulo'];
	description: Iniciativa.Value['descripcion'];
	demandId: Iniciativa.Value['id_demanda'];
	socialNeed: NecesidadSocial.Value['nombre'];
	studentName: DatosPersonalesInterno.Value['nombre'];
	areas: AreaServicio.Value['nombre'][];
}
async function obtenerIniciativasEstudiantesInternos(): Promise<GetIniciativasEstudiantesResult[]> {
	return qb(Iniciativa.Name)
		.join(NecesidadSocial.Name, NecesidadSocial.Key('id'), '=', Iniciativa.Key('necesidad_social'))
		.join(EstudianteInterno.Name, EstudianteInterno.Key('id'), '=', Iniciativa.Key('id_estudiante'))
		.join(DatosPersonalesInterno.Name, DatosPersonalesInterno.Key('id'), '=', EstudianteInterno.Key('datos_personales_Id'))
		.select({
			id: Iniciativa.Key('id'),
			title: Iniciativa.Key('titulo'),
			description: Iniciativa.Key('descripcion'),
			demandId: Iniciativa.Key('id_demanda'),
			socialNeed: NecesidadSocial.Key('nombre'),
			studentName: DatosPersonalesInterno.Key('nombre'),
			areas: qb(AreaServicio_Iniciativa.Name)
				.join(AreaServicio.Name, AreaServicio.Key('id'), '=', AreaServicio_Iniciativa.Key('id_area'))
				.where(AreaServicio_Iniciativa.Key('id_iniciativa'), qb.ref(Iniciativa.Key('id')))
				.select(`JSON_ARRAYAGG(${AreaServicio.Key('nombre')})`)
		} as const);
}

async function obtenerIniciativasEstudiantesExternos(): Promise<GetIniciativasEstudiantesResult[]> {
	return qb(Iniciativa.Name)
		.join(NecesidadSocial.Name, NecesidadSocial.Key('id'), '=', Iniciativa.Key('necesidad_social'))
		.join(EstudianteExterno.Name, EstudianteExterno.Key('id'), '=', Iniciativa.Key('id_estudiante'))
		.join(DatosPersonalesExterno.Name, DatosPersonalesExterno.Key('id'), '=', EstudianteExterno.Key('datos_personales_Id'))
		.select({
			id: Iniciativa.Key('id'),
			title: Iniciativa.Key('titulo'),
			description: Iniciativa.Key('descripcion'),
			demandId: Iniciativa.Key('id_demanda'),
			socialNeed: NecesidadSocial.Key('nombre'),
			studentName: DatosPersonalesExterno.Key('nombre'),
			areas: qb(AreaServicio_Iniciativa.Name)
				.join(AreaServicio.Name, AreaServicio.Key('id'), '=', AreaServicio_Iniciativa.Key('id_area'))
				.where(AreaServicio_Iniciativa.Key('id_iniciativa'), qb.ref(Iniciativa.Key('id')))
				.select(`JSON_ARRAYAGG(${AreaServicio.Key('nombre')})`)
		} as const);
}

export async function obtenerTodasIniciativas(): Promise<GetIniciativasEstudiantesResult[]> {
	const internos = await obtenerIniciativasEstudiantesInternos();
	const externos = await obtenerIniciativasEstudiantesExternos();
	return [...internos, ...externos];
}

export async function obtenerListaNecesidadSocial(): Promise<FormattedNecesidadSocial[]> {
	const areas = await qb(NecesidadSocial.Name);
	return areas.map((area) => formatNecesidadSocial(area));
}

export interface GetAreaServicioTitulacionByAreaResult {
	degree: MatchingAreaServicioTitulacion.Value['titulacion'];
}
export async function obtenerAreaServicioTitulacionPorArea(services: readonly number[]): Promise<GetAreaServicioTitulacionByAreaResult[]> {
	return await qb(MatchingAreaServicioTitulacion.Name).whereIn('area_servicio', services).select({ degree: 'titulacion' });
}

export async function obtenerAreaServicioConocimientoPorArea(services: readonly number[]) {
	return await qb(MatchingArea.Name)
		.whereIn('area_servicio', services)
		.select({ knowledgeArea: 'area_conocimiento' } as const);
}

export async function existe(id_oferta: number, id_demanda: number): Promise<boolean> {
	return (await qb(Matching.Name).where({ id_oferta, id_demanda })).length > 0;
}
