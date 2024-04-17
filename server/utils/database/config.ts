import knex from 'knex';

export const qb = knex({
	client: 'mysql2',
	version: '11.1.2',
	connection: {
		host: process.env.MYSQL_IP!,
		port: Number(process.env.MYSQL_PORT!),
		user: process.env.MYSQL_USER!,
		password: process.env.MYSQL_PASSWORD!,
		database: process.env.MYSQL_DATABASE!
	}
});

export default qb;
