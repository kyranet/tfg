import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { Knex } from 'knex';
import { Admin } from '../types/Admin';
import { AreaConocimiento } from '../types/AreaConocimiento';
import { AreaConocimiento_Profesor } from '../types/AreaConocimiento_Profesor';
import type { AreaServicio } from '../types/AreaServicio';
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
import { TitulacionLocal } from '../types/TitulacionLocal';
import { TitulacionLocal_Profesor } from '../types/TitulacionLocal_Profesor';
import { Universidad } from '../types/Universidad';
import { Usuario } from '../types/Usuario';
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
export type UsuarioCreateResult = Usuario.Value;
async function sharedInsertUsuario(data: UsuarioCreateData, trx: Knex.Transaction): Promise<UsuarioCreateResult> {
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
export async function insertarAdmin(data: AdminCreateData): Promise<FormattedUser> {
	return await qb.transaction(async (trx) => {
		const usuario = await sharedInsertUsuario(data, trx);
		const datos = await sharedInsertaDatosPersonalesInterno(data, trx);
		await trx(Admin.Name) //
			.insert({ id: usuario.id, datos_personales_Id: datos.id });

		return formatUser({ ...usuario, ...datos });
	});
}

export type OficinaApsCreateData = UsuarioCreateData & DatosPersonalesInterno.CreateData & OficinaAps.CreateData;
export type OficinaApsCreateResult = FormattedUser;
export async function insertarOficinaAps(data: OficinaApsCreateData): Promise<OficinaApsCreateResult> {
	return await qb.transaction(async (trx) => {
		const usuario = await sharedInsertUsuario(data, trx);
		const datos = await sharedInsertaDatosPersonalesInterno(data, trx);
		await trx(OficinaAps.Name).insert({ id: usuario.id, datos_personales_Id: datos.id });

		return formatUser({ ...usuario, ...datos });
	});
}

export type EstudianteCreateData = UsuarioCreateData;
export type EstudianteCreateResult = Usuario.Value & Estudiante.Value;
async function insertarEstudiante(data: EstudianteCreateData, trx: Knex.Transaction): Promise<EstudianteCreateResult> {
	const usuario = await sharedInsertUsuario(data, trx);
	await trx(Estudiante.Name).insert({ id: usuario.id });

	return usuario;
}

export type EstudianteInternoCreateData = EstudianteCreateData & DatosPersonalesInterno.CreateData & EstudianteInterno.CreateData;
export interface EstudianteInternoCreateResult extends FormattedUser {
	localDegree: number;
}
export async function insertarEstudianteInterno(data: EstudianteInternoCreateData): Promise<EstudianteInternoCreateResult> {
	return await qb.transaction(async (trx) => {
		const estudiante = await insertarEstudiante(data, trx);
		const datos = await sharedInsertaDatosPersonalesInterno(data, trx);
		await trx(EstudianteInterno.Name).insert({
			id: estudiante.id,
			titulacion_local: data.titulacion_local,
			datos_personales_Id: datos.id
		});

		return { ...formatUser({ ...estudiante, ...datos }), localDegree: data.titulacion_local };
	});
}

export type EstudianteExternoCreateData = EstudianteCreateData &
	DatosPersonalesExterno.CreateData &
	Omit<EstudianteExterno.CreateData, 'id' | 'datos_personales_Id' | 'universidad'> &
	UniversidadExterna;
export interface EstudianteExternoCreateResult extends FormattedUser {
	universityId: number;
	degree: string;
}
export async function insertarEstudianteExterno(data: EstudianteExternoCreateData): Promise<EstudianteExternoCreateResult> {
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

		return { ...formatUser({ ...student, ...userData }), universityId: universityId, degree: data.titulacion };
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
export type ProfesorInternoCreateResult = FormattedUser;
export async function insertarProfesorInterno(data: ProfesorInternoCreateData): Promise<ProfesorInternoCreateResult> {
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

		return formatUser({ ...professor, ...userData });
	});
}

