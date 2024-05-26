import type { AreaConocimiento_Profesor } from '../AreaConocimiento_Profesor';
import { TitulacionLocal_Profesor } from '../TitulacionLocal_Profesor';
import type { ViewUser } from './User';

export namespace ViewUserInternalProfessor {
	export const Name = 'view_user_internal_professor';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface UserData {
		role: 'InternalProfessor';
		knowledgeAreas: AreaConocimiento_Profesor.Value['id_area'][];
		degrees: TitulacionLocal_Profesor.Value['id_titulacion'][];
	}
}
