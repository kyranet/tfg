import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Knex } from 'knex';
import { AnuncioServicio } from '../types/AnuncioServicio';
import { AreaServicio } from '../types/AreaServicio';
import { AreaServicio_AnuncioServicio } from '../types/AreaServicio_AnuncioServicio';
import { Asignatura } from '../types/Asignatura';
import { DatosPersonalesInterno } from '../types/DatosPersonalesInterno';
import { OfertaDemanda_Tags } from '../types/OfertaDemanda_Tags';
import { OfertaServicio } from '../types/OfertaServicio';
import { ProfesorInterno } from '../types/ProfesorInterno';
import { ProfesorInterno_Oferta } from '../types/ProfesorInterno_Oferta';
import { Tag } from '../types/Tag';
import { SearchParameters, sharedCountTable } from './shared';

export type AnuncioServicioCreateData = Pick<AnuncioServicio, 'titulo' | 'descripcion' | 'imagen'> & { areasServicio: readonly number[] };
async function crearAnuncio(anuncio: AnuncioServicioCreateData, trx: Knex.Transaction): Promise<AnuncioServicio.Value> {
	const [entry] = await trx(AnuncioServicio.Name)
		.insert({ titulo: anuncio.titulo, descripcion: anuncio.descripcion, imagen: anuncio.imagen })
		.returning('*');

	// Insertar áreas de servicio si existen
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
export async function crearOferta(data: OfertaServicioCreateData): Promise<FormattedOferta> {
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
				//Revisar esta logica de insercion de profesores/tags
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

		return formatOferta(anuncio, oferta);
	});
}

export async function obtenerOfertaServicio(id: number): Promise<OfertaServicio | null> {
	// NOTE: I have no idea whether or not this works, verify once the program works.
	return await qb(OfertaServicio.Name)
		.where({ id })
		.join(AnuncioServicio.Name, AnuncioServicio.Key('id'), '=', OfertaServicio.Key('id'))
		.join(ProfesorInterno.Name, ProfesorInterno.Key('id'), '=', OfertaServicio.Key('creador'))
		.join(DatosPersonalesInterno.Name, DatosPersonalesInterno.Key('id'), '=', ProfesorInterno.Key('datos_personales_Id'))
		.select(
			qb.ref(AnuncioServicio.Key('*')),
			qb.ref(OfertaServicio.Key('*')),
			qb.ref(ProfesorInterno.Key('id')).as('creatorId'),
			qb.ref(DatosPersonalesInterno.Key('nombre')).as('creatorFirstName'),
			qb.ref(DatosPersonalesInterno.Key('apellidos')).as('creatorLastName'),
			// Get the service areas:
			qb(AreaServicio_AnuncioServicio.Name)
				.select(qb.raw(`JSON_ARRAYAGG(${AreaServicio.Key('nombre')})`))
				.where(AreaServicio_AnuncioServicio.Key('id_anuncio'), '=', OfertaServicio.Key('id'))
				.join(AreaServicio.Name, AreaServicio.Key('id'), '=', AreaServicio_AnuncioServicio.Key('id_area'))
				.as('areas'),
			// Get the professors
			qb(ProfesorInterno_Oferta.Name)
				.select(
					qb.raw(`JSON_ARRAY(JSON(
						'id', ${DatosPersonalesInterno.Key('id')},
						'firstName', ${DatosPersonalesInterno.Key('nombre')},
						'lastName', ${DatosPersonalesInterno.Key('apellidos')},
						'email', ${DatosPersonalesInterno.Key('correo')},
						'telephone', ${DatosPersonalesInterno.Key('telefono')},
						'facultad', ${ProfesorInterno.Key('facultad')},
						'universidad', ${ProfesorInterno.Key('universidad')}
					))`)
				)
				.where(ProfesorInterno_Oferta.Key('id_oferta'), '=', OfertaServicio.Key('id'))
				.join(ProfesorInterno.Name, ProfesorInterno.Key('id'), '=', ProfesorInterno_Oferta.Key('id_profesor'))
				.join(DatosPersonalesInterno.Name, DatosPersonalesInterno.Key('id'), '=', ProfesorInterno.Key('datos_personales_Id'))
				.as('profesores'),
			// Get the tags
			qb(OfertaDemanda_Tags.Name)
				.select(qb.raw(`JSON_ARRAYAGG(${Tag.Key('nombre')})`))
				.where(OfertaDemanda_Tags.Key('object_id'), '=', OfertaServicio.Key('id'))
				.join(Tag.Name, Tag.Key('id'), '=', OfertaDemanda_Tags.Key('tag_id'))
				.as('tags'),
			// Get the subjects
			qb(Asignatura.Name)
				.select(qb.raw(`JSON_ARRAYAGG(${Asignatura.Key('nombre')})`))
				.where(Asignatura.Key('id_oferta'), '=', OfertaServicio.Key('id'))
				.as('asignaturas')
		);
}

export function contarTodasOfertasServicio(): Promise<number> {
	return sharedCountTable(AnuncioServicio.Name);
}

