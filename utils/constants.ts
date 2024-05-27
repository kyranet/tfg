import type { ViewUser } from '~/server/utils/database/services/types/views/User';

export const UserRoleMapping = {
	Admin: 'Gestor',
	InternalStudent: 'Estudiante',
	ExternalStudent: 'Estudiante',
	InternalProfessor: 'Profesor',
	ExternalProfessor: 'Profesor',
	CommunityPartner: 'Socio Comunitario',
	ApSOffice: 'Oficina ApS',
	Collaborator: 'Colaborador',
	Tutor: 'Tutor CA'
} satisfies Record<ViewUser.ValueUserType, string>;
