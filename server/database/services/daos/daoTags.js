const knex = require("../../config");

//READ ALL TAGS THAN START WITH THE TEXT------------------------------------------------------------------------------------------------
function readByStartWithWord(text) {
    return knex("tags")
        .where("nombre", "like", `${text}%`)
        .select("*")
        .then((tags) => {
            return tags;
        });
}
//SELECT t.* FROM `oferta_demanda_tags` odt inner join `tags` t ON (odt.tag_id = t.id) WHERE object_id=126 and tipo like 'oferta'
function readByOferta(oferta_id) {
    return knex("oferta_demanda_tags")
        .select('tags.id','tags.nombre')
        .from("oferta_demanda_tags")
        .innerJoin("tags", "oferta_demanda_tags.tag_id", "tags.id")
        .where("object_id", oferta_id)
        .where("tipo", "like", "oferta")
        .then((tags) => {
            return tags;
        });
}
//funcion recibe los ids de las ofertas con formato de array
function readByOfertaIDs(ofertas_ids) {
    return knex("oferta_demanda_tags")
        .select('oferta_demanda_tags.object_id','tags.nombre')
        .from("oferta_demanda_tags")
        .innerJoin("tags", "oferta_demanda_tags.tag_id", "tags.id")
        .whereIn('object_id', ofertas_ids)
        .where("tipo", "like", "oferta")
        .then((tags) => {
            return tags;
        });
}
//funcion recibe los nombres de los tags los cuales se van a encargar de filtrar a las ofertas posibles
function getOfertasByTags(tags_names) {
    return knex("oferta_demanda_tags")
        .distinct('oferta_demanda_tags.object_id')
        .from("oferta_demanda_tags")
        .innerJoin("tags", "oferta_demanda_tags.tag_id", "tags.id")
        .whereIn('tags.nombre', tags_names)
        .then((ofertas) => {
            return ofertas;
        });
}
module.exports = {
    readByStartWithWord,
    readByOferta,
    readByOfertaIDs,
    getOfertasByTags
};
