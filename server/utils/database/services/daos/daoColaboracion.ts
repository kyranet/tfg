import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import type { Knex } from 'knex';
import { AnuncioServicio } from '../types/AnuncioServicio';
import { Colaboracion } from '../types/Colaboracion';
import { EstudianteProyecto } from '../types/EstudianteProyecto';
import { Nota } from '../types/Nota';
import { OfertaServicio } from '../types/OfertaServicio';
import { Partenariado } from '../types/Partenariado';
import { PrevioPartenariado } from '../types/PrevioPartenariado';
import { Profesor_Colaboracion } from '../types/Profesor_Colaboracion';
import { Proyecto } from '../types/Proyecto';
import { ViewPartnership } from '../types/views/Partnership';
import { SearchParameters, sharedCountTable, sharedDeleteEntryTable } from './shared';

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
export function crearPartenariado(data: PartenariadoCreateData): Promise<FormattedPartenariado> {
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
export function crearProyecto(data: ProyectoCreateData): Promise<FormattedProyecto> {
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

export async function obtenerNota(id: number): Promise<FormattedNota> {
	return formatNota(ensureDatabaseEntry(await qb(Nota.Name).where({ id }).first()));
}

export function countProjects(): Promise<number> {
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
export function actualizarPartenariado(data: PartenariadoUpdateData): Promise<FormattedPartenariado> {
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
export async function actualizarProyecto(data: ProyectoUpdateData): Promise<FormattedProyecto> {
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
export async function actualizarNota(nota: NotaUpdateData): Promise<FormattedNota> {
	const entry = getFirstDatabaseEntry(
		await qb(Nota.Name).where({ id: nota.id }).update({ nota: nota.nota }).returning('*'),
		'No se ha encontrado una nota a actualizar con el ID proporcionado'
	);

	return formatNota(entry);
}

export async function getPartnership(id: number) {
	return ensureDatabaseEntry(await qb(ViewPartnership.Name).where({ id }).first());
}

export interface GetAllPartnershipsFilter extends SearchParameters {
	title?: string;
	acceptsExternals?: ViewPartnership.Value['acceptsExternals'];
	status?: ViewPartnership.Value['status'];
	manager?: ViewPartnership.Value['managerId'];
	cities?: ViewPartnership.Value['demandCity'][];
}
export async function getAllPartnerships(options: GetAllPartnershipsFilter): Promise<ViewPartnership.Value[]> {
	return await qb(ViewPartnership.Name) //
		.modify((query) => {
			if (!isNullishOrEmpty(options.title)) query.andWhereLike('title', `%${options.title}%`);
			if (!isNullish(options.acceptsExternals)) query.andWhere('acceptsExternals', options.acceptsExternals);
			if (!isNullish(options.status)) query.andWhere('status', options.status);
			if (!isNullish(options.manager)) query.andWhere('managerId', options.manager);
			if (!isNullishOrEmpty(options.cities)) query.whereIn('demandCity', options.cities);
		})
		.limit(options.limit ?? 100)
		.offset(options.offset ?? 0);
}

export function countPartnerships(): Promise<number> {
	return sharedCountTable(Partenariado.Name);
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

export interface FormattedPartenariado extends ReturnType<typeof formatPartenariado> {}
function formatPartenariado(entry: Colaboracion.Value & Partenariado.Value) {
	return {
		id: entry.id,
		titulo: entry.titulo,
		descripcion: entry.descripcion,
		imagen: entry.imagen,
		admiteExternos: entry.admite_externos,
		responsableId: entry.responsable,
		demandaId: entry.id_demanda,
		ofertaId: entry.id_oferta,
		estado: entry.estado
	};
}

export interface FormattedProyecto extends ReturnType<typeof formatProyecto> {}
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

export interface FormattedNota extends ReturnType<typeof formatNota> {}
function formatNota(entry: Nota.Value) {
	return {
		id: entry.id,
		nota: entry.nota,
		estudianteId: entry.id_estudiante,
		proyectoId: entry.id_proyecto
	};
}
