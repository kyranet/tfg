import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Knex } from 'knex';
import { Colaboracion } from '../../types/Colaboracion';
import { EstudianteProyecto } from '../../types/EstudianteProyecto';
import { Nota } from '../../types/Nota';
import { Partenariado } from '../../types/Partenariado';
import { PrevioPartenariado } from '../../types/PrevioPartenariado';
import { Profesor_Colaboracion } from '../../types/Profesor_Colaboracion';
import { Proyecto } from '../../types/Proyecto';
import { formatPartenariado, formatProyecto, type FormattedPartenariado, type FormattedProyecto } from './_shared';

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

export async function crearPrevioPartenariado(data: PrevioPartenariado.CreateData) {
	await qb(PrevioPartenariado.Name).insert({
		id_demanda: data.id_demanda,
		id_oferta: data.id_oferta,
		completado_profesor: data.completado_profesor,
		completado_socioComunitario: data.completado_socioComunitario
	});
}
