import type { DatosPersonalesExterno } from '../DatosPersonalesExterno';
import type { DatosPersonalesInterno } from '../DatosPersonalesInterno';
import type { Usuario } from '../Usuario';
import type { ViewUserAdmin } from './UserAdmin';
import type { ViewUserApSOffice } from './UserApSOffice';
import type { ViewUserCollaborator } from './UserCollaborator';
import type { ViewUserCommunityPartner } from './UserCommunityPartner';
import type { ViewUserExternalProfessor } from './UserExternalProfessor';
import type { ViewUserExternalStudent } from './UserExternalStudent';
import type { ViewUserInternalProfessor } from './UserInternalProfessor';
import type { ViewUserInternalStudent } from './UserInternalStudent';
import type { ViewUserTutor } from './UserTutorCA';

export namespace ViewUser {
	export const Name = 'view_user';
	export type BaseValue<User extends object> = User & {
		id: Usuario.Value['id'];
		createdAt: Usuario.Value['createdAt'];
		avatar: Usuario.Value['origin_img'];
		firstName: DatosPersonalesInterno.Value['nombre'] | DatosPersonalesExterno.Value['nombre'];
		lastName: DatosPersonalesInterno.Value['apellidos'] | DatosPersonalesExterno.Value['apellidos'];
		phone: DatosPersonalesInterno.Value['telefono'] | DatosPersonalesExterno.Value['telefono'];
		email: DatosPersonalesInterno.Value['correo'] | DatosPersonalesExterno.Value['correo'];
	};

	export type Value =
		| ViewUserAdmin.Value
		| ViewUserInternalProfessor.Value
		| ViewUserExternalProfessor.Value
		| ViewUserInternalStudent.Value
		| ViewUserExternalStudent.Value
		| ViewUserApSOffice.Value
		| ViewUserCommunityPartner.Value
		| ViewUserTutor.Value
		| ViewUserCollaborator.Value;

	export type RawValue = BaseValue<{}> & { data: string };

	export type ValueUser =
		| ViewUserAdmin.UserData //
		| ViewUserInternalProfessor.UserData
		| ViewUserExternalProfessor.UserData
		| ViewUserInternalStudent.UserData
		| ViewUserExternalStudent.UserData
		| ViewUserApSOffice.UserData
		| ViewUserCommunityPartner.UserData
		| ViewUserTutor.UserData
		| ViewUserCollaborator.UserData;

	export type ValueUserType = ValueUser['role'];
	export type ValueUserOfType<Type extends ValueUserType> = Extract<ValueUser, { role: Type }>;
	export type ValueOfType<Type extends ValueUserType> = Extract<Value, { user: { role: Type } }>;
}
