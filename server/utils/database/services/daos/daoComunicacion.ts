import knex from '../../config';
import type { Mail } from '../types/Mail';
import { Mensaje } from '../types/Mensaje';
import { MensajeAnuncioServicio } from '../types/MensajeAnuncioServicio';
import { MensajeColaboracion } from '../types/MensajeColaboracion';
import { Newsletter } from '../types/Newsletter';
import { Upload } from '../types/Upload';
import { Upload_AnuncioServicio } from '../types/Upload_AnuncioServicio';
import { Upload_Colaboracion } from '../types/Upload_Colaboracion';

// Devuelve el upload correspondiente
export async function obtenerUpload(id: number): Promise<FormattedUpload> {
	return formatUpload(ensureDatabaseEntry(await qb(Upload.Name).where({ id }).first()));
}

//Devolver mensaje correspondiente
export async function obtenerMensaje(id: number): Promise<Mensaje> {
	return ensureDatabaseEntry(await qb(Mensaje.Name).where({ id }).first());
}

//Devuelve todos los mensajes de un anuncio
export async function obtenerMensajesAnuncio(id: number): Promise<readonly number[]> {
	const mensajes = await qb(MensajeAnuncioServicio.Name).where({ id_anuncio: id }).select('id_mensaje');
	return mensajes.map((mensaje) => mensaje.id_mensaje);
}

//Devuelve todos los mensajes de una colaboración
export async function obtenerMensajesColab(id: number): Promise<readonly number[]> {
	const mensajes = await qb(MensajeColaboracion.Name).where({ id_colaboracion: id }).select('id_mensaje');
	return mensajes.map((mensaje) => mensaje.id_mensaje);
}

//Devuelve todos los uploads de un anuncio
export async function obtenerUploadsAnuncio(id: number): Promise<readonly number[]> {
	const uploads = await qb(Upload_AnuncioServicio.Name).where({ id_anuncio: id }).select('id_upload');
	return uploads.map((upload) => upload.id_upload);
}

//Devuelve todos los uploads de una colaboración
export async function obtenerUploadsColab(id: number): Promise<readonly number[]> {
	const uploads = await qb(Upload_Colaboracion.Name).where({ id_colaboracion: id }).select('id_upload');
	return uploads.map((upload) => upload.id_upload);
}

//Crear nuevo mensaje
export async function crearMensajeAnuncio(mensaje: Mensaje, anuncio: number): Promise<number | null> {
	try {
		const idMensaje = await knex('mensaje')
			.insert({
				texto: mensaje.text,
				fecha: mensaje.datetime,
				usuario: mensaje.user
			})
			.returning('id');

		if (!idMensaje || idMensaje.length === 0) {
			console.error('No se pudo obtener el ID del mensaje recién creado.');
			return null;
		}

		const idMensajeAnuncio = await knex('mensaje_anuncioservicio').insert({
			id_mensaje: idMensaje[0],
			id_anuncio: anuncio
		});

		if (!idMensajeAnuncio) {
			console.error('No se pudo obtener el ID del mensaje_anuncioservicio recién creado.');
			return null;
		}

		return idMensaje[0];
	} catch (error) {
		console.error(error);
		console.error('Se ha producido un error al intentar crear el mensaje con texto', mensaje.text);
		return null;
	}
}

export function crearMensajeColaboracion(data: Mensaje.CreateData, colaboracionId: number): Promise<Mensaje.Value> {
	return knex.transaction(async (trx) => {
		const colaboraciones = await trx('colaboracion').where({ id: colaboracionId }).select('id');
		const colaboracion = getFirstDatabaseEntry(colaboraciones, 'No se encontró la colaboración con el ID proporcionado');

		const [mensaje] = await trx(Mensaje.Name).insert(data).returning('*');

		await trx(MensajeColaboracion.Name).insert({ id_mensaje: mensaje.id, id_colaboracion: colaboracion.id });
		return mensaje;
	});
}

