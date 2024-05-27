import { isNullishOrEmpty } from '@sapphire/utilities';
import { Mail } from '../../types/Mail';
import { Mensaje } from '../../types/Mensaje';
import { MensajeAnuncioServicio } from '../../types/MensajeAnuncioServicio';
import { MensajeColaboracion } from '../../types/MensajeColaboracion';
import { Newsletter } from '../../types/Newsletter';
import { Upload } from '../../types/Upload';
import { Upload_AnuncioServicio } from '../../types/Upload_AnuncioServicio';
import { Upload_Colaboracion } from '../../types/Upload_Colaboracion';
import { SearchParameters } from '../shared';
import { FormattedNewsletter, FormattedUpload, formatNewsletter } from './_shared';

//Devolver mensaje correspondiente
export async function obtenerMensaje(id: number): Promise<Mensaje.Value> {
	return ensureDatabaseEntry(await qb(Mensaje.Name).where({ id }).first());
}

//Devuelve todos los mensajes de un anuncio
export async function obtenerMensajesAnuncio(id: number): Promise<Mensaje.Value[]> {
	return await qb(MensajeAnuncioServicio.Name)
		.where({ id_anuncio: id })
		.join(Mensaje.Name, Mensaje.Key('id'), '=', MensajeAnuncioServicio.Key('id_mensaje'))
		.select(Mensaje.Key('*'));
}

//Devuelve todos los mensajes de una colaboración
export async function obtenerMensajesColab(id: number): Promise<Mensaje.Value[]> {
	return await qb(MensajeColaboracion.Name)
		.where({ id_colaboracion: id })
		.join(Mensaje.Name, Mensaje.Key('id'), '=', MensajeColaboracion.Key('id_mensaje'))
		.select(Mensaje.Key('*'));
}

//Devuelve todos los uploads de un anuncio
export async function obtenerUploadsAnuncio(id: number): Promise<FormattedUpload[]> {
	return await qb(Upload_AnuncioServicio.Name)
		.where({ id_anuncio: id })
		.join(Upload.Name, Upload.Key('id'), '=', Upload_AnuncioServicio.Key('id_upload'))
		.select(Upload.Key('*'));
}

//Devuelve todos los uploads de una colaboración
export async function obtenerUploadsColab(id: number): Promise<FormattedUpload[]> {
	return await qb(Upload_Colaboracion.Name)
		.where({ id_colaboracion: id })
		.join(Upload.Name, Upload.Key('id'), '=', Upload_Colaboracion.Key('id_upload'))
		.select(Upload.Key('*'));
}

export async function obtenerMail(id: number): Promise<Mail.Value> {
	return ensureDatabaseEntry(await qb(Mail.Name).where({ id }).first());
}

export interface GetAllNewslettersOptions extends SearchParameters {
	email?: string;
}
export async function getAllNewsletters(options: GetAllNewslettersOptions): Promise<FormattedNewsletter[]> {
	const entries = await qb(Newsletter.Name)
		.modify((qb) => {
			if (!isNullishOrEmpty(options.email)) {
				qb.where(Newsletter.Key('mail_to'), 'like', `%${options.email}%`);
			}
		})
		.limit(options.limit ?? 100)
		.offset(options.offset ?? 0)
		.orderBy(Newsletter.Key('created_at'), 'desc');

	return entries.map(formatNewsletter);
}

export async function getNewsletter(id: number): Promise<FormattedNewsletter> {
	const entry = ensureDatabaseEntry(await qb(Newsletter.Name).where({ id }).first());
	return formatNewsletter(entry);
}
