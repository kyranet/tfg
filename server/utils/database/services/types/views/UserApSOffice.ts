import type { ViewUser } from './User';

export namespace ViewUserApSOffice {
	export const Name = 'view_user_aps_office';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface UserData {
		type: 'ApSOffice';
	}
}
