import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { Nota } from '../../types/Nota';
import { Partenariado } from '../../types/Partenariado';
import { ViewPartnership } from '../../types/views/Partnership';
import { SearchParameters } from '../shared';
import { formatNota, type FormattedNota } from './_shared';

export async function obtenerNota(id: number): Promise<FormattedNota> {
	return formatNota(ensureDatabaseEntry(await qb(Nota.Name).where({ id }).first()));
}

export async function getPartnership(id: number) {
	return ensureDatabaseEntry(await qb(ViewPartnership.Name).where({ id }).first());
}

export async function maybeObtenerIdPartenariado(data: Pick<Partenariado.Value, 'id_demanda' | 'id_oferta'>): Promise<number | null> {
	const entry = await qb('partenariado').where({ id_demanda: data.id_demanda, id_oferta: data.id_oferta }).select('id').first();
	return entry?.id ?? null;
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
