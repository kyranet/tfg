import { ViewUser } from './User';

export namespace ViewUserInternalStudent {
	export const Name = 'view_user_internal_student';
	export interface Value extends ViewUser.Value<'InternalStudent'> {}
}