export type ProfesorExternoCreateData = ProfesorCreateData &
	DatosPersonalesExterno.CreateData &
	Omit<ProfesorExterno.CreateData, 'id' | 'datos_personales_Id' | 'universidad'> &
	UniversidadExterna & { areasConocimiento?: readonly number[] };
export interface ProfesorExternoCreateResult extends FormattedUser {
	universityId: number;
	faculty: string;
}
export async function insertarProfesorExterno(data: ProfesorExternoCreateData): Promise<ProfesorExternoCreateResult> {
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

		return { ...formatUser({ ...professor, ...userData }), universityId, faculty: data.facultad };
	});
}

export type SocioComunitarioCreateData = UsuarioCreateData &
	DatosPersonalesExterno.CreateData &
	Omit<SocioComunitario.CreateData, 'id' | 'datos_personales_Id'>;
export interface SocioComunitarioCreateResult extends FormattedUser {
	sector: string;
	communityPartnerName: string;
	url: string;
	mission: string;
}
export async function insertarSocioComunitario(data: SocioComunitarioCreateData): Promise<SocioComunitarioCreateResult> {
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

		return {
			...formatUser({ ...user, ...userData }),
			sector: data.sector,
			communityPartnerName: data.nombre_socioComunitario,
			url: data.url,
			mission: data.mision
		};
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

export async function obtenerUsuarioSinRolPorEmail(email: string): Promise<GetUserResult | null> {
	return (
		(await getInternalUserByEmail(email)) ?? //
		(await getExternalUserByEmail(email))
	);
}

async function getInternalUserByEmail(email: string): Promise<GetInternalUserResult | null> {
	const entry = await qb(DatosPersonalesInterno.Name)
		.join(Usuario.Name, DatosPersonalesInterno.Key('id'), '=', Usuario.Key('id'))
		.where({ correo: email })
		.first();

	return isNullish(entry) ? null : getInternalUserByUserData(entry);
}

async function getInternalUserByUserData(data: DatosPersonalesInterno.Value & Usuario.Value): Promise<GetInternalUserResult | null> {
	const user =
		(await getInternalProfessorByPersonalUserDataId(data.id)) ??
		(await getInternalStudentByPersonalUserDataId(data.id)) ??
		(await getAdminByPersonalUserDataId(data.id)) ??
		(await getApSOfficeByPersonalUserDataId(data.id));
	if (isNullish(user)) return null;

	return { ...formatUser(data), ...user };
}

async function getInternalProfessorByPersonalUserDataId(id: number): Promise<GetPartialInternalProfessorResult | undefined> {
	return await qb(ProfesorInterno.Name)
		.select(
			ProfesorInterno.Key('id'),
			qb.ref(ProfesorInterno.Key('facultad')).as('facultyId'),
			qb.ref(Universidad.Key('id')).as('universityId'),
			qb.ref(Universidad.Key('nombre')).as('universityName'),
			qb.ref(Universidad.Key('provincia')).as('universityProvince'),
			qb.raw("'ProfesorInterno' as rol"),
			// Areas
			sharedGetKnowledgeAreasSubquery(ProfesorInterno.Key('id')),
			sharedGetLocalDegreesSubquery()
		)
		.join(Universidad.Name, ProfesorInterno.Key('universidad'), '=', Universidad.Key('id'))
		.where({ datos_personales_Id: id })
		.first();
}

async function getInternalStudentByPersonalUserDataId(id: number): Promise<GetPartialInternalStudentResult | undefined> {
	return await qb(EstudianteInterno.Name)
		.select(
			EstudianteInterno.Key('id'), //
			qb.ref(TitulacionLocal.Key('nombre')).as('localDegree'),
			qb.raw("'EstudianteInterno' as rol")
		)
		.join(TitulacionLocal.Name, TitulacionLocal.Key('id'), '=', EstudianteInterno.Key('titulacion_local'))
		.where({ datos_personales_Id: id })
		.first();
}

async function getAdminByPersonalUserDataId(id: number): Promise<GetPartialAdminResult | undefined> {
	return await qb(Admin.Name)
		.select(
			Admin.Key('id'), //
			qb.raw("'Admin' as rol")
		)
		.where({ datos_personales_Id: id })
		.first();
}

async function getApSOfficeByPersonalUserDataId(id: number): Promise<GetPartialApSOfficeResult | undefined> {
	return await qb(OficinaAps.Name)
		.select(
			OficinaAps.Key('id'), //
			qb.raw("'OficinaApS' as rol")
		)
		.where({ datos_personales_Id: id })
		.first();
}

async function getExternalUserByEmail(email: string): Promise<GetExternalUserResult | null> {
	const entry = await qb(DatosPersonalesExterno.Name)
		.join(Usuario.Name, DatosPersonalesExterno.Key('id'), '=', Usuario.Key('id'))
		.where({ correo: email })
		.first();

	return isNullish(entry) ? null : getExternalUserByUserData(entry);
}

async function getExternalUserByUserData(data: DatosPersonalesExterno.Value & Usuario.Value): Promise<GetExternalUserResult | null> {
	const user =
		(await getExternalProfessorByPersonalUserDataId(data.id)) ??
		(await getExternalStudentByPersonalUserDataId(data.id)) ??
		(await getCommunityPartnerByPersonalUserDataId(data.id));
	if (isNullish(user)) return null;

	return { ...formatUser(data), ...user };
}

async function getExternalProfessorByPersonalUserDataId(id: number): Promise<GetPartialExternalProfessorResult | undefined> {
	return await qb(ProfesorExterno.Name)
		.select(
			ProfesorExterno.Key('id'),
			qb.ref(ProfesorExterno.Key('facultad')).as('facultyId'),
			qb.ref(Universidad.Key('id')).as('universityId'),
			qb.ref(Universidad.Key('nombre')).as('universityName'),
			qb.ref(Universidad.Key('provincia')).as('universityProvince'),
			qb.raw("'ProfesorExterno' as rol"),
			sharedGetKnowledgeAreasSubquery(ProfesorExterno.Key('id'))
		)
		.join(Universidad.Name, ProfesorExterno.Key('universidad'), '=', Universidad.Key('id'))
		.where({ datos_personales_Id: id })
		.first();
}

async function getExternalStudentByPersonalUserDataId(id: number): Promise<GetPartialExternalStudentResult | undefined> {
	return await qb(EstudianteExterno.Name)
		.select(
			EstudianteExterno.Key('id'), //
			qb.ref(EstudianteExterno.Key('titulacion')).as('degree'),
			qb.ref(Universidad.Key('id')).as('universityId'),
			qb.ref(Universidad.Key('nombre')).as('universityName'),
			qb.ref(Universidad.Key('provincia')).as('universityProvince'),
			qb.raw("'EstudianteExterno' as rol")
		)
		.join(Universidad.Name, Universidad.Key('id'), '=', EstudianteExterno.Key('universidad'))
		.where({ datos_personales_Id: id })
		.first();
}

async function getCommunityPartnerByPersonalUserDataId(id: number): Promise<GetPartialCommunityPartnerResult | undefined> {
	return await qb(SocioComunitario.Name)
		.select(
			SocioComunitario.Key('id'), //
			qb.ref(SocioComunitario.Key('nombre_socioComunitario')).as('communityPartnerName'),
			qb.ref(SocioComunitario.Key('mision')).as('mission'),
			SocioComunitario.Key('sector'),
			SocioComunitario.Key('url'),
			qb.raw("'SocioComunitario' as rol")
		)
		.where({ datos_personales_Id: id })
		.first();
}

export async function obtenerUsuarioSinRolPorId(id: number): Promise<GetUserResult | null> {
	return (
		(await getInternalUserByUserDataId(id)) ?? //
		(await getExternalUserByUserDataId(id))
	);
}

async function getInternalUserByUserDataId(id: number): Promise<GetInternalUserResult | null> {
	const entry = await qb(DatosPersonalesInterno.Name)
		.join(Usuario.Name, DatosPersonalesInterno.Key('id'), '=', Usuario.Key('id'))
		.where({ id })
		.first();

	return isNullish(entry) ? null : getInternalUserByUserData(entry);
}

async function getExternalUserByUserDataId(id: number) {
	const entry = await qb(DatosPersonalesExterno.Name)
		.join(Usuario.Name, DatosPersonalesExterno.Key('id'), '=', Usuario.Key('id'))
		.where({ id })
		.first();

	return isNullish(entry) ? null : getExternalUserByUserData(entry);
}

export async function obtenerUniversidades(): Promise<Universidad.Value[]> {
	return await qb(Universidad.Name);
}

export async function obtenerAreasConocimientoUsuario(id: number): Promise<any[]> {
	try {
		const id_areas = await knex('areaconocimiento_profesor').where({ id_profesor: id }).select('id_area');

		const id_areas_array = id_areas.map((id_area) => id_area['id_area']);

		if (id_areas_array.length === 0) return [];

		const areas_conocim = await knex.select('nombre', 'id').from('area_conocimiento').whereIn('id', id_areas_array);

		const areas = areas_conocim.map((area) => ({ id: area['id'], nombre: area['nombre'] }));
		return areas; // Retorna las áreas de conocimiento asociadas
	} catch (err) {
		console.error('Se ha producido un error al intentar obtener las áreas de conocimiento del usuario', id, err);
		return []; // Retorno de array vacio o null?
	}
}

export async function obtenerAreasConocimiento(): Promise<AreaConocimiento.Value[]> {
	return await qb(AreaConocimiento.Name);
}

export async function obtenerAdmin(id: number): Promise<GetAdminResult | null> {
	const entry = await qb(Admin.Name)
		.join(Usuario.Name, Admin.Key('id'), '=', Usuario.Key('id'))
		.join(DatosPersonalesInterno.Name, Admin.Key('datos_personales_Id'), '=', DatosPersonalesInterno.Key('id'))
		.where({ id })
		.select('*')
		.first();
	if (isNullish(entry)) return null;

	return { ...formatUser(entry), rol: 'Admin' };
}

export async function obtenerOficinaAps(id: number): Promise<GetApSOfficeResult | null> {
	const entry = await qb(OficinaAps.Name)
		.join(DatosPersonalesInterno.Name, OficinaAps.Key('datos_personales_Id'), '=', DatosPersonalesInterno.Key('id'))
		.join(Usuario.Name, OficinaAps.Key('id'), '=', Usuario.Key('id'))
		.where({ id })
		.first();
	if (isNullish(entry)) return null;

	return { ...formatUser(entry), rol: 'OficinaAps' };
}

export async function obtenerSocioComunitario(id: number): Promise<GetCommunityPartnerResult | null> {
	const entry = await qb(SocioComunitario.Name)
		.join(DatosPersonalesExterno.Name, SocioComunitario.Key('datos_personales_Id'), '=', DatosPersonalesExterno.Key('id'))
		.join(Usuario.Name, SocioComunitario.Key('id'), '=', Usuario.Key('id'))
		.where({ id })
		.first();
	if (isNullish(entry)) return null;

	return {
		...formatUser(entry),
		communityPartnerName: entry.nombre_socioComunitario,
		mission: entry.mision,
		sector: entry.sector,
		url: entry.url,
		rol: 'SocioComunitario'
	};
}

export async function obtenerSociosComunitarios(): Promise<SocioComunitario[]> {
	try {
		const socios = await knex('socio_comunitario')
			.join('datos_personales_externo', 'socio_comunitario.datos_personales_Id', '=', 'datos_personales_externo.id')
			.select('socio_comunitario.id', 'datos_personales_externo.nombre', 'datos_personales_externo.apellidos');
		return socios;
	} catch (err) {
		console.error('Se ha producido un error al obtener todos los socios comunitarios:', err);
		return [];
	}
}

export async function obtenerProfesores(): Promise<Profesor[]> {
	try {
		const profesores = await knex('profesor_interno')
			.join('datos_personales_interno', 'profesor_interno.datos_personales_Id', '=', 'datos_personales_interno.id')
			.select('profesor_interno.id', 'datos_personales_interno.nombre', 'datos_personales_interno.apellidos');
		return profesores; // Retorna todos los profesores internos con sus nombres y apellidos
	} catch (err) {
		console.error('Se ha producido un error al obtener todos los profesores:', err);
		return []; // Retorno array vacio o null?
	}
}

export async function obtenerProfesorInterno(id: number): Promise<GetInternalProfessorResult | null> {
	const entry = await qb(ProfesorInterno.Name)
		.select(
			Usuario.Key('*'),
			DatosPersonalesInterno.Key('*'),
			qb.ref(ProfesorInterno.Key('facultad')).as('facultyId'),
			qb.ref(ProfesorInterno.Key('universidad')).as('universityId'),
			sharedGetKnowledgeAreasSubquery(ProfesorInterno.Key('id')),
			sharedGetLocalDegreesSubquery()
		)
		.join(DatosPersonalesInterno.Name, ProfesorInterno.Key('datos_personales_Id'), '=', DatosPersonalesInterno.Key('id'))
		.join(Usuario.Name, ProfesorInterno.Key('id'), '=', Usuario.Key('id'))
		.where({ id })
		.first();
	if (isNullish(entry)) return null;

	return {
		...formatUser(entry),
		facultyId: entry.facultyId,
		universityId: entry.universityId,
		knowledgeAreas: entry.knowledgeAreas,
		localDegrees: entry.localDegrees,
		rol: 'ProfesorInterno'
	};
}

export async function obtenerProfesorExterno(id: number): Promise<GetExternalProfessorResult | null> {
	const entry = await qb(ProfesorExterno.Name)
		.select(
			Usuario.Key('*'),
			DatosPersonalesExterno.Key('*'),
			qb.ref(ProfesorExterno.Key('facultad')).as('facultyId'),
			qb.ref(Universidad.Key('id')).as('universityId'),
			qb.ref(Universidad.Key('nombre')).as('universityName'),
			qb.ref(Universidad.Key('provincia')).as('universityProvince'),
			sharedGetKnowledgeAreasSubquery(ProfesorExterno.Key('id')),
			sharedGetLocalDegreesSubquery()
		)
		.join(DatosPersonalesExterno.Name, ProfesorExterno.Key('datos_personales_Id'), '=', DatosPersonalesExterno.Key('id'))
		.join(Usuario.Name, ProfesorExterno.Key('id'), '=', Usuario.Key('id'))
		.join(Universidad.Name, ProfesorExterno.Key('universidad'), '=', Universidad.Key('id'))
		.where({ id })
		.first();
	if (isNullish(entry)) return null;

	return {
		...formatUser(entry),
		facultyId: entry.facultyId,
		universityId: entry.universityId,
		universityName: entry.universityName,
		universityProvince: entry.universityProvince,
		knowledgeAreas: entry.knowledgeAreas,
		rol: 'ProfesorExterno'
	};
}

export async function obtenerEstudianteInterno(id: number): Promise<GetInternalStudentResult | null> {
	const entry = await qb(EstudianteInterno.Name)
		.join(DatosPersonalesInterno.Name, EstudianteInterno.Key('datos_personales_Id'), '=', DatosPersonalesInterno.Key('id'))
		.join(Usuario.Name, EstudianteInterno.Key('id'), '=', Usuario.Key('id'))
		.join(TitulacionLocal.Name, EstudianteInterno.Key('titulacion_local'), '=', TitulacionLocal.Key('id'))
		.where({ id })
		.first();
	if (isNullish(entry)) return null;

	return { ...formatUser(entry), localDegree: entry.nombre, rol: 'EstudianteInterno' };
}

export async function obtenerEstudianteExterno(id: number): Promise<GetExternalStudentResult | null> {
	const entry = await qb(EstudianteExterno.Name)
		.select(
			Usuario.Key('*'),
			DatosPersonalesExterno.Key('*'),
			qb.ref(EstudianteExterno.Key('titulacion')).as('degree'),
			qb.ref(Universidad.Key('id')).as('universityId'),
			qb.ref(Universidad.Key('nombre')).as('universityName'),
			qb.ref(Universidad.Key('provincia')).as('universityProvince')
		)
		.join(DatosPersonalesInterno.Name, EstudianteExterno.Key('datos_personales_Id'), '=', DatosPersonalesInterno.Key('id'))
		.join(Usuario.Name, EstudianteExterno.Key('id'), '=', Usuario.Key('id'))
		.join(Universidad.Name, EstudianteExterno.Key('universidad'), '=', Universidad.Key('id'))
		.where({ id })
		.first();
	if (isNullish(entry)) return null;

	return {
		...formatUser(entry),
		degree: entry.degree,
		universityId: entry.universityId,
		universityName: entry.universityName,
		universityProvince: entry.universityProvince,
		rol: 'EstudianteExterno'
	};
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
async function sharedUpdateUserData(userId: number, userDataId: number, data: UpdateUserData, trx: Knex.Transaction): Promise<FormattedUser> {
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

	return formatUser({ ...user, ...userData });
}

export interface UpdateAdminData extends UpdateUserData {}
export function actualizarAdmin(id: number, data: UpdateAdminData): Promise<FormattedUser> {
	return qb.transaction(async (trx) => {
		const entry = ensureDatabaseEntry(
			await trx(Admin.Name).where({ id }).first(),
			'No se ha encontrado un administrador con el ID proporcionado'
		);

		return await sharedUpdateUserData(id, entry.datos_personales_Id, data, trx);
	});
}

export interface UpdateApSOfficeData extends UpdateUserData {}
export async function actualizarOficinaAPS(id: number, data: UpdateApSOfficeData): Promise<FormattedUser> {
	return qb.transaction(async (trx) => {
		const entry = ensureDatabaseEntry(
			await trx(OficinaAps.Name).where({ id }).first(),
			'No se ha encontrado una oficina ApS con el ID proporcionado'
		);

		return await sharedUpdateUserData(id, entry.datos_personales_Id, data, trx);
	});
}

export interface UpdateCommunityPartnerData extends UpdateUserData, Partial<Omit<SocioComunitario.Value, 'id'>> {}
export interface UpdateCommunityPartnerResult extends FormattedUser {
	communityPartnerName: SocioComunitario.Value['nombre_socioComunitario'];
	mission: SocioComunitario.Value['mision'];
	sector: SocioComunitario.Value['sector'];
	url: SocioComunitario.Value['url'];
}
export async function actualizarSocioComunitario(id: number, data: UpdateCommunityPartnerData): Promise<UpdateCommunityPartnerResult> {
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

		const user = await sharedUpdateUserData(id, entry.datos_personales_Id, data, trx);
		return { ...user, communityPartnerName: entry.nombre_socioComunitario, mission: entry.mision, sector: entry.sector, url: entry.url };
	});
}

