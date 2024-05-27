import { Mail } from '../../types/Mail';
import { Mensaje } from '../../types/Mensaje';
import { MensajeAnuncioServicio } from '../../types/MensajeAnuncioServicio';
import { MensajeColaboracion } from '../../types/MensajeColaboracion';
import { Newsletter } from '../../types/Newsletter';
import { Upload } from '../../types/Upload';
import { Upload_AnuncioServicio } from '../../types/Upload_AnuncioServicio';
import { Upload_Colaboracion } from '../../types/Upload_Colaboracion';
import { sharedDeleteEntryTable } from '../shared';

export async function eliminarMensaje(id_mensaje: number): Promise<boolean> {
	return qb.transaction(
		async (trx) =>
			(await sharedDeleteEntryTable(Mensaje.Name, id_mensaje, trx)) &&
			(await sharedDeleteEntryTable(MensajeAnuncioServicio.Name, id_mensaje, trx)) &&
			(await sharedDeleteEntryTable(MensajeColaboracion.Name, id_mensaje, trx))
	);
}

export async function eliminarUpload(id_upload: number): Promise<boolean> {
	return qb.transaction(
		async (trx) =>
			(await sharedDeleteEntryTable(Upload.Name, id_upload, trx)) &&
			(await sharedDeleteEntryTable(Upload_AnuncioServicio.Name, id_upload, trx)) &&
			(await sharedDeleteEntryTable(Upload_Colaboracion.Name, id_upload, trx))
	);
}

export function eliminarMail(id_mail: number): Promise<boolean> {
	return sharedDeleteEntryTable(Mail.Name, id_mail);
}

export async function deleteNewsletter(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Newsletter.Name, id);
}
