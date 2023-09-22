const knex = require("../../config");
const daoUsuario = require("./daoUsuario");
const transferIniciativa = require("../transfers/TIniciativa");

function crearIniciativa(iniciativa) {
  return knex("iniciativa")
    .insert({
      titulo: iniciativa.getTitulo(),
      descripcion: iniciativa.getDescripcion(),
      necesidad_social: iniciativa.getNecesidad_social(),
      id_estudiante: iniciativa.getEstudiante(),
      id_demanda: iniciativa.getDemanda(),
    })
    .then((id_iniciativa) => {
      let fieldsToInsert = {
        id_area: iniciativa.getArea_servicio(),
        id_iniciativa: id_iniciativa,
      };
      if (Array.isArray(iniciativa.getArea_servicio())) {
        let fieldsToInsert = iniciativa.getArea_servicio().map((area) => ({
          id_area: area,
          id_iniciativa: id_iniciativa,
        }));
      }
      return knex("areaservicio_iniciativa")
        .insert(fieldsToInsert)
        .then(() => {
          console.log(
            "Se ha introducido en la base de datos una iniciativa con id",
            id_iniciativa
          );
        });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al crear la iniciativa");
    });
}

function crearMatch(idOferta, idDemanda, porcentaje) {
  return knex("matching")
    .insert({
      id_oferta: idOferta,
      id_demanda: idDemanda,
      procesado: 1,
      emparejamiento: porcentaje,
    })
    .then(function (res) {
      console.log("El match se ha creado con exito");
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al intenatar crear el match");
    });
}

function obtenerIniciativa(id) {
  return knex("iniciativa")
    .where({ id: id })
    .select("*")
    .then((datos) => {
      return knex("areaservicio_iniciativa")
        .where({ id_iniciativa: id })
        .select("id_area")
        .then((id_areas) => {
          return knex("necesidad_social")
            .where({ id: datos[0]["necesidad_social"] })
            .select("nombre")
            .then((necesidad_social) => {
              id_areas_array = [];
              for (id_area of id_areas) {
                id_areas_array.push(id_area["id_area"]);
              }
              return knex
                .select("nombre")
                .from("area_servicio")
                .whereIn("id", id_areas_array)
                .then((areas_servicio) => {
                  areas = [];
                  for (area of areas_servicio) {
                    areas.push(area["nombre"]);
                  }
                  return new transferIniciativa(
                    (id = datos[0]["id"]),
                    (titulo = datos[0]["titulo"]),
                    (descripcion = datos[0]["descripcion"]),
                    (necesidad_social = necesidad_social[0]["nombre"]),
                    (demanda = datos[0]["id_demanda"]),
                    (area_servicio = areas),
                    (estudiante = datos[0]["id_estudiante"])
                  );
                });
            });
        });
    })
    .catch((err) => {
      console.log(err);
      tconsole.log(
        "Se ha producido un error al intentar obtener de la base de datos la iniciativa con id ",
        id
      );
    });
}

