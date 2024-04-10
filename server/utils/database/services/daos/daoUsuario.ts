import { isNullishOrEmpty } from '@sapphire/utilities';
import knex from '../../config';
import { Admin } from '../types/Admin';
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
import type { TitulacionLocal } from '../types/TitulacionLocal';
import { TitulacionLocal_Profesor } from '../types/TitulacionLocal_Profesor';
import { Universidad } from '../types/Universidad';
import { Usuario } from '../types/Usuario';
import { sharedDeleteEntryTable } from './daoUtils';

async function sharedInsertaDatosPersonalesInterno(data: DatosPersonalesInterno.CreateData) {
	const [datos] = await knex(DatosPersonalesInterno.Name)
		.insert({ correo: data.correo, password: data.password, apellidos: data.apellidos, nombre: data.nombre, telefono: data.telefono })
		.returning('*');
	return datos;
}

async function sharedInsertaDatosPersonalesExterno(data: DatosPersonalesExterno.CreateData) {
	const [datos] = await knex(DatosPersonalesExterno.Name)
		.insert({ correo: data.correo, password: data.password, apellidos: data.apellidos, nombre: data.nombre, telefono: data.telefono })
		.returning('*');
	return datos;
}

export type UniversidadExterna = { universidad: string };
export async function sharedEnsureUniversidadId(data: UniversidadExterna): Promise<number> {
	const entries = await knex(Universidad.Name).select('id').where('nombre', 'like', `%${data.universidad}%`);
	if (isNullishOrEmpty(entries)) {
		throw createNotFoundError('No se encontró la universidad con el nombre proporcionado');
	}

	return entries[0].id;
}