export async function crearUploadAnuncio(upload: Upload, anuncio: number): Promise<number | null> {
	try {
		return knex('upload')
			.insert({
				almacenamiento: upload.almacenamiento,
				campo: upload.campo,
				tipo: upload.tipo,
				tipo_id: upload.tipo_id,
				path: upload.path,
				client_name: upload.client_name,
				nombre: upload.nombre,
				creador: upload.creador,
				createdAt: upload.createdAt,
				updatedAt: upload.updatedAt
			})
			.then((id_upload) => {
				return knex('upload_anuncioservicio')
					.insert({
						id_upload: id_upload[0],
						id_anuncio: anuncio
					})
					.then(() => id_upload[0])
					.catch((err) => {
						console.error(err);
						console.error('Se ha producido un error al intentar asociar el upload con el anuncio');
						return null;
					});
			})
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar crear el upload con nombre ', upload.nombre);
				return null;
			});
	} catch (error) {
		console.error(error);
		return Promise.resolve(null);
	}
}

export async function crearUploadColab(upload: Upload, colaboracion: number): Promise<number | null> {
	try {
		return knex('upload')
			.insert({
				almacenamiento: upload.almacenamiento,
				campo: upload.campo,
				tipo: upload.tipo,
				tipo_id: upload.tipo_id,
				path: upload.path,
				client_name: upload.client_name,
				nombre: upload.nombre,
				creador: upload.creador,
				createdAt: upload.createdAt,
				updatedAt: upload.updatedAt
			})
			.then((id_upload) => {
				return knex('uploads_colaboracion')
					.insert({
						id_upload: id_upload[0],
						id_colaboracion: colaboracion
					})
					.then(() => id_upload[0])
					.catch((err) => {
						console.error(err);
						console.error('Se ha producido un error al intentar asociar el upload con la colaboración');
						return null;
					});
			})
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar crear el upload con nombre ', upload.nombre);
				return null;
			});
	} catch (error) {
		console.error(error);
		return Promise.resolve(null);
	}
}

export async function eliminarMensaje(id_mensaje: number): Promise<void> {
	try {
		return knex('mensaje')
			.where({
				id: id_mensaje
			})
			.del()
			.then((result) => {
				if (result > 0) {
					console.log('Se ha eliminado de la base de datos el mensaje con id ', id_mensaje);
				} else {
					console.log('No existe el mensaje con id ', id_mensaje);
				}
			})
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar eliminar el mensaje con id ', id_mensaje);
			});
	} catch (error) {
		console.error(error);
		return Promise.resolve();
	}
}

export async function eliminarUpload(id_upload: number): Promise<void> {
	try {
		return knex('upload')
			.where({
				id: id_upload
			})
			.del()
			.then((result) => {
				if (result > 0) {
					console.log('Se ha eliminado de la base de datos el upload con id ', id_upload);
				} else {
					console.log('No existe el upload con id ', id_upload);
				}
			})
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar eliminar el upload con id ', id_upload);
			});
	} catch (error) {
		console.error(error);
		return Promise.resolve();
	}
}

export async function actualizarUpload(upload: Upload): Promise<void> {
	try {
		return knex('upload')
			.where('id', upload.id)
			.update({
				almacenamiento: upload.almacenamiento,
				campo: upload.campo,
				tipo: upload.tipo,
				tipo_id: upload.tipo_id,
				path: upload.path,
				client_name: upload.client_name,
				nombre: upload.nombre,
				updatedAt: new Date()
			})
			.then(() => {
				console.log('Se ha actualizado el upload con id ', upload.id);
			})
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar actualizar el upload con id ', upload.id);
			});
	} catch (error) {
		console.error(error);
		return Promise.resolve();
	}
}

export async function actualizarMensaje(mensaje: Mensaje): Promise<void> {
	try {
		return knex('mensaje')
			.where({
				id: mensaje.id
			})
			.update({
				texto: mensaje.text,
				fecha: new Date()
			})
			.then(() => {
				console.log('Se ha actualizado el mensaje con id ', mensaje.id);
			})
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar actualizar el mensaje con id ', mensaje.id);
			});
	} catch (error) {
		console.error(error);
		return Promise.resolve();
	}
}

//Mail
export async function crearMail(mail: Mail): Promise<number | null> {
	try {
		return knex('mail')
			.insert({
				mail_to: mail.mail_to,
				type: mail.type,
				mail_name: mail.mail_name,
				mail_from: mail.mail_from,
				subject: mail.subject,
				html: mail.html,
				_to: mail._to,
				usuario: mail.usuario,
				createdAt: mail.createdAt,
				updatedAt: mail.updatedAt
			})
			.then((id_mail) => id_mail[0])
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar crear el mail con subject ', mail.subject);
				return null;
			}) as Promise<number | null>; // Especificamos el tipo de retorno aquí
	} catch (error) {
		console.error(error);
		return Promise.resolve(null);
	}
}

