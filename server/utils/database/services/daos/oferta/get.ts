import { isNullishOrEmpty } from '@sapphire/utilities';
import { OfertaDemanda_Tags } from '../../types/OfertaDemanda_Tags';
import { Quarter } from '../../types/OfertaServicio';
import { Tag } from '../../types/Tag';
import { ViewServiceOffer } from '../../types/views/ServiceOffer';
import { SearchParameters } from '../shared';
import { parseViewServiceOfferJsonStringProperties } from './_shared';

export async function obtenerOfertaServicio(id: number): Promise<ViewServiceOffer.Value> {
	const entry = ensureDatabaseEntry(await qb(ViewServiceOffer.Name).where({ id }).first());
	return parseViewServiceOfferJsonStringProperties(entry);
}

export interface OfertasServicioFilter extends SearchParameters {
	quarter?: Quarter[];
	title?: string;
	creatorId?: number;
	professorId?: number;
	tag?: string;
}

export async function obtenerTodasOfertasServicio(options: OfertasServicioFilter): Promise<ViewServiceOffer.Value[]> {
	return await qb(ViewServiceOffer.Name)
		.modify((query) => {
			if (!isNullishOrEmpty(options.title)) query.where('title', 'like', `%${options.title}%`);
			if (!isNullishOrEmpty(options.quarter)) query.whereIn('quarter', options.quarter);
			if (!isNullishOrEmpty(options.creatorId)) query.whereJsonPath('creator', 'id', '=', options.creatorId);
			if (!isNullishOrEmpty(options.professorId)) query.whereRaw("JSON_CONTAINS(professors, ?, '$**.id')", [options.professorId]);
			if (!isNullishOrEmpty(options.tag)) query.whereRaw("JSON_CONTAINS(tags, ?, '$')", [options.tag]);
		})
		.limit(options.limit ?? 100)
		.offset(options.offset ?? 0);
}

export async function getTagsStartingWith(text: string): Promise<FormattedTag[]> {
	return await qb(Tag.Name)
		.whereLike({ nombre: `${text}%` })
		.select({ id: Tag.Key('id'), name: Tag.Key('nombre') });
}

export interface FormattedTag {
	id: Tag.Value['id'];
	name: Tag.Value['nombre'];
}

export interface FormattedOfferTagId {
	objectId: OfertaDemanda_Tags.Value['object_id'];
	name: Tag.Value['nombre'];
}
