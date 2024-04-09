import knex from '../../config';
import { obtenerSocioComunitario } from '../daos/daoUsuario';
import { AnuncioServicio } from '../types/AnuncioServicio';
import { AreaServicio } from '../types/AreaServicio';
import { AreaServicioAnuncio } from '../types/AreaServicioAnuncio';
import { DemandaServicio } from '../types/DemandaServicio';
import { TitulacionLocal } from '../types/TitulacionLocal';
import { TitulacionLocalDemanda } from '../types/TitulacionLocalDemanda';

//Obtener areas de servicio por un id de anuncio concreto
async function obtenerAreaServicio(id_anuncio: number): Promise<AreaServicio[]> {
	try {
		// Consultamos en la tabla areaservicio_anuncioservicio donde el id_anuncio coincide
		const id_areas = await knex('areaservicio_anuncioservicio').where({ id_anuncio: id_anuncio }).select('id_area');

		// Consultamos en la tabla area_servicio donde el id está en la lista de ids obtenidos anteriormente
		const areas: AreaServicio[] = await knex
			.select('*')
			.from('area_servicio')
			.whereIn(
				'id',
				id_areas.map((area) => area.id_area)
			);

		// Devolvemos las áreas de servicio encontradas
		return areas;
	} catch (error) {
		// En caso de error, manejamos y lanzamos la excepción
		console.error(`Error al obtener el área de servicio para el anuncio de servicio con id ${id_anuncio}`);
		throw error;
	}
}

// Obtener todas las areas de servicio
export async function obtenerListaAreasServicio(): Promise<AreaServicio[]> {
	try {
		// Usamos async/await para manejar de manera asincrónica las operaciones de base de datos
		const areas: AreaServicio[] = await knex('area_servicio').select('*');

		// Devolvemos las áreas de servicio encontradas
		return areas;
	} catch (error) {
		// En caso de error, manejamos y lanzamos la excepción
		console.error('Error al obtener la lista de áreas de servicio:', error);
		throw error;
	}
}

// Esta función obtiene demandas de servicio basadas en un área de servicio específica.
// Recibe el ID del área de servicio como parámetro y devuelve una promesa que resuelve en un array de objetos DemandaServicio.
export async function obtenerDemandaPorAreaServicio(id_areaServicio: number): Promise<DemandaServicio[]> {
	try {
		const id_demandas = await knex('areaservicio_iniciativa').where({ id_area: id_areaServicio }).select('id_iniciativa');

		//Array de ids de demandas para recuperar su info despues.
		const demandas: number[] = [];

		// Itera sobre los resultados de las demandas y obtiene sus IDs.
		for (const id_demanda of id_demandas) {
			demandas.push(id_demanda['id_iniciativa']);
		}

		// Consulta la base de datos para obtener los detalles completos de las demandas basadas en los IDs obtenidos.
		const demandasCompletas = await knex.select('*').from('demanda_servicio').whereIn('id', demandas);

		return demandasCompletas;
	} catch (err) {
		console.error('Error al obtener las demandas con el área de servicio con id ', id_areaServicio);
		throw err;
	}
}

//Obtiene las demandas de servicio asociadas a una necesidad social específica.
export async function obtenerDemandaPorNecesidadSocial(id_necesidadSocial: number): Promise<DemandaServicio[]> {
	try {
		// Consulta las demandas de servicio que coinciden con la necesidad social proporcionada
		const demandas: DemandaServicio[] = await knex
			.select('*')
			.from('demanda_servicio')
			.where({ necesidad_social: id_necesidadSocial })
			.innerJoin('anuncio_servicio', 'demanda_servicio.id', 'anuncio_servicio.id');

		// Devuelve el resultado de la consulta
		return demandas;
	} catch (err) {
		// En caso de error, imprime un mensaje detallado y relanza el error
		console.error(`Error al obtener las demandas con la necesidad social con ID ${id_necesidadSocial}: ${err}`);
		throw err;
	}
}

