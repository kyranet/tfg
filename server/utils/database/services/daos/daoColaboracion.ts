import { isNullishOrEmpty } from '@sapphire/utilities';
import { Knex } from 'knex';
import { obtenerUsuarioSinRolPorId } from '../daos/daoUsuario';
import { AnuncioServicio } from '../types/AnuncioServicio';
import { Colaboracion } from '../types/Colaboracion';
import { EstudianteProyecto } from '../types/EstudianteProyecto';
import { Nota } from '../types/Nota';
import { OfertaServicio } from '../types/OfertaServicio';
import { Partenariado } from '../types/Partenariado';
import { PrevioPartenariado } from '../types/PrevioPartenariado';
import { Profesor_Colaboracion } from '../types/Profesor_Colaboracion';
import { Proyecto } from '../types/Proyecto';
import { sharedCountTable, sharedDeleteEntryTable } from './shared';

export type ColaboracionCreateData = Colaboracion.CreateData & { profesores?: readonly number[] };
async function crearColaboracion(data: ColaboracionCreateData, trx: Knex.Transaction): Promise<Colaboracion.Value> {
	const [entry] = await trx(Colaboracion.Name)
		.insert({
			titulo: data.titulo,
			descripcion: data.descripcion,
			admite_externos: data.admite_externos,
			responsable: data.responsable
		})
		.returning('*');

	if (!isNullishOrEmpty(data.profesores)) {
		await trx(Profesor_Colaboracion.Name).insert(
			data.profesores.map((profesor) => ({
				id_profesor: profesor,
				id_colaboracion: entry.id
			}))
		);
	}

	return entry;
}

export type PartenariadoCreateData = Omit<ColaboracionCreateData & Partenariado.CreateData, 'id'>;
export function crearPartenariado(data: PartenariadoCreateData) {
	return qb.transaction(async (trx) => {
		const colaboracion = await crearColaboracion(data, trx);
		const [partenariado] = await trx(Partenariado.Name)
			.insert({
				id: colaboracion.id,
				id_demanda: data.id_demanda,
				id_oferta: data.id_oferta,
				estado: data.estado
			})
			.returning('*');

		return formatPartenariado({ ...colaboracion, ...partenariado });
	});
}

export type ProyectoCreateData = Omit<ColaboracionCreateData & Proyecto.CreateData, 'id'> & { estudiantes?: readonly number[] };
export function crearProyecto(data: ProyectoCreateData) {
	return qb.transaction(async (trx) => {
		const colaboracion = await crearColaboracion(data, trx);
		const [proyecto] = await trx(Proyecto.Name)
			.insert({
				id: colaboracion.id,
				id_partenariado: data.id_partenariado,
				estado: data.estado
			})
			.returning('*');

		if (!isNullishOrEmpty(data.estudiantes)) {
			await trx(EstudianteProyecto.Name).insert(
				data.estudiantes.map((estudiante) => ({
					id_estudiante: estudiante,
					id_proyecto: proyecto.id
				}))
			);
		}

		return formatProyecto({ ...colaboracion, ...proyecto });
	});
}

export async function crearNota(nota: Nota.CreateData): Promise<number> {
	const [entry] = await qb(Nota.Name) //
		.insert({ id_estudiante: nota.id_estudiante, nota: nota.nota, id_proyecto: nota.id_proyecto })
		.returning('id');

	return entry.id;
}

async function obtenerProfesores(colaboracionId: number): Promise<readonly number[]> {
	const profesores = await qb(Profesor_Colaboracion.Name) //
		.where({ id_colaboracion: colaboracionId })
		.select('id_profesor');
	return profesores.map((profesor) => profesor.id_profesor);
}

export async function obtenerPartenariado(id: number) {
	const entry = ensureDatabaseEntry(
		await qb(Colaboracion.Name) //
			.where({ id })
			.join(Partenariado.Name, Colaboracion.Key('id'), '=', Partenariado.Key('id'))
			.first()
	);

	const responsable = await obtenerUsuarioSinRolPorId(entry.id);
	return {
		...formatPartenariado(entry),
		profesores: await obtenerProfesores(entry.id),
		responsable: responsable.nombre
	};
}

export async function obtenerProyecto(id: number) {
	const entry = ensureDatabaseEntry(
		await qb(Colaboracion.Name) //
			.where({ id })
			.join(Proyecto.Name, Colaboracion.Key('id'), '=', Proyecto.Key('id'))
			.first()
	);

	const estudiantes = await qb(EstudianteProyecto.Name) //
		.where({ id_proyecto: id })
		.select('id_estudiante');
	return {
		...formatProyecto(entry),
		profesores: await obtenerProfesores(entry.id),
		estudiantes: estudiantes.map((est) => est.id_estudiante)
	};
}

export async function obtenerNota(id: number) {
	return formatNota(ensureDatabaseEntry(await qb(Nota.Name).where({ id }).first()));
}

export function contarProyectos(): Promise<number> {
	return sharedCountTable(Proyecto.Name);
}

export function contarPartenariados(): Promise<number> {
	return sharedCountTable(Partenariado.Name);
}

export function contarIniciativas(): Promise<number> {
	return sharedCountTable(OfertaServicio.Name);
}

export async function contarOfertas(): Promise<number> {
	return sharedCountTable(AnuncioServicio.Name);
}

//ELIMINAR

// Eliminar una colaboración
export function eliminarColaboracion(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Colaboracion.Name, id);
}

// Eliminar un partenariado
export function eliminarPartenariado(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Partenariado.Name, id);
}

// Eliminar un proyecto
export function eliminarProyecto(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Proyecto.Name, id);
}

// Eliminar una nota
export async function eliminarNota(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Nota.Name, id);
}

//ACTUALIZAR---------------------------------------------------

