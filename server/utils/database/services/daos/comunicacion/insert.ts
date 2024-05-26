import { AnuncioServicio } from '../../types/AnuncioServicio';
import { Colaboracion } from '../../types/Colaboracion';
import { Mail } from '../../types/Mail';
import { Mensaje } from '../../types/Mensaje';
import { MensajeAnuncioServicio } from '../../types/MensajeAnuncioServicio';
import { MensajeColaboracion } from '../../types/MensajeColaboracion';
import { Newsletter } from '../../types/Newsletter';
import { Upload } from '../../types/Upload';
import { Upload_AnuncioServicio } from '../../types/Upload_AnuncioServicio';
import { Upload_Colaboracion } from '../../types/Upload_Colaboracion';
import { FormattedUpload, formatUpload } from './_shared';

//Crear nuevo mensaje
export async function crearMensajeAnuncio(data: Mensaje.CreateData, anuncioId: number): Promise<Mensaje.Value> {
	return qb.transaction(async (trx) => {
		const anuncios = await trx(AnuncioServicio.Name) //
			.where({ id: anuncioId })
			.select('id');

		const anuncio = getFirstDatabaseEntry(anuncios, 'No se encontró el anuncio con el ID proporcionado');

		const [mensaje] = await trx(Mensaje.Name) //
			.insert(data)
			.returning('*');

		await trx(MensajeAnuncioServicio.Name) //
			.insert({ id_mensaje: mensaje.id, id_anuncio: anuncio.id });

		return mensaje;
	});
}

export function crearMensajeColaboracion(data: Mensaje.CreateData, colaboracionId: number): Promise<Mensaje.Value> {
	return qb.transaction(async (trx) => {
		const colaboraciones = await trx(Colaboracion.Name) //
			.where({ id: colaboracionId })
			.select('id');
		const colaboracion = getFirstDatabaseEntry(colaboraciones, 'No se encontró la colaboración con el ID proporcionado');

		const [mensaje] = await trx(Mensaje.Name) //
			.insert(data)
			.returning('*');

		await trx(MensajeColaboracion.Name) //
			.insert({ id_mensaje: mensaje.id, id_colaboracion: colaboracion.id });
		return mensaje;
	});
}

export async function crearUploadAnuncio(data: Upload.CreateData, anuncioId: number): Promise<FormattedUpload> {
	return qb.transaction(async (trx) => {
		const anuncios = await trx(AnuncioServicio.Name) //
			.where({ id: anuncioId })
			.select('id');
		const anuncio = getFirstDatabaseEntry(anuncios, 'No se encontró la colaboración con el ID proporcionado');

		const [upload] = await trx(Upload.Name) //
			.insert(data)
			.returning('*');

		await trx(Upload_AnuncioServicio.Name) //
			.insert({ id_upload: upload.id, id_anuncio: anuncio.id });

		return formatUpload(upload);
	});
}

export async function crearUploadColab(data: Upload.CreateData, colaboracionId: number): Promise<FormattedUpload> {
	return qb.transaction(async (trx) => {
		const colaboraciones = await trx(Colaboracion.Name) //
			.where({ id: colaboracionId })
			.select('id');
		const colaboracion = getFirstDatabaseEntry(colaboraciones, 'No se encontró la colaboración con el ID proporcionado');

		const [upload] = await trx(Upload.Name) //
			.insert(data)
			.returning('*');

		await trx(Upload_Colaboracion.Name) //
			.insert({ id_upload: upload.id, id_colaboracion: colaboracion.id });

		return formatUpload(upload);
	});
}

export async function crearMail(data: Mail.CreateData): Promise<Mail.Value> {
	const [mail] = await qb(Mail.Name) //
		.insert(data)
		.returning('*');
	return mail;
}

export async function crearNewsletter(data: Newsletter.CreateData): Promise<Newsletter.Value> {
	const [news] = await qb(Newsletter.Name) //
		.insert(data)
		.returning('*');
	return news;
}
