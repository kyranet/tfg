import type { ProfesorExterno } from '../ProfesorExterno';
import type { ViewUser } from './User';

export namespace ViewUserExternalProfessor {
	export const Name = 'view_user_external_professor';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface UserData {
		type: 'ExternalProfessor';
		university: ProfesorExterno.Value['universidad'];
		faculty: ProfesorExterno.Value['facultad'];
	}
}
