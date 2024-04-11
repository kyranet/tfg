import { isNullishOrEmpty } from '@sapphire/utilities';
import { Knex } from 'knex';
import knex from '../../config';
import { obtenerSocioComunitario } from '../daos/daoUsuario';
import { AnuncioServicio } from '../types/AnuncioServicio';
import { AreaServicio } from '../types/AreaServicio';
import { AreaServicio_AnuncioServicio } from '../types/AreaServicio_AnuncioServicio';
import { AreaServicio_Iniciativa } from '../types/AreaServicio_Iniciativa';
import { DemandaServicio } from '../types/DemandaServicio';
import { Iniciativa } from '../types/Iniciativa';
import { NecesidadSocial } from '../types/NecesidadSocial';
import { TitulacionLocal } from '../types/TitulacionLocal';
import { TitulacionLocal_Demanda } from '../types/TitulacionLocal_Demanda';
import { sharedCountTable, sharedDeleteEntryTable, type SearchParameters } from './shared';

async function obtenerAreaServicio(id: number): Promise<AreaServicio.Value[]> {
	return await qb(AreaServicio_AnuncioServicio.Name)
		.where({ id_anuncio: id })
		.join(AreaServicio.Name, AreaServicio.Key('id'), '=', AreaServicio_AnuncioServicio.Key('id_area'))
		.select(AreaServicio.Key('*'));
}

export async function obtenerListaAreasServicio(): Promise<AreaServicio.Value[]> {
	return await qb(AreaServicio.Name);
}

// Esta función obtiene demandas de servicio basadas en un área de servicio específica.
// Recibe el ID del área de servicio como parámetro y devuelve una promesa que resuelve en un array de objetos DemandaServicio.
export interface CompleteDemandaServicio extends DemandaServicio.Value, AnuncioServicio.Value {}
export async function obtenerDemandaPorAreaServicio(id_areaServicio: number): Promise<CompleteDemandaServicio[]> {
	return await qb(AreaServicio_Iniciativa.Name)
		.where({ id_area: id_areaServicio })
		.join(Iniciativa.Name, AreaServicio.Key('id'), '=', AreaServicio_Iniciativa.Key('id_iniciativa'))
		.join(DemandaServicio.Name, DemandaServicio.Key('id'), '=', Iniciativa.Key('id_demanda'))
		.join(AnuncioServicio.Name, AnuncioServicio.Key('id'), '=', DemandaServicio.Key('id'))
		.select(DemandaServicio.Key('*'), AnuncioServicio.Key('*'));
}

