import knex from '../../config';
import { AnuncioServicio } from '../types/AnuncioServicio';
import { Colaboracion } from '../types/Colaboracion';
import { Mail } from '../types/Mail';
import { Mensaje } from '../types/Mensaje';
import { MensajeAnuncioServicio } from '../types/MensajeAnuncioServicio';
import { MensajeColaboracion } from '../types/MensajeColaboracion';
import { Newsletter } from '../types/Newsletter';
import { Upload } from '../types/Upload';
import { Upload_AnuncioServicio } from '../types/Upload_AnuncioServicio';
import { Upload_Colaboracion } from '../types/Upload_Colaboracion';
import { sharedDeleteEntryTable } from './shared';

// Devuelve el upload correspondiente
export async function obtenerUpload(id: number): Promise<FormattedUpload> {
	return formatUpload(ensureDatabaseEntry(await qb(Upload.Name).where({ id }).first()));
}

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

//export type MensajeCreateData = Mensaje.CreateData & { anuncio?: number };
//Crear nuevo mensaje
export async function crearMensajeAnuncio(data: Mensaje.CreateData, anuncioId: number): Promise<Mensaje.Value> {
	return knex.transaction(async (trx) => {
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
	return knex.transaction(async (trx) => {
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
	return knex.transaction(async (trx) => {
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
	return knex.transaction(async (trx) => {
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

export async function actualizarUpload(data: Upload): Promise<FormattedUpload> {
	const entry = getFirstDatabaseEntry(
		await qb(Upload.Name) //
			.where({ id: data.id })
			.update({
				almacenamiento: data.almacenamiento,
				campo: data.campo,
				tipo: data.tipo,
				tipo_id: data.tipo_id
			})
			.returning('*'),
		'No se ha encontrado un upload con el ID proporcionado'
	);
	return formatUpload(entry);
}

export async function actualizarMensaje(data: Mensaje): Promise<Mensaje.Value> {
	return getFirstDatabaseEntry(
		await qb(Mensaje.Name)
			.where({ id: data.id })
			.update({
				texto: data.texto
			})
			.returning('*')
	);
}

//Mail
export async function crearMail(data: Mail.CreateData): Promise<Mail.Value> {
	const [mail] = await qb(Mail.Name) //
		.insert(data)
		.returning('*');
	return mail;
}

export async function obtenerMail(id: number): Promise<Mail.Value> {
	return ensureDatabaseEntry(await qb(Mail.Name).where({ id }).first());
}

//Que datos tiene sentido que se puedan actualizar en un Mail?
export async function actualizarMail(data: Mail): Promise<Mail.Value> {
	return getFirstDatabaseEntry(
		await qb(Mail.Name)
			.where({ id: data.id })
			.update({
				type: data.type,
				html: data.html,
				subject: data.subject,
				usuario: data.usuario,
				mail_name: data.mail_name
			})
			.returning('*')
	);
}

export function eliminarMail(id_mail: number): Promise<boolean> {
	return sharedDeleteEntryTable(Mail.Name, id_mail);
}
//Newsletter

export async function crearNewsletter(data: Newsletter.CreateData): Promise<Newsletter.Value> {
	const [news] = await qb(Mail.Name) //
		.insert(data)
		.returning('*');
	return news;
}

export async function obtenerNewsletter(id: number): Promise<Newsletter.Value> {
	return ensureDatabaseEntry(await qb(Newsletter.Name).where({ id }).first());
}

//Newsletter solo tiene(mail_to, createdAt,updatedAt)Que se puede actualizar?
export async function actualizarNewsletter(data: Newsletter): Promise<Newsletter.Value> {
	return getFirstDatabaseEntry(
		await qb(Newsletter.Name)
			.where({ id: data.id })
			.update({
				mail_to: data.mail_to
			})
			.returning('*')
	);
}

export async function eliminarNewsletter(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Newsletter.Name, id);
}

export interface FormattedUpload extends ReturnType<typeof formatUpload> {}
function formatUpload(entry: Upload.Value) {
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
