import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import knex from '../../config';
import { obtenerUsuarioSinRolPorId } from '../daos/daoUsuario';
import { Colaboracion } from '../types/Colaboracion';
import { EstudianteProyecto } from '../types/EstudianteProyecto';
import { Nota } from '../types/Nota';
import { Partenariado } from '../types/Partenariado';
import { Profesor_Colaboracion } from '../types/Profesor_Colaboracion';
import { Proyecto } from '../types/Proyecto';
import { OfertaServicio } from '../types/OfertaServicio';
import { AnuncioServicio } from '../types/AnuncioServicio';

export type ColaboracionCreateData = Colaboracion.CreateData & { profesores?: readonly number[] };
export const crearColaboracion = async (colaboracion: ColaboracionCreateData): Promise<number> => {
	const [entry] = await knex(Colaboracion.Name).insert(
		{
			titulo: colaboracion.titulo,
			descripcion: colaboracion.descripcion,
			admite_externos: colaboracion.admite_externos,
			responsable: colaboracion.responsable
		},
		'id'
	);

	if (!isNullishOrEmpty(colaboracion.profesores)) {
		await knex(Profesor_Colaboracion.Name).insert(
			colaboracion.profesores.map((profesor) => ({
				id_profesor: profesor,
				id_colaboracion: entry.id
			}))
		);
	}

	return entry.id;
};

export type PartenariadoCreateData = Omit<ColaboracionCreateData & Partenariado.CreateData, 'id'>;
export const crearPartenariado = async (partenariado: PartenariadoCreateData): Promise<number> => {
	const id = await crearColaboracion(partenariado);
	await knex(Partenariado.Name).insert({
		id,
		id_demanda: partenariado.id_demanda,
		id_oferta: partenariado.id_oferta,
		estado: partenariado.estado
	});

	console.log('Se ha creado un partenariado con id', id);
	return id;
};

export type ProyectoCreateData = Omit<ColaboracionCreateData & Proyecto.CreateData, 'id'> & { estudiantes?: readonly number[] };
export const crearProyecto = async (proyecto: ProyectoCreateData): Promise<number> => {
	const id = await crearColaboracion(proyecto);
	await knex(Proyecto.Name).insert({
		id,
		id_partenariado: proyecto.id_partenariado,
		estado: proyecto.estado
	});

	if (!isNullishOrEmpty(proyecto.estudiantes)) {
		await knex(EstudianteProyecto.Name).insert(
			proyecto.estudiantes.map((estudiante) => ({
				id_estudiante: estudiante,
				id_proyecto: id
			}))
		);
	}

	return id;
};

export async function crearNota(nota: Nota.CreateData): Promise<number> {
	const [entry] = await knex(Nota.Name)
		.insert({
			id_estudiante: nota.id_estudiante,
			nota: nota.nota,
			id_proyecto: nota.id_proyecto
		})
		.returning('id');

	return entry.id;
}

async function obtenerColaboracion(colaboracionId: number) {
	const colaboracion = await knex(Colaboracion.Name).where({ id: colaboracionId }).first();
	if (isNullish(colaboracion)) return null;

	const profesores = await knex(Profesor_Colaboracion.Name).where({ id_colaboracion: colaboracion.id }).select('id_profesor');

	return {
		...colaboracion,
		profesores: profesores.map((profesor) => profesor.id_profesor)
	};
}

export async function obtenerPartenariado(id: number) {
	const colaboracion = await obtenerColaboracion(id);
	if (isNullish(colaboracion)) return null;

	const partenariado = await knex(Partenariado.Name).where({ id }).first();
	if (isNullish(partenariado)) return null;

	const responsable = await obtenerUsuarioSinRolPorId(colaboracion.id);

	return {
		id,
		titulo: colaboracion.titulo,
		descripcion: colaboracion.descripcion,
		admiteExternos: colaboracion.admite_externos,
		responsable: responsable.nombre,
		profesores: colaboracion.profesores,
		demandaId: partenariado.id_demanda,
		ofertaId: partenariado.id_oferta,
		estado: partenariado.estado
	};
}

