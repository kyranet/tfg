import { ViewUser } from './User';

export namespace ViewUserExternalStudent {
	export const Name = 'view_user_external_student';
	export interface Value extends ViewUser.Value<'ExternalStudent'> {}
}
