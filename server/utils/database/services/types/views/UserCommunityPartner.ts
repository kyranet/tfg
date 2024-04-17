import type { SocioComunitario } from '../SocioComunitario';
import type { ViewUser } from './User';

export namespace ViewUserCommunityPartner {
	export const Name = 'view_user_community_partner';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface UserData {
		type: 'CommunityPartner';
		mission: SocioComunitario.Value['mision'];
		name: SocioComunitario.Value['nombre_socioComunitario'];
		sector: SocioComunitario.Value['sector'];
		url: SocioComunitario.Value['url'];
	}
}