export async function obtenerMail(id_mail: number): Promise<Mail | null> {
	try {
		const mail = await knex<Mail>('mail')
			.where({
				id: id_mail
			})
			.select('*')
			.first();

		if (mail) {
			return {
				id: mail.id,
				mail_to: mail.mail_to,
				type: mail.type,
				mail_name: mail.mail_name,
				mail_from: mail.mail_from,
				subject: mail.subject,
				html: mail.html,
				_to: mail._to,
				usuario: mail.usuario,
				createdAt: mail.createdAt,
				updatedAt: mail.updatedAt
			};
		} else {
			console.error('No se encontró ningún mail con ID', id_mail);
			return null;
		}
	} catch (error) {
		console.error(error);
		console.error('Se ha producido un error al intentar obtener el mail con ID', id_mail);
		return null;
	}
}

export async function actualizarMail(mail: Mail): Promise<void> {
	try {
		return knex('mail')
			.where('id', mail.id)
			.update({
				mail_to: mail.mail_to,
				type: mail.type,
				mail_name: mail.mail_name,
				mail_from: mail.mail_from,
				subject: mail.subject,
				html: mail.html,
				_to: mail._to,
				updatedAt: new Date()
			})
			.then(() => {
				console.log('Se ha actualizado el mail con ID', mail.id);
			})
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar actualizar el mail con ID', mail.id);
			}) as Promise<void>; // Especificamos el tipo de retorno aquí
	} catch (error) {
		console.error(error);
		return Promise.resolve();
	}
}

export async function eliminarMail(id_mail: number): Promise<void> {
	try {
		return knex('mail')
			.where({
				id: id_mail
			})
			.del()
			.then((result) => {
				if (result > 0) {
					console.log('Se ha eliminado de la base de datos el mail con ID', id_mail);
				} else {
					console.log('No existe el mail con ID', id_mail);
				}
			})
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar eliminar el mail con ID', id_mail);
			}) as Promise<void>; // Especificamos el tipo de retorno aquí
	} catch (error) {
		console.error(error);
		return Promise.resolve();
	}
}
//Newsletter

export async function crearNewsletter(news: Newsletter): Promise<number | null> {
	try {
		return knex('newsletter')
			.insert({
				mail_to: news.mail_to,
				created_at: news.createdAt,
				updated_at: news.updatedAt
			})
			.then((id_news) => id_news[0])
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar crear el newsletter con destino', news.mail_to);
				return null;
			}) as Promise<number | null>; // Especificamos el tipo de retorno aquí
	} catch (error) {
		console.error(error);
		return Promise.resolve(null);
	}
}

export async function obtenerNewsletter(id_news: number): Promise<Newsletter | null> {
	try {
		const news = await knex<Newsletter>('newsletter')
			.where({
				id: id_news
			})
			.select('*')
			.first();

		if (news) {
			return {
				id: news.id,
				mail_to: news.mail_to,
				createdAt: news.createdAt,
				updatedAt: news.updatedAt
			};
		} else {
			console.error('No se encontró ninguna newsletter con ID', id_news);
			return null;
		}
	} catch (error) {
		console.error(error);
		console.error('Se ha producido un error al intentar obtener la newsletter con ID', id_news);
		return null;
	}
}

export async function actualizarNewsletter(news: Newsletter): Promise<void> {
	try {
		return knex('newsletter')
			.where({
				id: news.id
			})
			.update({
				mail_to: news.mail_to,
				updated_at: new Date()
			})
			.then(() => {
				console.log('Se ha actualizado la newsletter con ID', news.id);
			})
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar actualizar la newsletter con ID', news.id);
			}) as Promise<void>; // Especificamos el tipo de retorno aquí
	} catch (error) {
		console.error(error);
		return Promise.resolve();
	}
}

export async function eliminarNewsletter(id: number): Promise<void> {
	try {
		const result = await knex('newsletter')
			.where({
				id
			})
			.del();

		if (result > 0) {
			console.log('Se ha eliminado de la base de datos la newsletter con ID', id);
		} else {
			console.log('No existe la newsletter con ID', id);
		}

		return Promise.resolve();
	} catch (error) {
		console.error(error);
		return Promise.resolve();
	}
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
