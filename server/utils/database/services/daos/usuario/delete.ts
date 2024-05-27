import { Admin } from '../../types/Admin';
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
import { Usuario } from '../../types/Usuario';
import { sharedDeleteEntryTable } from '../shared';

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
