import type { Knex } from 'knex';

export async function sharedUpdateAndReturn<const Table extends Knex.TableNames>({
	table,
	where,
	data,
	trx = qb
}: UpdateAndReturnOptions<Table>): Promise<Knex.TableType<Table>> {
	await trx(table)
		.where(where)
		.update(data as any);
	return ensureDatabaseEntry(
		(await trx(table).where(where).first()) as Knex.TableType<Table> | undefined,
		'No se ha encontrado una entrada con los datos proporcionados'
	);
}

export interface UpdateAndReturnOptions<Table extends Knex.TableNames> {
	table: Table;
	where: Partial<Knex.TableType<Table>>;
	data: Partial<Knex.TableType<Table>>;
	trx?: Knex.Transaction | Knex;
}

export async function sharedDeleteEntryTable(table: Knex.TableNames, id: number, trx: Knex | Knex.Transaction = qb) {
	const result = await trx(table).where({ id }).del();
	return result > 0;
}

export async function sharedCountTable(table: Knex.TableNames, trx: Knex | Knex.Transaction = qb) {
	const result = await trx(table).count({ count: '*' }).first();
	return result?.count ? Number(result.count) : 0;
}

export async function sharedHasTableEntry(table: Knex.TableNames, id: number, trx: Knex | Knex.Transaction = qb) {
	const result = await trx(table).where({ id }).count({ count: '*' }).first();
	return result?.count ? Number(result.count) > 0 : false;
}

export interface SearchParameters {
	limit?: number;
	offset?: number;
}
