import { Mail } from '../../types/Mail';
import { Mensaje } from '../../types/Mensaje';
import { Newsletter } from '../../types/Newsletter';
import { Upload } from '../../types/Upload';
import { FormattedUpload, formatUpload } from './_shared';

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
