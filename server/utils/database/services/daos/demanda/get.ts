import { AnuncioServicio } from '../../types/AnuncioServicio';
import { AreaServicio } from '../../types/AreaServicio';
import { AreaServicio_AnuncioServicio } from '../../types/AreaServicio_AnuncioServicio';
import { AreaServicio_Iniciativa } from '../../types/AreaServicio_Iniciativa';
import { DatosPersonalesExterno } from '../../types/DatosPersonalesExterno';
import { DemandaServicio } from '../../types/DemandaServicio';
import { Iniciativa } from '../../types/Iniciativa';
import { NecesidadSocial } from '../../types/NecesidadSocial';
import { SocioComunitario } from '../../types/SocioComunitario';
import { TitulacionLocal } from '../../types/TitulacionLocal';
import { TitulacionLocal_Demanda } from '../../types/TitulacionLocal_Demanda';
import type { SearchParameters } from '../shared';
import { formatDemanda, type FormattedDemanda } from './_shared';

export async function obtenerListaAreasServicio(): Promise<AreaServicio.Value[]> {
	return await qb(AreaServicio.Name);
}

export async function getAnnouncementsFromServiceArea(areaId: number): Promise<AreaServicio.Value[]> {
	return await qb(AnuncioServicio.Name)
		.join(AreaServicio_AnuncioServicio.Name, AreaServicio_AnuncioServicio.Key('id_anuncio'), '=', AnuncioServicio.Key('id'))
		.where(AreaServicio_AnuncioServicio.Key('id_area'), '=', areaId)
		.select(AnuncioServicio.Key('*'));
}

// Esta función obtiene demandas de servicio basadas en un área de servicio específica.
// Recibe el ID del área de servicio como parámetro y devuelve una promesa que resuelve en un array de objetos DemandaServicio.
export async function obtenerDemandaPorAreaServicio(id: number): Promise<FormattedDemanda[]> {
	const entries = await qb(AreaServicio_Iniciativa.Name)
		.where({ id_area: id })
		.join(Iniciativa.Name, AreaServicio.Key('id'), '=', AreaServicio_Iniciativa.Key('id_iniciativa'))
		.join(DemandaServicio.Name, DemandaServicio.Key('id'), '=', Iniciativa.Key('id_demanda'))
		.join(AnuncioServicio.Name, AnuncioServicio.Key('id'), '=', DemandaServicio.Key('id'))
		.select(DemandaServicio.Key('*'), AnuncioServicio.Key('*'));

	return entries.map((entry) => formatDemanda(entry));
}

//Obtiene las demandas de servicio asociadas a una necesidad social específica.
export async function obtenerDemandaPorNecesidadSocial(id: number): Promise<FormattedDemanda[]> {
	const entries = await qb(DemandaServicio.Name)
		.where({ necesidad_social: id })
		.join(AnuncioServicio.Name, AnuncioServicio.Key('id'), '=', DemandaServicio.Key('id'))
		.select(DemandaServicio.Key('*'), AnuncioServicio.Key('*'));

	return entries.map((entry) => formatDemanda(entry));
}

//Obtener demanda por su id
export interface GetDemandaServicioResult extends FormattedDemanda {
	degrees: TitulacionLocal_Demanda.Value['id_titulacion'][];
	areas: { id: AreaServicio.Value['id']; name: AreaServicio.Value['nombre']; announcementId: AreaServicio_AnuncioServicio.Value['id_anuncio'] }[];
}
export async function obtenerDemandaServicio(id: number): Promise<GetDemandaServicioResult> {
	const entry = ensureDatabaseEntry(
		await qb(AnuncioServicio.Name)
			.where({ id: id })
			.join(DemandaServicio.Name, DemandaServicio.Key('id'), '=', AnuncioServicio.Key('id'))
			.join(AreaServicio_AnuncioServicio.Name, AreaServicio_AnuncioServicio.Key('id_anuncio'), '=', AnuncioServicio.Key('id'))
			.select(
				AnuncioServicio.Key('*'),
				DemandaServicio.Key('*'),
				qb(TitulacionLocal_Demanda.Name)
					.where(TitulacionLocal_Demanda.Key('id_demanda'), '=', DemandaServicio.Key('id'))
					.select(qb.raw(`JSON_ARRAY((${TitulacionLocal_Demanda.Key('id_titulacion')}))`))
					.as('degrees'),
				qb(AreaServicio.Name)
					.where(AreaServicio.Key('id'), '=', AreaServicio_AnuncioServicio.Key('id_area'))
					.join(AreaServicio_AnuncioServicio.Name, AreaServicio_AnuncioServicio.Key('id_area'), '=', AreaServicio.Key('id'))
					.select(
						qb.raw(`JSON_ARRAY(JSON_OBJECTAGG(
							'id', ${AreaServicio.Key('id')},
							'name', ${AreaServicio.Key('nombre')},
							'announcementId', ${AreaServicio_AnuncioServicio.Key('id_anuncio')}
						))`)
					)
					.as('areas')
			)
			.first()
	);

	return { ...formatDemanda(entry), degrees: entry.degrees, areas: entry.areas };
}

