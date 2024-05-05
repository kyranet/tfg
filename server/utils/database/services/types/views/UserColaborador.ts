import { Colaborador } from '../Colaborador';
import type { ViewUser } from './User';

export namespace ViewUserPartner {
	export const Name = 'view_user_partner';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface UserData {
		type: 'Partner';
		university: Colaborador.Value['universidad'];
		faculty: Colaborador.Value['facultad'];
	}
}
