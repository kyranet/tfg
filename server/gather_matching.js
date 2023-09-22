//let matching = require("...");
/*process.env.MYSQL_IP = "localhost";
process.env.MYSQL_PORT = "3306";
process.env.MYSQL_USER = "MYSQL_USER";
process.env.MYSQL_PASSWORD = "aps";
process.env.MYSQL_DATABASE = "aps";*/
require('dotenv').config();

let daoOferta = require("./database/services/daos/daoOferta.js");
let daoDemanda = require("./database/services/daos/daoDemanda.js");
let daoTentativa = require("./database/services/daos/daoTentativa.js");
let matching = require("./controllers/matching.js")
let config = require("./configuracion.json");

match = (async function() {
  let ofertas = await daoOferta.obtenerTodasOfertasServicioMatching();
  let demandas = await daoDemanda.obtenerTodasDemandasServicio();
  for(let Oferta of ofertas){
    for(let Demanda of demandas){
      let count  = await daoTentativa.existe(Oferta.id, Demanda.id);
      if(count.length > 0) continue;
      await matching.hacerMatch("../tfg-aps/server/configuracion.txt", Oferta, Demanda);
    }
  }
  return 0;
});
match().then(() => {
  console.log("Matching completado.");
  process.exit();
}).catch((err) => {
  console.error("Error al hacer matching:", err);
  process.exit(1);
});