function obtenerIniciativasInternos() {
  return knex("iniciativa")
    .join(
      "necesidad_social",
      "iniciativa.necesidad_social",
      "=",
      "necesidad_social.id"
    )
    .join(
      "estudiante_interno",
      "iniciativa.id_estudiante",
      "=",
      "estudiante_interno.id"
    )
    .join(
      "datos_personales_interno",
      "estudiante_interno.datos_personales_Id",
      "=",
      "datos_personales_interno.id"
    )
    .select(
      "iniciativa.id",
      "iniciativa.titulo",
      "iniciativa.descripcion",
      "necesidad_social.nombre as necesidad",
      "iniciativa.id_demanda as demanda",
      "datos_personales_interno.nombre as estudiante"
    );
}
function obtenerIniciativasExternos() {
  return knex("iniciativa")
    .join(
      "necesidad_social",
      "iniciativa.necesidad_social",
      "=",
      "necesidad_social.id"
    )
    .join(
      "estudiante_externo",
      "iniciativa.id_estudiante",
      "=",
      "estudiante_externo.id"
    )
    .join(
      "datos_personales_externo",
      "estudiante_externo.datos_personales_Id",
      "=",
      "datos_personales_externo.id"
    )
    .select(
      "iniciativa.id",
      "iniciativa.titulo",
      "iniciativa.descripcion",
      "necesidad_social.nombre as necesidad",
      "iniciativa.id_demanda as demanda",
      "datos_personales_externo.nombre as estudiante"
    );
}
function obtenerTodasIniciativas() {
  return obtenerIniciativasInternos()
    .then((internos) => {
      return obtenerIniciativasExternos().then((externos) => {
        return knex("areaservicio_iniciativa")
          .join(
            "area_servicio",
            "areaservicio_iniciativa.id_area",
            "=",
            "area_servicio.id"
          )
          .select(
            "areaservicio_iniciativa.id_iniciativa",
            "area_servicio.nombre as area"
          )
          .then((areas) => {
            let transfersIniciativas = [];
            internos.forEach((dato) => {
              let areas_servicio = [];
              areas.forEach((area) => {
                if (area["id_iniciativa"] === dato["id"]) {
                  areas_servicio.push(area["area"]);
                }
              });
              let transfer = new transferIniciativa(
                dato["id"],
                dato["titulo"],
                dato["descripcion"],
                dato["necesidad"],
                dato["demanda"],
                areas_servicio,
                dato["estudiante"]
              );
              transfersIniciativas.push(transfer);
            });
            externos.forEach((dato) => {
              areas_servicio = [];
              areas.forEach((area) => {
                if (area["id_iniciativa"] === dato["id"]) {
                  areas_servicio.push(area["area"]);
                }
              });
              transfer = new transferIniciativa(
                dato["id"],
                dato["titulo"],
                dato["descripcion"],
                dato["necesidad"],
                dato["demanda"],
                areas_servicio,
                dato["estudiante"]
              );
              transfersIniciativas.push(transfer);
            });
            return transfersIniciativas;
          });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener de la base de datos todas las iniciativas "
      );
    });
}

function actualizarIniciativa(iniciativa) {
  return knex("iniciativa")
    .where("id", iniciativa.getId())
    .update({
      titulo: iniciativa.getTitulo(),
      descripcion: iniciativa.getDescripcion(),
      id_demanda: iniciativa.getDemanda(),
      necesidad_social: iniciativa.getNecesidad_social(),
    })
    .then(() => {
      return knex("areaservicio_iniciativa")
        .where("id_iniciativa", iniciativa.getId())
        .del()
        .then(() => {
          areasServicio = iniciativa.getArea_servicio();
          let fieldsToInsert = {
            id_area: areasServicio,
            id_iniciativa: iniciativa.getId(),
          };
          if (Array.isArray(areasServicio)) {
            fieldsToInsert = areasServicio.map((area) => ({
              id_area: area,
              id_iniciativa: iniciativa.getId(),
            }));
          }
          return knex("areaservicio_iniciativa")
            .insert(fieldsToInsert)
            .then(() => {
              return iniciativa.getId();
            });
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar actualizar en la base de datos la iniciativa con id ",
        iniciativa.getId()
      );
    });
}

function eliminarIniciativa(id) {
  return knex("iniciativa")
    .where("id", id)
    .del()
    .then((result) => {
      if (result > 0) {
        console.log(
          "Se ha eliminado de la base de datos la inciativa con id ",
          id
        );
      } else {
        console.log("No existe la iniciativa con id ", id);
      }
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar eliminar de la base de datos la iniciativa con id ",
        id
      );
    });
}

function obtenerListaNecesidadSocial() {
  return knex("necesidad_social")
    .select("*")
    .then((areas) => {
      return areas;
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener todas las necesidades sociales"
      );
    });
}

function obtenerAreaServicioTitulacionPorArea(servicios) {
  return knex
      .select("titulacion")
      .from("matching_areaservicio_titulacion")
      .whereIn("area_servicio", servicios)
      .catch((err) => {
          console.log(err);
          console.log(
              "Se ha producido un error al intentar obtener datos de la tabla matching_areaservicio_titulacion"
          );
      });
}

function obtenerAreaServicioConocimientoPorArea(servicios) {
  return knex
      .select("area_conocimiento")
      .from("matching_areas")
      .whereIn("area_servicio", servicios)
      .catch((err) => {
          console.log(err);
          console.log(
              "Se ha producido un error al intentar obtener datos de la tabla matching_areas"
          );
      });
}

function existe(id_oferta, id_demanda){
  return knex.from("matching").where("id_oferta" ,"=", id_oferta).andWhere("id_demanda", "=", id_demanda).catch((err) => {
    console.log(err);
    console.log(
        "Se ha producido un error al intentar obtener datos de la tabla matching_areas"
    );
  });
}

module.exports = {
  crearIniciativa,
  crearMatch,
  obtenerIniciativa,
  obtenerTodasIniciativas,
  actualizarIniciativa,
  obtenerListaNecesidadSocial,
  eliminarIniciativa,
  obtenerAreaServicioTitulacionPorArea,
  obtenerAreaServicioConocimientoPorArea,
  existe

};