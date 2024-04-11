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
import { sharedCountTable } from './shared';

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

interface OfertasServicioFilter {
	cuatrimestre: string[];
	terminoBusqueda: string;
	creador?: string;
	profesor?: string;
	tags?: string[];
}

export async function obtenerTodasOfertasServicio(limit: number, offset: number, filters: OfertasServicioFilter): Promise<OfertaServicio[]> {
	// Construye la consulta base con los filtros básicos aplicados.
	let baseQuery = knex('anuncio_servicio')
		.join('oferta_servicio', 'anuncio_servicio.id', '=', 'oferta_servicio.id')
		.join('profesor_interno', 'oferta_servicio.creador', '=', 'profesor_interno.id')
		.join('datos_personales_interno', 'profesor_interno.datos_personales_id', '=', 'datos_personales_interno.id')
		.select(
			'anuncio_servicio.id',
			'anuncio_servicio.titulo',
			'anuncio_servicio.descripcion',
			'anuncio_servicio.imagen',
			'anuncio_servicio.created_at',
			'anuncio_servicio.updated_at',
			'oferta_servicio.cuatrimestre',
			'oferta_servicio.anio_academico',
			'oferta_servicio.fecha_limite',
			'oferta_servicio.observaciones_temporales',
			'datos_personales_interno.nombre',
			'datos_personales_interno.apellidos'
		)
		.whereIn('cuatrimestre', filters.cuatrimestre)
		.where('titulo', 'like', `%${filters.terminoBusqueda}%`)
		.modify((queryBuilder) => {
			if (filters.creador) {
				queryBuilder.where('creador', filters.creador);
			}
			if (filters.profesor) {
				queryBuilder.where('creador', filters.profesor);
			}
		})
		.limit(limit)
		.offset(offset);

	// Si hay filtros de tags aplicados, ajusta la consulta para incluir solo ofertas con esos tags.
	if (filters.tags && filters.tags.length > 0) {
		const taggedOffers = await knex('oferta_demanda_tags')
			.join('tags', 'tags.id', 'oferta_demanda_tags.tag_id')
			.whereIn('tags.nombre', filters.tags)
			.select('object_id');

		const taggedOfferIds = taggedOffers.map((offer) => offer.object_id);
		baseQuery = baseQuery.whereIn('anuncio_servicio.id', taggedOfferIds);
	}

	try {
		const datos_ofertas = await baseQuery;

		// Enriquece cada oferta con información adicional (áreas de servicio, asignaturas objetivo, etc).
		for (let oferta of datos_ofertas) {
			// Enriquecimiento con áreas de servicio
			const areasServicio = await knex('areaservicio_anuncioservicio')
				.join('area_servicio', 'areaservicio_anuncioservicio.id_area', '=', 'area_servicio.id')
				.where('id_anuncio', oferta.id)
				.select('area_servicio.nombre as area');

			oferta.areasServicio = areasServicio.map((a) => a.area);

			// Enriquecimiento con asignaturas objetivo
			const asignaturasObjetivo = await knex('asignatura').where('id_oferta', oferta.id).select('nombre');

			oferta.asignaturasObjetivo = asignaturasObjetivo.map((a) => a.nombre);

			// Enriquecimiento con tags
			const tags = await knex('oferta_demanda_tags')
				.join('tags', 'tags.id', '=', 'oferta_demanda_tags.tag_id')
				.where('oferta_demanda_tags.object_id', '=', oferta.id)
				.select('tags.nombre');

			oferta.tags = tags.map((tag) => tag.nombre);
		}

		return datos_ofertas;
	} catch (err) {
		console.error('Error al obtener todas las ofertas de servicio:', err);
		throw err;
	}
}

