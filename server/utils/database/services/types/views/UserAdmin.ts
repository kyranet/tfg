import type { ViewUser } from './User';

export namespace ViewUserAdmin {
	export const Name = 'view_user_admin';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface UserData {
		type: 'Admin';
	}
}
