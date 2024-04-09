import knex from '../../config';
import type { Iniciativa } from '../types/Iniciativa';

async function crearIniciativa(iniciativa: Iniciativa): Promise<void> {
	try {
		const [id_iniciativa] = await knex('iniciativa')
			.insert({
				titulo: iniciativa.titulo,
				descripcion: iniciativa.descripcion,
				necesidad_social: iniciativa.necesidad_social,
				id_estudiante: iniciativa.estudiante,
				id_demanda: iniciativa.demanda
			})
			.returning('id');

		let fieldsToInsert = Array.isArray(iniciativa.area_servicio)
			? iniciativa.area_servicio.map((area) => ({
					id_area: area,
					id_iniciativa
				}))
			: [{ id_area: iniciativa.area_servicio, id_iniciativa }];

		await knex('areaservicio_iniciativa').insert(fieldsToInsert);

		console.log('Se ha introducido en la base de datos una iniciativa con id', id_iniciativa);
	} catch (err) {
		console.error('Se ha producido un error al crear la iniciativa', err);
		throw err;
	}
}

async function crearMatch(idOferta: number, idDemanda: number, porcentaje: number): Promise<void> {
	try {
		await knex('matching')
			.insert({
				id_oferta: idOferta,
				id_demanda: idDemanda,
				procesado: 1,
				emparejamiento: porcentaje
			})
			.returning('id');

		console.log('El match se ha creado con éxito');
	} catch (err) {
		console.error('Se ha producido un error al intentar crear el match', err);
		throw err;
	}
}

async function obtenerIniciativa(id: number): Promise<Iniciativa | null> {
	try {
		// Obtener los datos de la iniciativa directamente
		const datos = await knex('iniciativa').where({ id }).first();
		if (!datos) {
			console.log(`No se encontró la iniciativa con id ${id}`);
			return null;
		}

		// Obtener los IDs de las áreas de servicio relacionadas con la iniciativa
		const id_areas = await knex('areaservicio_iniciativa').where({ id_iniciativa: id }).select('id_area');
		const id_areas_array = id_areas.map((area) => area.id_area);

		// No es necesario obtener los nombres de las áreas de servicio ni de la demanda
		// Devolver directamente la iniciativa con los IDs de áreas de servicio
		return {
			id: datos.id,
			titulo: datos.titulo,
			descripcion: datos.descripcion,
			necesidad_social: datos.necesidad_social,
			demanda: datos.id_demanda,
			area_servicio: id_areas_array,
			estudiante: datos.id_estudiante
		};
	} catch (err) {
		console.error(`Se ha producido un error al intentar obtener la iniciativa con id ${id}`, err);
		throw err;
	}
}

//Unificar estas dos en una unica funcion y modificar dinamicamente la consulta mediante un parametro???
async function obtenerIniciativasInternos(): Promise<Iniciativa[]> {
	return knex('iniciativa')
		.join('necesidad_social', 'iniciativa.necesidad_social', '=', 'necesidad_social.id')
		.join('estudiante_interno', 'iniciativa.id_estudiante', '=', 'estudiante_interno.id')
		.join('datos_personales_interno', 'estudiante_interno.datos_personales_Id', '=', 'datos_personales_interno.id')
		.select({
			id: 'iniciativa.id',
			titulo: 'iniciativa.titulo',
			descripcion: 'iniciativa.descripcion',
			necesidad: 'necesidad_social.nombre',
			demanda: 'iniciativa.id_demanda',
			estudiante: 'datos_personales_interno.nombre'
		});
}

async function obtenerIniciativasExternos(): Promise<Iniciativa[]> {
	return knex('iniciativa')
		.join('necesidad_social', 'iniciativa.necesidad_social', '=', 'necesidad_social.id')
		.join('estudiante_externo', 'iniciativa.id_estudiante', '=', 'estudiante_externo.id')
		.join('datos_personales_externo', 'estudiante_externo.datos_personales_Id', '=', 'datos_personales_externo.id')
		.select({
			id: 'iniciativa.id',
			titulo: 'iniciativa.titulo',
			descripcion: 'iniciativa.descripcion',
			necesidad: 'necesidad_social.nombre',
			demanda: 'iniciativa.id_demanda',
			estudiante: 'datos_personales_externo.nombre'
		});
}