export interface OfertasServicioFilter extends SearchParameters {
	cuatrimestre?: string[];
	terminoBusqueda?: string;
	creador?: string;
	profesor?: string;
	tags?: string[];
}

export interface GetAllServiceOffersResult extends Omit<FormattedOferta, 'creador'> {
	creatorFirstName: string;
	creatorLastName: string;
	areas: string[];
	subjects: string[];
	tags: string[];
}
export async function obtenerTodasOfertasServicio(options: OfertasServicioFilter): Promise<GetAllServiceOffersResult[]> {
	// Construye la consulta base con los filtros básicos aplicados.
	return await qb(AnuncioServicio.Name)
		.join(OfertaServicio.Name, OfertaServicio.Key('id'), '=', AnuncioServicio.Key('id'))
		.join(ProfesorInterno.Name, ProfesorInterno.Key('id'), '=', OfertaServicio.Key('creador'))
		.join(DatosPersonalesInterno.Name, DatosPersonalesInterno.Key('id'), '=', ProfesorInterno.Key('datos_personales_Id'))
		.select(
			AnuncioServicio.Key('id'),
			qb.ref(AnuncioServicio.Key('titulo')).as('title'),
			qb.ref(AnuncioServicio.Key('descripcion')).as('description'),
			qb.ref(AnuncioServicio.Key('imagen')).as('image'),
			qb.ref(AnuncioServicio.Key('created_at')).as('createdAt'),
			qb.ref(AnuncioServicio.Key('updated_at')).as('updatedAt'),
			qb.ref(OfertaServicio.Key('cuatrimestre')).as('quarter'),
			qb.ref(OfertaServicio.Key('anio_academico')).as('academicYear'),
			qb.ref(OfertaServicio.Key('fecha_limite')).as('deadline'),
			qb.ref(OfertaServicio.Key('observaciones_temporales')).as('temporaryRemarks'),
			qb.ref(DatosPersonalesInterno.Key('nombre')).as('creatorFirstName'),
			qb.ref(DatosPersonalesInterno.Key('apellidos')).as('creatorLastName'),
			// Get service areas
			qb(AreaServicio_AnuncioServicio.Name)
				.select(qb.raw(`JSON_ARRAYAGG(${AreaServicio.Key('nombre')})`))
				.where(AreaServicio_AnuncioServicio.Key('id_anuncio'), '=', OfertaServicio.Key('id'))
				.join(AreaServicio.Name, AreaServicio.Key('id'), '=', AreaServicio_AnuncioServicio.Key('id_area'))
				.as('areas'),
			// Get subjects
			qb(Asignatura.Name)
				.select(qb.raw(`JSON_ARRAY(${Asignatura.Key('nombre')})`))
				.where(Asignatura.Key('id_oferta'), '=', OfertaServicio.Key('id'))
				.as('subjects'),
			// Get tags
			qb(OfertaDemanda_Tags.Name)
				.select(qb.raw(`JSON_ARRAY(${Tag.Key('nombre')})`))
				.where(OfertaDemanda_Tags.Key('object_id'), '=', OfertaServicio.Key('id'))
				.join(Tag.Name, Tag.Key('id'), '=', OfertaDemanda_Tags.Key('tag_id'))
				.as('tags')
		)
		.modify((qb) => {
			if (!isNullishOrEmpty(options.terminoBusqueda)) qb.where(AnuncioServicio.Key('titulo'), 'like', `%${options.terminoBusqueda}%`);
			if (!isNullishOrEmpty(options.cuatrimestre)) qb.whereIn(OfertaServicio.Key('cuatrimestre'), options.cuatrimestre);
			if (!isNullishOrEmpty(options.creador)) qb.where(OfertaServicio.Key('creador'), options.creador);
			if (!isNullishOrEmpty(options.profesor)) qb.where(OfertaServicio.Key('creador'), options.profesor);
			if (!isNullishOrEmpty(options.tags)) {
				qb.join(OfertaDemanda_Tags.Name, OfertaDemanda_Tags.Key('object_id'), '=', AnuncioServicio.Key('id'))
					.join(Tag.Name, Tag.Key('id'), '=', OfertaDemanda_Tags.Key('tag_id'))
					.whereIn(Tag.Key('nombre'), options.tags);
			}
		})
		.limit(options.limit ?? 100)
		.offset(options.offset ?? 0);
}

export interface FormattedOferta extends ReturnType<typeof formatOferta> {}
function formatOferta(anuncio: AnuncioServicio.Value, oferta: OfertaServicio.Value) {
	return {
		id: anuncio.id,
		title: anuncio.titulo,
		description: anuncio.descripcion,
		image: anuncio.imagen,
		createdAt: anuncio.created_at,
		updatedAt: anuncio.updated_at,
		dummy: anuncio.dummy,
		quarter: oferta.cuatrimestre,
		academicYear: oferta.anio_academico,
		deadline: oferta.fecha_limite,
		temporaryRemarks: oferta.observaciones_temporales,
		creator: oferta.creador
	};
}
