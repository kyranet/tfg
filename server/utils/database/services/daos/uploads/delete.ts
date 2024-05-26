import type { Knex } from 'knex';
import { access, constants, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Upload } from '../../types/Upload';
import { getLocalFileUploadRoot } from './_shared';

export function deleteUpload(type: 'usuarios', field: 'avatar', typeId: number, trx: Knex.Transaction): Promise<null>;
export function deleteUpload(type: 'iniciativas', field: 'default' | 'archivos', typeId: number, trx: Knex.Transaction): Promise<null>;
export function deleteUpload(type: 'partenariados', field: 'archivos', typeId: number, trx: Knex.Transaction): Promise<null>;
export function deleteUpload(type: 'proyectos', field: 'archivos', typeId: number, trx: Knex.Transaction): Promise<null>;
export async function deleteUpload(
	type: 'usuarios' | 'iniciativas' | 'partenariados' | 'proyectos' | 'usuarios',
	field: 'avatar' | 'archivos' | 'default',
	typeId: number,
	trx: Knex.Transaction
): Promise<null> {
	const entry = await trx(Upload.Name).where({ tipo: type, campo: field, tipo_id: typeId.toString() }).first();

	// If the entry exists, delete the file and the entry:
	if (entry) {
		const path = resolve(getLocalFileUploadRoot(type, field), entry.path);
		const canWrite = await access(path, constants.F_OK)
			.then(() => true)
			.catch(() => false);

		if (canWrite) await rm(path);
		await trx(Upload.Name).where({ id: entry.id }).del();
	}

	return null;
}

/**
 * TODO: It would be nice to make this function in a way that it can be used in
 * a transaction, reverting the changes if the transaction fails for some reason.
 *
 * One way I thought of doing this is by moving the file to a temporary folder
 * (using `node:os.tmpdir()` for the path) in a way that the file is easily
 * recoverable if the transaction fails, moving it back to the original path.
 *
 * However, this is a bit more complex than I can do right now, so I'll leave it
 * as a TODO for now. I mean, in normal circumstances, the transaction should not
 * fail, so this is not a high priority. Still nice to have in mind though.
 */