export interface UpdateStudentData extends UpdateUserData {}
async function sharedUpdateStudent(id: number, userDataId: number, data: UpdateStudentData, trx: Knex.Transaction): Promise<FormattedUser> {
	if (!(await sharedHasTableEntry(Estudiante.Name, id, trx))) {
		throw createNotFoundError('No se ha encontrado un estudiante con el ID proporcionado');
	}

	return await sharedUpdateUserData(id, userDataId, data, trx);
}

export interface UpdateInternalStudentData extends UpdateStudentData, Partial<Omit<EstudianteInterno.Value, 'id'>> {}
export interface UpdateInternalStudentResult extends FormattedUser {
	localDegree: EstudianteInterno.Value['titulacion_local'];
}
export async function actualizarEstudianteInterno(id: number, data: UpdateInternalStudentData): Promise<UpdateInternalStudentResult> {
	return qb.transaction(async (trx) => {
		const entry = getFirstDatabaseEntry(
			await trx(EstudianteInterno.Name) //
				.where({ id })
				.update({ titulacion_local: data.titulacion_local })
				.returning('*'),
			'No se ha encontrado un estudiante interno con el ID proporcionado'
		);

		const user = await sharedUpdateStudent(id, entry.datos_personales_Id, data, trx);
		return { ...user, localDegree: entry.titulacion_local };
	});
}

