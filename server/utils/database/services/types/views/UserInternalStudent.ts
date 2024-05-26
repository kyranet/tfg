import type { EstudianteInterno } from '../EstudianteInterno';
import type { ViewUser } from './User';

export namespace ViewUserInternalStudent {
	export const Name = 'view_user_internal_student';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface UserData {
		role: 'InternalStudent';
		degree: EstudianteInterno.Value['titulacion_local'];
	}
}
