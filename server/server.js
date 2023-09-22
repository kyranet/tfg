const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const {dbConnection} = require("./database/config");

// Creo app express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parsear json
app.use(express.json());

// Rutas 
app.use('/api/photos', express.static(__dirname + '/uploads/usuarios')); 

app.use("/api/auth", require("./routes/auth"));
app.use("/api/mails", require("./routes/mails"));
app.use("/api/home", require("./routes/home"));
app.use("/api/ofertas", require("./routes/ofertas"));
app.use("/api/ofertasAreaServicio", require("./routes/ofertas"));/**/
app.use("/api/demandasAreaServicio", require("./routes/demandas"));/**/
app.use("/api/demandas", require("./routes/demandas"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/iniciativas", require("./routes/iniciativas"));
app.use("/api/partenariados", require("./routes/partenariados"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/upload", require("./routes/uploads"));
app.use("/api/tags", require("./routes/tags"));

// Cuando la peticion no es para el backend, servimos el frontend
app.use(express.static(__dirname + "/../dist/portal-aps"));


app.listen(process.env.PORT, () => {
    console.info("Servidor escuchando en puerto " + process.env.PORT);
});