export async function obtenerProyecto(id: number) {
	const colaboracion = await obtenerColaboracion(id);
	if (isNullish(colaboracion)) return null;

	const proyecto = await knex(Proyecto.Name).where({ id }).first();
	if (isNullish(proyecto)) return null;

	const estudiantes = await knex(EstudianteProyecto.Name).where({ id_proyecto: id }).select('id_estudiante');

	return {
		id,
		titulo: colaboracion.titulo,
		descripcion: colaboracion.descripcion,
		admiteExternos: colaboracion.admite_externos,
		responsable: colaboracion.responsable,
		profesores: colaboracion.profesores,
		partenariadoId: proyecto.id_partenariado,
		estado: proyecto.estado,
		estudiantes: estudiantes.map((est) => est.id_estudiante)
	};
}

// Función para obtener una nota específica
export async function obtenerNota(id: number) {
	const response = await knex(Nota.Name).where({ id }).first();
	if (isNullish(response)) return null;

	return {
		id: response.id,
		estudianteId: response.id_estudiante,
		nota: response.nota,
		proyectoId: response.id_proyecto
	};
}

async function countTable(table: string) {
	const result = await knex(table).count({ count: '*' }).first();
	return result?.count ? Number(result.count) : 0;
}

// Funciones para contar elementos en la base de datos
export function contarProyectos(): Promise<number> {
	return countTable(Proyecto.Name);
}

export function contarPartenariados(): Promise<number> {
	return countTable(Partenariado.Name);
}

export function contarIniciativas(): Promise<number> {
	return countTable(OfertaServicio.Name);
}

export async function contarOfertas(): Promise<number> {
	return countTable(AnuncioServicio.Name);
}

//ELIMINAR

async function deleteEntryTable(table: string, id: number) {
	const result = await knex(table).where({ id }).del();
	return result > 0;
}

// Eliminar una colaboración
export function eliminarColaboracion(id: number): Promise<boolean> {
	return deleteEntryTable(Colaboracion.name, id);
}

// Eliminar un partenariado
export function eliminarPartenariado(id: number): Promise<boolean> {
	return deleteEntryTable(Partenariado.name, id);
}

// Eliminar un proyecto
export function eliminarProyecto(id: number): Promise<boolean> {
	return deleteEntryTable(Proyecto.name, id);
}

// Eliminar una nota
export async function eliminarNota(id: number): Promise<boolean> {
	return deleteEntryTable(Nota.name, id);
}

//ACTUALIZAR---------------------------------------------------

async function actualizarColaboracion(colaboracion: Colaboracion): Promise<void> {
	try {
		await knex('colaboracion').where({ id: colaboracion.id }).update({
			titulo: colaboracion.titulo,
			descripcion: colaboracion.descripcion,
			admite_externos: colaboracion.admite_externos,
			responsable: colaboracion.responsable
		});

		await knex('profesor_colaboracion').where('id_colaboracion', colaboracion.id).del();

		if (colaboracion.profesores.length > 0) {
			const fieldsToInsert = colaboracion.profesores.map((profesor) => ({
				id_profesor: profesor,
				id_colaboracion: colaboracion.id
			}));
			await knex('profesor_colaboracion').insert(fieldsToInsert);
		}

		console.log('Colaboración actualizada con éxito. ID:', colaboracion.id);
	} catch (err) {
		console.error('Error al actualizar la colaboración. ID:', colaboracion.id, err);
	}
}

export async function actualizarPartenariado(partenariado: Partenariado): Promise<void> {
	try {
		await actualizarColaboracion(partenariado);

		await knex('partenariado').where('id', partenariado.id).update({
			id_demanda: partenariado.id_demanda,
			id_oferta: partenariado.id_oferta
		});

		console.log('Partenariado actualizado con éxito. ID:', partenariado.id);
	} catch (err) {
		console.error('Error al actualizar el partenariado. ID:', partenariado.id, err);
	}
}

