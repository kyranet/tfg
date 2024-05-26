import { Upload } from '../../types/Upload';

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
