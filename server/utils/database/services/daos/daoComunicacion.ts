import knex from '../../config';
import type { Mail } from '../types/Mail';
import type { Mensaje } from '../types/Mensaje';
import type { Newsletter } from '../types/Newsletter';
import type { Upload } from '../types/Upload';
// Devuelve el upload correspondiente

async function obtenerUploads(idUploads: number): Promise<Upload | null> {
	const uploadData: Upload | undefined = await knex<Upload>('upload').where({ id: idUploads }).select('*').first();

	if (!uploadData) {
		console.error('No se encontró ningún upload con el ID', idUploads);
		return null;
	}

	const upload: Upload = {
		id: uploadData.id,
		almacenamiento: uploadData.almacenamiento,
		campo: uploadData.campo,
		tipo: uploadData.tipo,
		tipo_id: uploadData.tipo_id,
		path: uploadData.path,
		client_name: uploadData.client_name,
		nombre: uploadData.nombre,
		creador: uploadData.creador,
		createdAt: uploadData.createdAt,
		updatedAt: uploadData.updatedAt
	};

	return upload;
}

//Devolver mensaje correspondiente

async function obtenerMensajes(idMensajes: number): Promise<Mensaje | null> {
	try {
		const mensajeData: Mensaje | undefined = await knex<Mensaje>('mensaje')
			.where({
				id: idMensajes
			})
			.select('*')
			.first();

		if (!mensajeData) {
			console.error('No se encontró ningún mensaje con el ID', idMensajes);
			return null;
		}

		const usuarioData = await knex<Mensaje['user']>('usuario').where({ id: mensajeData.user }).select('origin_login').first();

		if (!usuarioData) {
			console.error('No se encontró ningún usuario con el ID', mensajeData.user);
			return null;
		}

		// Asignar el campo faltante a `mensajeData` utilizando la aserción de tipo
		mensajeData.user = usuarioData.origin_login as Mensaje['user'];

		return mensajeData;
	} catch (error) {
		console.error(error);
		console.error(`Se ha producido un error al intentar obtener el mensaje con ID ${idMensajes}`);
		return null;
	}
}

//Devuelve todos los mensajes de un anuncio
//REVISAR
async function obtenerMensajesAnuncio(idAnuncio: number): Promise<Mensaje[] | null> {
	try {
		const mensajes: Mensaje[] = await knex('mensaje_anuncioservicio')
			.where({
				id_anuncio: idAnuncio
			})
			.join('mensaje', 'id_mensaje', '=', 'id')
			.join('usuario', 'usuario.id', '=', 'usuario')
			.select('mensaje.id', 'mensaje.texto', 'mensaje.fecha', 'mensaje.usuario', 'usuario.origin_login')
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar obtener los mensajes del anuncio ', idAnuncio);
				// Proporciona un valor por defecto o lanza el error nuevamente según la lógica
				return [] as Mensaje[];
			});

		if (!mensajes || mensajes.length === 0) {
			console.error('No se encontraron mensajes para el anuncio con ID', idAnuncio);
			return null;
		}

		const mensajesTransformados: Mensaje[] = mensajes.map((mensaje) => ({
			id: mensaje.id,
			text: mensaje.text,
			datetime: mensaje.datetime,
			user: mensaje.user,
			username: mensaje.username
		}));

		return mensajesTransformados;
	} catch (error) {
		console.error(error);
		return null;
	}
}

//Devuelve todos los mensajes de una colaboración
async function obtenerMensajesColab(idColab: number): Promise<Mensaje[] | null> {
	try {
		const mensajes = await knex('mensaje_colaboracion')
			.where({
				id_colaboracion: idColab
			})
			.join('mensaje', 'id_mensaje', '=', 'id')
			.join('usuario', 'usuario.id', '=', 'usuario')
			.select('mensaje.id', 'mensaje.texto', 'mensaje.fecha', 'mensaje.usuario', 'usuario.origin_login')
			.then((mensajes) => {
				const mensajesTransformados: Mensaje[] = mensajes.map((mensaje: any) => {
					return {
						id: mensaje.id,
						text: mensaje.texto,
						datetime: mensaje.fecha,
						user: mensaje.usuario,
						username: mensaje.origin_login
					};
				});
				return mensajesTransformados;
			})
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar obtener los mensajes de la colaboración con id ', idColab);
				return null;
			});

		return mensajes;
	} catch (error) {
		console.error(error);
		return null;
	}
}

