import knex from 'knex';

export const qb = knex({
	client: 'mysql2',
	version: '11.1.2',
	connection: { ...useRuntimeConfig().db }
});

export default qb;