export interface UpdateExternalStudentData extends UpdateStudentData, Partial<Omit<EstudianteExterno.Value, 'id'>> {}
export interface UpdateExternalStudentResult extends FormattedUser {
	degree: EstudianteExterno.Value['titulacion'];
	universityId: EstudianteExterno.Value['universidad'];
}
export async function actualizarEstudianteExterno(id: number, data: UpdateExternalStudentData): Promise<UpdateExternalStudentResult> {
	return qb.transaction(async (trx) => {
		const entry = getFirstDatabaseEntry(
			await trx(EstudianteExterno.Name) //
				.where({ id })
				.update({ titulacion: data.titulacion, universidad: data.universidad })
				.returning('*'),
			'No se ha encontrado un estudiante externo con el ID proporcionado'
		);

		const user = await sharedUpdateStudent(id, entry.datos_personales_Id, data, trx);
		return { ...user, degree: entry.titulacion, universityId: entry.universidad };
	});
}

export interface UpdateProfessorData extends UpdateUserData {}
async function sharedUpdateProfessor(id: number, userDataId: number, data: UpdateProfessorData, trx: Knex.Transaction): Promise<FormattedUser> {
	if (!(await sharedHasTableEntry(Estudiante.Name, id, trx))) {
		throw createNotFoundError('No se ha encontrado un profesor con el ID proporcionado');
	}

	return await sharedUpdateUserData(id, userDataId, data, trx);
}

