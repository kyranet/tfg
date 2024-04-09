import knex from '../../config';
import type { OfertaServicio } from '../types/OfertaServicio';

export function readByStartWithWord(text: string): Promise<any[]> {
	return knex<OfertaServicio>('tags').where('nombre', 'like', `${text}%`).select('*');
}

export function readByOferta(ofertaId: number): Promise<any[]> {
	return knex<OfertaServicio>('oferta_demanda_tags')
		.select('tags.id', 'tags.nombre')
		.from('oferta_demanda_tags')
		.innerJoin('tags', 'oferta_demanda_tags.tag_id', 'tags.id')
		.where('object_id', ofertaId)
		.where('tipo', 'like', 'oferta');
}

export function readByOfertaIDs(ofertasIds: number[]): Promise<any[]> {
	return knex('oferta_demanda_tags')
		.select('oferta_demanda_tags.object_id', 'tags.nombre')
		.from('oferta_demanda_tags')
		.innerJoin('tags', 'oferta_demanda_tags.tag_id', 'tags.id')
		.whereIn('object_id', ofertasIds)
		.where('tipo', 'like', 'oferta');
}

function getOfertasByTags(tagsNames: string[]): Promise<OfertaServicio[]> {
	return knex<OfertaServicio>('oferta_demanda_tags')
		.distinct('oferta_demanda_tags.object_id')
		.from('oferta_demanda_tags')
		.innerJoin('tags', 'oferta_demanda_tags.tag_id', 'tags.id')
		.whereIn('tags.nombre', tagsNames);
}

module.exports = {
	readByStartWithWord,
	readByOferta,
	readByOfertaIDs,
	getOfertasByTags
};
