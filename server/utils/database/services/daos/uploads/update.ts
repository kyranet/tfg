import type { Knex } from 'knex';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Upload } from '../../types/Upload';
import { getLocalFileUploadRoot } from './_shared';
import { deleteUpload } from './delete';

export function updateUpload(type: 'usuarios', field: 'avatar', typeId: number, value: Buffer, trx: Knex.Transaction): Promise<string>;
export function updateUpload(
	type: 'iniciativas',
	field: 'default' | 'archivos',
	typeId: number,
	value: Buffer,
	trx: Knex.Transaction
): Promise<string>;
export function updateUpload(type: 'partenariados', field: 'archivos', typeId: number, value: Buffer, trx: Knex.Transaction): Promise<string>;
export function updateUpload(type: 'proyectos', field: 'archivos', typeId: number, value: Buffer, trx: Knex.Transaction): Promise<string>;
export async function updateUpload(
	type: 'usuarios' | 'iniciativas' | 'partenariados' | 'proyectos' | 'usuarios',
	field: 'avatar' | 'archivos' | 'default',
	typeId: number,
	value: Buffer,
	trx: Knex.Transaction
): Promise<string> {
	// @ts-expect-error Complex union type
	await deleteUpload(type, field, typeId, trx);

	// Insert the new entry:
	const path = randomUUID();
	await writeFile(resolve(getLocalFileUploadRoot(type, field), path), value);
	await trx(Upload.Name).insert({
		almacenamiento: 'local',
		campo: field,
		tipo: type,
		tipo_id: typeId.toString(),
		path,
		client_name: 'file',
		nombre: 'file',
		creador: 1
	});

	return path;
}