export interface UpdateInternalProfessorData extends UpdateProfessorData, Partial<Omit<ProfesorInterno.Value, 'id'>> {
	knowledgeAreas?: readonly number[];
	localDegrees?: readonly number[];
}
export interface UpdateInternalProfessorResult extends FormattedUser {
	universityId: ProfesorInterno.Value['universidad'];
	facultyId: ProfesorInterno.Value['facultad'];
}
export async function actualizarProfesorInterno(id: number, data: UpdateInternalProfessorData): Promise<UpdateInternalProfessorResult> {
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

		const user = await sharedUpdateProfessor(id, entry.datos_personales_Id, data, trx);
		return { ...user, universityId: entry.universidad, facultyId: entry.facultad };
	});
}

export interface UpdateExternalProfessorData extends UpdateProfessorData, Partial<Omit<ProfesorExterno.Value, 'id'>> {}
export interface UpdateExternalProfessorResult extends FormattedUser {
	universityId: ProfesorExterno.Value['universidad'];
	facultyId: ProfesorExterno.Value['facultad'];
}
export async function actualizarProfesorExterno(id: number, data: UpdateExternalProfessorData): Promise<UpdateExternalProfessorResult> {
	return qb.transaction(async (trx) => {
		const entry = getFirstDatabaseEntry(
			await trx(ProfesorExterno.Name) //
				.where({ id })
				.update({ universidad: data.universidad, facultad: data.facultad })
				.returning('*'),
			'No se ha encontrado un profesor externo con el ID proporcionado'
		);

		const user = await sharedUpdateProfessor(id, entry.datos_personales_Id, data, trx);
		return { ...user, universityId: entry.universidad, facultyId: entry.facultad };
	});
}

