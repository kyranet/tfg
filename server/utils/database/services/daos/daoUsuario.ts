import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import type { Knex } from 'knex';
import { Admin } from '../types/Admin';
import { AreaConocimiento } from '../types/AreaConocimiento';
import { AreaConocimiento_Profesor } from '../types/AreaConocimiento_Profesor';
import { DatosPersonalesExterno } from '../types/DatosPersonalesExterno';
import { DatosPersonalesInterno } from '../types/DatosPersonalesInterno';
import { Estudiante } from '../types/Estudiante';
import { EstudianteExterno } from '../types/EstudianteExterno';
import { EstudianteInterno } from '../types/EstudianteInterno';
import { OficinaAps } from '../types/OficinaAps';
import { Profesor } from '../types/Profesor';
import { ProfesorExterno } from '../types/ProfesorExterno';
import { ProfesorInterno } from '../types/ProfesorInterno';
import { SocioComunitario } from '../types/SocioComunitario';
import { TitulacionLocal_Profesor } from '../types/TitulacionLocal_Profesor';
import { Universidad } from '../types/Universidad';
import { Usuario } from '../types/Usuario';
import { ViewUser } from '../types/views/User';
import { ViewUserAdmin } from '../types/views/UserAdmin';
import { ViewUserApSOffice } from '../types/views/UserApSOffice';
import { ViewUserCommunityPartner } from '../types/views/UserCommunityPartner';
import { ViewUserExternalProfessor } from '../types/views/UserExternalProfessor';
import { ViewUserExternalStudent } from '../types/views/UserExternalStudent';
import { ViewUserInternalProfessor } from '../types/views/UserInternalProfessor';
import { ViewUserInternalStudent } from '../types/views/UserInternalStudent';
import { SearchParameters, sharedCountTable, sharedDeleteEntryTable } from './shared';
import { Upload } from '../types/Upload';

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

export async function borrarEstudianteInterno(id: number): Promise<boolean> {
	return await qb.transaction(
		async (trx) =>
			(await sharedDeleteEntryTable(EstudianteInterno.Name, id, trx)) &&
			(await sharedDeleteEntryTable(DatosPersonalesInterno.Name, id, trx)) &&
			(await sharedDeleteEntryTable(Estudiante.Name, id, trx)) &&
			(await sharedDeleteEntryTable(Usuario.Name, id, trx))
	);
}

export async function borrarEstudianteExterno(id: number): Promise<boolean> {
	return await qb.transaction(
		async (trx) =>
			(await sharedDeleteEntryTable(EstudianteExterno.Name, id, trx)) &&
			(await sharedDeleteEntryTable(DatosPersonalesExterno.Name, id, trx)) &&
			(await sharedDeleteEntryTable(Estudiante.Name, id, trx)) &&
			(await sharedDeleteEntryTable(Usuario.Name, id, trx))
	);
}

export async function borrarProfesorExterno(id: number): Promise<boolean> {
	return await qb.transaction(
		async (trx) =>
			(await sharedDeleteEntryTable(ProfesorExterno.Name, id, trx)) &&
			(await sharedDeleteEntryTable(DatosPersonalesExterno.Name, id, trx)) &&
			(await sharedDeleteEntryTable(Profesor.Name, id, trx)) &&
			(await sharedDeleteEntryTable(Usuario.Name, id, trx))
	);
}

export async function borrarProfesorInterno(id: number): Promise<boolean> {
	return await qb.transaction(
		async (trx) =>
			(await sharedDeleteEntryTable(ProfesorInterno.Name, id, trx)) &&
			(await sharedDeleteEntryTable(DatosPersonalesInterno.Name, id, trx)) &&
			(await sharedDeleteEntryTable(Profesor.Name, id, trx)) &&
			(await sharedDeleteEntryTable(Usuario.Name, id, trx))
	);
}

export async function borrarAdmin(id: number): Promise<boolean> {
	return await qb.transaction(
		async (trx) =>
			(await sharedDeleteEntryTable(Admin.Name, id, trx)) &&
			(await sharedDeleteEntryTable(DatosPersonalesInterno.Name, id, trx)) &&
			(await sharedDeleteEntryTable(Usuario.Name, id, trx))
	);
}

export async function borrarOficinaAPS(id: number): Promise<boolean> {
	return await qb.transaction(
		async (trx) =>
			(await sharedDeleteEntryTable(OficinaAps.Name, id, trx)) &&
			(await sharedDeleteEntryTable(DatosPersonalesInterno.Name, id, trx)) &&
			(await sharedDeleteEntryTable(Usuario.Name, id, trx))
	);
}

