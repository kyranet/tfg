import { isNullishOrEmpty } from '@sapphire/utilities';
import { AreaServicio_Iniciativa } from '../../types/AreaServicio_Iniciativa';
import { Iniciativa } from '../../types/Iniciativa';
import { FormattedIniciativa, formatIniciativa } from './_shared';
import type { CreateIniciativaOptions } from './insert';

export async function actualizarIniciativa(id: number, data: CreateIniciativaOptions): Promise<FormattedIniciativa> {
	return await qb.transaction(async (trx) => {
		const entry = getFirstDatabaseEntry(
			await trx(Iniciativa.Name) //
				.where({ id })
				.update(data)
				.returning('*')
		);

		await trx(AreaServicio_Iniciativa.Name).where({ id_iniciativa: entry.id }).del();
		if (!isNullishOrEmpty(data.areas)) {
			await trx(AreaServicio_Iniciativa.Name).insert(data.areas.map((area) => ({ id_area: area, id_iniciativa: entry.id })));
		}

		return formatIniciativa(entry);
	});
}
