import { isNullishOrEmpty } from '@sapphire/utilities';
import type { Knex } from 'knex';
import { Admin } from '../../types/Admin';
import { AreaConocimiento_Profesor } from '../../types/AreaConocimiento_Profesor';
import { DatosPersonalesExterno } from '../../types/DatosPersonalesExterno';
import { DatosPersonalesInterno } from '../../types/DatosPersonalesInterno';
import { Estudiante } from '../../types/Estudiante';
import { EstudianteExterno } from '../../types/EstudianteExterno';
import { EstudianteInterno } from '../../types/EstudianteInterno';
import { OficinaAps } from '../../types/OficinaAps';
import { Profesor } from '../../types/Profesor';
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
import { formatUser } from './_shared';

export interface InsertBaseUserData {
	avatar?: Usuario.CreateData['origin_img'];
	acceptedTerms: Usuario.CreateData['terminos_aceptados'];
}
async function sharedInsertUsuario(data: InsertBaseUserData, trx: Knex.Transaction): Promise<Usuario.Value> {
	const [entry] = await trx(Usuario.Name)
		.insert({
			origin_login: 'Portal ApS',
			origin_img: data.avatar,
			terminos_aceptados: data.acceptedTerms
		})
		.returning('*');

	return entry;
}

export interface InsertUserData extends InsertBaseUserData {
	email: DatosPersonalesInterno.CreateData['nombre'];
	firstName: DatosPersonalesInterno.CreateData['nombre'];
	lastName: DatosPersonalesInterno.CreateData['apellidos'];
	password: DatosPersonalesInterno.CreateData['password'];
	phone: DatosPersonalesInterno.CreateData['telefono'];
}
async function sharedInsertaDatosPersonalesInterno(data: InsertUserData, trx: Knex.Transaction) {
	const [datos] = await trx(DatosPersonalesInterno.Name)
		.insert({ correo: data.email, password: data.password, nombre: data.firstName, apellidos: data.lastName, telefono: data.phone })
		.returning('*');
	return datos;
}

async function sharedInsertaDatosPersonalesExterno(data: InsertUserData, trx: Knex.Transaction) {
	const [datos] = await trx(DatosPersonalesExterno.Name)
		.insert({ correo: data.email, password: data.password, nombre: data.firstName, apellidos: data.lastName, telefono: data.phone })
		.returning('*');
	return datos;
}

export type AdminCreateData = InsertUserData;
export async function insertarAdmin(data: AdminCreateData): Promise<ViewUserAdmin.Value> {
	return await qb.transaction(async (trx) => {
		const usuario = await sharedInsertUsuario(data, trx);
		const datos = await sharedInsertaDatosPersonalesInterno(data, trx);
		await trx(Admin.Name) //
			.insert({ id: usuario.id, datos_personales_Id: datos.id });

		return formatUser({ ...usuario, ...datos }, { role: 'Admin' });
	});
}

export type OficinaApsCreateData = InsertUserData;
export async function insertarOficinaAps(data: OficinaApsCreateData): Promise<ViewUserApSOffice.Value> {
	return await qb.transaction(async (trx) => {
		const usuario = await sharedInsertUsuario(data, trx);
		const datos = await sharedInsertaDatosPersonalesInterno(data, trx);
		await trx(OficinaAps.Name).insert({ id: usuario.id, datos_personales_Id: datos.id });

		return formatUser({ ...usuario, ...datos }, { role: 'ApSOffice' });
	});
}

async function insertarEstudiante(data: InsertBaseUserData, trx: Knex.Transaction): Promise<Usuario.Value> {
	const usuario = await sharedInsertUsuario(data, trx);
	await trx(Estudiante.Name).insert({ id: usuario.id });

	return usuario;
}

export interface EstudianteInternoCreateData extends InsertUserData {
	degree: EstudianteInterno.CreateData['titulacion_local'];
}
export async function insertarEstudianteInterno(data: EstudianteInternoCreateData): Promise<ViewUserInternalStudent.Value> {
	return await qb.transaction(async (trx) => {
		const estudiante = await insertarEstudiante(data, trx);
		const datos = await sharedInsertaDatosPersonalesInterno(data, trx);
		await trx(EstudianteInterno.Name).insert({
			id: estudiante.id,
			titulacion_local: data.degree,
			datos_personales_Id: datos.id
		});

		return formatUser({ ...estudiante, ...datos }, { role: 'InternalStudent', degree: data.degree });
	});
}