interface DemandasFiltro extends SearchParameters {
	terminoBusqueda: string;
	necesidadSocial?: string[];
	creador?: string;
	entidadDemandante?: string;
	areaServicio?: string[];
}

interface RawGetAllDemandasServicioResult extends AnuncioServicio.Value, DemandaServicio.Value {
	socialNeed: NecesidadSocial.Value['nombre'];
	creatorFirstName: DatosPersonalesExterno.Value['nombre'];
	creatorLastName: DatosPersonalesExterno.Value['apellidos'];
}
export interface GetAllDemandasServicioResult extends Omit<FormattedDemanda, 'creator' | 'socialNeed'> {
	socialNeed: NecesidadSocial.Value['nombre'];
	creator: { firstName: DatosPersonalesExterno.Value['nombre']; lastName: DatosPersonalesExterno.Value['apellidos'] };
}
export async function obtenerTodasDemandasServicio(options: DemandasFiltro): Promise<GetAllDemandasServicioResult[]> {
	const entries: RawGetAllDemandasServicioResult[] = await qb(AnuncioServicio.Key('id'))
		.join(DemandaServicio.Name, DemandaServicio.Key('id'), '=', AnuncioServicio.Key('id'))
		.join(NecesidadSocial.Name, NecesidadSocial.Key('id'), '=', DemandaServicio.Key('necesidad_social'))
		.join(SocioComunitario.Name, SocioComunitario.Key('id'), '=', DemandaServicio.Key('creador'))
		.join(DatosPersonalesExterno.Name, DatosPersonalesExterno.Key('id'), '=', SocioComunitario.Key('datos_personales_Id'))
		.select(
			AnuncioServicio.Key('*'),
			DemandaServicio.Key('*'),
			qb.ref(NecesidadSocial.Key('nombre')).as('socialNeed'),
			qb.ref(DatosPersonalesExterno.Key('nombre')).as('creatorFirstName'),
			qb.ref(DatosPersonalesExterno.Key('apellidos')).as('creatorLastName')
		)
		.whereLike({ titulo: `%${options.terminoBusqueda}%` })
		.modify((queryBuilder) => {
			if (options.necesidadSocial) {
				queryBuilder.whereIn(NecesidadSocial.Key('nombre'), options.necesidadSocial);
			}
			if (options.creador) {
				queryBuilder.where(DemandaServicio.Key('creador'), options.creador);
			}
			if (options.entidadDemandante) {
				queryBuilder.where(SocioComunitario.Key('id'), options.entidadDemandante);
			}
			if (options.areaServicio) {
				queryBuilder
					.join(AreaServicio_AnuncioServicio.Name, AreaServicio_AnuncioServicio.Key('id_anuncio'), '=', AnuncioServicio.Key('id'))
					.join(AreaServicio.Name, AreaServicio.Key('id'), '=', AreaServicio_AnuncioServicio.Key('id_area'))
					.whereIn(AreaServicio.Key('nombre'), options.areaServicio);
			}
		})
		.limit(options.limit ?? 100)
		.offset(options.offset ?? 0);

	return entries.map((entry) => ({
		...formatDemanda(entry),
		socialNeed: entry.socialNeed,
		creator: { firstName: entry.creatorFirstName, lastName: entry.creatorLastName }
	}));
}

export async function obtenerListaTitulacionLocal(): Promise<TitulacionLocal.Value[]> {
	return await qb(TitulacionLocal.Name);
}

export async function obtenerListaNecesidadSocial(): Promise<any[]> {
	return await qb(NecesidadSocial.Name);
}
