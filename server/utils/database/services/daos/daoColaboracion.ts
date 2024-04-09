import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import knex from '../../config';
import { obtenerUsuarioSinRolPorId } from '../daos/daoUsuario';
import { AnuncioServicio } from '../types/AnuncioServicio';
import { Colaboracion } from '../types/Colaboracion';
import { EstudianteProyecto } from '../types/EstudianteProyecto';
import { Nota } from '../types/Nota';
import { OfertaServicio } from '../types/OfertaServicio';
import { Partenariado } from '../types/Partenariado';
import { Profesor_Colaboracion } from '../types/Profesor_Colaboracion';
import { Proyecto } from '../types/Proyecto';

export type ColaboracionCreateData = Colaboracion.CreateData & { profesores?: readonly number[] };
export const crearColaboracion = async (data: ColaboracionCreateData): Promise<Colaboracion.Value> => {
	const [entry] = await knex(Colaboracion.Name)
		.insert({
			titulo: data.titulo,
			descripcion: data.descripcion,
			admite_externos: data.admite_externos,
			responsable: data.responsable
		})
		.returning('*');

	if (!isNullishOrEmpty(data.profesores)) {
		await knex(Profesor_Colaboracion.Name).insert(
			data.profesores.map((profesor) => ({
				id_profesor: profesor,
				id_colaboracion: entry.id
			}))
		);
	}

	return entry;
};

export type PartenariadoCreateData = Omit<ColaboracionCreateData & Partenariado.CreateData, 'id'>;
export const crearPartenariado = async (data: PartenariadoCreateData): Promise<Colaboracion.Value & Partenariado.Value> => {
	const colaboracion = await crearColaboracion(data);
	const [partenariado] = await knex(Partenariado.Name)
		.insert({
			id: colaboracion.id,
			id_demanda: data.id_demanda,
			id_oferta: data.id_oferta,
			estado: data.estado
		})
		.returning('*');

	console.log('Se ha creado un partenariado con id', colaboracion.id);
	return { ...colaboracion, ...partenariado };
};

export type ProyectoCreateData = Omit<ColaboracionCreateData & Proyecto.CreateData, 'id'> & { estudiantes?: readonly number[] };
export const crearProyecto = async (data: ProyectoCreateData): Promise<Colaboracion.Value & Proyecto.Value> => {
	const colaboracion = await crearColaboracion(data);
	const [proyecto] = await knex(Proyecto.Name)
		.insert({
			id: colaboracion.id,
			id_partenariado: data.id_partenariado,
			estado: data.estado
		})
		.returning('*');

	if (!isNullishOrEmpty(data.estudiantes)) {
		await knex(EstudianteProyecto.Name).insert(
			data.estudiantes.map((estudiante) => ({
				id_estudiante: estudiante,
				id_proyecto: proyecto.id
			}))
		);
	}

	return { ...colaboracion, ...proyecto };
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
	return deleteEntryTable(Colaboracion.Name, id);
}

// Eliminar un partenariado
export function eliminarPartenariado(id: number): Promise<boolean> {
	return deleteEntryTable(Partenariado.Name, id);
}

// Eliminar un proyecto
export function eliminarProyecto(id: number): Promise<boolean> {
	return deleteEntryTable(Proyecto.Name, id);
}

// Eliminar una nota
export async function eliminarNota(id: number): Promise<boolean> {
	return deleteEntryTable(Nota.Name, id);
}

//ACTUALIZAR---------------------------------------------------

export type ColaboracionUpdateData = { id: number } & Partial<Colaboracion.Value> & { profesores?: readonly number[] };
async function actualizarColaboracion(data: ColaboracionUpdateData): Promise<Colaboracion.Value> {
	const entries = await knex(Colaboracion.Name)
		.where({ id: data.id })
		.update({
			titulo: data.titulo,
			descripcion: data.descripcion,
			admite_externos: data.admite_externos,
			responsable: data.responsable
		})
		.returning('*');
	const entry = getFirstDatabaseEntry(entries, 'No se ha encontrado una colaboración con el ID proporcionado');

	await knex(Profesor_Colaboracion.Name).where({ id_colaboracion: data.id }).del();
	if (!isNullishOrEmpty(data.profesores)) {
		await knex(Profesor_Colaboracion.Name).insert(
			data.profesores.map((profesor) => ({
				id_profesor: profesor,
				id_colaboracion: data.id
			}))
		);
	}

	return entry;
}

export type PartenariadoUpdateData = ColaboracionUpdateData & Partial<Partenariado.Value>;
export async function actualizarPartenariado(data: PartenariadoUpdateData): Promise<Colaboracion.Value & Partenariado.Value> {
	const colaboracion = await actualizarColaboracion(data);
	const partenariados = await knex(Partenariado.Name)
		.where('id', data.id)
		.update({ id_demanda: data.id_demanda, id_oferta: data.id_oferta, estado: data.estado })
		.returning('*');
	const partenariado = getFirstDatabaseEntry(partenariados, 'No se ha encontrado un partenariado a actualizar con el ID proporcionado');

	return { ...colaboracion, ...partenariado };
}

export type ProyectoUpdateData = ColaboracionUpdateData & Partial<Proyecto.Value> & { estudiantes?: readonly number[] };
export async function actualizarProyecto(data: ProyectoUpdateData): Promise<Colaboracion.Value & Proyecto.Value> {
	const colaboracion = await actualizarColaboracion(data);
	const proyectos = await knex(Proyecto.Name)
		.where({ id: data.id })
		.update({ id_partenariado: data.id_partenariado, estado: data.estado })
		.returning('*');
	const proyecto = getFirstDatabaseEntry(proyectos, 'No se ha encontrado un proyecto a actualizar con el ID proporcionado');

	await knex(EstudianteProyecto.Name).where({ id_proyecto: data.id }).del();
	if (!isNullishOrEmpty(data.estudiantes)) {
		await knex(EstudianteProyecto.Name).insert(
			data.estudiantes.map((estudiante) => ({
				id_estudiante: estudiante,
				id_proyecto: data.id
			}))
		);
	}

	return { ...colaboracion, ...proyecto };
}

export type NotaUpdateData = Pick<Nota.Value, 'id' | 'nota'>;
export async function actualizarNota(nota: NotaUpdateData): Promise<Nota.Value> {
	const entries = await knex(Nota.Name).where({ id: nota.id }).update({ nota: nota.nota }).returning('*');
	return getFirstDatabaseEntry(entries, 'No se ha encontrado una nota a actualizar con el ID proporcionado');
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
