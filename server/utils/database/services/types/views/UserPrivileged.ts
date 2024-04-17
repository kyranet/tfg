import { ViewUser } from './User';

/**
 * The view for authentication purposes, this view contains the user's password
 * and role, which must **never** be exposed to the application.
 */
export namespace ViewUserPrivileged {
	export const Name = 'view_user_privileged';
	export interface Value extends Omit<ViewUser.Value, 'user'> {
		password: string;
		role: ViewUser.ValueUserType;
	}
}
