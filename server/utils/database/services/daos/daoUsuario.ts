import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { Knex } from 'knex';
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
import { sharedDeleteEntryTable, sharedHasTableEntry } from './shared';

async function sharedInsertaDatosPersonalesInterno(data: DatosPersonalesInterno.CreateData, trx: Knex.Transaction) {
	const [datos] = await trx(DatosPersonalesInterno.Name)
		.insert({ correo: data.correo, password: data.password, apellidos: data.apellidos, nombre: data.nombre, telefono: data.telefono })
		.returning('*');
	return datos;
}

async function sharedInsertaDatosPersonalesExterno(data: DatosPersonalesExterno.CreateData, trx: Knex.Transaction) {
	const [datos] = await trx(DatosPersonalesExterno.Name)
		.insert({ correo: data.correo, password: data.password, apellidos: data.apellidos, nombre: data.nombre, telefono: data.telefono })
		.returning('*');
	return datos;
}

export type UniversidadExterna = { universidad: string };
async function sharedEnsureUniversidadId(data: UniversidadExterna, trx: Knex | Knex.Transaction = qb): Promise<number> {
	const entry = ensureDatabaseEntry(
		await trx(Universidad.Name).select('id').where(Universidad.Key('nombre'), 'like', `%${data.universidad}%`).first(),
		'No se encontró la universidad con el nombre proporcionado'
	);
	return entry.id;
}

export type UsuarioCreateData = Usuario.CreateData;
async function sharedInsertUsuario(data: UsuarioCreateData, trx: Knex.Transaction): Promise<Usuario.Value> {
	const [entry] = await trx(Usuario.Name)
		.insert({
			origin_login: data.origin_login,
			origin_img: data.origin_img,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			terminos_aceptados: data.terminos_aceptados
		})
		.returning('*');

	return entry;
}

export type AdminCreateData = UsuarioCreateData & DatosPersonalesInterno.CreateData & Admin.CreateData;
export async function insertarAdmin(data: AdminCreateData): Promise<ViewUserAdmin.Value> {
	return await qb.transaction(async (trx) => {
		const usuario = await sharedInsertUsuario(data, trx);
		const datos = await sharedInsertaDatosPersonalesInterno(data, trx);
		await trx(Admin.Name) //
			.insert({ id: usuario.id, datos_personales_Id: datos.id });

		return formatUser({ ...usuario, ...datos }, { type: 'Admin' });
	});
}

export type OficinaApsCreateData = UsuarioCreateData & DatosPersonalesInterno.CreateData & OficinaAps.CreateData;
export async function insertarOficinaAps(data: OficinaApsCreateData): Promise<ViewUserApSOffice.Value> {
	return await qb.transaction(async (trx) => {
		const usuario = await sharedInsertUsuario(data, trx);
		const datos = await sharedInsertaDatosPersonalesInterno(data, trx);
		await trx(OficinaAps.Name).insert({ id: usuario.id, datos_personales_Id: datos.id });

		return formatUser({ ...usuario, ...datos }, { type: 'ApSOffice' });
	});
}

export type EstudianteCreateData = UsuarioCreateData;
async function insertarEstudiante(data: EstudianteCreateData, trx: Knex.Transaction): Promise<Usuario.Value & Estudiante.Value> {
	const usuario = await sharedInsertUsuario(data, trx);
	await trx(Estudiante.Name).insert({ id: usuario.id });

	return usuario;
}

export type EstudianteInternoCreateData = EstudianteCreateData & DatosPersonalesInterno.CreateData & EstudianteInterno.CreateData;
export async function insertarEstudianteInterno(data: EstudianteInternoCreateData): Promise<ViewUserInternalStudent.Value> {
	return await qb.transaction(async (trx) => {
		const estudiante = await insertarEstudiante(data, trx);
		const datos = await sharedInsertaDatosPersonalesInterno(data, trx);
		await trx(EstudianteInterno.Name).insert({
			id: estudiante.id,
			titulacion_local: data.titulacion_local,
			datos_personales_Id: datos.id
		});

		return formatUser({ ...estudiante, ...datos }, { type: 'InternalStudent', degree: data.titulacion_local });
	});
}

export type EstudianteExternoCreateData = EstudianteCreateData &
	DatosPersonalesExterno.CreateData &
	Omit<EstudianteExterno.CreateData, 'id' | 'datos_personales_Id' | 'universidad'> &
	UniversidadExterna;
