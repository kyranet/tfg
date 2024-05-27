import { isNullish } from '@sapphire/utilities';
import type { Knex } from 'knex';
import sharp from 'sharp';
import { Admin } from '../../types/Admin';
import { AreaConocimiento_Profesor } from '../../types/AreaConocimiento_Profesor';
import { DatosPersonalesExterno } from '../../types/DatosPersonalesExterno';
import { DatosPersonalesInterno } from '../../types/DatosPersonalesInterno';
import { EstudianteExterno } from '../../types/EstudianteExterno';
import { EstudianteInterno } from '../../types/EstudianteInterno';
import { OficinaAps } from '../../types/OficinaAps';
import { ProfesorExterno } from '../../types/ProfesorExterno';
import { ProfesorInterno } from '../../types/ProfesorInterno';
import { SocioComunitario } from '../../types/SocioComunitario';
import { TitulacionLocal_Profesor } from '../../types/TitulacionLocal_Profesor';
import { Usuario } from '../../types/Usuario';
import { ViewUserAdmin } from '../../types/views/UserAdmin';
import { ViewUserApSOffice } from '../../types/views/UserApSOffice';
import { ViewUserCommunityPartner } from '../../types/views/UserCommunityPartner';
import { ViewUserExternalProfessor } from '../../types/views/UserExternalProfessor';
import { ViewUserExternalStudent } from '../../types/views/UserExternalStudent';
import { ViewUserInternalProfessor } from '../../types/views/UserInternalProfessor';
import { ViewUserInternalStudent } from '../../types/views/UserInternalStudent';
import { sharedUpdateAndReturn } from '../shared';
import { deleteUpload } from '../uploads/delete';
import { updateUpload } from '../uploads/update';
import { formatUser, type BaseUserData } from './_shared';

async function performAvatarUpload(id: number, avatar: Buffer | null | undefined, trx: Knex.Transaction) {
	// If the avatar is undefined, we don't need to do anything:
	if (avatar === undefined) return undefined;

	if (avatar === null) {
		await deleteUpload('usuarios', 'avatar', id, trx);
		return null;
	}

	const file = await sharp(avatar) //
		.resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
		.webp()
		.toBuffer();
	return updateUpload('usuarios', 'avatar', id, file, '.webp', id, trx);
}

export interface UpdateBaseUserData {
	avatar?: Buffer | null | undefined;
	acceptedTerms?: Usuario.Value['terminos_aceptados'];
}
async function sharedUpdateUser(id: number, data: UpdateBaseUserData, trx: Knex.Transaction): Promise<Usuario.Value> {
	const avatar = await performAvatarUpload(id, data.avatar, trx);
	return sharedUpdateAndReturn({
		table: Usuario.Name,
		where: { id },
		data: { origin_img: avatar, terminos_aceptados: data.acceptedTerms },
		trx
	});
}

export interface UpdateUserData extends UpdateBaseUserData {
	firstName?: DatosPersonalesInterno.Value['nombre'];
	lastName?: DatosPersonalesInterno.Value['apellidos'];
	password?: DatosPersonalesInterno.Value['password'];
	phone?: DatosPersonalesInterno.Value['telefono'];
}
async function sharedUpdatePersonalUserData(
	table: typeof DatosPersonalesInterno.Name | typeof DatosPersonalesExterno.Name,
	userId: number,
	userDataId: number,
	data: UpdateUserData,
	trx: Knex.Transaction
): Promise<BaseUserData> {
	const user = await sharedUpdateUser(userId, data, trx);
	const userData = await sharedUpdateAndReturn({
		table,
		where: { id: userDataId },
		data: { nombre: data.firstName, apellidos: data.lastName, password: data.password, telefono: data.phone },
		trx
	});

	return { ...userData, ...user };
}

async function sharedUpdateInternalPersonalUserData(
	userId: number,
	userDataId: number,
	data: UpdateUserData,
	trx: Knex.Transaction
): Promise<BaseUserData> {
	return sharedUpdatePersonalUserData(DatosPersonalesInterno.Name, userId, userDataId, data, trx);
}

async function sharedUpdateExternalPersonalUserData(
	userId: number,
	userDataId: number,
	data: UpdateUserData,
	trx: Knex.Transaction
): Promise<BaseUserData> {
	return sharedUpdatePersonalUserData(DatosPersonalesExterno.Name, userId, userDataId, data, trx);
}

export interface UpdateAdminData extends UpdateUserData {}
export function actualizarAdmin(id: number, data: UpdateAdminData): Promise<ViewUserAdmin.Value> {
	return qb.transaction(async (trx) => {
		const entry = ensureDatabaseEntry(
			await trx(Admin.Name).where({ id }).first(),
			'No se ha encontrado un administrador con el ID proporcionado'
		);

		const userData = await sharedUpdateInternalPersonalUserData(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { role: 'Admin' });
	});
}

export interface UpdateApSOfficeData extends UpdateUserData {}
export async function actualizarOficinaAPS(id: number, data: UpdateApSOfficeData): Promise<ViewUserApSOffice.Value> {
	return qb.transaction(async (trx) => {
		const entry = ensureDatabaseEntry(
			await trx(OficinaAps.Name).where({ id }).first(),
			'No se ha encontrado una oficina ApS con el ID proporcionado'
		);

		const userData = await sharedUpdateInternalPersonalUserData(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { role: 'ApSOffice' });
	});
}