//Obtiene las demandas de servicio asociadas a una necesidad social específica.
export async function obtenerDemandaPorNecesidadSocial(id: number): Promise<CompleteDemandaServicio[]> {
	return await qb(DemandaServicio.Name)
		.where({ necesidad_social: id })
		.join(AnuncioServicio.Name, AnuncioServicio.Key('id'), '=', DemandaServicio.Key('id'))
		.select(DemandaServicio.Key('*'), AnuncioServicio.Key('*'));
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

export type AnuncioServicioCreateData = AnuncioServicio.CreateData & { areasServicio?: readonly number[] };
async function crearAnuncio(data: AnuncioServicioCreateData, trx: Knex.Transaction): Promise<AnuncioServicio.Value> {
	const [entry] = await trx(AnuncioServicio.Name)
		.insert({
			titulo: data.titulo,
			descripcion: data.descripcion,
			imagen: data.imagen,
			dummy: data.dummy
		})
		.returning('*');

	if (!isNullishOrEmpty(data.areasServicio)) {
		await trx(AreaServicio_AnuncioServicio.Name) //
			.insert(data.areasServicio.map((area) => ({ id_area: area, id_anuncio: entry.id })));
	}

	return entry;
}

export type DemandaServicioCreateData = AnuncioServicioCreateData &
	Omit<DemandaServicio.CreateData, 'id'> & { titulacionesLocales?: readonly number[] };
export function crearDemanda(data: DemandaServicioCreateData): Promise<FormattedDemanda> {
	return qb.transaction(async (trx) => {
		// Crear el anuncio de servicio asociado a la demanda
		const anuncio = await crearAnuncio(data, trx);

		// Insertar la demanda de servicio asociada al anuncio
		const [demanda] = await trx(DemandaServicio.Name)
			.insert({
				id: anuncio.id,
				creador: data.creador,
				ciudad: data.ciudad,
				finalidad: data.finalidad,
				periodo_definicion_ini: data.periodo_definicion_ini,
				periodo_definicion_fin: data.periodo_definicion_fin,
				periodo_ejecucion_ini: data.periodo_ejecucion_ini,
				periodo_ejecucion_fin: data.periodo_ejecucion_fin,
				fecha_fin: data.fecha_fin,
				observaciones_temporales: data.observaciones_temporales,
				necesidad_social: data.necesidad_social,
				comunidad_beneficiaria: data.comunidad_beneficiaria
			})
			.returning('*');

		if (!isNullishOrEmpty(data.titulacionesLocales)) {
			await trx(TitulacionLocal_Demanda.Name).insert(
				data.titulacionesLocales.map((titulacion) => ({
					id_titulacion: titulacion,
					id_demanda: anuncio.id
				}))
			);
		}

		return formatDemanda(anuncio, demanda);
	});
}

export function contarTodasDemandasServicio(): Promise<number> {
	return sharedCountTable(DemandaServicio.Name);
}

interface DemandasFiltro extends SearchParameters {
	terminoBusqueda: string;
	necesidadSocial?: string[];
	creador?: string;
	entidadDemandante?: string;
	areaServicio?: string[];
}

export async function obtenerTodasDemandasServicio(options: DemandasFiltro): Promise<DemandaServicio[]> {
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
			.where('titulo', 'like', `%${options.terminoBusqueda}%`)
			.modify((queryBuilder) => {
				if (options.necesidadSocial) {
					queryBuilder.whereIn('necesidad_social.nombre', options.necesidadSocial);
				}
				if (options.creador) {
					queryBuilder.where('demanda_servicio.creador', options.creador);
				}
				if (options.entidadDemandante) {
					queryBuilder.where('socio_comunitario.id', options.entidadDemandante);
				}
				if (options.areaServicio) {
					queryBuilder.whereIn('area_servicio.nombre', options.areaServicio);
				}
			})
			.limit(options.limit ?? 100)
			.offset(options.offset ?? 0);

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

export async function eliminarDemanda(id_demanda: number): Promise<boolean> {
	return qb.transaction(
		async (trx) =>
			(await sharedDeleteEntryTable(DemandaServicio.Name, id_demanda, trx)) &&
			(await sharedDeleteEntryTable(AnuncioServicio.Name, id_demanda, trx))
	);
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

export async function obtenerListaTitulacionLocal(): Promise<TitulacionLocal.Value[]> {
	return await qb(TitulacionLocal.Name);
}

export async function obtenerListaNecesidadSocial(): Promise<any[]> {
	return await qb(NecesidadSocial.Name);
}

export interface FormattedDemanda extends ReturnType<typeof formatDemanda> {}
function formatDemanda(anuncio: AnuncioServicio.Value, demanda: DemandaServicio.Value) {
	return {
		id: anuncio.id,
		titulo: anuncio.titulo,
		descripcion: anuncio.descripcion,
		imagen: anuncio.imagen,
		createdAt: anuncio.created_at,
		updatedAt: anuncio.updated_at,
		dummy: anuncio.dummy,
		creador: demanda.creador,
		ciudad: demanda.ciudad,
		finalidad: demanda.finalidad,
		periodos: {
			definicion: { inicio: demanda.periodo_definicion_ini, fin: demanda.periodo_definicion_fin },
			ejecucion: { inicio: demanda.periodo_ejecucion_ini, fin: demanda.periodo_ejecucion_fin },
			fin: demanda.fecha_fin
		},
		observacionesTemporales: demanda.observaciones_temporales,
		necesidadSocial: demanda.necesidad_social,
		comunidadBeneficiaria: demanda.comunidad_beneficiaria
	};
}