export interface EstudianteExternoCreateData extends InsertUserData {
	university: EstudianteExterno.CreateData['universidad'];
	degree: EstudianteExterno.CreateData['titulacion'];
}
export async function insertarEstudianteExterno(data: EstudianteExternoCreateData): Promise<ViewUserExternalStudent.Value> {
	return await qb.transaction(async (trx) => {
		const student = await insertarEstudiante(data, trx);
		const userData = await sharedInsertaDatosPersonalesExterno(data, trx);
		await trx(EstudianteExterno.Name).insert({
			id: student.id,
			universidad: data.university,
			titulacion: data.degree,
			datos_personales_Id: userData.id
		});

		return formatUser({ ...student, ...userData }, { role: 'ExternalStudent', degree: data.degree, university: data.university });
	});
}

export interface InsertProfessorData extends InsertUserData {
	knowledgeAreas?: readonly number[];
}
async function insertarProfesor(data: InsertProfessorData, trx: Knex.Transaction): Promise<Usuario.Value> {
	const user = await sharedInsertUsuario(data, trx);
	await trx(Profesor.Name).insert({ id: user.id });

	return user;
}

async function insertSharedProfessorKnowledgeAreas(id: number, data: InsertProfessorData, trx: Knex.Transaction): Promise<number[]> {
	if (!isNullishOrEmpty(data.knowledgeAreas)) {
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

export interface ProfesorInternoCreateData extends InsertProfessorData {
	degrees?: TitulacionLocal_Profesor.Value['id_titulacion'][];
}
export async function insertarProfesorInterno(data: ProfesorInternoCreateData): Promise<ViewUserInternalProfessor.Value> {
	return await qb.transaction(async (trx) => {
		const professor = await insertarProfesor(data, trx);
		const userData = await sharedInsertaDatosPersonalesInterno(data, trx);
		await trx(ProfesorInterno.Name).insert({ id: professor.id, datos_personales_Id: userData.id });

		let degrees: number[] = [];
		if (!isNullishOrEmpty(data.degrees)) {
			await trx(TitulacionLocal_Profesor.Name).insert(
				data.degrees.map((field) => ({
					id_titulacion: field,
					id_profesor: professor.id
				}))
			);

			degrees = data.degrees;
		}

		const knowledgeAreas = await insertSharedProfessorKnowledgeAreas(professor.id, data, trx);
		return formatUser({ ...professor, ...userData }, { role: 'InternalProfessor', knowledgeAreas, degrees });
	});
}

export interface ProfesorExternoCreateData extends InsertProfessorData {
	university: ProfesorExterno.CreateData['universidad'];
	faculty: ProfesorExterno.CreateData['facultad'];
}
export async function insertarProfesorExterno(data: ProfesorExternoCreateData): Promise<ViewUserExternalProfessor.Value> {
	return await qb.transaction(async (trx) => {
		const professor = await insertarProfesor(data, trx);
		const userData = await sharedInsertaDatosPersonalesExterno(data, trx);

		await trx(ProfesorExterno.Name).insert({
			id: professor.id,
			universidad: data.university,
			facultad: data.faculty,
			datos_personales_Id: userData.id
		});

		const knowledgeAreas = await insertSharedProfessorKnowledgeAreas(professor.id, data, trx);
		return formatUser(
			{ ...professor, ...userData },
			{ role: 'ExternalProfessor', university: data.university, faculty: data.faculty, knowledgeAreas }
		);
	});
}

export interface SocioComunitarioCreateData extends InsertUserData {
	mission: SocioComunitario.CreateData['mision'];
	name: SocioComunitario.CreateData['nombre_socioComunitario'];
	sector: SocioComunitario.CreateData['sector'];
	url: SocioComunitario.CreateData['url'];
}
export async function insertarSocioComunitario(data: SocioComunitarioCreateData): Promise<ViewUserCommunityPartner.Value> {
	return await qb.transaction(async (trx) => {
		const user = await sharedInsertUsuario(data, trx);
		const userData = await sharedInsertaDatosPersonalesExterno(data, trx);
		await trx(SocioComunitario.Name).insert({
			id: user.id,
			sector: data.sector,
			nombre_socioComunitario: data.name,
			url: data.url,
			mision: data.mission,
			datos_personales_Id: userData.id
		});

		return formatUser(
			{ ...user, ...userData },
			{ role: 'CommunityPartner', mission: data.mission, name: data.name, sector: data.sector, url: data.url }
		);
	});
}
