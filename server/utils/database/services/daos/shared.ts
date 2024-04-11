import type { Knex } from 'knex';

export async function sharedDeleteEntryTable(table: Knex.TableNames, id: number, trx: Knex | Knex.Transaction = qb) {
	const result = await trx(table).where({ id }).del();
	return result > 0;
}

export async function sharedCountTable(table: string) {
	const result = await qb(table).count({ count: '*' }).first();
	return result?.count ? Number(result.count) : 0;
}

export interface SearchParameters {
	limit?: number;
	offset?: number;
}