export async function borrarSocioComunitario(id: number): Promise<boolean> {
	return await qb.transaction(
		async (trx) =>
			(await sharedDeleteEntryTable(SocioComunitario.Name, id, trx)) &&
			(await sharedDeleteEntryTable(DatosPersonalesExterno.Name, id, trx)) &&
			(await sharedDeleteEntryTable(Usuario.Name, id, trx))
	);
}

export async function maybeGetUsuarioSinRolPorEmail(email: string): Promise<ViewUser.Value | null> {
	return parseViewUserJsonStringProperties(await qb(ViewUser.Name).where({ email }).first()) ?? null;
}

export async function obtenerUsuarioSinRolPorEmail(email: string): Promise<ViewUser.Value> {
	return ensureDatabaseEntry(await maybeGetUsuarioSinRolPorEmail(email));
}

export async function maybeGetUsuarioSinRolPorId(id: number): Promise<ViewUser.Value | null> {
	return parseViewUserJsonStringProperties(await qb(ViewUser.Name).where({ id }).first()) ?? null;
}

export async function obtenerUsuarioSinRolPorId(id: number): Promise<ViewUser.Value> {
	return ensureDatabaseEntry(await maybeGetUsuarioSinRolPorId(id));
}

export async function obtenerUniversidades(): Promise<Universidad.Value[]> {
	return await qb(Universidad.Name);
}

export interface GetAllUserKnowledgeAreasResult {
	id: AreaConocimiento.Value['id'];
	name: AreaConocimiento.Value['nombre'];
}
export async function obtenerAreasConocimientoUsuario(id: number): Promise<GetAllUserKnowledgeAreasResult[]> {
	return await qb(AreaConocimiento.Name)
		.join(AreaConocimiento_Profesor.Name, AreaConocimiento.Key('id'), '=', AreaConocimiento_Profesor.Key('id_area'))
		.where(AreaConocimiento_Profesor.Key('id_profesor'), '=', id)
		.select(AreaConocimiento.Key('id'), qb.ref(AreaConocimiento.Key('nombre')).as('name'));
}

export async function obtenerAreasConocimiento(): Promise<AreaConocimiento.Value[]> {
	return await qb(AreaConocimiento.Name);
}

export async function obtenerAdmin(id: number): Promise<ViewUserAdmin.Value | null> {
	return (await qb(ViewUserAdmin.Name).where({ id }).first()) ?? null;
}

export async function obtenerOficinaAps(id: number): Promise<ViewUserApSOffice.Value | null> {
	return (await qb(ViewUserApSOffice.Name).where({ id }).first()) ?? null;
}

export async function obtenerSocioComunitario(id: number): Promise<ViewUserCommunityPartner.Value | null> {
	return (await qb(ViewUserCommunityPartner.Name).where({ id }).first()) ?? null;
}

export async function obtenerSociosComunitarios(): Promise<ViewUserCommunityPartner.Value[]> {
	return await qb(ViewUserCommunityPartner.Name);
}

export async function obtenerProfesoresInternos(): Promise<ViewUserExternalProfessor.Value[]> {
	const entries = await qb(ViewUserExternalProfessor.Name);
	return entries.map((entry) => parseViewUserExternalProfessorJsonStringProperties(entry));
}

export async function obtenerProfesorInterno(id: number): Promise<ViewUserInternalProfessor.Value | null> {
	return (await qb(ViewUserInternalProfessor.Name).where({ id }).first()) ?? null;
}

export async function obtenerProfesorExterno(id: number): Promise<ViewUserExternalProfessor.Value | null> {
	const entry = await qb(ViewUserExternalProfessor.Name).where({ id }).first();
	return parseViewUserExternalProfessorJsonStringProperties(entry) ?? null;
}

export async function obtenerEstudianteInterno(id: number): Promise<ViewUserInternalStudent.Value | null> {
	return (await qb(ViewUserInternalStudent.Name).where({ id }).first()) ?? null;
}

export async function obtenerEstudianteExterno(id: number): Promise<ViewUserExternalStudent.Value | null> {
	return (await qb(ViewUserExternalStudent.Name).where({ id }).first()) ?? null;
}

export interface SearchUsersOptions extends SearchParameters {
	query?: string;
}
export async function searchUsers(options: SearchUsersOptions): Promise<ViewUser.Value[]> {
	const entries = (await qb(ViewUser.Name)
		.modify((query) => {
			if (!isNullishOrEmpty(options.query)) {
				query
					.where('firstName', 'like', `%${options.query}%`) //
					.orWhere('lastName', 'like', `%${options.query}%`)
					.orWhere('email', 'like', `%${options.query}%`);
			}
		})
		.limit(options.limit ?? 100)
		.offset(options.offset ?? 0)
		.orderBy('createdAt')) as ViewUser.RawValue[];
	return entries.map((entry) => parseViewUserJsonStringProperties(entry));
}

export function countUsers() {
	return sharedCountTable(Usuario.Name);
}

