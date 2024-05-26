import { Colaborador } from '../Colaborador';
import type { ViewUser } from './User';

export namespace ViewUserCollaborator {
	export const Name = 'view_user_collaborator';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface UserData {
		role: 'Collaborator';
		university: Colaborador.Value['universidad'];
		faculty: Colaborador.Value['facultad'];
	}
}
