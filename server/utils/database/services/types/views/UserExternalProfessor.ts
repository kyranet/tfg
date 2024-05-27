import type { AreaConocimiento_Profesor } from '../AreaConocimiento_Profesor';
import type { ProfesorExterno } from '../ProfesorExterno';
import type { ViewUser } from './User';

export namespace ViewUserExternalProfessor {
	export const Name = 'view_user_external_professor';
	export interface Value extends ViewUser.BaseValue<UserData> {}

	export interface RawValue extends ViewUser.BaseValue<Omit<UserData, 'knowledgeAreas'>> {
		knowledgeAreas: string;
	}

	export interface UserData {
		role: 'ExternalProfessor';
		university: ProfesorExterno.Value['universidad'];
		faculty: ProfesorExterno.Value['facultad'];
		knowledgeAreas: AreaConocimiento_Profesor.Value['id_area'][];
	}
}
