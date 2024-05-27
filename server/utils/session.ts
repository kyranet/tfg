import type { H3Event, SessionConfig } from 'h3';
import type { ViewUser } from './database/services/types/views/User';

const sessionConfig = useRuntimeConfig().auth as SessionConfig;

export interface AuthSession {
	id: number;
	email: string;
	avatar: string | null;
	firstName: string;
	lastName: string;
	role: ViewUser.ValueUserType;
}

export function useAuthSession(event: H3Event) {
	return useSession<AuthSession>(event, sessionConfig);
}

export async function requireAuthSession(event: H3Event) {
	const session = await useAuthSession(event);
	// session.data gets initialized as {}
	if (!session.data.id) {
		throw createError({ message: 'Not Authorized', statusCode: 401 });
	}

	return session;
}

/**
 * Requires the user to be authenticated and have a specific role.
 *
 * @privateRemarks
 *
 * TODO: This function should ideally check the database for the user's role,
 * as the role could have been changed since the session was created or the
 * session could have been tampered with or forged by a malicious user.
 *
 * @param event - The event object.
 * @param roles - The roles that are allowed to access the route.
 * @returns The session object.
 */
export async function requireAuthRole(event: H3Event, roles: ViewUser.ValueUserType[]) {
	const session = await requireAuthSession(event);
	if (!roles.includes(session.data.role)) {
		throw createError({ message: 'Not Authorized', statusCode: 403 });
	}

	return session;
}