//Devuelve todos los uploads de un anuncio
async function obtenerUploadsAnuncio(idAnuncio: number): Promise<Upload[] | null> {
	try {
		const uploadsData = (await knex<Upload>('upload_anuncioservicio')
			.where({
				id: idAnuncio
			})
			.join('upload', 'id_upload', '=', 'id')
			.select(
				'upload.id',
				'upload.almacenamiento',
				'upload.campo',
				'upload.tipo',
				'upload.tipo_id',
				'upload.path',
				'upload.client_name',
				'upload.nombre',
				'upload.creador',
				'upload.createdAt',
				'upload.updatedAt'
			)
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar obtener los uploads del anuncio con ID', idAnuncio);
				throw err;
			})) as Upload[];

		if (!uploadsData || uploadsData.length === 0) {
			console.error('No se encontraron uploads para el anuncio con el ID', idAnuncio);
			return null;
		}

		return uploadsData;
	} catch (error) {
		console.error(error);
		console.error(`Se ha producido un error al intentar obtener los uploads del anuncio con ID ${idAnuncio}`);
		return null;
	}
}

//Devuelve todos los uploads de una colaboración

async function obtenerUploadsColab(idColab: number): Promise<Upload[] | null> {
	try {
		const uploadsData = (await knex('uploads_colaboracion')
			.where({
				id_colaboracion: idColab
			})
			.join('upload', 'id_upload', '=', 'id')
			.select(
				'upload.id',
				'upload.almacenamiento',
				'upload.campo',
				'upload.tipo',
				'upload.tipo_id',
				'upload.path',
				'upload.client_name',
				'upload.nombre',
				'upload.creador',
				'upload.createdAt',
				'upload.updatedAt'
			)) as Upload[];

		if (!uploadsData || uploadsData.length === 0) {
			console.error('No se encontraron uploads para la colaboración con el ID', idColab);
			return null;
		}

		return uploadsData;
	} catch (error) {
		console.error(error);
		console.error(`Se ha producido un error al intentar obtener los uploads para la colaboración con ID ${idColab}`);
		return null;
	}
}

//Crear nuevo mensaje

async function crearMensajeAnuncio(mensaje: Mensaje, anuncio: number): Promise<number | null> {
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

async function crearMensajeColab(mensaje: Mensaje, colaboracion: number): Promise<number | null> {
	try {
		return knex('mensaje')
			.insert({
				texto: mensaje.text,
				fecha: mensaje.datetime,
				usuario: mensaje.user
			})
			.then((id_mensaje) => {
				return knex('mensaje_colaboracion')
					.insert({
						id_mensaje,
						id_colaboracion: colaboracion
					})
					.then(() => id_mensaje[0])
					.catch((err) => {
						console.error(err);
						console.error('Se ha producido un error al intentar asociar el mensaje con la colaboración');
						return null;
					});
			})
			.catch((err) => {
				console.error(err);
				console.error('Se ha producido un error al intentar crear el mensaje con texto ', mensaje.text);
				return null;
			});
	} catch (error) {
		console.error(error);
		return Promise.resolve(null);
	}
}

async function crearUploadAnuncio(upload: Upload, anuncio: number): Promise<number | null> {
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

async function crearUploadColab(upload: Upload, colaboracion: number): Promise<number | null> {
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

async function eliminarMensaje(id_mensaje: number): Promise<void> {
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

async function eliminarUpload(id_upload: number): Promise<void> {
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

async function actualizarUpload(upload: Upload): Promise<void> {
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

async function actualizarMensaje(mensaje: Mensaje): Promise<void> {
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
async function crearMail(mail: Mail): Promise<number | null> {
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

async function obtenerMail(id_mail: number): Promise<Mail | null> {
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

async function actualizarMail(mail: Mail): Promise<void> {
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

async function eliminarMail(id_mail: number): Promise<void> {
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

async function crearNewsletter(news: Newsletter): Promise<number | null> {
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

async function obtenerNewsletter(id_news: number): Promise<Newsletter | null> {
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

async function actualizarNewsletter(news: Newsletter): Promise<void> {
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

async function eliminarNewsletter(id: number): Promise<void> {
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

module.exports = {
	crearMensajeAnuncio,
	crearMensajeColab,
	crearUploadAnuncio,
	crearUploadColab,
	crearNewsletter,
	crearMail,
	obtenerUploads,
	obtenerMensajes,
	obtenerMensajesAnuncio,
	obtenerMensajesColab,
	obtenerUploadsAnuncio,
	obtenerUploadsColab,
	obtenerMail,
	obtenerNewsletter,
	actualizarUpload,
	actualizarMensaje,
	actualizarMail,
	actualizarNewsletter,
	eliminarUpload,
	eliminarMail,
	eliminarMensaje,
	eliminarNewsletter
};
