import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Knex } from 'knex';
import { Colaboracion } from '../../types/Colaboracion';
import { EstudianteProyecto } from '../../types/EstudianteProyecto';
import { Nota } from '../../types/Nota';
import { Partenariado } from '../../types/Partenariado';
import { PrevioPartenariado } from '../../types/PrevioPartenariado';
import { Profesor_Colaboracion } from '../../types/Profesor_Colaboracion';
import { Proyecto } from '../../types/Proyecto';
import { formatNota, formatPartenariado, formatProyecto, type FormattedNota, type FormattedPartenariado, type FormattedProyecto } from './_shared';

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

export async function actualizarPrevioPartenariado(data: PrevioPartenariado.CreateData): Promise<void> {
	await qb(PrevioPartenariado.Name).where({ id_demanda: data.id_demanda, id_oferta: data.id_oferta }).update({
		completado_profesor: data.completado_profesor,
		completado_socioComunitario: data.completado_socioComunitario
	});
}
