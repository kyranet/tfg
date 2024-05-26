import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Knex } from 'knex';
import { AnuncioServicio } from '../types/AnuncioServicio';
import { AreaServicio_AnuncioServicio } from '../types/AreaServicio_AnuncioServicio';
import { Asignatura } from '../types/Asignatura';
import { OfertaDemanda_Tags } from '../types/OfertaDemanda_Tags';
import { OfertaServicio, Quarter } from '../types/OfertaServicio';
import { ProfesorInterno_Oferta } from '../types/ProfesorInterno_Oferta';
import { Tag } from '../types/Tag';
import { ViewServiceOffer } from '../types/views/ServiceOffer';
import { SearchParameters, sharedCountTable } from './shared';

export type AnuncioServicioCreateData = Pick<AnuncioServicio.Value, 'titulo' | 'descripcion' | 'imagen'> & { areasServicio: readonly number[] };
async function crearAnuncio(anuncio: AnuncioServicioCreateData, trx: Knex.Transaction): Promise<AnuncioServicio.Value> {
	const [entry] = await trx(AnuncioServicio.Name)
		.insert({ titulo: anuncio.titulo, descripcion: anuncio.descripcion, imagen: anuncio.imagen })
		.returning('*');

	if (!isNullishOrEmpty(anuncio.areasServicio)) {
		await trx(AreaServicio_AnuncioServicio.Name).insert(
			anuncio.areasServicio.map((area) => ({
				id_area: area,
				id_anuncio: entry.id
			}))
		);
	}

	return entry;
}

type OfertaServicioCreateDataKeys = 'cuatrimestre' | 'anio_academico' | 'fecha_limite' | 'observaciones_temporales' | 'creador';
export type OfertaServicioCreateData = AnuncioServicioCreateData &
	Pick<OfertaServicio.CreateData, OfertaServicioCreateDataKeys> & { asignaturas: readonly string[]; profesores: readonly number[] };
export type CreateServiceOfferResult = Omit<ViewServiceOffer.Value, 'services' | 'subjects' | 'tags' | 'creator' | 'professors'>;
export async function crearOferta(data: OfertaServicioCreateData): Promise<CreateServiceOfferResult> {
	return await qb.transaction(async (trx) => {
		const anuncio = await crearAnuncio(data, trx);
		const [oferta] = await trx(OfertaServicio.Name)
			.insert({
				id: anuncio.id,
				cuatrimestre: data.cuatrimestre,
				anio_academico: data.anio_academico,
				fecha_limite: data.fecha_limite,
				observaciones_temporales: data.observaciones_temporales,
				creador: data.creador
			})
			.returning('*');

		if (!isNullishOrEmpty(data.asignaturas)) {
			await trx(Asignatura.Name).insert(
				data.asignaturas.map((asignatura) => ({
					id_oferta: oferta.id,
					nombre: asignatura
				}))
			);
		}

		if (!isNullishOrEmpty(data.profesores)) {
			await trx(ProfesorInterno_Oferta.Name).insert(
				data.profesores.map((profesor) => ({
					id_profesor: profesor,
					id_oferta: oferta.id
				}))
			);
		}

		return {
			id: anuncio.id,
			academicYear: oferta.anio_academico,
			remarks: oferta.observaciones_temporales,
			quarter: oferta.cuatrimestre,
			deadline: oferta.fecha_limite,
			image: anuncio.imagen,
			title: anuncio.titulo,
			description: anuncio.descripcion,
			createdAt: anuncio.created_at,
			updatedAt: anuncio.updated_at
		};
	});
}

export async function obtenerOfertaServicio(id: number): Promise<ViewServiceOffer.Value> {
	const entry = ensureDatabaseEntry(await qb(ViewServiceOffer.Name).where({ id }).first());
	return parseViewServiceOfferJsonStringProperties(entry);
}

export function contarTodasOfertasServicio(): Promise<number> {
	return sharedCountTable(AnuncioServicio.Name);
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

function parseViewServiceOfferJsonStringProperties(value: ViewServiceOffer.RawValue): ViewServiceOffer.Value {
	return {
		...value,
		services: JSON.parse(value.services),
		subjects: JSON.parse(value.subjects),
		tags: JSON.parse(value.tags),
		creator: JSON.parse(value.creator),
		professors: JSON.parse(value.professors)
	};
}