async function actualizarProyecto(proyecto: Proyecto): Promise<void> {
	try {
		await actualizarColaboracion(proyecto);

		await knex('proyecto').where('id', proyecto.id).update({
			id_partenariado: proyecto.id_partenariado,
			estado: proyecto.estado
		});

		await knex('estudiante_proyecto').where('id_proyecto', proyecto.id).del();

		const fieldsToInsert = proyecto.estudiantes.map((estudiante) => ({
			id_estudiante: estudiante,
			id_proyecto: proyecto.id
		}));
		await knex('estudiante_proyecto').insert(fieldsToInsert);

		console.log('Proyecto actualizado con éxito. ID:', proyecto.id);
	} catch (err) {
		console.error('Error al actualizar el proyecto. ID:', proyecto.id, err);
	}
}

async function actualizarNota(nota: Nota): Promise<void> {
	try {
		const notaExistente = await knex('notas').where('id', nota.id).first();

		if (!notaExistente) {
			console.log('No se ha encontrado la nota con ID:', nota.id);
			return;
		}

		await knex('notas').where('id', nota.id).update({
			nota: nota.nota
		});

		console.log('Nota actualizada con éxito. ID:', nota.id);
	} catch (err) {
		console.error('Error al intentar actualizar la nota. ID:', nota.id, err);
	}
}

export async function actualizarEstadoPartenariado(partenariado: Partenariado): Promise<void> {
	try {
		const partenariadoExistente = await knex('partenariado').where('id', partenariado.id).first();

		if (!partenariadoExistente) {
			console.log('No se ha encontrado el partenariado con ID:', partenariado.id);
			return;
		}

		await knex('partenariado').where('id', partenariado.id).update({
			estado: partenariado.estado
		});

		console.log('Estado de partenariado actualizado con éxito. ID:', partenariado.id);
	} catch (err) {
		console.error('Error al intentar actualizar el estado de partenariado. ID:', partenariado.id, err);
	}
}

//GET ALL
async function obtenerTodosPartenariados(): Promise<Partenariado[]> {
	try {
		const datos = await knex('colaboracion').join('partenariado', 'colaboracion.id', '=', 'partenariado.id').select('*');

		const datos_profesores = await knex('profesor_colaboracion').select('*');

		const transfers = datos.map((partenariado) => {
			const profesores = datos_profesores
				.filter((profesor) => profesor['id_colaboracion'] === partenariado['id'])
				.map((profesor) => profesor['id_profesor']);

			return {
				id: partenariado['id'],
				titulo: partenariado['titulo'],
				descripcion: partenariado['descripcion'],
				admite_externos: partenariado['admite_externos'],
				responsable: partenariado['responsable'],
				profesores: profesores,
				id_demanda: partenariado['id_demanda'],
				id_oferta: partenariado['id_oferta'],
				status: partenariado['estado']
			};
		});

		return transfers;
	} catch (err) {
		console.error('Error al obtener todos los partenariados:', err);
		throw err;
	}
}

async function crearPrevioPartenariado(
	id_demanda: number,
	id_oferta: number,
	completado_profesor: boolean,
	completado_socioComunitario: boolean
): Promise<void> {
	try {
		await knex('previo_partenariado').insert({
			id_demanda,
			id_oferta,
			completado_profesor,
			completado_socioComunitario
		});
	} catch (err) {
		console.error('Error al crear el previo al partenariado:', err);
		throw err;
	}
}

export async function actualizarPrevioPartenariado(
	id_demanda: number,
	id_oferta: number,
	completado_profesor: boolean,
	completado_socioComunitario: boolean
): Promise<void> {
	try {
		await knex('previo_partenariado').where({ id_demanda, id_oferta }).update({
			completado_profesor,
			completado_socioComunitario
		});
	} catch (err) {
		console.error('Error al actualizar el previo al partenariado:', err);
		throw err;
	}
}

export async function obtenerIdPartenariado(id_demanda: number, id_oferta: number): Promise<number | null> {
	try {
		const result = await knex('partenariado').where({ id_demanda, id_oferta }).select('id').first();

		return result ? result.id : null;
	} catch (err) {
		console.error('Error al obtener ID de partenariado:', err);
		throw err;
	}
}
