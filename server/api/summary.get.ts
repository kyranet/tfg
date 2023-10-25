import type { RowDataPacket } from 'mysql2/promise';

export default eventHandler(async () => {
	// TODO(Sebastianrza): Hook this with the DB
	try {
		const connection = await useDatabase();
		console.log(`Conectado con el ID ${connection.threadId}`);

		// Realizar la consulta
		const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM usuarios');
		console.log(rows);
	} catch (err) {
		console.error('Error de conexión:', err);
	}

	return {
		proyectos: 0,
		partenariados: 0,
		ofertas: 0
	};
});
