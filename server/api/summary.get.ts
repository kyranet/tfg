import { createConnection, Connection, ConnectionOptions, RowDataPacket } from 'mysql2/promise';
//En proceso

export default eventHandler(async () => {
  // TODO(Sebastianrza): Hook this with the DB
  try {
    const access: ConnectionOptions = {
      host: 'localhost',
      port: 3306,
      user: 'admin',
      password: 'admin',
      database: 'aps',
      multipleStatements: true,
    };
  
    const connection: Connection = await createConnection(access);
  
    console.log('Conectado con el ID ' + connection.threadId);
  
    // Realizar la consulta
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM usuarios');
  
    console.log(rows);
  
  } catch (err) {
    console.error('Error de conexión: ' + err);
  }

  return {
    proyectos: 0,
    partenariados: 0,
    ofertas: 0,
  };
});
