import type { Knex } from 'knex';
import { qb } from '../../config';

export async function sharedDeleteEntryTable(table: Knex.TableNames, id: number) {
	const result = await qb(table).where({ id }).del();
	return result > 0;
}

export async function sharedCountTable(table: string) {
	const result = await qb(table).count({ count: '*' }).first();
	return result?.count ? Number(result.count) : 0;
}
