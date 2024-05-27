import { isNullishOrEmpty } from '@sapphire/utilities';
import { AreaServicio_Iniciativa } from '../../types/AreaServicio_Iniciativa';
import { Iniciativa } from '../../types/Iniciativa';
import { Matching } from '../../types/Matching';
import { formatIniciativa, formatMatch, type FormattedIniciativa, type FormattedMatch } from './_shared';

export interface CreateIniciativaOptions extends Iniciativa.CreateData {
	areas?: readonly AreaServicio_Iniciativa.Value['id_area'][];
}

export async function crearIniciativa(data: CreateIniciativaOptions): Promise<FormattedIniciativa> {
	return await qb.transaction(async (trx) => {
		const [entry] = await trx(Iniciativa.Name).insert(data).returning('*');

		if (!isNullishOrEmpty(data.areas)) {
			await trx(AreaServicio_Iniciativa.Name).insert(data.areas.map((area) => ({ id_area: area, id_iniciativa: entry.id })));
		}

		return formatIniciativa(entry);
	});
}

export async function crearMatch(data: Matching.CreateData): Promise<FormattedMatch> {
	const [entry] = await qb(Matching.Name).insert(data).returning('*');
	return formatMatch(entry);
}
