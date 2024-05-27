import type { ViewUser } from './User';

export namespace ViewUserTutor {
	export const Name = 'view_user_tutor';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface UserData {
		role: 'Tutor';
	}
}