//Obtener demanda por su id
export async function obtenerDemandaServicio(id_demanda: number): Promise<DemandaServicio> {
	try {
		// Usamos async/await para manejar de manera asincrónica las operaciones de base de datos
		const anuncio = await obtenerAnuncioServicio(id_demanda);

		const demanda = await knex('demanda_servicio').where({ id: id_demanda }).select('*');

		const necesidad_social = await knex('necesidad_social').where({ id: demanda[0].necesidad_social }).select('nombre');

		const socio = await obtenerSocioComunitario(demanda[0].creador);

		const titulaciones = await obtenerTitulacionLocal(id_demanda);
		// Mapear cada id de titulación a un objeto que también incluya el id de la demanda
		const titulaciones_ref = titulaciones.map((titulacion) => ({
			id_titulacion: titulacion.id,
			id_demanda: id_demanda
		}));

		//Obtenemos areas de servicio de la demanda
		const areasServicio = await obtenerAreaServicio(id_demanda);

		let relaciones: AreaServicioAnuncio[] = [];

		// Por cada área de servicio, encuentra los anuncios relacionados.
		for (const areaServicio of areasServicio) {
			const anunciosRelacionados = await knex('areaservicio_anuncioservicio')
				.where({ id_area: areaServicio.id }) // Usamos el ID del área de servicio
				.select('id_anuncio');

			// Mapea cada anuncio relacionado al formato esperado y agrega al array de intermedias
			anunciosRelacionados.forEach((anuncio) => {
				relaciones.push({
					id_area: areaServicio.id,
					id_anuncio: anuncio.id_anuncio
				});
			});
		}

		// Devolvemos la interfaz DemandaServicio
		const demandaServicio: DemandaServicio = {
			id: demanda[0].id,
			titulo: anuncio[0]['titulo'],
			descripcion: anuncio[0]['descripcion'],
			imagen: anuncio[0]['imagen'],
			created_at: anuncio[0]['created_at'],
			updated_at: anuncio[0]['updated_at'],
			creador: demanda[0].creador,
			ciudad: demanda[0].ciudad,
			finalidad: demanda[0].finalidad,
			periodo_definicion_ini: demanda[0].periodo_definicion_ini,
			periodo_definicion_fin: demanda[0].periodo_definicion_fin,
			periodo_ejecucion_ini: demanda[0].periodo_ejecucion_ini,
			periodo_ejecucion_fin: demanda[0].periodo_ejecucion_fin,
			fecha_fin: demanda[0].fecha_fin,
			observaciones_temporales: demanda[0].observaciones_temporales,
			necesidad_social: demanda[0].necesidad_social,
			titulacionlocal: titulaciones_ref,
			area_servicio: relaciones,
			comunidad_beneficiaria: demanda[0].comunidad_beneficiaria,
			dummy: anuncio[0]['dummy']
		};

		return demandaServicio;
	} catch (error) {
		console.error('Error al obtener la demanda de servicio:', error);
		throw error;
	}
}

// Definimos el tipo de retorno de la función utilizando Promise con un array de AreaServicio
async function obtenerAnuncioServicio(id_anuncio: number): Promise<AnuncioServicio> {
	// Consultamos la tabla 'anuncio_servicio' para obtener el anuncio correspondiente al ID
	return knex('anuncio_servicio')
		.where({ id: id_anuncio })
		.select('*')
		.then((anuncio) => {
			// Llamamos a la función obtenerAreaServicio para obtener las áreas de servicio
			return obtenerAreaServicio(id_anuncio).then((areas_servicio) => {
				// Mapeamos las áreas de servicio al array de objetos que representan la tabla intermedia anuncio_area
				const areas: AreaServicioAnuncio[] = areas_servicio.map((area: AreaServicio) => ({
					id_area: area.id,
					id_anuncio: id_anuncio
				}));
				// Devolvemos la interfaz anuncio_servicio
				const anuncioServicio: AnuncioServicio = {
					id: id_anuncio,
					titulo: anuncio[0]['titulo'],
					descripcion: anuncio[0]['descripcion'],
					imagen: anuncio[0]['imagen'],
					created_at: anuncio[0]['created_at'],
					updated_at: anuncio[0]['updated_at'],
					area_servicio: areas,
					dummy: anuncio[0]['dummy']
				};
				return anuncioServicio;
			});
		})
		.catch((err) => {
			console.log('Error al obtener el anuncio de servicio con ID: ', id_anuncio);
			throw err;
		});
}

async function crearAnuncio(anuncio: AnuncioServicio): Promise<number> {
	try {
		// Insertar el anuncio de servicio
		const [id_anuncio] = await knex('anuncio_servicio').insert({
			titulo: anuncio.titulo,
			descripcion: anuncio.descripcion,
			imagen: anuncio.imagen,
			dummy: anuncio.dummy
		});

		// Obtener las áreas de servicio del anuncio
		const areasServicio = anuncio.area_servicio;

		// Preparar los datos a insertar en la tabla areaservicio_anuncioservicio
		const fieldsToInsert: AreaServicioAnuncio | AreaServicioAnuncio[] = Array.isArray(areasServicio)
			? areasServicio.map((area) => ({
					id_area: area.id_area,
					id_anuncio: id_anuncio
				}))
			: { id_area: areasServicio, id_anuncio: id_anuncio };

		// Insertar en la tabla areaservicio_anuncioservicio
		await knex('areaservicio_anuncioservicio').insert(fieldsToInsert);

		console.log('Se ha creado el anuncio con ID:', id_anuncio);
		return id_anuncio;
	} catch (error) {
		console.error('Se ha producido un error al intentar crear el anuncio:', error);
		throw error;
	}
}

