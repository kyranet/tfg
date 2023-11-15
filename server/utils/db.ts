import { createConnection, type ConnectionOptions } from 'mysql2/promise';

const dbConfig = useRuntimeConfig().db as ConnectionOptions;

export function useDatabase() {
	return createConnection(dbConfig);
}
