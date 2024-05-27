import { isNullishOrEmpty } from '@sapphire/utilities';
import { AnuncioServicio } from '../../types/AnuncioServicio';
import { AreaServicio } from '../../types/AreaServicio';
import { AreaServicio_AnuncioServicio } from '../../types/AreaServicio_AnuncioServicio';
import { AreaServicio_Iniciativa } from '../../types/AreaServicio_Iniciativa';
import { DemandaServicio } from '../../types/DemandaServicio';
import { Iniciativa } from '../../types/Iniciativa';
import { NecesidadSocial } from '../../types/NecesidadSocial';
import { TitulacionLocal } from '../../types/TitulacionLocal';
import { ViewDemand } from '../../types/views/Demand';
import type { SearchParameters } from '../shared';
import { formatDemanda, parseViewDemandJsonStringProperties, type FormattedDemanda } from './_shared';

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

export async function obtenerDemandaServicio(id: number): Promise<ViewDemand.Value> {
	const entry = ensureDatabaseEntry(await qb(ViewDemand.Name).where({ id: id }).first());
	return parseViewDemandJsonStringProperties(entry);
}

interface DemandasFiltro extends SearchParameters {
	query?: string;
	socialNeed?: string[];
	creator?: string;
	serviceAreas?: string[];
}

export interface GetAllDemandasServicioResult extends ViewDemand.Value {}
export async function obtenerTodasDemandasServicio(options: DemandasFiltro): Promise<GetAllDemandasServicioResult[]> {
	return await qb(ViewDemand.Name)
		.modify((queryBuilder) => {
			if (!isNullishOrEmpty(options.query)) {
				queryBuilder.whereLike(ViewDemand.Key('title'), `%${options.query}%`);
			}
			if (!isNullishOrEmpty(options.socialNeed)) {
				queryBuilder.whereIn(ViewDemand.Key('socialNeedName'), options.socialNeed);
			}
			if (!isNullishOrEmpty(options.creator)) {
				queryBuilder.whereLike(ViewDemand.Key('creatorName'), `%${options.creator}%`);
			}
			if (!isNullishOrEmpty(options.serviceAreas)) {
				queryBuilder
					.join(AreaServicio_AnuncioServicio.Name, AreaServicio_AnuncioServicio.Key('id_anuncio'), '=', ViewDemand.Key('id'))
					.join(AreaServicio.Name, AreaServicio.Key('id'), '=', AreaServicio_AnuncioServicio.Key('id_area'))
					.whereIn(AreaServicio.Key('nombre'), options.serviceAreas);
			}
		})
		.limit(options.limit ?? 100)
		.offset(options.offset ?? 0);
}

export async function obtenerListaTitulacionLocal(): Promise<TitulacionLocal.Value[]> {
	return await qb(TitulacionLocal.Name);
}

export async function obtenerListaNecesidadSocial() {
	return await qb(NecesidadSocial.Name);
}