export async function crearDemanda(demanda: DemandaServicio): Promise<number> {
	try {
		// Crear el anuncio de servicio asociado a la demanda
		const id_anuncio = await crearAnuncio(demanda);

		// Insertar la demanda de servicio asociada al anuncio
		await knex('demanda_servicio').insert({
			id: id_anuncio,
			creador: demanda.creador,
			ciudad: demanda.ciudad,
			finalidad: demanda.finalidad,
			periodo_definicion_ini: demanda.periodo_definicion_ini,
			periodo_definicion_fin: demanda.periodo_definicion_fin,
			periodo_ejecucion_ini: demanda.periodo_ejecucion_ini,
			periodo_ejecucion_fin: demanda.periodo_ejecucion_fin,
			fecha_fin: demanda.fecha_fin,
			observaciones_temporales: demanda.observaciones_temporales,
			necesidad_social: demanda.necesidad_social,
			comunidad_beneficiaria: demanda.comunidad_beneficiaria
		});

		// Insertar las titulaciones locales demandadas asociadas a la demanda
		const titulaciones = demanda.titulacionlocal;
		const fieldsToInsert: TitulacionLocalDemanda | TitulacionLocalDemanda[] = Array.isArray(titulaciones)
			? titulaciones.map((titulacion) => ({
					id_titulacion: titulacion.id_titulacion,
					id_demanda: id_anuncio
				}))
			: { id_titulacion: titulaciones, id_demanda: id_anuncio };

		await knex('titulacionlocal_demanda').insert(fieldsToInsert);

		console.log('Se ha creado la demanda de servicio con ID:', id_anuncio);
		return id_anuncio;
	} catch (error) {
		console.error('Se ha producido un error al intentar crear la demanda de servicio:', error);
		throw error;
	}
}

export async function contarTodasDemandasServicio(): Promise<number> {
	try {
		// Realiza el conteo y espera el resultado
		const resultado = await knex('demanda_servicio').count({ count: '*' }).first();

		const total = resultado.count;
		return total;
	} catch (err) {
		console.error('Error al contar todas las demandas de servicio:', err);
		throw err;
	}
}

interface DemandasFiltro {
	terminoBusqueda: string;
	necesidadSocial?: string[];
	creador?: string;
	entidadDemandante?: string;
	areaServicio?: string[];
}

