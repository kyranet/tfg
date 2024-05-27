import { Mail } from '../../types/Mail';
import { Mensaje } from '../../types/Mensaje';
import { Newsletter } from '../../types/Newsletter';
import { Upload } from '../../types/Upload';
import { sharedUpdateAndReturn } from '../shared';
import { FormattedNewsletter, FormattedUpload, formatNewsletter, formatUpload } from './_shared';

export async function actualizarUpload(data: Upload): Promise<FormattedUpload> {
	const entry = await sharedUpdateAndReturn({
		table: Upload.Name,
		where: { id: data.id },
		data: { almacenamiento: data.almacenamiento, campo: data.campo, tipo: data.tipo, tipo_id: data.tipo_id }
	});
	return formatUpload(entry);
}

export async function actualizarMensaje(data: Mensaje): Promise<Mensaje.Value> {
	return await sharedUpdateAndReturn({
		table: Mensaje.Name,
		where: { id: data.id },
		data: { texto: data.texto }
	});
}

//Que datos tiene sentido que se puedan actualizar en un Mail?
export async function actualizarMail(data: Mail): Promise<Mail.Value> {
	return await sharedUpdateAndReturn({
		table: Mail.Name,
		where: { id: data.id },
		data: { type: data.type, html: data.html, subject: data.subject, usuario: data.usuario, mail_name: data.mail_name }
	});
}

//Newsletter solo tiene(mail_to, createdAt,updatedAt)Que se puede actualizar?
export async function actualizarNewsletter(data: Newsletter.Value): Promise<FormattedNewsletter> {
	const entry = await sharedUpdateAndReturn({
		table: Newsletter.Name,
		where: { id: data.id },
		data: { mail_to: data.mail_to }
	});
	return formatNewsletter(entry);
}