function sharedGetKnowledgeAreasSubquery(
	key: `${typeof ProfesorInterno.Name}.${keyof ProfesorInterno.Value}` | `${typeof ProfesorExterno.Name}.${keyof ProfesorExterno.Value}`
) {
	return qb(AreaConocimiento_Profesor.Name)
		.select(qb.raw(`JSON_ARRAYAGG(${AreaConocimiento.Key('nombre')})`))
		.join(AreaConocimiento.Name, AreaConocimiento_Profesor.Key('id_area'), '=', AreaConocimiento.Key('id'))
		.where(AreaConocimiento_Profesor.Key('id_profesor'), '=', key)
		.as('knowledgeAreas');
}

function sharedGetLocalDegreesSubquery() {
	return qb(TitulacionLocal_Profesor.Name)
		.select(qb.raw(`JSON_ARRAYAGG(${TitulacionLocal.Key('nombre')})`))
		.join(TitulacionLocal.Name, TitulacionLocal.Key('id'), '=', TitulacionLocal_Profesor.Key('id_titulacion'))
		.where(TitulacionLocal_Profesor.Key('id_profesor'), '=', ProfesorInterno.Key('id'))
		.as('localDegrees');
}

export interface FormattedUser extends ReturnType<typeof formatUser> {}
function formatUser(datos: Usuario.Value & (DatosPersonalesInterno.Value | DatosPersonalesExterno.Value)) {
	return {
		id: datos.id,
		origin: { login: datos.origin_login, image: datos.origin_img },
		createdAt: datos.createdAt,
		updatedAt: datos.updatedAt,
		acceptedTerms: datos.terminos_aceptados,
		firstName: datos.nombre,
		lastName: datos.apellidos,
		email: datos.correo,
		phone: datos.telefono
	};
}