export type UsuarioCreateData = Usuario.CreateData;
export type UsuarioCreateResult = Usuario.Value;
export async function insertarUsuario(data: UsuarioCreateData): Promise<UsuarioCreateResult> {
	const [entry] = await knex(Usuario.Name)
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
export type AdminCreateResult = Usuario.Value & DatosPersonalesInterno.Value;
export async function insertarAdmin(data: AdminCreateData): Promise<AdminCreateResult> {
	const usuario = await insertarUsuario(data);
	const datos = await sharedInsertaDatosPersonalesInterno(data);
	await knex(Admin.Name) //
		.insert({ id: usuario.id, datos_personales_Id: datos.id });

	return { ...datos, ...usuario };
}

export type OficinaApsCreateData = UsuarioCreateData & DatosPersonalesInterno.CreateData & OficinaAps.CreateData;
export type OficinaApsCreateResult = Usuario.Value & DatosPersonalesInterno.Value;
export async function insertarOficinaAps(data: OficinaApsCreateData): Promise<OficinaApsCreateResult> {
	const usuario = await insertarUsuario(data);
	const datos = await sharedInsertaDatosPersonalesInterno(data);
	await knex(OficinaAps.Name).insert({ id: usuario.id, datos_personales_Id: datos.id });

	return { ...datos, ...usuario };
}

export type EstudianteCreateData = UsuarioCreateData;
export type EstudianteCreateResult = Usuario.Value & Estudiante.Value;
export async function insertarEstudiante(data: EstudianteCreateData): Promise<EstudianteCreateResult> {
	const usuario = await insertarUsuario(data); // Cambiar a un solo número
	await knex(Estudiante.Name).insert({ id: usuario.id });

	return usuario;
}

export type EstudianteInternoCreateData = EstudianteCreateData & DatosPersonalesInterno.CreateData & EstudianteInterno.CreateData;
export type EstudianteInternoCreateResult = EstudianteCreateResult & DatosPersonalesInterno.Value & Pick<EstudianteInterno.Value, 'titulacion_local'>;
export async function insertarEstudianteInterno(data: EstudianteInternoCreateData): Promise<EstudianteInternoCreateResult> {
	const estudiante = await insertarEstudiante(data);
	const datos = await sharedInsertaDatosPersonalesInterno(data);
	await knex(EstudianteInterno.Name).insert({
		id: estudiante.id,
		titulacion_local: data.titulacion_local,
		datos_personales_Id: datos.id
	});

	return { ...datos, ...estudiante, titulacion_local: data.titulacion_local };
}

export type EstudianteExternoCreateData = EstudianteCreateData &
	DatosPersonalesExterno.CreateData &
	Omit<EstudianteExterno.CreateData, 'id' | 'datos_personales_Id' | 'universidad'> &
	UniversidadExterna;
export type EstudianteExternoCreateResult = EstudianteCreateResult &
	DatosPersonalesExterno.Value &
	Pick<EstudianteExterno.Value, 'universidad' | 'titulacion'>;
export async function insertarEstudianteExterno(data: EstudianteExternoCreateData): Promise<EstudianteExternoCreateResult> {
	const universidadId = await sharedEnsureUniversidadId(data);
	const estudiante = await insertarEstudiante(data);
	const datos = await sharedInsertaDatosPersonalesExterno(data);
	await knex(EstudianteExterno.Name).insert({
		id: estudiante.id,
		universidad: universidadId,
		titulacion: data.titulacion,
		datos_personales_Id: datos.id
	});

	return { ...datos, ...estudiante, universidad: universidadId, titulacion: data.titulacion };
}

export type ProfesorCreateData = UsuarioCreateData & Omit<Profesor.CreateData, 'id'>;
export type ProfesorCreateResult = Usuario.Value & Profesor.Value;
export async function insertarProfesor(data: ProfesorCreateData): Promise<ProfesorCreateResult> {
	const usuario = await insertarUsuario(data);
	await knex(Profesor.Name).insert({ id: usuario.id });

	return usuario;
}

export type ProfesorInternoCreateData = ProfesorCreateData &
	DatosPersonalesInterno.CreateData &
	ProfesorInterno.CreateData & { titulacionesLocales?: readonly number[]; areasConocimiento?: readonly number[] };
export type ProfesorInternoCreateResult = ProfesorCreateResult & DatosPersonalesInterno.Value;
export async function insertarProfesorInterno(data: ProfesorInternoCreateData): Promise<ProfesorInternoCreateResult> {
	const profesor = await insertarProfesor(data);
	const datos = await sharedInsertaDatosPersonalesInterno(data);
	await knex(ProfesorInterno.Name).insert({ id: profesor.id, datos_personales_Id: datos.id });

	if (!isNullishOrEmpty(data.titulacionesLocales)) {
		await knex(TitulacionLocal_Profesor.Name).insert(
			data.titulacionesLocales.map((field) => ({
				id_titulacion: field,
				id_profesor: profesor.id
			}))
		);
	}

	if (!isNullishOrEmpty(data.areasConocimiento)) {
		await knex(AreaConocimiento_Profesor.Name).insert(
			data.areasConocimiento.map((field) => ({
				id_area: field,
				id_profesor: profesor.id
			}))
		);
	}

	return { ...datos, ...profesor };
}

export type ProfesorExternoCreateData = ProfesorCreateData &
	DatosPersonalesExterno.CreateData &
	Omit<ProfesorExterno.CreateData, 'id' | 'datos_personales_Id' | 'universidad'> &
	UniversidadExterna & { areasConocimiento?: readonly number[] };
export type ProfesorExternoCreateResult = ProfesorCreateResult &
	DatosPersonalesExterno.Value &
	Pick<ProfesorExterno.Value, 'universidad' | 'facultad'>;
export async function insertarProfesorExterno(data: ProfesorExternoCreateData) {
	const universidadId = await sharedEnsureUniversidadId(data);
	const profesor = await insertarProfesor(data);
	const datos = await sharedInsertaDatosPersonalesExterno(data);

	await knex(ProfesorExterno.Name).insert({
		id: profesor.id,
		universidad: universidadId,
		facultad: data.facultad,
		datos_personales_Id: datos.id
	});

	if (!isNullishOrEmpty(data.areasConocimiento)) {
		await knex(AreaConocimiento_Profesor.Name).insert(
			data.areasConocimiento.map((field) => ({
				id_area: field,
				id_profesor: profesor.id
			}))
		);
	}

	return { ...datos, ...profesor, universidad: universidadId, facultad: data.facultad };
}

export type SocioComunitarioCreateData = UsuarioCreateData &
	DatosPersonalesExterno.CreateData &
	Omit<SocioComunitario.CreateData, 'id' | 'datos_personales_Id'>;
export type SocioComunitarioCreateResult = Usuario.Value & DatosPersonalesExterno.Value & Omit<SocioComunitario.Value, 'datos_personales_Id'>;
export async function insertarSocioComunitario(data: SocioComunitarioCreateData): Promise<SocioComunitarioCreateResult> {
	const usuario = await insertarUsuario(data);
	const datos = await sharedInsertaDatosPersonalesExterno(data);

	await knex(SocioComunitario.Name).insert({
		id: usuario.id,
		sector: data.sector,
		nombre_socioComunitario: data.nombre_socioComunitario,
		url: data.url,
		mision: data.mision,
		datos_personales_Id: datos.id
	});

	return { ...datos, ...usuario, sector: data.sector, nombre_socioComunitario: data.nombre_socioComunitario, url: data.url, mision: data.mision };
}

export function borrarDatosPersonalesInternos(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(DatosPersonalesInterno.Name, id);
}

export function borrarDatosPersonalesExternos(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(DatosPersonalesExterno.Name, id);
}

export function borrarUsuario(id: number): Promise<boolean> {
	return sharedDeleteEntryTable(Usuario.Name, id);
}

export async function borrarEstudianteInterno(id: number): Promise<number> {
	try {
		const res = await obtenerEstudianteInterno(id);
		if (!res) return -1;
		const correoU = res.correo;

		const usuarioResult = await borrarUsuario(id);
		if (usuarioResult === -1) return -1;

		const result = await knex('datos_personales_interno').where({ correo: correoU }).del();
		return result > 0 ? id : -1;
	} catch (err) {
		console.error('Error al borrar estudiante interno:', err);
		return -1;
	}
}

export async function borrarEstudianteExterno(id: number): Promise<number> {
	try {
		const res = await obtenerEstudianteExterno(id);
		if (!res) return -1;

		const usuarioResult = await borrarUsuario(id);
		if (usuarioResult === -1) return -1;

		const result = await knex('datos_personales_externo').where({ correo: res.correo }).del();
		return result > 0 ? id : -1;
	} catch (err) {
		console.error('Error al borrar estudiante externo:', err);
		return -1;
	}
}

export async function borrarProfesorExterno(id: number): Promise<number> {
	try {
		const res = await obtenerProfesorExterno(id);
		if (!res) return -1;

		const usuarioResult = await borrarUsuario(id);
		if (usuarioResult === -1) return -1;

		const result = await knex('datos_personales_externo').where({ correo: res.correo }).del();
		return result > 0 ? id : -1;
	} catch (err) {
		console.error('Error al borrar profesor externo:', err);
		return -1;
	}
}

export async function borrarProfesorInterno(id: number): Promise<number> {
	try {
		const res = await obtenerProfesorInterno(id);
		if (!res) return -1;

		const usuarioResult = await borrarUsuario(id);
		if (usuarioResult === -1) return -1;

		const result = await knex('datos_personales_interno').where({ correo: res.correo }).del();
		return result > 0 ? id : -1;
	} catch (err) {
		console.error('Error al borrar profesor interno:', err);
		return -1;
	}
}

export async function borrarAdmin(id: number): Promise<number> {
	try {
		const res = await obtenerAdmin(id);
		if (!res) return -1;

		const usuarioResult = await borrarUsuario(id);
		if (usuarioResult === -1) return -1;

		const result = await knex('datos_personales_interno').where({ correo: res.correo }).del();
		return result > 0 ? id : -1;
	} catch (err) {
		console.error('Error al borrar admin:', err);
		return -1;
	}
}

export async function borrarOficinaAPS(id: number): Promise<number> {
	try {
		const res = await obtenerOficinaAps(id);
		if (!res) return -1;

		const usuarioResult = await borrarUsuario(id);
		if (usuarioResult === -1) return -1;

		const result = await knex('datos_personales_interno').where({ correo: res.correo }).del();
		return result > 0 ? id : -1;
	} catch (err) {
		console.error('Error al borrar Oficina APS:', err);
		return -1;
	}
}

export async function borrarSocioComunitario(id: number): Promise<number> {
	try {
		const res = await obtenerSocioComunitario(id);
		if (!res) return -1;

		const usuarioResult = await borrarUsuario(id);
		if (usuarioResult === -1) return -1;

		const result = await knex('datos_personales_externo').where({ correo: res.correo }).del();
		return result > 0 ? id : -1;
	} catch (err) {
		console.error('Error al borrar socio comunitario:', err);
		return -1;
	}
}

//LECTURA

export async function obtenerUsuarioSinRolPorEmail(email: string): Promise<any | null> {
	try {
		// Buscar en datos personales internos primero
		let idInternos = await knex('datos_personales_interno').where({ correo: email }).select('id');

		if (idInternos.length > 0) {
			const idInterno = idInternos[0].id;
			// Intentar obtener los diferentes roles internos
			const resultadoInterno = await obtenerRolInterno(idInterno);
			return resultadoInterno;
		}

		// Si no se encuentra en internos, buscar en externos
		let idExternos = await knex('datos_personales_externo').where({ correo: email }).select('id');

		if (idExternos.length > 0) {
			const idExterno = idExternos[0].id;
			// Intentar obtener los diferentes roles externos
			const resultadoExterno = await obtenerRolExterno(idExterno);
			return resultadoExterno;
		}

		// Si no se encuentra en ninguno de los dos
		console.log('No existe ningún usuario con ese correo');
		return null;
	} catch (err) {
		console.error('Se ha producido un error al intentar obtener de la base de datos el usuario con email', email, err);
		return null;
	}
}

export async function obtenerRolInterno(idInterno: number): Promise<Usuario> {
	try {
		let profeInterno = await obtenerProfesorInternoPorDatosPersonales(idInterno);
		if (profeInterno !== null) return profeInterno;

		let estudianteInterno = await obtenerEstudianteInternoPorDatosPersonales(idInterno);
		if (estudianteInterno !== null) return estudianteInterno;

		let admin = await obtenerAdminPorDatosPersonales(idInterno);
		if (admin !== null) return admin;

		let Aps = await obtenerOficinaApsPorDatosPersonales(idInterno);
		if (Aps !== null) return Aps;

		// No se encontró ningún rol interno asociado
		return null;
	} catch (err) {
		console.error('Error al obtener rol interno por ID', idInterno, err);
		return null;
	}
}

export async function obtenerRolExterno(idExterno: number): Promise<Usuario> {
	try {
		let socio = await obtenerSocioComunitarioPorDatosPersonales(idExterno);
		if (socio !== null) return socio;

		let profeExterno = await obtenerProfesorExternoPorDatosPersonales(idExterno);
		if (profeExterno !== null) return profeExterno;

		let estudianteExterno = await obtenerEstudianteExternoPorDatosPersonales(idExterno);
		if (estudianteExterno !== null) return estudianteExterno;

		// No se encontró ningún rol externo asociado
		return null;
	} catch (err) {
		console.error('Error al obtener rol externo por ID', idExterno, err);
		return null;
	}
}

export async function obtenerUsuarioSinRolPorId(id: number): Promise<any> {
	try {
		// Buscar en datos personales internos primero
		let idInternos = await knex('datos_personales_interno').where({ id }).select('id');

		// Verificar si se encontró un usuario interno
		if (idInternos.length > 0) {
			const idInterno = idInternos[0].id;
			// Intentar obtener los diferentes roles internos
			const resultadoInterno = await obtenerRolInterno(idInterno);
			if (resultadoInterno !== null) {
				return resultadoInterno;
			}
		}

		// Si no se encuentra en internos, buscar en externos
		let idExternos = await knex('datos_personales_externo').where({ id }).select('id');

		// Verificar si se encontró un usuario externo
		if (idExternos.length > 0) {
			const idExterno = idExternos[0].id;
			// Intentar obtener los diferentes roles externos
			const resultadoExterno = await obtenerRolExterno(idExterno);
			if (resultadoExterno !== null) {
				return resultadoExterno;
			}
		}

		// Si no se encuentra en ninguno de los dos
		console.log('No existe ningún usuario con el ID', id);
		return null;
	} catch (err) {
		console.error('Se ha producido un error al intentar obtener de la base de datos el usuario con ID', id, err);
		return null;
	}
}

async function obtenerUsuario(id: number): Promise<Usuario | null> {
	try {
		const response = await knex('usuario').where({ id }).select('*');
		return response[0] || null; // Retorna el usuario encontrado o null si no existe
	} catch (err) {
		console.error('Se ha producido un error al intentar obtener el usuario con id', id, err);
		return null; // Retorna null en caso de error
	}
}

export async function obtenerUniversidades(): Promise<any[]> {
	try {
		const response = await knex('universidad').select('id', 'nombre');
		return response; // Retorna todas las universidades
	} catch (err) {
		console.error('Se ha producido un error al intentar obtener las universidades', err);
		return []; // Retorno de array vacio o null?
	}
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

export async function obtenerAreasConocimiento(): Promise<any[]> {
	try {
		const response = await knex('area_conocimiento').select('id', 'nombre');
		return response;
	} catch (err) {
		console.error('Se ha producido un error al obtener las áreas de conocimiento:', err);
		return [];
	}
}

export async function obtenerDatosPersonalesInterno(id: number): Promise<any> {
	try {
		const response = await knex('datos_personales_interno').where({ id }).select('*');
		return response[0];
	} catch (err) {
		console.error('Se ha producido un error al obtener datos personales internos:', err);
		return null;
	}
}

export async function obtenerDatosPersonalesExterno(id: number): Promise<any> {
	try {
		const response = await knex('datos_personales_externo').where({ id }).select('*');
		return response[0] || null;
	} catch (err) {
		console.error('Se ha producido un error al obtener datos personales externos:', err);
		return null;
	}
}

export async function obtenerAdmin(id: number) {
	// TODO: Ignore `datos_personales_Id` from select
	const [entry] = await knex(Admin.Name)
		.join(Usuario.Name, Admin.Key('id'), '=', Usuario.Key('id'))
		.join(DatosPersonalesInterno.Name, Admin.Key('datos_personales_Id'), '=', DatosPersonalesInterno.Key('id'))
		.where({ id })
		.select('*');

	return entry;
	// try {
	// 	const admin = await knex('admin').where({ id }).select('*');
	// 	if (admin.length === 0) return null;

	// 	const usuario = await obtenerUsuario(id);
	// 	const datos = await obtenerDatosPersonalesInterno(admin[0]['datos_personales_Id']);

	// 	const Tadmin: Admin = {
	// 		id: usuario.id,
	// 		correo: datos.correo,
	// 		nombre: datos.nombre,
	// 		apellidos: datos.apellidos,
	// 		password: datos.password,
	// 		origin_login: usuario.origin_login,
	// 		origin_img: usuario.origin_img,
	// 		createdAt: usuario.createdAt,
	// 		updatedAt: usuario.updatedAt,
	// 		terminos_aceptados: usuario.terminos_aceptados,
	// 		telefono: datos.telefono,
	// 		rol: 'admin'
	// 	};
	// 	return Tadmin;
	// } catch (err) {
	// 	console.error('Se ha producido un error al obtener admin:', err);
	// 	return null;
	// }
}

export async function obtenerAdminPorDatosPersonales(id: number): Promise<Admin> {
	try {
		const admin = await knex('admin').where({ datos_personales_Id: id }).select('*');
		if (admin.length === 0) return null;

		const usuario = await obtenerUsuario(admin[0].id);
		const datos = await obtenerDatosPersonalesInterno(admin[0]['datos_personales_Id']);

		const Tadmin: Admin = {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			telefono: datos.telefono,
			rol: 'admin'
		};
		return Tadmin;
	} catch (err) {
		console.error('Se ha producido un error al obtener admin por datos personales:', err);
		return null;
	}
}

export async function obtenerOficinaAps(id: number): Promise<OficinaAps> {
	try {
		const admin = await knex('oficinaaps').where({ id }).select('*');
		if (admin.length === 0) return null;

		const usuario = await obtenerUsuario(id);
		const datos = await obtenerDatosPersonalesInterno(admin[0]['datos_personales_Id']);

		const oficinaAps: OficinaAps = {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			telefono: datos.telefono,
			rol: 'OficinaAps'
		};
		return oficinaAps;
	} catch (err) {
		console.error('Se ha producido un error al obtener Oficina APS:', err);
		return null;
	}
}

export async function obtenerOficinaApsPorDatosPersonales(id: number): Promise<OficinaAps> {
	try {
		const admin = await knex('oficinaaps').where({ datos_personales_Id: id }).select('*');
		if (admin.length === 0) return null;

		const usuario = await obtenerUsuario(admin[0].id);
		const datos = await obtenerDatosPersonalesInterno(admin[0]['datos_personales_Id']);

		const Tadmin: Admin = {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			telefono: datos.telefono,
			rol: 'admin'
		};
		return Tadmin;
	} catch (err) {
		console.error('Se ha producido un error al obtener Oficina APS por datos personales:', err);
		return null;
	}
}

export async function obtenerSocioComunitario(id: number): Promise<SocioComunitario> {
	try {
		const socio = await knex('socio_comunitario').where({ id }).select('*');
		if (socio.length === 0) return null;

		const usuario = await obtenerUsuario(id);
		const datos = await obtenerDatosPersonalesExterno(socio[0]['datos_personales_Id']);

		const tSocio: SocioComunitario = {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			sector: socio[0].sector,
			nombre_socioComunitario: socio[0].nombre_socioComunitario,
			telefono: datos.telefono,
			url: socio[0].url,
			mision: socio[0].mision,
			rol: 'SocioComunitario'
		};
		return tSocio;
	} catch (err) {
		console.error('Se ha producido un error al obtener socio comunitario:', err);
		return null;
	}
}

export async function obtenerSocioComunitarioPorDatosPersonales(id: number): Promise<SocioComunitario> {
	try {
		const socio = await knex('socio_comunitario').where({ datos_personales_Id: id }).select('*');
		if (socio.length === 0) return null;

		const usuario = await obtenerUsuario(socio[0].id);
		const datos = await obtenerDatosPersonalesExterno(socio[0]['datos_personales_Id']);

		const tSocio: SocioComunitario = {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			sector: socio[0].sector,
			nombre_socioComunitario: socio[0].nombre_socioComunitario,
			telefono: datos.telefono,
			url: socio[0].url,
			mision: socio[0].mision,
			rol: 'SocioComunitario'
		};
		return tSocio;
	} catch (err) {
		console.error('Se ha producido un error al obtener socio comunitario por datos personales:', err);
		return null;
	}
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

export async function obtenerProfesor(id: number): Promise<Profesor> {
	try {
		const profesor = await knex('profesor').where({ id }).select('*');
		return profesor[0] || null; // Retorna el profesor encontrado o null si no existe
	} catch (err) {
		console.error('Se ha producido un error al obtener el profesor:', err);
		return null; // Retorna null en caso de error
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

export async function obtenerProfesorInterno(id: number): Promise<ProfesorInterno> {
	try {
		const profesorInterno = await knex('profesor_interno').where({ id }).select('*');
		if (profesorInterno.length === 0) return null;

		const usuario = await obtenerUsuario(id);
		const datos = await obtenerDatosPersonalesInterno(profesorInterno[0]['datos_personales_Id']);
		const areas = await obtenerAreasConocimientoDelProfesor(id);
		const titulaciones = await obtenerTitulacionesDelProfesor(id);

		const ProfesorInterno: ProfesorInterno = {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			area_conocimiento: areas,
			titulacion_local: titulaciones,
			telefono: datos.telefono,
			rol: 'ProfesorInterno'
		};
		return ProfesorInterno;
	} catch (err) {
		console.error('Se ha producido un error al obtener el profesor interno:', err);
		return null;
	}
}

export async function obtenerProfesorInternoPorDatosPersonales(datosPersonalesId: number): Promise<ProfesorInterno> {
	try {
		// Encontrar el profesor interno por su ID de datos personales
		const profesorInterno = await knex('profesor_interno').where({ datos_personales_Id: datosPersonalesId }).select('*');
		if (profesorInterno.length === 0) return null;

		// Utilizar el ID del profesor interno para obtener información adicional
		const idProfesorInterno = profesorInterno[0].id;
		const usuario = await obtenerUsuario(idProfesorInterno);
		const datos = await obtenerDatosPersonalesInterno(datosPersonalesId);
		const areas = await obtenerAreasConocimientoDelProfesor(idProfesorInterno);
		const titulaciones = await obtenerTitulacionesDelProfesor(idProfesorInterno);

		// Crear y retornar la instancia de TProfesorInterno con la información obtenida
		const ProfesorInterno: ProfesorInterno = {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			area_conocimiento: areas,
			titulacion_local: titulaciones,
			telefono: datos.telefono,
			rol: 'ProfesorInterno'
		};
		return ProfesorInterno;
	} catch (err) {
		console.error('Se ha producido un error al obtener el profesor interno por datos personales:', err);
		return null; // Retorna null en caso de error
	}
}

export async function obtenerAreasConocimientoDelProfesor(idProfesor: number): Promise<string[]> {
	const idAreas = await knex('areaconocimiento_profesor').where({ id_profesor: idProfesor }).select('id_area');
	const areas = await knex
		.select('nombre')
		.from('area_conocimiento')
		.whereIn(
			'id',
			idAreas.map((a) => a.id_area)
		);
	return areas.map((area) => area.nombre);
}

export async function obtenerTitulacionesDelProfesor(idProfesor: number): Promise<string[]> {
	const idTitulaciones = await knex('titulacionlocal_profesor').where({ id_profesor: idProfesor }).select('id_titulacion');
	const titulaciones = await knex
		.select('nombre')
		.from('titulacion_local')
		.whereIn(
			'id',
			idTitulaciones.map((t) => t.id_titulacion)
		);
	return titulaciones.map((titulacion) => titulacion.nombre);
}

export async function obtenerProfesorExterno(id: number): Promise<ProfesorExterno> {
	try {
		const profesorExterno = await knex('profesor_externo').where({ id }).select('*');
		if (profesorExterno.length === 0) return null;

		const usuario = await obtenerUsuario(id);
		const datos = await obtenerDatosPersonalesExterno(profesorExterno[0]['datos_personales_Id']);
		const areas = await obtenerAreasConocimientoDelProfesor(profesorExterno[0]['datos_personales_Id']);
		const universidad = await knex('universidad').where({ id: profesorExterno[0]['universidad'] }).select('*');

		const ProfesorExterno: ProfesorExterno = {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			universidad: universidad[0].nombre,
			facultad: profesorExterno[0].facultad,
			telefono: datos.telefono,
			rol: 'ProfesorExterno',
			area_conocimiento: areas
		};
		return ProfesorExterno;
	} catch (err) {
		console.error('Se ha producido un error al obtener el profesor externo:', err);
		return null;
	}
}

export async function obtenerProfesorExternoPorDatosPersonales(datosPersonalesId: number): Promise<ProfesorExterno> {
	try {
		const profesorExterno = await knex('profesor_externo').where({ datos_personales_Id: datosPersonalesId }).select('*');
		if (profesorExterno.length === 0) return null;

		const idProfesorExterno = profesorExterno[0].id;
		const usuario = await obtenerUsuario(idProfesorExterno);
		const datos = await obtenerDatosPersonalesExterno(datosPersonalesId);
		const universidad = await knex('universidad').where({ id: profesorExterno[0]['universidad'] }).select('*');
		const areas = await obtenerAreasConocimientoDelProfesor(profesorExterno[0]['datos_personales_Id']);

		const ProfesorExterno: ProfesorExterno = {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			universidad: universidad[0].nombre,
			facultad: profesorExterno[0].facultad,
			telefono: datos.telefono,
			rol: 'ProfesorExterno',
			area_conocimiento: areas
		};
		return ProfesorExterno;
	} catch (err) {
		console.error('Se ha producido un error al obtener el profesor externo por datos personales:', err);
		return null;
	}
}

//Se utiliza?
export async function obtenerEstudiante(id: number): Promise<Estudiante> {
	try {
		const estudiante = await knex('estudiante').where({ id }).select('*');
		if (estudiante.length === 0) {
			console.log('No se encontró el estudiante con el ID:', id);
			return null;
		}
		return estudiante[0];
	} catch (err) {
		console.error('Se ha producido un error al obtener el estudiante con el ID:', id, err);
		return null;
	}
}

export async function obtenerEstudianteInterno(id: number): Promise<EstudianteInterno | null> {
	try {
		const estudianteInterno = await knex('estudiante_interno').where({ id }).select('*');
		if (estudianteInterno.length === 0) return null;

		const usuario = await obtenerUsuario(id);
		const datos = await obtenerDatosPersonalesInterno(estudianteInterno[0]['datos_personales_Id']);
		const titulacion = await knex('titulacion_local').where({ id: estudianteInterno[0]['titulacion_local'] }).select('*');

		return {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			titulacion_local: titulacion[0].nombre,
			telefono: datos.telefono,
			rol: 'EstudianteInterno'
		};
	} catch (err) {
		console.error('Se ha producido un error al obtener el estudiante interno:', err);
		return null;
	}
}

export async function obtenerEstudianteInternoPorDatosPersonales(datosPersonalesId: number): Promise<EstudianteInterno | null> {
	try {
		const estudianteInterno = await knex('estudiante_interno').where({ datos_personales_Id: datosPersonalesId }).select('*');
		if (estudianteInterno.length === 0) return null;

		const id = estudianteInterno[0].id;
		const usuario = await obtenerUsuario(id);
		const datos = await obtenerDatosPersonalesInterno(datosPersonalesId);
		const titulacion = await knex('titulacion_local').where({ id: estudianteInterno[0].titulacion_local }).select('*');

		return {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			titulacion_local: titulacion[0]?.nombre || '', //Puede estar vacio?
			telefono: datos.telefono,
			rol: 'EstudianteInterno'
		};
	} catch (err) {
		console.error('Error al obtener estudiante interno por datos personales', err);
		return null;
	}
}

export async function obtenerEstudianteExterno(id: number): Promise<EstudianteExterno | null> {
	try {
		const estudianteExterno = await knex('estudiante_externo').where({ id }).select('*');
		if (estudianteExterno.length === 0) return null;

		const usuario = await obtenerUsuario(id);
		const datos = await obtenerDatosPersonalesExterno(estudianteExterno[0]['datos_personales_Id']);
		const universidad = await knex('universidad').where({ id: estudianteExterno[0]['universidad'] }).select('*');

		return {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			titulacion: estudianteExterno[0]['titulacion'],
			nombreUniversidad: universidad[0].nombre,
			telefono: datos.telefono,
			rol: 'EstudianteExterno'
		};
	} catch (err) {
		console.error('Se ha producido un error al obtener el estudiante externo:', err);
		return null;
	}
}

export async function obtenerEstudianteExternoPorDatosPersonales(datosPersonalesId: number): Promise<EstudianteExterno | null> {
	try {
		const estudianteExterno = await knex('estudiante_externo').where({ datos_personales_Id: datosPersonalesId }).select('*');
		if (estudianteExterno.length === 0) return null;

		const id = estudianteExterno[0].id;
		const usuario = await obtenerUsuario(id);
		const datos = await obtenerDatosPersonalesExterno(datosPersonalesId);
		const universidad = await knex('universidad').where({ id: estudianteExterno[0].universidad }).select('*');

		return {
			id: usuario.id,
			correo: datos.correo,
			nombre: datos.nombre,
			apellidos: datos.apellidos,
			password: datos.password,
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados,
			titulacion: estudianteExterno[0].titulacion,
			nombreUniversidad: universidad[0]?.nombre || '',
			telefono: datos.telefono,
			rol: 'EstudianteExterno'
		};
	} catch (err) {
		console.error('Error al obtener estudiante externo por datos personales', err);
		return null;
	}
}

export async function getPathAvatar(id: number): Promise<ProfesorInterno> {
	try {
		const response: ProfesorInterno[] = await knex('datos_personales_interno')
			.innerJoin('profesor_interno', 'profesor_interno.datos_personales_Id', 'datos_personales_interno.id')
			.where('profesor_interno.id', id)
			.select('*');
		return response.length > 0 ? response[0] : undefined;
	} catch (err) {
		console.error('Se ha producido un error al intentar obtener el avatar del usuario interno:', err);
		return undefined; // Asegúrate de manejar este undefined correctamente en tu aplicación
	}
}

//UPDATES
export async function updateAvatar(id: number, photo: string): Promise<number> {
	try {
		await knex('usuario').where('id', id).update({ origin_img: photo });
		return id;
	} catch (err) {
		console.error('Se ha producido un error al intentar actualizar el avatar del usuario interno', err);
		return -1; //Error
	}
}

export async function actualizarUsuario(usuario: Usuario): Promise<number> {
	try {
		await knex('usuario').where('id', usuario.id).update({
			origin_login: usuario.origin_login,
			origin_img: usuario.origin_img,
			createdAt: usuario.createdAt,
			updatedAt: usuario.updatedAt,
			terminos_aceptados: usuario.terminos_aceptados
		});
		//Retornamos id de usuario actualizado
		return usuario.id;
	} catch (err) {
		console.error('Se ha producido un error al intentar actualizar el usuario', err);
		return -1;
	}
}

export async function actualizarAdmin(usuario: Admin): Promise<number> {
	try {
		// Actualizar la información básica del usuario en la tabla 'usuario'
		const resUsuario = await actualizarUsuario(usuario);
		if (resUsuario <= 0) {
			console.log('Se ha producido un error al intentar actualizar el usuario');
			return -1;
		}

		// Actualizar los datos personales asociados al admin
		const resDatosPersonales = await knex('datos_personales_interno').where('id', usuario.id).update({
			nombre: usuario.nombre,
			apellidos: usuario.apellidos,
			password: usuario.password,
			telefono: usuario.telefono
		});

		if (resDatosPersonales > 0) {
			return usuario.id; // Retornar el ID del usuario como confirmación de éxito
		} else {
			console.log('No se pudieron actualizar los datos personales del admin');
			return -1;
		}
	} catch (err) {
		console.error('Se ha producido un error al intentar actualizar el admin:', err);
		return -1;
	}
}

export async function actualizarOficinaAPS(usuario: OficinaAps): Promise<number> {
	try {
		// Actualizar la información básica del usuario en la tabla 'usuario'
		const resUsuario = await actualizarUsuario(usuario);
		if (resUsuario <= 0) {
			console.log('Se ha producido un error al intentar actualizar el usuario');
			return -1;
		}

		// Actualizar los datos personales asociados al usuario de Oficina APS
		const resDatosPersonales = await knex('datos_personales_interno').where('id', usuario.id).update({
			nombre: usuario.nombre,
			apellidos: usuario.apellidos,
			password: usuario.password,
			telefono: usuario.telefono
		});

		if (resDatosPersonales > 0) {
			return usuario.id; // Retornar el ID del usuario como confirmación de éxito
		} else {
			console.log('No se pudieron actualizar los datos personales de Oficina APS');
			return -1;
		}
	} catch (err) {
		console.error('Se ha producido un error al intentar actualizar Oficina APS:', err);
		return -1;
	}
}

export async function actualizarSocioComunitario(usuario: SocioComunitario): Promise<number> {
	try {
		//Actualizamos datos generales usuario
		const res = await actualizarUsuario(usuario);
		if (res <= 0) {
			console.log('Se ha producido un error al intentar actualizar el usuario');
			return -1;
		}
		//Actualizamos datos personales externo
		const rel = await knex('datos_personales_externo').where('correo', usuario.correo).update({
			nombre: usuario.nombre,
			apellidos: usuario.apellidos,
			password: usuario.password,
			telefono: usuario.telefono
		});

		if (rel <= 0) {
			console.log('No se pudieron actualizar los datos personales del socio comunitario');
			return -1;
		}
		//Actualizamos datos concretos de Socio Comunitario
		const rel2 = await knex('socio_comunitario').where('id', usuario.id).update({
			sector: usuario.sector,
			nombre_socioComunitario: usuario.nombre_socioComunitario,
			url: usuario.url,
			mision: usuario.mision
		});

		return rel2 > 0 ? usuario.id : -1;
	} catch (err) {
		console.error('Se ha producido un error al intentar actualizar el socio comunitario:', err);
		return -1;
	}
}

export async function actualizarEstudiante(usuario: Estudiante): Promise<number> {
	try {
		const res = await actualizarUsuario(usuario);
		return res > 0 ? usuario.id : -1;
	} catch (err) {
		console.error('Se ha producido un error al intentar actualizar el estudiante:', err);
		return -1;
	}
}

export async function actualizarProfesor(usuario: Profesor): Promise<number> {
	try {
		const res = await actualizarUsuario(usuario);
		//Devolvemos idProfesor actu
		return res > 0 ? usuario.id : -1;
	} catch (err) {
		console.error('Se ha producido un error al intentar actualizar el profesor:', err);
		return -1;
	}
}

export async function actualizarEstudianteExterno(usuario: EstudianteExterno): Promise<number> {
	try {
		// Eliminada comprobacion previa de correo, tiene sentido?
		const resUsuario = await actualizarUsuario(usuario);
		if (resUsuario <= 0) {
			console.log('Se ha producido un error al intentar actualizar el usuario');
			return -1;
		}

		// Actualizar los datos personales externos
		const resDatosPersonales = await knex('datos_personales_externo').where('id', usuario.id).update({
			nombre: usuario.nombre,
			apellidos: usuario.apellidos,
			password: usuario.password,
			telefono: usuario.telefono
		});

		if (resDatosPersonales <= 0) {
			console.log('No se pudieron actualizar los datos personales del estudiante externo');
			return -1;
		}

		// Actualizar información específica del estudiante externo
		const resEstudianteExterno = await knex('estudiante_externo').where('id', usuario.id).update({
			titulacion: usuario.titulacion,
			universidad: usuario.nombreUniversidad
		});

		if (resEstudianteExterno <= 0) {
			console.log('No se pudo actualizar la información del estudiante externo');
			return -1;
		}

		return usuario.id;
	} catch (err) {
		console.error('Se ha producido un error al intentar actualizar el estudiante externo:', err);
		return -1;
	}
}

export async function actualizarProfesorExterno(usuario: ProfesorExterno): Promise<number> {
	try {
		const res = await actualizarUsuario(usuario);
		if (res <= 0) {
			console.log('Se ha producido un error al intentar actualizar el usuario');
			return -1;
		}

		const rel = await knex('datos_personales_externo').where('id', usuario.id).update({
			nombre: usuario.nombre,
			apellidos: usuario.apellidos,
			password: usuario.password,
			telefono: usuario.telefono
		});

		if (rel <= 0) {
			console.log('No se pudieron actualizar los datos personales del profesor externo');
			return -1;
		}

		const rel2 = await knex('profesor_externo').where('id', usuario.id).update({
			universidad: usuario.universidad
		});

		return rel2 > 0 ? usuario.id : -1;
	} catch (err) {
		console.error('Se ha producido un error al intentar actualizar el profesor externo:', err);
		return -1;
	}
}

export async function actualizarProfesorInterno(usuario: ProfesorInterno, areas: AreaServicio[], titulaciones: TitulacionLocal[]): Promise<number> {
	try {
		await actualizarUsuario(usuario);

		await knex('datos_personales_interno').where('id', usuario.id).update({
			nombre: usuario.nombre,
			apellidos: usuario.apellidos,
			password: usuario.password,
			telefono: usuario.telefono
		});

		await knex('areaconocimiento_profesor').where('id_profesor', usuario.id).del();

		for (const area of areas) {
			await knex('areaconocimiento_profesor').insert({
				id_area: area,
				id_profesor: usuario.id
			});
		}

		await knex('titulacionlocal_profesor').where('id_profesor', usuario.id).del();

		for (const titulacion of titulaciones) {
			await knex('titulacionlocal_profesor').insert({
				id_titulacion: titulacion,
				id_profesor: usuario.id
			});
		}

		return usuario.id;
	} catch (err) {
		console.error('Se ha producido un error al intentar actualizar el profesor interno:', err);
		return -1;
	}
}

export async function actualizarEstudianteInterno(usuario: EstudianteInterno): Promise<number> {
	try {
		const res = await actualizarUsuario(usuario);
		if (res <= 0) {
			console.log('Se ha producido un error');
			return -1;
		}

		const rel = await knex('datos_personales_interno').where('id', usuario.id).update({
			nombre: usuario.nombre,
			apellidos: usuario.apellidos,
			password: usuario.password,
			telefono: usuario.telefono
		});

		if (rel <= 0) {
			console.log('No se pudieron actualizar los datos personales del estudiante interno');
			return -1;
		}

		const rel2 = await knex('estudiante_interno').where('id', usuario.id).update({
			titulacion_local: usuario.titulacion_local
		});

		return rel2 > 0 ? usuario.id : -1;
	} catch (err) {
		console.error('Se ha producido un error al intentar actualizar el estudiante interno:', err);
		return -1;
	}
}

//AUXILIARES
export async function obtenerProfesoresInternos(arrayProfesores: number[]): Promise<ProfesorInterno[]> {
	try {
		// Asumiendo que hay una relación directa y las claves foráneas están correctamente configuradas en tus tablas
		const profesores: ProfesorInterno[] = await knex('profesor_interno')
			.join('usuario', 'usuario.id', 'profesor_interno.id')
			.join('datos_personales_interno', 'datos_personales_interno.id', 'profesor_interno.datos_personales_Id')
			.join('areaconocimiento_profesor', 'areaconocimiento_profesor.id_profesor', 'profesor_interno.id')
			.join('area_conocimiento', 'area_conocimiento.id', 'areaconocimiento_profesor.id_area')
			.join('titulacionlocal_profesor', 'titulacionlocal_profesor.id_profesor', 'profesor_interno.id')
			.join('titulacion_local', 'titulacion_local.id', 'titulacionlocal_profesor.id_titulacion')
			.whereIn('profesor_interno.id', arrayProfesores)
			.select([
				'usuario.id',
				'datos_personales_interno.correo',
				'datos_personales_interno.nombre',
				'datos_personales_interno.apellidos',
				'datos_personales_interno.telefono',
				'datos_personales_interno.password',
				'usuario.origin_login',
				'usuario.origin_img',
				'usuario.createdAt',
				'usuario.updatedAt',
				'usuario.terminos_aceptados',
				knex.raw("GROUP_CONCAT(DISTINCT area_conocimiento.nombre SEPARATOR ', ') as area_conocimiento"),
				knex.raw("GROUP_CONCAT(DISTINCT titulacion_local.nombre SEPARATOR ', ') as titulacion_local")
			])
			.groupBy('usuario.id');

		// Transformación de los resultados para ajustarse al formato esperado
		//Revisar, esta harcodeado para admitir la separacion con split, seguramente no funcione de la forma esperada.
		return profesores.map((profesor) => ({
			...profesor,
			area_conocimiento: (profesor.area_conocimiento as unknown as string).split(', '),
			titulacion_local: (profesor.titulacion_local as unknown as string).split(', ')
		}));
	} catch (err) {
		console.error('Error al obtener profesores internos', err);
		throw err;
	}
}
