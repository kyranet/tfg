require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const { dbConnection } = require("./database/config");

// Creo app express
const app = express();

// configurar CORS
app.use(cors());

// lectura y parsear json
app.use( express.json());
app.use(express.json());

// Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/mails", require("./routes/mails"));
app.use("/api/home", require("./routes/home"));
app.use("/api/ofertas", require("./routes/ofertas"));
app.use("/api/demandas", require("./routes/demandas"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/iniciativas", require("./routes/iniciativas"));
app.use("/api/partenariados", require("./routes/partenariados"));
app.use("/api/proyectos", require("./routes/proyectos"));

app.use("/api/upload", require("./routes/uploads"));

// cuando la peticion no es para el backend, servimos el frontend
app.use(express.static(__dirname + "/../dist/portal-aps"));

app.listen(process.env.PORT || 8080, () => {
  console.info("Servidor escuchando en puerto " + process.env.PORT || 8080);
});


/* fs = require('fs')
  dao_tentativa.obtenerDemandaServicio(130).then(function(demanda){
   dao_tentativa.obtenerOfertaServicio(131).then(function(oferta){
    var path  = "/configuracion.txt";
     matching.hacerMatch(__dirname + path, oferta, demanda);
   });
 }); */