async function obtenerTodasIniciativas(): Promise<Iniciativa[]> {
	try {
		const internos = await obtenerIniciativasInternos();
		const externos = await obtenerIniciativasExternos();
		const areas = await knex('areaservicio_iniciativa').join('area_servicio', 'areaservicio_iniciativa.id_area', '=', 'area_servicio.id').select({
			idIniciativa: 'areaservicio_iniciativa.id_iniciativa',
			area: 'area_servicio.nombre'
		});

		const todasIniciativas = [...internos, ...externos];
		const transfersIniciativas = todasIniciativas.map((iniciativa) => {
			const areasServicio = areas.filter((area) => area.idIniciativa === iniciativa.id).map((area) => area.area);

			return { ...iniciativa, areasServicio };
		});

		return transfersIniciativas;
	} catch (err) {
		console.error('Error al obtener todas las iniciativas:', err);
		throw err;
	}
}

async function actualizarIniciativa(iniciativa: Iniciativa): Promise<number> {
	try {
		await knex('iniciativa').where({ id: iniciativa.id }).update({
			titulo: iniciativa.titulo,
			descripcion: iniciativa.descripcion,
			id_demanda: iniciativa.demanda,
			necesidad_social: iniciativa.necesidad_social
		});

		await knex('areaservicio_iniciativa').where({ id_iniciativa: iniciativa.id }).del();

		const fieldsToInsert = {
			id_area: iniciativa.area_servicio,
			id_iniciativa: iniciativa.id
		};

		await knex('areaservicio_iniciativa').insert(fieldsToInsert);

		return iniciativa.id; // Retorna el ID de la iniciativa actualizada
	} catch (err) {
		console.error(`Error al actualizar la iniciativa con id ${iniciativa.id}:`, err);
		throw err;
	}
}

async function eliminarIniciativa(id: number): Promise<void> {
	try {
		const result = await knex('iniciativa').where('id', id).del();
		if (result > 0) {
			console.log(`Se ha eliminado de la base de datos la iniciativa con id ${id}.`);
		} else {
			console.log(`No existe la iniciativa con id ${id}.`);
		}
	} catch (err) {
		console.error(`Error al intentar eliminar de la base de datos la iniciativa con id ${id}:`, err);
	}
}
//Que se supone que retorna: AreasServicio?
async function obtenerListaNecesidadSocial(): Promise<any[]> {
	try {
		const areas = await knex('necesidad_social').select('*');
		return areas;
	} catch (err) {
		console.error('Error al intentar obtener todas las necesidades sociales:', err);
		throw err;
	}
}

//Que se supone que retorna?
async function obtenerAreaServicioTitulacionPorArea(servicios: number[]): Promise<any[]> {
	try {
		const titulaciones = await knex.select('titulacion').from('matching_areaservicio_titulacion').whereIn('area_servicio', servicios);
		return titulaciones;
	} catch (err) {
		console.error('Error al intentar obtener datos de la tabla matching_areaservicio_titulacion:', err);
		throw err;
	}
}

async function obtenerAreaServicioConocimientoPorArea(servicios: number[]): Promise<any[]> {
	try {
		const areasConocimiento = await knex.select('area_conocimiento').from('matching_areas').whereIn('area_servicio', servicios);
		return areasConocimiento;
	} catch (err) {
		console.error('Error al intentar obtener datos de la tabla matching_areas:', err);
		throw err;
	}
}

async function existe(id_oferta: number, id_demanda: number): Promise<boolean> {
	try {
		const resultado = await knex.from('matching').where({ id_oferta, id_demanda });
		return resultado.length > 0;
	} catch (err) {
		console.error('Error al intentar verificar existencia en la tabla matching:', err);
		throw err;
	}
}
