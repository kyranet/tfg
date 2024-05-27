import { isNullish } from '@sapphire/utilities';
import { ViewUserPrivileged } from '~/server/utils/database/services/types/views/UserPrivileged';

export default eventHandler(async (event) => {
	const session = await requireAuthSession(event);

	const entry = await qb(ViewUserPrivileged.Name)
		.where({ id: session.data.id })
		.select('id', 'email', 'avatar', 'firstName', 'lastName', 'role')
		.first();
	if (isNullish(entry)) {
		await session.clear();
		throw createError({ message: 'No existe tu usuario', statusCode: 401 });
	}

	session.update({
		id: entry.id,
		email: entry.email,
		avatar: entry.avatar,
		firstName: entry.firstName,
		lastName: entry.lastName,
		role: entry.role
	});
	return session.data;
});