// async function performAvatarUpload(id: number, avatar: Buffer | null | undefined, trx: Knex.Transaction) {
// 	// If the avatar is undefined, we don't need to do anything:
// 	if (avatar === undefined) return undefined;

// 	const entry = await trx(Upload.Name).where({ tipo: 'usuarios', campo: 'avatar', tipo_id: id.toString() });

// 	if (entry.length > 0) {
// 		await trx(Upload.Name).where({ id: entry[0].id }).del();
// 	}
// }

//UPDATES
export interface UpdateBaseUserData {
	avatar?: Buffer | null;
	acceptedTerms?: Usuario.Value['terminos_aceptados'];
}
async function sharedUpdateUser(id: number, data: UpdateBaseUserData, trx: Knex.Transaction): Promise<Usuario.Value> {
	return getFirstDatabaseEntry(
		await trx(Usuario.Name) //
			.where({ id })
			.update({ origin_img: data.avatar, terminos_aceptados: data.acceptedTerms })
			.returning('*'),
		'No se ha encontrado un usuario con el ID proporcionado'
	);
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
	const userData = getFirstDatabaseEntry(
		await trx(table)
			.where({ id: userDataId })
			.update({ nombre: data.firstName, apellidos: data.lastName, password: data.password, telefono: data.phone })
			.returning('*'),
		'No se ha encontrado los datos personales internos con el ID proporcionado'
	);

	return { ...user, ...userData };
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
		const entry = getFirstDatabaseEntry(
			await trx(SocioComunitario.Name)
				.where({ id })
				.update({
					mision: data.mission,
					nombre_socioComunitario: data.name,
					sector: data.sector,
					url: data.url
				})
				.returning('*')
		);

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
		const entry = getFirstDatabaseEntry(
			await trx(EstudianteInterno.Name) //
				.where({ id })
				.update({ titulacion_local: data.degree })
				.returning('*'),
			'No se ha encontrado un estudiante interno con el ID proporcionado'
		);

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
		const entry = getFirstDatabaseEntry(
			await trx(EstudianteExterno.Name) //
				.where({ id })
				.update({ titulacion: data.degree, universidad: data.university })
				.returning('*'),
			'No se ha encontrado un estudiante externo con el ID proporcionado'
		);

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
		const entry = getFirstDatabaseEntry(
			await trx(ProfesorExterno.Name) //
				.where({ id })
				.update({ universidad: data.university, facultad: data.faculty })
				.returning('*'),
			'No se ha encontrado un profesor externo con el ID proporcionado'
		);

		const knowledgeAreas = await updateSharedProfessorKnowledgeAreas(id, data, trx);
		const userData = await sharedUpdateExternalPersonalUserData(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { role: 'ExternalProfessor', university: entry.universidad, faculty: entry.facultad, knowledgeAreas });
	});
}

/**
 * Fixes the `user` property of a `ViewUser` entry from a JSON string to an object. This function is required as the
 * `JSON` type in MariaDB aliases the `TEXT` type, which in turn will not be parsed by any database client or driver.
 *
 * @param entry The entry to parse
 * @returns The parsed entry
 */
function parseViewUserJsonStringProperties(entry: ViewUser.RawValue): ViewUser.Value;
function parseViewUserJsonStringProperties(entry: ViewUser.RawValue | undefined): ViewUser.Value | undefined;
function parseViewUserJsonStringProperties(entry: ViewUser.RawValue | undefined): ViewUser.Value | undefined {
	if (!entry) return entry;

	const { data, ...rest } = entry;
	return Object.assign(rest, JSON.parse(data));
}

function parseViewUserExternalProfessorJsonStringProperties(entry: ViewUserExternalProfessor.RawValue): ViewUserExternalProfessor.Value;
function parseViewUserExternalProfessorJsonStringProperties(
	entry: ViewUserExternalProfessor.RawValue | undefined
): ViewUserExternalProfessor.Value | undefined;
function parseViewUserExternalProfessorJsonStringProperties(
	entry: ViewUserExternalProfessor.RawValue | undefined
): ViewUserExternalProfessor.Value | undefined {
	if (!entry) return entry;

	return { ...entry, knowledgeAreas: JSON.parse(entry.knowledgeAreas as unknown as string) };
}

function formatUser<User extends ViewUser.ValueUserType>(datos: BaseUserData, data: ViewUser.ValueUserOfType<User>): ViewUser.ValueOfType<User> {
	return {
		id: datos.id,
		createdAt: datos.createdAt,
		firstName: datos.nombre,
		lastName: datos.apellidos,
		email: datos.correo,
		phone: datos.telefono,
		...data
	} as unknown as ViewUser.ValueOfType<User>;
}

type BaseUserData = Usuario.Value & (DatosPersonalesInterno.Value | DatosPersonalesExterno.Value);