export async function insertarEstudianteExterno(data: EstudianteExternoCreateData): Promise<ViewUserExternalStudent.Value> {
	return await qb.transaction(async (trx) => {
		const universityId = await sharedEnsureUniversidadId(data, trx);
		const student = await insertarEstudiante(data, trx);
		const userData = await sharedInsertaDatosPersonalesExterno(data, trx);
		await trx(EstudianteExterno.Name).insert({
			id: student.id,
			universidad: universityId,
			titulacion: data.titulacion,
			datos_personales_Id: userData.id
		});

		return formatUser({ ...student, ...userData }, { type: 'ExternalStudent', degree: data.titulacion, university: universityId });
	});
}

export type ProfesorCreateData = UsuarioCreateData & Omit<Profesor.CreateData, 'id'>;
export type ProfesorCreateResult = Usuario.Value & Profesor.Value;
async function insertarProfesor(data: ProfesorCreateData, trx: Knex.Transaction): Promise<ProfesorCreateResult> {
	const user = await sharedInsertUsuario(data, trx);
	await trx(Profesor.Name).insert({ id: user.id });

	return user;
}

export type ProfesorInternoCreateData = ProfesorCreateData &
	DatosPersonalesInterno.CreateData &
	ProfesorInterno.CreateData & { titulacionesLocales?: readonly number[]; areasConocimiento?: readonly number[] };
export async function insertarProfesorInterno(data: ProfesorInternoCreateData): Promise<ViewUserInternalProfessor.Value> {
	return await qb.transaction(async (trx) => {
		const professor = await insertarProfesor(data, trx);
		const userData = await sharedInsertaDatosPersonalesInterno(data, trx);
		await trx(ProfesorInterno.Name).insert({ id: professor.id, datos_personales_Id: data.id });

		if (!isNullishOrEmpty(data.titulacionesLocales)) {
			await trx(TitulacionLocal_Profesor.Name).insert(
				data.titulacionesLocales.map((field) => ({
					id_titulacion: field,
					id_profesor: professor.id
				}))
			);
		}

		if (!isNullishOrEmpty(data.areasConocimiento)) {
			await trx(AreaConocimiento_Profesor.Name).insert(
				data.areasConocimiento.map((field) => ({
					id_area: field,
					id_profesor: professor.id
				}))
			);
		}

		return formatUser({ ...professor, ...userData }, { type: 'InternalProfessor' });
	});
}

export type ProfesorExternoCreateData = ProfesorCreateData &
	DatosPersonalesExterno.CreateData &
	Omit<ProfesorExterno.CreateData, 'id' | 'datos_personales_Id' | 'universidad'> &
	UniversidadExterna & { areasConocimiento?: readonly number[] };
export async function insertarProfesorExterno(data: ProfesorExternoCreateData): Promise<ViewUserExternalProfessor.Value> {
	return await qb.transaction(async (trx) => {
		const universityId = await sharedEnsureUniversidadId(data, trx);
		const professor = await insertarProfesor(data, trx);
		const userData = await sharedInsertaDatosPersonalesExterno(data, trx);

		await trx(ProfesorExterno.Name).insert({
			id: professor.id,
			universidad: universityId,
			facultad: data.facultad,
			datos_personales_Id: userData.id
		});

		if (!isNullishOrEmpty(data.areasConocimiento)) {
			await trx(AreaConocimiento_Profesor.Name).insert(
				data.areasConocimiento.map((field) => ({
					id_area: field,
					id_profesor: professor.id
				}))
			);
		}

		return formatUser({ ...professor, ...userData }, { type: 'ExternalProfessor', university: universityId, faculty: data.facultad });
	});
}

export type SocioComunitarioCreateData = UsuarioCreateData &
	DatosPersonalesExterno.CreateData &
	Omit<SocioComunitario.CreateData, 'id' | 'datos_personales_Id'>;
