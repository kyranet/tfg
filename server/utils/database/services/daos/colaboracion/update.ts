import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Knex } from 'knex';
import { Colaboracion } from '../../types/Colaboracion';
import { EstudianteProyecto } from '../../types/EstudianteProyecto';
import { Nota } from '../../types/Nota';
import { Partenariado } from '../../types/Partenariado';
import { PrevioPartenariado } from '../../types/PrevioPartenariado';
import { Profesor_Colaboracion } from '../../types/Profesor_Colaboracion';
import { Proyecto } from '../../types/Proyecto';
import { sharedUpdateAndReturn } from '../shared';
import { formatNota, formatPartenariado, formatProyecto, type FormattedNota, type FormattedPartenariado, type FormattedProyecto } from './_shared';

export type ColaboracionUpdateData = { id: number } & Partial<Colaboracion.Value> & { profesores?: readonly number[] };
async function actualizarColaboracion(data: ColaboracionUpdateData, trx: Knex.Transaction): Promise<Colaboracion.Value> {
	const entry = await sharedUpdateAndReturn({
		table: Colaboracion.Name,
		where: { id: data.id },
		data: { titulo: data.titulo, descripcion: data.descripcion, admite_externos: data.admite_externos, responsable: data.responsable },
		trx
	});

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
		const partenariado = await sharedUpdateAndReturn({
			table: Partenariado.Name,
			where: { id: data.id },
			data: { id_demanda: data.id_demanda, id_oferta: data.id_oferta, estado: data.estado },
			trx
		});

		return formatPartenariado({ ...colaboracion, ...partenariado });
	});
}

export type ProyectoUpdateData = ColaboracionUpdateData & Partial<Proyecto.Value> & { estudiantes?: readonly number[] };
export async function actualizarProyecto(data: ProyectoUpdateData): Promise<FormattedProyecto> {
	return qb.transaction(async (trx) => {
		const colaboracion = await actualizarColaboracion(data, trx);
		const proyecto = await sharedUpdateAndReturn({
			table: Proyecto.Name,
			where: { id: data.id },
			data: { id_partenariado: data.id_partenariado, estado: data.estado },
			trx
		});

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
	const entry = await sharedUpdateAndReturn({
		table: Nota.Name,
		where: { id: nota.id },
		data: { nota: nota.nota }
	});

	return formatNota(entry);
}

export async function actualizarPrevioPartenariado(data: PrevioPartenariado.CreateData): Promise<void> {
	await qb(PrevioPartenariado.Name).where({ id_demanda: data.id_demanda, id_oferta: data.id_oferta }).update({
		completado_profesor: data.completado_profesor,
		completado_socioComunitario: data.completado_socioComunitario
	});
}
