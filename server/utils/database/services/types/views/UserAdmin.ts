import { ViewUser } from './User';

export namespace ViewUserAdmin {
	export const Name = 'view_user_admin';
	export interface Value extends ViewUser.Value<'Admin'> {}
}
