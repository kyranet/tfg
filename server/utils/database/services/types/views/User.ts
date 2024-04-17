import { DatosPersonalesExterno } from '../DatosPersonalesExterno';
import { DatosPersonalesInterno } from '../DatosPersonalesInterno';
import { EstudianteExterno } from '../EstudianteExterno';
import { EstudianteInterno } from '../EstudianteInterno';
import { ProfesorExterno } from '../ProfesorExterno';
import { SocioComunitario } from '../SocioComunitario';
import type { Usuario } from '../Usuario';

export namespace ViewUser {
	export const Name = 'view_user';
	export interface Value<Type extends ValueUserType = ValueUserType> {
		id: Usuario.Value['id'];
		createdAt: Usuario.Value['createdAt'];
		firstName: DatosPersonalesInterno.Value['nombre'] | DatosPersonalesExterno.Value['nombre'];
		lastName: DatosPersonalesInterno.Value['apellidos'] | DatosPersonalesExterno.Value['apellidos'];
		phone: DatosPersonalesInterno.Value['telefono'] | DatosPersonalesExterno.Value['telefono'];
		email: DatosPersonalesInterno.Value['correo'] | DatosPersonalesExterno.Value['correo'];
		user: ValueUserOfType<Type>;
	}

	export type ValueUser =
		| Admin //
		| InternalProfessor
		| ExternalProfessor
		| InternalStudent
		| ExternalStudent
		| ApSOffice
		| CommunityPartner;

	export type ValueUserType = ValueUser['type'];
	export type ValueUserOfType<Type extends ValueUserType> = Extract<ValueUser, { type: Type }>;

	export interface Admin {
		type: 'Admin';
	}

	export interface InternalProfessor {
		type: 'InternalProfessor';
	}

	export interface ExternalProfessor {
		type: 'ExternalProfessor';
		university: ProfesorExterno.Value['universidad'];
		faculty: ProfesorExterno.Value['facultad'];
	}

	export interface InternalStudent {
		type: 'InternalStudent';
		degree: EstudianteInterno.Value['titulacion_local'];
	}

	export interface ExternalStudent {
		type: 'ExternalStudent';
		degree: EstudianteExterno.Value['titulacion'];
		university: EstudianteExterno.Value['universidad'];
	}

	export interface ApSOffice {
		type: 'ApSOffice';
	}

	export interface CommunityPartner {
		type: 'CommunityPartner';
		mission: SocioComunitario.Value['mision'];
		name: SocioComunitario.Value['nombre_socioComunitario'];
		sector: SocioComunitario.Value['sector'];
		url: SocioComunitario.Value['url'];
	}
}
