const knex = require("../../config");

//Crea y linkea el tag a la oferta y/o demandas()
//preparado para recibir nombre de tag, id de oferta o demanda, type [oferta o demanda]
function createAndLinkedTags(tagName, objectId, type) {
    return knex("tags")
    .where({nombre: tagName})
    .select("*")
    .then((tags) => {
        //si n oexiste l tag lo creamos y linkeamos
        if(tags.length==0){
            return knex("tags")
            .insert({
                nombre: tagName,
            })
            .then((tagId) => {
                return knex("oferta_demanda_tags")
                    .insert({
                        tag_id: tagId[0],
                        object_id: objectId,
                        tipo: type,
                    })
                    .then(function (ofer_demanda_id) {
                        console.log(`Se ha introducido el tag con id ${ofer_demanda_id[0]}`);
                    })
                    .catch((err) => {
                        console.log(err);
                        console.log("Se ha producido un error al linkear el tag con el objeto.",tagId[0]);
                        return knex("tags")
                            .where("id", tagId[0])
                            .del();
                    });
            })
            .catch((err) => {
                console.log(err);
                console.log(
                    "Se ha producido un error al intentar crear el tag",tagName
                );
            });
        }
        //si ya existe hay que linkearlo unicamente
        else{
            //antes de linkear compruebo que ya no exista en la base de datos
            return knex("oferta_demanda_tags")
            .where({
                tag_id: tags[0]['id'],
                object_id: objectId,
                tipo: type,
            })
            .select("*")
            .then((of_dem_tags) => {
                //si n oexiste l tag lo creamos y linkeamos
                if(of_dem_tags.length==0){
                    return knex("oferta_demanda_tags")
                    .insert({
                        tag_id: tags[0]['id'],
                        object_id: objectId,
                        tipo: type,
                    })
                    .then(function (ofer_demanda_id) {
                        console.log(`Se ha introducido el tag con id ${ofer_demanda_id[0]}`);
                    })
                    .catch((err) => {
                        console.log(err);
                        console.log("Se ha producido un error al linkear el tag con el objeto.",tags[0]['id']);
                        return knex("tags")
                            .where("id", tags[0]['id'])
                            .del();
                    });
                } 
            });
        } 
    }); 
} 

module.exports = {
    createAndLinkedTags
};