export type ColaboracionUpdateData = { id: number } & Partial<Colaboracion.Value> & { profesores?: readonly number[] };
async function actualizarColaboracion(data: ColaboracionUpdateData, trx: Knex.Transaction): Promise<Colaboracion.Value> {
	const entry = getFirstDatabaseEntry(
		await trx(Colaboracion.Name)
			.where({ id: data.id })
			.update({
				titulo: data.titulo,
				descripcion: data.descripcion,
				admite_externos: data.admite_externos,
				responsable: data.responsable
			})
			.returning('*'),
		'No se ha encontrado una colaboración con el ID proporcionado'
	);

	await trx(Profesor_Colaboracion.Name).where({ id_colaboracion: data.id }).del();
	if (!isNullishOrEmpty(data.profesores)) {
		await trx(Profesor_Colaboracion.Name).insert(
			data.profesores.map((profesor) => ({
				id_profesor: profesor,
				id_colaboracion: data.id
			}))
		);
	}

	return entry;
}

export type PartenariadoUpdateData = ColaboracionUpdateData & Partial<Partenariado.Value>;
export function actualizarPartenariado(data: PartenariadoUpdateData) {
	return qb.transaction(async (trx) => {
		const colaboracion = await actualizarColaboracion(data, trx);
		const partenariado = getFirstDatabaseEntry(
			await trx(Partenariado.Name)
				.where({ id: data.id })
				.update({ id_demanda: data.id_demanda, id_oferta: data.id_oferta, estado: data.estado })
				.returning('*'),
			'No se ha encontrado un partenariado a actualizar con el ID proporcionado'
		);

		return formatPartenariado({ ...colaboracion, ...partenariado });
	});
}

export type ProyectoUpdateData = ColaboracionUpdateData & Partial<Proyecto.Value> & { estudiantes?: readonly number[] };
export async function actualizarProyecto(data: ProyectoUpdateData) {
	return qb.transaction(async (trx) => {
		const colaboracion = await actualizarColaboracion(data, trx);
		const proyectos = await trx(Proyecto.Name)
			.where({ id: data.id })
			.update({ id_partenariado: data.id_partenariado, estado: data.estado })
			.returning('*');
		const proyecto = getFirstDatabaseEntry(proyectos, 'No se ha encontrado un proyecto a actualizar con el ID proporcionado');

		await trx(EstudianteProyecto.Name).where({ id_proyecto: data.id }).del();
		if (!isNullishOrEmpty(data.estudiantes)) {
			await trx(EstudianteProyecto.Name).insert(
				data.estudiantes.map((estudiante) => ({
					id_estudiante: estudiante,
					id_proyecto: data.id
				}))
			);
		}

		return formatProyecto({ ...colaboracion, ...proyecto });
	});
}

export type NotaUpdateData = Pick<Nota.Value, 'id' | 'nota'>;
export async function actualizarNota(nota: NotaUpdateData) {
	const entry = getFirstDatabaseEntry(
		await qb(Nota.Name).where({ id: nota.id }).update({ nota: nota.nota }).returning('*'),
		'No se ha encontrado una nota a actualizar con el ID proporcionado'
	);

	return formatNota(entry);
}

export async function obtenerTodosPartenariados() {
	const entries = await qb(Colaboracion.Name) //
		.join(Partenariado.Name, Colaboracion.Key('id'), '=', Partenariado.Key('id'));

	const profesores = await qb(Profesor_Colaboracion.Name);
	const map = new Map(entries.map((entry) => [entry.id, { ...formatPartenariado(entry), profesores: [] as number[] }]));
	for (const profesor of profesores) {
		const entry = map.get(profesor.id_colaboracion);
		entry?.profesores.push(profesor.id_profesor);
	}

	return [...map.values()];
}

export async function crearPrevioPartenariado(data: PrevioPartenariado.CreateData) {
	await qb(PrevioPartenariado.Name).insert({
		id_demanda: data.id_demanda,
		id_oferta: data.id_oferta,
		completado_profesor: data.completado_profesor,
		completado_socioComunitario: data.completado_socioComunitario
	});
}

export async function actualizarPrevioPartenariado(data: PrevioPartenariado.CreateData): Promise<void> {
	await qb(PrevioPartenariado.Name).where({ id_demanda: data.id_demanda, id_oferta: data.id_oferta }).update({
		completado_profesor: data.completado_profesor,
		completado_socioComunitario: data.completado_socioComunitario
	});
}

export async function maybeObtenerIdPartenariado(data: Pick<Partenariado.Value, 'id_demanda' | 'id_oferta'>): Promise<number | null> {
	const entry = await qb('partenariado').where({ id_demanda: data.id_demanda, id_oferta: data.id_oferta }).select('id').first();
	return entry?.id ?? null;
}

function formatPartenariado(entry: Colaboracion.Value & Partenariado.Value) {
	return {
		id: entry.id,
		titulo: entry.titulo,
		descripcion: entry.descripcion,
		imagen: entry.imagen,
		admiteExternos: entry.admite_externos,
		demandaId: entry.id_demanda,
		ofertaId: entry.id_oferta,
		estado: entry.estado
	};
}

function formatProyecto(entry: Colaboracion.Value & Proyecto.Value) {
	return {
		id: entry.id,
		titulo: entry.titulo,
		descripcion: entry.descripcion,
		imagen: entry.imagen,
		admiteExternos: entry.admite_externos,
		estado: entry.estado,
		url: entry.url,
		partenariadoId: entry.id_partenariado,
		responsableId: entry.responsable
	};
}

function formatNota(entry: Nota.Value) {
	return {
		id: entry.id,
		nota: entry.nota,
		estudianteId: entry.id_estudiante,
		proyectoId: entry.id_proyecto
	};
}