export interface GetPartialInternalProfessorResult {
	id: ProfesorInterno.Value['id'];
	facultyId: ProfesorInterno.Value['facultad'];
	universityId: ProfesorInterno.Value['universidad'];
	knowledgeAreas: readonly string[];
	localDegrees: readonly string[];
	rol: 'ProfesorInterno';
}

export interface GetPartialInternalStudentResult {
	id: EstudianteInterno.Value['id'];
	localDegree: TitulacionLocal.Value['nombre'];
	rol: 'EstudianteInterno';
}

export interface GetPartialAdminResult {
	id: Admin.Value['id'];
	rol: 'Admin';
}

export interface GetPartialApSOfficeResult {
	id: OficinaAps.Value['id'];
	rol: 'OficinaAps';
}

export interface GetInternalProfessorResult extends GetPartialInternalProfessorResult, FormattedUser {}
export interface GetInternalStudentResult extends GetPartialInternalStudentResult, FormattedUser {}
export interface GetAdminResult extends GetPartialAdminResult, FormattedUser {}
export interface GetApSOfficeResult extends GetPartialApSOfficeResult, FormattedUser {}

export interface GetPartialExternalProfessorResult {
	id: ProfesorExterno.Value['id'];
	facultyId: ProfesorExterno.Value['facultad'];
	universityId: Universidad.Value['id'];
	universityName: Universidad.Value['nombre'];
	universityProvince: Universidad.Value['provincia'];
	knowledgeAreas: string[];
	rol: 'ProfesorExterno';
}

