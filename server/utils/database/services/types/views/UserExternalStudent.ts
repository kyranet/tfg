import type { EstudianteExterno } from '../EstudianteExterno';
import type { ViewUser } from './User';

export namespace ViewUserExternalStudent {
	export const Name = 'view_user_external_student';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface UserData {
		role: 'ExternalStudent';
		degree: EstudianteExterno.Value['titulacion'];
		university: EstudianteExterno.Value['universidad'];
	}
}
