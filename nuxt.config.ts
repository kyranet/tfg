import type { SessionConfig } from 'h3';
import type { Knex } from 'knex';

export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', 'nuxt-icon'],
	runtimeConfig: {
		auth: {
			name: 'aps-auth',
			maxAge: 604800,
			password: process.env.NUXT_AUTH_PASSWORD ?? '',
			cookie: { sameSite: 'lax' },
			sessionHeader: false
		} as const satisfies SessionConfig,
		db: {
			host: process.env.NUXT_DB_HOST ?? 'localhost',
			user: process.env.NUXT_DB_USER ?? 'admin',
			password: process.env.NUXT_DB_PASSWORD ?? 'admin',
			database: process.env.NUXT_DB_DATABASE ?? 'aps',
			port: process.env.NUXT_DB_PORT ? Number(process.env.NUXT_DB_PORT) : 3306,
			multipleStatements: true
		} as const satisfies Knex.MySql2ConnectionConfig,
		public: {
			organization: process.env.NUXT_PUBLIC_ORGANIZATION ?? '',
			organizationUrl: process.env.NUXT_PUBLIC_ORGANIZATION_URL ?? '',
			organizationLogo: process.env.NUXT_PUBLIC_ORGANIZATION_LOGO ?? ''
		}
	}
});
