const knex = require("../../config");
const daoUsuario = require("./daoUsuario");
const daoTags = require("./daoTags");
const transferOfertaServicio = require("../transfers/TOfertaServicio");
const transferAnuncioServicio = require("../transfers/TAnuncioServicio");
const transferPartenariado = require("../transfers/TPartenariado");

function obtenerPartenariados(limit, offset, filters) {
    let fil = JSON.parse(filters); // tomamos los tags name para buscarlo en la tabla de relaciones si esta vacio este array entonces lo que vot hacer es usar un pivote de -1 para conseguir un true en la parte dekl condcional
    let query =
        "select * from partenariado p inner join oferta_servicio of on (p.id_oferta = of.id) inner join demanda_servicio ds on (p.id_demanda = ds.id)";
    query = !fil.creador
        ? query
        : query + ` where of.creador=${fil.creador} or ds.creador=${fil.creador}`;
    return knex
        .raw(query)
        .then((res) => { 
            return res[0].map(x => new transferPartenariado(x.id,x.finalidad,x.observaciones_temporales,false,x.creador,[],x.id_demanda,x.id_oferta,x.estado));
        })
        .catch((err) => {
            console.log(err);
            console.log(
                "Se ha producido un error al intentar obtener de la base de datos todas las ofertas de servicio "
            );
        });
}

module.exports = {
    obtenerPartenariados,
};
