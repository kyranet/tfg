import type { H3Event, SessionConfig } from 'h3';
import type { ViewUser } from './database/services/types/views/User';

const sessionConfig = useRuntimeConfig().auth as SessionConfig;

export interface AuthSession {
	id: number;
	email: string;
	avatar: string;
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