export async function insertarSocioComunitario(data: SocioComunitarioCreateData): Promise<ViewUserCommunityPartner.Value> {
	return await qb.transaction(async (trx) => {
		const user = await sharedInsertUsuario(data, trx);
		const userData = await sharedInsertaDatosPersonalesExterno(data, trx);
		await trx(SocioComunitario.Name).insert({
			id: user.id,
			sector: data.sector,
			nombre_socioComunitario: data.nombre_socioComunitario,
			url: data.url,
			mision: data.mision,
			datos_personales_Id: userData.id
		});

		return formatUser(
			{ ...user, ...userData },
			{ type: 'CommunityPartner', mission: data.mision, name: data.nombre_socioComunitario, sector: data.sector, url: data.url }
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

export async function obtenerUsuarioSinRolPorEmail(email: string): Promise<ViewUser.Value | null> {
	return (await qb(ViewUser.Name).where({ email }).first()) ?? null;
}

export async function obtenerUsuarioSinRolPorId(id: number): Promise<ViewUser.Value | null> {
	return (await qb(ViewUser.Name).where({ id }).first()) ?? null;
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
	return await qb(ViewUserExternalProfessor.Name);
}

export async function obtenerProfesorInterno(id: number): Promise<ViewUserExternalProfessor.Value | null> {
	return (await qb(ViewUserExternalProfessor.Name).where({ id }).first()) ?? null;
}

export async function obtenerProfesorExterno(id: number): Promise<ViewUserExternalProfessor.Value | null> {
	return (await qb(ViewUserExternalProfessor.Name).where({ id }).first()) ?? null;
}

export async function obtenerEstudianteInterno(id: number): Promise<ViewUserInternalStudent.Value | null> {
	return (await qb(ViewUserInternalStudent.Name).where({ id }).first()) ?? null;
}

export async function obtenerEstudianteExterno(id: number): Promise<ViewUserExternalStudent.Value | null> {
	return (await qb(ViewUserExternalStudent.Name).where({ id }).first()) ?? null;
}

//UPDATES
export interface UpdateUserData extends Partial<Omit<Usuario.Value, 'id'>> {}
async function sharedUpdateUser(id: number, data: Partial<Omit<Usuario.Value, 'id'>>, trx: Knex.Transaction): Promise<Usuario.Value> {
	return getFirstDatabaseEntry(
		await trx(Usuario.Name)
			.where({ id })
			.update({
				origin_login: data.origin_login,
				origin_img: data.origin_img,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
				terminos_aceptados: data.terminos_aceptados
			})
			.returning('*'),
		'No se ha encontrado un usuario con el ID proporcionado'
	);
}

export interface UpdateUserData extends Partial<Omit<Usuario.Value & DatosPersonalesInterno.Value, 'id'>> {}
async function sharedUpdateUserData(userId: number, userDataId: number, data: UpdateUserData, trx: Knex.Transaction): Promise<BaseUserData> {
	const user = await sharedUpdateUser(userId, data, trx);
	const userData = getFirstDatabaseEntry(
		await trx(DatosPersonalesInterno.Name)
			.where({ id: userDataId })
			.update({
				nombre: data.nombre,
				apellidos: data.apellidos,
				password: data.password,
				telefono: data.telefono
			})
			.returning('*'),
		'No se ha encontrado los datos personales internos con el ID proporcionado'
	);

	return { ...user, ...userData };
}

export interface UpdateAdminData extends UpdateUserData {}
export function actualizarAdmin(id: number, data: UpdateAdminData): Promise<ViewUserAdmin.Value> {
	return qb.transaction(async (trx) => {
		const entry = ensureDatabaseEntry(
			await trx(Admin.Name).where({ id }).first(),
			'No se ha encontrado un administrador con el ID proporcionado'
		);

		const userData = await sharedUpdateUserData(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { type: 'Admin' });
	});
}

export interface UpdateApSOfficeData extends UpdateUserData {}
export async function actualizarOficinaAPS(id: number, data: UpdateApSOfficeData): Promise<ViewUserApSOffice.Value> {
	return qb.transaction(async (trx) => {
		const entry = ensureDatabaseEntry(
			await trx(OficinaAps.Name).where({ id }).first(),
			'No se ha encontrado una oficina ApS con el ID proporcionado'
		);

		const userData = await sharedUpdateUserData(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { type: 'ApSOffice' });
	});
}

export interface UpdateCommunityPartnerData extends UpdateUserData, Partial<Omit<SocioComunitario.Value, 'id'>> {}
export async function actualizarSocioComunitario(id: number, data: UpdateCommunityPartnerData): Promise<ViewUserCommunityPartner.Value> {
	return qb.transaction(async (trx) => {
		const entry = getFirstDatabaseEntry(
			await trx(SocioComunitario.Name)
				.where({ id })
				.update({
					nombre_socioComunitario: data.nombre_socioComunitario,
					sector: data.sector,
					url: data.url,
					mision: data.mision
				})
				.returning('*')
		);

		const userData = await sharedUpdateUserData(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, {
			type: 'CommunityPartner',
			mission: entry.mision,
			name: entry.nombre_socioComunitario,
			sector: entry.sector,
			url: entry.url
		});
	});
}

export interface UpdateStudentData extends UpdateUserData {}
async function sharedUpdateStudent(id: number, userDataId: number, data: UpdateStudentData, trx: Knex.Transaction): Promise<BaseUserData> {
	if (!(await sharedHasTableEntry(Estudiante.Name, id, trx))) {
		throw createNotFoundError('No se ha encontrado un estudiante con el ID proporcionado');
	}

	return await sharedUpdateUserData(id, userDataId, data, trx);
}

export interface UpdateInternalStudentData extends UpdateStudentData, Partial<Omit<EstudianteInterno.Value, 'id'>> {}
export async function actualizarEstudianteInterno(id: number, data: UpdateInternalStudentData): Promise<ViewUserInternalStudent.Value> {
	return qb.transaction(async (trx) => {
		const entry = getFirstDatabaseEntry(
			await trx(EstudianteInterno.Name) //
				.where({ id })
				.update({ titulacion_local: data.titulacion_local })
				.returning('*'),
			'No se ha encontrado un estudiante interno con el ID proporcionado'
		);

		const userData = await sharedUpdateStudent(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { type: 'InternalStudent', degree: entry.titulacion_local });
	});
}

export interface UpdateExternalStudentData extends UpdateStudentData, Partial<Omit<EstudianteExterno.Value, 'id'>> {}
export async function actualizarEstudianteExterno(id: number, data: UpdateExternalStudentData): Promise<ViewUserExternalStudent.Value> {
	return qb.transaction(async (trx) => {
		const entry = getFirstDatabaseEntry(
			await trx(EstudianteExterno.Name) //
				.where({ id })
				.update({ titulacion: data.titulacion, universidad: data.universidad })
				.returning('*'),
			'No se ha encontrado un estudiante externo con el ID proporcionado'
		);

		const userData = await sharedUpdateStudent(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { type: 'ExternalStudent', degree: entry.titulacion, university: entry.universidad });
	});
}

export interface UpdateProfessorData extends UpdateUserData {}
async function sharedUpdateProfessor(id: number, userDataId: number, data: UpdateProfessorData, trx: Knex.Transaction): Promise<BaseUserData> {
	if (!(await sharedHasTableEntry(Estudiante.Name, id, trx))) {
		throw createNotFoundError('No se ha encontrado un profesor con el ID proporcionado');
	}

	return await sharedUpdateUserData(id, userDataId, data, trx);
}

export interface UpdateInternalProfessorData extends UpdateProfessorData, Partial<Omit<ProfesorInterno.Value, 'id'>> {
	knowledgeAreas?: readonly number[];
	localDegrees?: readonly number[];
}
export async function actualizarProfesorInterno(id: number, data: UpdateInternalProfessorData): Promise<ViewUserInternalProfessor.Value> {
	return qb.transaction(async (trx) => {
		const entry = getFirstDatabaseEntry(
			await trx(ProfesorInterno.Name) //
				.where({ id })
				.update({ universidad: data.universidad, facultad: data.facultad })
				.returning('*'),
			'No se ha encontrado un profesor interno con el ID proporcionado'
		);

		if (!isNullish(data.knowledgeAreas)) {
			await trx(AreaConocimiento_Profesor.Name).where({ id_profesor: id }).del();

			if (data.knowledgeAreas.length > 0) {
				await trx(AreaConocimiento_Profesor.Name).insert(
					data.knowledgeAreas.map((field) => ({
						id_area: field,
						id_profesor: id
					}))
				);
			}
		}

		if (!isNullish(data.localDegrees)) {
			await trx(TitulacionLocal_Profesor.Name).where({ id_profesor: id }).del();

			if (data.localDegrees.length > 0) {
				await trx(TitulacionLocal_Profesor.Name).insert(
					data.localDegrees.map((field) => ({
						id_titulacion: field,
						id_profesor: id
					}))
				);
			}
		}

		const userData = await sharedUpdateProfessor(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { type: 'InternalProfessor' });
	});
}

export interface UpdateExternalProfessorData extends UpdateProfessorData, Partial<Omit<ProfesorExterno.Value, 'id'>> {}
export async function actualizarProfesorExterno(id: number, data: UpdateExternalProfessorData): Promise<ViewUserExternalProfessor.Value> {
	return qb.transaction(async (trx) => {
		const entry = getFirstDatabaseEntry(
			await trx(ProfesorExterno.Name) //
				.where({ id })
				.update({ universidad: data.universidad, facultad: data.facultad })
				.returning('*'),
			'No se ha encontrado un profesor externo con el ID proporcionado'
		);

		const userData = await sharedUpdateProfessor(id, entry.datos_personales_Id, data, trx);
		return formatUser(userData, { type: 'ExternalProfessor', university: entry.universidad, faculty: entry.facultad });
	});
}

function formatUser<User extends ViewUser.ValueUserType>(datos: BaseUserData, user: ViewUser.ValueUserOfType<User>): ViewUser.Value<User> {
	return {
		id: datos.id,
		createdAt: datos.createdAt,
		firstName: datos.nombre,
		lastName: datos.apellidos,
		email: datos.correo,
		phone: datos.telefono,
		user
	};
}

type BaseUserData = Usuario.Value & (DatosPersonalesInterno.Value | DatosPersonalesExterno.Value);