//LEER UN ELEMENTO----------------------------------------------------------------------------------------------------
function obtenerAnuncioServicio(id_anuncio) {
	return knex('anuncio_servicio')
		.where({ id: id_anuncio })
		.select('*')
		.then((anuncio) => {
			return obtenerAreaServicio(id_anuncio).then((areas_servicio) => {
				const areas = [];
				for (const area of areas_servicio) {
					areas.push(area['nombre']);
				}
				const tAnuncioServicio: AnuncioServicio = {
					id: id_anuncio,
					titulo: anuncio[0]['titulo'],
					descripcion: anuncio[0]['descripcion'],
					imagen: anuncio[0]['imagen'],
					created_at: anuncio[0]['created_at'],
					updated_at: anuncio[0]['updated_at'],
					area_servicio: areas,
					dummy: anuncio[0]['dummy']
				};
				return tAnuncioServicio;
			});
		});
}

//Funciones auxiliares
async function obtenerAsignaturaObjetivo(id_oferta: number): Promise<string[]> {
	try {
		const nombres = await knex('asignatura').where({ id_oferta }).select('nombre');
		return nombres.map((n) => n.nombre);
	} catch (err) {
		console.error(`No se ha encontrado la asignatura objetivo perteneciente a la oferta de servicio con id ${id_oferta}`);
		throw err;
	}
}

async function obtenerAreaServicio(id_anuncio: number): Promise<any[]> {
	try {
		const id_areas = await knex('areaservicio_anuncioservicio').where({ id_anuncio }).select('id_area');
		const areas = id_areas.map((a) => a.id_area);
		return knex('area_servicio').select('*').whereIn('id', areas);
	} catch (err) {
		console.error(`No se ha encontrado el área de servicio perteneciente al anuncio de servicio con id ${id_anuncio}`);
		throw err;
	}
}

export async function obtenerAnuncioPorAreaServicio(id_areaServicio: number): Promise<AnuncioServicio[]> {
	try {
		const id_anuncios = await knex('areaservicio_anuncioservicio').where({ id_area: id_areaServicio }).select('id_anuncio');
		const anuncios = id_anuncios.map((a) => a.id_anuncio);
		return knex.select('*').from('anuncio_servicio').whereIn('id', anuncios);
	} catch (err) {
		console.error(`No se han encontrado los anuncios con el área de servicio con id ${id_areaServicio}`);
		throw err;
	}
}

async function obtenerIdsAreas(nombre_areas: string[]): Promise<number[]> {
	try {
		const ids = await knex('area_servicio').whereIn('nombre', nombre_areas).select('id');
		return ids.map((id) => id.id);
	} catch (err) {
		console.error('Se ha producido un error al intentar obtener las ids a partir de los nombres de área');
		throw err;
	}
}

//Hay dos funciones para retornar areasServicio???
async function obtenerAreasServicio(id_anuncio: number): Promise<string[]> {
	try {
		const areas = await knex('areaservicio_anuncioservicio')
			.join('area_servicio', 'areaservicio_anuncioservicio.id_area', '=', 'area_servicio.id')
			.where({ id_anuncio })
			.select('area_servicio.nombre');
		return areas.map((area) => area.nombre);
	} catch (err) {
		console.error(`Se ha producido un error al intentar obtener el área de servicio del anuncio ${id_anuncio}`, err);
		throw err;
	}
}

export async function obtenerListaAreasServicio(): Promise<AreaServicio.Value[]> {
	return await qb(AreaServicio.Name);
}

async function obtenerCreadorOferta(id: number): Promise<number> {
	try {
		const creador = await knex('oferta_servicio').where({ id }).select('creador');
		return creador[0].creador;
	} catch (err) {
		console.error(`Se ha producido un error al intentar obtener el creador de la oferta ${id}`, err);
		throw err;
	}
}

async function obtenerAreaServicioConocimientoPorArea(servicios: string[]): Promise<any[]> {
	try {
		return await knex.select('area_conocimiento').from('matching_areas').whereIn('area_servicio', servicios);
	} catch (err) {
		console.error('Se ha producido un error al intentar obtener datos de la tabla matching_areas', err);
		throw err;
	}
}

async function obtenerAreaServicioTitulacionPorArea(servicios: string[]): Promise<any[]> {
	try {
		return await knex.select('titulacion').from('matching_areaservicio_titulacion').whereIn('area_servicio', servicios);
	} catch (err) {
		console.error('Se ha producido un error al intentar obtener datos de la tabla matching_areaservicio_titulacion', err);
		throw err;
	}
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