export interface GetPartialExternalStudentResult {
	id: EstudianteExterno.Value['id'];
	degree: EstudianteExterno.Value['titulacion'];
	universityId: Universidad.Value['id'];
	universityName: Universidad.Value['nombre'];
	universityProvince: Universidad.Value['provincia'];
	rol: 'EstudianteExterno';
}

export interface GetPartialCommunityPartnerResult {
	id: SocioComunitario.Value['id'];
	communityPartnerName: SocioComunitario.Value['nombre_socioComunitario'];
	mission: SocioComunitario.Value['mision'];
	sector: SocioComunitario.Value['sector'];
	url: SocioComunitario.Value['url'];
	rol: 'SocioComunitario';
}

export interface GetExternalProfessorResult extends GetPartialExternalProfessorResult, FormattedUser {}
export interface GetExternalStudentResult extends GetPartialExternalStudentResult, FormattedUser {}
export interface GetCommunityPartnerResult extends GetPartialCommunityPartnerResult, FormattedUser {}

export type GetUserResult = GetInternalUserResult | GetExternalUserResult;
export type GetInternalUserResult = GetInternalProfessorResult | GetInternalStudentResult | GetAdminResult | GetApSOfficeResult;
export type GetExternalUserResult = GetExternalProfessorResult | GetExternalStudentResult | GetCommunityPartnerResult;
