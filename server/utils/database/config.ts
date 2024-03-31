import knex from 'knex';

const config = {
    client: 'mysql',
    connection: {
      host: process.env.MYSQL_IP!,
      port: process.env.MYSQL_PORT!,
      user: process.env.MYSQL_USER!,
      password: process.env.MYSQL_PASSWORD!,
      database: process.env.MYSQL_DATABASE!
    }
  };
  
  export default knex(config);
  