export async function obtenerTodasDemandasServicio(limit: number, offset: number, filters: DemandasFiltro): Promise<DemandaServicio[]> {
	try {
		const demandasQuery = knex('anuncio_servicio')
			.join('demanda_servicio', 'anuncio_servicio.id', '=', 'demanda_servicio.id')
			.join('necesidad_social', 'demanda_servicio.necesidad_social', '=', 'necesidad_social.id')
			.join('socio_comunitario', 'demanda_servicio.creador', '=', 'socio_comunitario.id')
			.join('datos_personales_externo', 'socio_comunitario.datos_personales_Id', '=', 'datos_personales_externo.id')
			.select([
				'anuncio_servicio.id',
				'anuncio_servicio.titulo',
				'anuncio_servicio.descripcion',
				'anuncio_servicio.imagen',
				'anuncio_servicio.created_at',
				'anuncio_servicio.updated_at',
				'demanda_servicio.*',
				'necesidad_social.nombre as necesidad_social',
				'datos_personales_externo.nombre as nombre_creador',
				'datos_personales_externo.apellidos as apellidos_creador'
			])
			.where('titulo', 'like', `%${filters.terminoBusqueda}%`)
			.modify((queryBuilder) => {
				if (filters.necesidadSocial) {
					queryBuilder.whereIn('necesidad_social.nombre', filters.necesidadSocial);
				}
				if (filters.creador) {
					queryBuilder.where('demanda_servicio.creador', filters.creador);
				}
				if (filters.entidadDemandante) {
					queryBuilder.where('socio_comunitario.id', filters.entidadDemandante);
				}
				if (filters.areaServicio) {
					queryBuilder.whereIn('area_servicio.nombre', filters.areaServicio);
				}
			})
			.limit(limit)
			.offset(offset);

		const datosDemandas = await demandasQuery;

		// Construcción de objetos TransferDemandaServicio
		return datosDemandas.map((datoDemanda) => {
			const anuncio: AnuncioServicio = {
				id: datoDemanda.id,
				titulo: datoDemanda.titulo,
				descripcion: datoDemanda.descripcion,
				imagen: datoDemanda.imagen,
				created_at: new Date(datoDemanda.created_at),
				updated_at: new Date(datoDemanda.updated_at),
				area_servicio: [], // Es necesario???
				dummy: datoDemanda.dummy
			};

			const transferDemanda: DemandaServicio = {
				...anuncio,
				creador: { nombre: datoDemanda.nombre_creador, apellidos: datoDemanda.apellidos_creador },
				ciudad: datoDemanda.ciudad,
				finalidad: datoDemanda.finalidad,
				periodo_definicion_ini: new Date(datoDemanda.periodo_definicion_ini),
				periodo_definicion_fin: new Date(datoDemanda.periodo_definicion_fin),
				periodo_ejecucion_ini: new Date(datoDemanda.periodo_ejecucion_ini),
				periodo_ejecucion_fin: new Date(datoDemanda.periodo_ejecucion_fin),
				fecha_fin: new Date(datoDemanda.fecha_fin),
				observaciones_temporales: datoDemanda.observaciones_temporales,
				necesidad_social: datoDemanda.necesidad_social,
				titulacionlocal: [], // Es necesario???
				comunidad_beneficiaria: datoDemanda.comunidad_beneficiaria,
				dummy: datoDemanda.dummy
			};

			return transferDemanda;
		});
	} catch (err) {
		console.error('Error al obtener todas las demandas de servicio:', err);
		throw err;
	}
}

async function eliminarDemanda(id_demanda: number): Promise<void> {
	try {
		const resultado = await knex('demanda_servicio').where('id', id_demanda).del();

		if (resultado > 0) {
			console.log('Se ha eliminado de la base de datos la demanda con id ', id_demanda);

			//En el codigo original no se elimina nada, es necesario?
			// await eliminarAnuncio(id_demanda);
		} else {
			console.log('No existe la demanda de servicio con id ', id_demanda);
		}
	} catch (err) {
		console.error('Se ha producido un error al intentar eliminar la demanda de servicio con id ', id_demanda, err);
		throw err;
	}
}

async function obtenerTitulacionLocal(id_demanda: number): Promise<TitulacionLocal[]> {
	try {
		// Obtener los IDs de las titulaciones asociadas a la demanda.
		const id_titulaciones = await knex('titulacionlocal_demanda').where({ id_demanda }).select('id_titulacion');

		// Si no hay titulaciones asociadas, devuelve un array vacío.
		if (!id_titulaciones.length) {
			console.log('No hay titulaciones asociadas a la demanda con id ', id_demanda);
			return [];
		}

		// Extraer solo los IDs de las titulaciones.
		const titulacionesIds = id_titulaciones.map((t) => t.id_titulacion);

		// Obtener los detalles de las titulaciones a partir de los IDs.
		const titulaciones = await knex('titulacion_local').select('id', 'nombre').whereIn('id', titulacionesIds);

		return titulaciones;
	} catch (err) {
		console.error('Error al obtener las titulaciones de la demanda con id ', id_demanda, err);
		throw err;
	}
}
async function obtenerAreaServicioDemanda(demanda: number): Promise<AreaServicioAnuncio[]> {
	try {
		const areasServicio = await knex<AreaServicioAnuncio>('areaservicio_anuncioservicio').where({ id_anuncio: demanda });
		return areasServicio;
	} catch (err) {
		console.error('Error al obtener áreas de servicio para la demanda', demanda, err);
		throw err;
	}
}

export async function obtenerListaTitulacionLocal(): Promise<TitulacionLocal[]> {
	try {
		const titulaciones = await knex<TitulacionLocal>('titulacion_local').select('*');
		return titulaciones;
	} catch (err) {
		console.error('Error al obtener todas las titulaciones locales', err);
		throw err;
	}
}

export async function obtenerListaNecesidadSocial(): Promise<any[]> {
	try {
		const necesidadesSociales = await knex('necesidad_social').select('*');
		return necesidadesSociales;
	} catch (err) {
		console.error('Error al obtener todas las necesidades sociales', err);
		throw err;
	}
}
