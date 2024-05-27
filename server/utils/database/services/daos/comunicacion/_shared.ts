import type { Newsletter } from '../../types/Newsletter';
import type { Upload } from '../../types/Upload';

export interface FormattedUpload extends ReturnType<typeof formatUpload> {}
export function formatUpload(entry: Upload.Value) {
	return {
		id: entry.id,
		almacenamiento: entry.almacenamiento,
		tipo: entry.tipo,
		campo: entry.campo,
		tipoId: entry.tipo_id,
		path: entry.path,
		clientName: entry.client_name,
		nombre: entry.nombre,
		creador: entry.creador
	};
}

export interface FormattedNewsletter extends ReturnType<typeof formatNewsletter> {}
export function formatNewsletter(entry: Newsletter.Value) {
	return {
		id: entry.id,
		mailTo: entry.mail_to,
		createdAt: entry.created_at,
		updatedAt: entry.updated_at
	};
}
