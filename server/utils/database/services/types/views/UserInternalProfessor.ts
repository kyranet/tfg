import type { ViewUser } from './User';

export namespace ViewUserInternalProfessor {
	export const Name = 'view_user_internal_professor';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface UserData {
		type: 'InternalProfessor';
	}
}