export interface UpdateCommunityPartnerData extends UpdateUserData {
	mission?: SocioComunitario.Value['mision'];
	name?: SocioComunitario.Value['nombre_socioComunitario'];
	sector?: SocioComunitario.Value['sector'];
	url?: SocioComunitario.Value['url'];
}
export async function actualizarSocioComunitario(id: number, data: UpdateCommunityPartnerData): Promise<ViewUserCommunityPartner.Value> {
	return qb.transaction(async (trx) => {
		const entry = await sharedUpdateAndReturn({
			table: SocioComunitario.Name,
			where: { id },
			data: { mision: data.mission, nombre_socioComunitario: data.name, sector: data.sector, url: data.url },
			trx
		});

		const userData = await sharedUpdateExternalPersonalUserData(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, {
			role: 'CommunityPartner',
			mission: entry.mision,
			name: entry.nombre_socioComunitario,
			sector: entry.sector,
			url: entry.url
		});
	});
}

export interface UpdateStudentData extends UpdateUserData {}
export interface UpdateInternalStudentData extends UpdateStudentData {
	degree?: EstudianteInterno.Value['titulacion_local'];
}
export async function actualizarEstudianteInterno(id: number, data: UpdateInternalStudentData): Promise<ViewUserInternalStudent.Value> {
	return qb.transaction(async (trx) => {
		const entry = await sharedUpdateAndReturn({
			table: EstudianteInterno.Name,
			where: { id },
			data: { titulacion_local: data.degree },
			trx
		});

		const userData = await sharedUpdateInternalPersonalUserData(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { role: 'InternalStudent', degree: entry.titulacion_local });
	});
}

export interface UpdateExternalStudentData extends UpdateStudentData {
	degree?: EstudianteExterno.Value['titulacion'];
	university?: EstudianteExterno.Value['universidad'];
}
export async function actualizarEstudianteExterno(id: number, data: UpdateExternalStudentData): Promise<ViewUserExternalStudent.Value> {
	return qb.transaction(async (trx) => {
		const entry = await sharedUpdateAndReturn({
			table: EstudianteExterno.Name,
			where: { id },
			data: { titulacion: data.degree, universidad: data.university },
			trx
		});

		const userData = await sharedUpdateExternalPersonalUserData(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { role: 'ExternalStudent', degree: entry.titulacion, university: entry.universidad });
	});
}

export interface UpdateProfessorData extends UpdateUserData {
	knowledgeAreas?: readonly number[];
}
async function updateSharedProfessorKnowledgeAreas(id: number, data: UpdateProfessorData, trx: Knex.Transaction): Promise<number[]> {
	if (!isNullish(data.knowledgeAreas)) {
		await trx(AreaConocimiento_Profesor.Name).where({ id_profesor: id }).del();

		if (data.knowledgeAreas.length > 0) {
			await trx(AreaConocimiento_Profesor.Name).insert(
				data.knowledgeAreas.map((field) => ({
					id_area: field,
					id_profesor: id
				}))
			);

			return data.knowledgeAreas as number[];
		}

		return [];
	}

	const entries = await trx(AreaConocimiento_Profesor.Name).where({ id_profesor: id }).select('id_area');
	return entries.map((entry) => entry.id_area);
}

export interface UpdateInternalProfessorData extends UpdateProfessorData {
	localDegrees?: readonly number[];
}
export async function actualizarProfesorInterno(id: number, data: UpdateInternalProfessorData): Promise<ViewUserInternalProfessor.Value> {
	return qb.transaction(async (trx) => {
		const entry = getFirstDatabaseEntry(
			await trx(ProfesorInterno.Name) //
				.where({ id })
				.select('datos_personales_Id'),
			'No se ha encontrado un profesor interno con el ID proporcionado'
		);

		let degrees: number[] = [];
		if (!isNullish(data.localDegrees)) {
			await trx(TitulacionLocal_Profesor.Name).where({ id_profesor: id }).del();

			if (data.localDegrees.length > 0) {
				await trx(TitulacionLocal_Profesor.Name).insert(
					data.localDegrees.map((field) => ({
						id_titulacion: field,
						id_profesor: id
					}))
				);

				degrees = data.localDegrees as number[];
			}
		} else {
			const entries = await trx(TitulacionLocal_Profesor.Name).where({ id_profesor: id }).select('id_titulacion');
			degrees = entries.map((entry) => entry.id_titulacion);
		}

		const knowledgeAreas = await updateSharedProfessorKnowledgeAreas(id, data, trx);
		const userData = await sharedUpdateInternalPersonalUserData(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { role: 'InternalProfessor', knowledgeAreas, degrees });
	});
}

export interface UpdateExternalProfessorData extends UpdateProfessorData {
	university?: ProfesorExterno.Value['universidad'];
	faculty?: ProfesorExterno.Value['facultad'];
}
export async function actualizarProfesorExterno(id: number, data: UpdateExternalProfessorData): Promise<ViewUserExternalProfessor.Value> {
	return qb.transaction(async (trx) => {
		const entry = await sharedUpdateAndReturn({
			table: ProfesorExterno.Name,
			where: { id },
			data: { universidad: data.university, facultad: data.faculty },
			trx
		});

		const knowledgeAreas = await updateSharedProfessorKnowledgeAreas(id, data, trx);
		const userData = await sharedUpdateExternalPersonalUserData(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { role: 'ExternalProfessor', university: entry.universidad, faculty: entry.facultad, knowledgeAreas });
	});
}
