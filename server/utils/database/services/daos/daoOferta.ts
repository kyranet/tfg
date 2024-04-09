import knex from '../../config';
import { readByOferta } from '../daos/daoTags';
import { obtenerProfesorInterno, obtenerProfesoresInternos } from '../daos/daoUsuario';
import { AnuncioServicio } from '../types/AnuncioServicio';
import { OfertaServicio } from '../types/OfertaServicio';

async function crearAnuncio(anuncio: AnuncioServicio): Promise<number> {
	try {
		const [idAnuncio] = await knex('anuncio_servicio')
			.insert({
				titulo: anuncio.titulo,
				descripcion: anuncio.descripcion,
				imagen: anuncio.imagen
			})
			.returning('id');

		// Insertar áreas de servicio si existen
		if (anuncio.area_servicio && anuncio.area_servicio.length > 0) {
			const areasParaInsertar = anuncio.area_servicio.map((area) => ({
				id_area: area.id_area,
				id_anuncio: idAnuncio
			}));
			await knex('areaservicio_anuncioservicio').insert(areasParaInsertar);
		}

		return idAnuncio; // Retorna el ID del anuncio creado
	} catch (error) {
		console.error('Error al crear anuncio', error);
		throw error;
	}
}
export async function crearOferta(oferta: OfertaServicio): Promise<number> {
	try {
		const idAnuncio = await crearAnuncio(oferta); // Reutiliza la función de crearAnuncio

		await knex('oferta_servicio').insert({
			id: idAnuncio,
			asignatura_objetivo: oferta.asignatura_objetivo,
			cuatrimestre: oferta.cuatrimestre,
			anio_academico: oferta.anio_academico,
			fecha_limite: oferta.fecha_limite,
			observaciones_temporales: oferta.observaciones_temporales,
			creador: oferta.creador,
			//Revisar esta logica de insercion de profesores/tags
			tags: oferta.tags,
			profesores: oferta.profesores
		});
		return idAnuncio;
	} catch (error) {
		console.error('Error al crear oferta', error);
		throw error;
	}
}

export async function obtenerOfertaServicio(id_oferta: number): Promise<OfertaServicio | null> {
	try {
		const anuncio = await obtenerAnuncioServicio(id_oferta);

		const oferta = await knex('oferta_servicio').where({ id: id_oferta }).select('*');
		if (!oferta || oferta.length === 0) {
			return null; // Retorna null si no se encuentra la oferta
		}

		const datos_profesores = await knex('profesorinterno_oferta').where({ id_oferta: id_oferta }).select('id_profesor');
		const arrayProfesores = datos_profesores.map((profesor) => profesor.id_profesor);

		const responsable = await obtenerProfesorInterno(oferta[0].creador);
		const profesores = await obtenerProfesoresInternos(arrayProfesores);
		const asignaturas = await obtenerAsignaturaObjetivo(id_oferta);
		const tags = await readByOferta(id_oferta);

		const asignaturas_ref = await obtenerAsignaturaObjetivo(id_oferta);
		const tags_ref = tags.map((tag) => tag.nombre);

		const tOfertaServicio: OfertaServicio = {
			id: oferta[0].id,
			titulo: anuncio.titulo,
			descripcion: anuncio.descripcion,
			imagen: anuncio.imagen,
			created_at: anuncio.created_at,
			updated_at: anuncio.updated_at,
			asignatura_objetivo: asignaturas_ref,
			cuatrimestre: oferta[0].cuatrimestre,
			anio_academico: oferta[0].anio_academico,
			fecha_limite: oferta[0].fecha_limite,
			observaciones_temporales: oferta[0].observaciones_temporales,
			//Revisar parametros del creador
			creador: responsable.nombre,
			area_servicio: anuncio.area_servicio,
			profesores: profesores,
			tags: tags_ref,
			dummy: null
		};
	} catch (error) {
		console.error('Error al obtener oferta de servicio:', error);
		throw error;
	}
}

export async function contarTodasOfertasServicio(): Promise<number> {
	try {
		const total = await knex('anuncio_servicio').count('id as COUNT');
		return Number(total[0].COUNT);
	} catch (err) {
		console.error('Error al contar todas las ofertas de servicio:', err);
		throw err;
	}
}

/*async function obtenerTodasOfertasServicio(limit: number, offset: number, filters: string): Promise<any[]> {
    try {
        const fil = JSON.parse(filters);
        const creator_id = fil.creador || true;
        const tag_filter = fil.tags.length ? fil.tags : [];

        console.log(fil);

        let query = knex("anuncio_servicio")
            .join("oferta_servicio", "anuncio_servicio.id", "=", "oferta_servicio.id")
            .join("profesor_interno", "oferta_servicio.creador", "=", "profesor_interno.id")
            .join("datos_personales_interno", "profesor_interno.datos_personales_id", "=", "datos_personales_interno.id")
            .select("anuncio_servicio.id", "anuncio_servicio.titulo", "anuncio_servicio.descripcion", "anuncio_servicio.imagen", "anuncio_servicio.created_at", "anuncio_servicio.updated_at", "oferta_servicio.cuatrimestre", "oferta_servicio.anio_academico", "oferta_servicio.fecha_limite", "oferta_servicio.observaciones_temporales", "datos_personales_interno.nombre", "datos_personales_interno.apellidos")
            .whereIn("cuatrimestre", fil.cuatrimestre)
            .where("titulo", "like", `%${fil.terminoBusqueda}%`)
            .modify(function(queryBuilder) {
                if (fil.creador) {
                    queryBuilder.where('creador', fil.creador);
                }
                if (fil.profesores && fil.profesores.length > 0) {
                    queryBuilder.where('creador', fil.profesores[0].id);
                }
            })
            .where(tag_filter.length, "=", 0)
            .orWhere(0, '<', function() {
                this.count('*').from('oferta_demanda_tags').join('tags', 'tags.id', '=', 'oferta_demanda_tags.tag_id').whereRaw(`oferta_demanda_tags.object_id = oferta_servicio.id`).whereIn('tags.nombre', tag_filter);
            })
            .limit(limit)
            .offset(offset);

        let datos_ofertas = await query;

        return datos_ofertas; // Esta línea se modificará según la implementación completa.
    } catch (err) {
        console.error("Error al obtener todas las ofertas de servicio:", err);
        throw err;
    }
}
*/

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

export async function obtenerListaAreasServicio(): Promise<{ id: number; nombre: string }[]> {
	try {
		return await knex('area_servicio').select('id', 'nombre');
	} catch (err) {
		console.error('Se ha producido un error al intentar obtener todas las áreas de servicio', err);
		throw err;
	}
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
