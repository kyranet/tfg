import { DatosPersonalesExterno } from '../DatosPersonalesExterno';
import { DatosPersonalesInterno } from '../DatosPersonalesInterno';
import type { Usuario } from '../Usuario';
import type { ViewUserAdmin } from './UserAdmin';
import type { ViewUserApSOffice } from './UserApSOffice';
import { ViewUserPartner } from './UserColaborador';
import type { ViewUserCommunityPartner } from './UserCommunityPartner';
import type { ViewUserExternalProfessor } from './UserExternalProfessor';
import type { ViewUserExternalStudent } from './UserExternalStudent';
import type { ViewUserInternalProfessor } from './UserInternalProfessor';
import type { ViewUserInternalStudent } from './UserInternalStudent';
import { ViewUserTutor } from './UserTutorCA';

export namespace ViewUser {
	export const Name = 'view_user';
	export interface BaseValue<User extends object> {
		id: Usuario.Value['id'];
		createdAt: Usuario.Value['createdAt'];
		firstName: DatosPersonalesInterno.Value['nombre'] | DatosPersonalesExterno.Value['nombre'];
		lastName: DatosPersonalesInterno.Value['apellidos'] | DatosPersonalesExterno.Value['apellidos'];
		phone: DatosPersonalesInterno.Value['telefono'] | DatosPersonalesExterno.Value['telefono'];
		email: DatosPersonalesInterno.Value['correo'] | DatosPersonalesExterno.Value['correo'];
		user: User;
	}

	export type Value =
		| ViewUserAdmin.Value
		| ViewUserInternalProfessor.Value
		| ViewUserExternalProfessor.Value
		| ViewUserInternalStudent.Value
		| ViewUserExternalStudent.Value
		| ViewUserApSOffice.Value
		| ViewUserCommunityPartner.Value
		| ViewUserTutor.Value
		| ViewUserPartner.Value;

	export type ValueUser =
		| ViewUserAdmin.UserData //
		| ViewUserInternalProfessor.UserData
		| ViewUserExternalProfessor.UserData
		| ViewUserInternalStudent.UserData
		| ViewUserExternalStudent.UserData
		| ViewUserApSOffice.UserData
		| ViewUserCommunityPartner.UserData
		| ViewUserTutor.UserData
		| ViewUserPartner.UserData;

	export type ValueUserType = ValueUser['type'];
	export type ValueUserOfType<Type extends ValueUserType> = Extract<ValueUser, { type: Type }>;
	export type ValueOfType<Type extends ValueUserType> = Extract<Value, { user: { type: Type } }>;
}
