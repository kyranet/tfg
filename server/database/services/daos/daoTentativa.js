const knex = require("../../config");
const daoUsuario = require("./daoUsuario");
const transferIniciativa = require("../transfers/TIniciativa");
const transferOfertaServicio = require("../transfers/TOfertaServicio");
const transferAnuncioServicio = require("../transfers/TAnuncioServicio");
const transferDemandaServicio = require("../transfers/TDemandaServicio");
//INSERTAR------------------------------------------------------------------------------------------------
function crearAnuncio(anuncio) {
  return knex("anuncio_servicio")
    .insert({
      titulo: anuncio.getTitulo(),
      descripcion: anuncio.getDescripcion(),
      imagen: anuncio.getImagen(),
      dummy: anuncio.dummy,
    })
    .then((id_anuncio) => {
      let areasServicio = anuncio.getArea_servicio();
      let fieldsToInsert = { id_area: areasServicio, id_anuncio: id_anuncio };
      if (Array.isArray(areasServicio)) {
        console.log("Se va a proceder a insertar las areas de servicio");
        fieldsToInsert = areasServicio.map((area) => ({
          id_area: area,
          id_anuncio: id_anuncio,
        }));
        return knex("areaservicio_anuncioservicio")
          .insert(fieldsToInsert)
          .then(() => {
            console.log("Se han insertado las areas de servicio")
            return id_anuncio;
          });
      } else {
        return knex("areaservicio_anuncioservicio")
          .insert({ id_area: areasServicio, id_anuncio: id_anuncio })
          .then(() => {
            return id_anuncio;
          });
      }
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar crear el anuncio con titulo ",
        titulo
      );
    });
}

function crearOferta(oferta) {
  return crearAnuncio(oferta)
    .then(function (id_anuncio) {
      return knex("oferta_servicio")
        .insert({
          id: id_anuncio[0],
          cuatrimestre: oferta.getCuatrimestre(),
          anio_academico: oferta.getAnio_academico(),
          fecha_limite: oferta.getFecha_limite(),
          observaciones_temporales: oferta.getObservaciones_temporales(),
          creador: oferta.getCreador(),
        })
        .then(function (result) {
          id = id_anuncio[0];
          asignaturas = oferta.getAsignatura_objetivo();
          let fieldsToInsert = {
            id_oferta: id_anuncio[0],
            nombre: asignaturas,
          };
          if (Array.isArray(asignaturas)) {
            fieldsToInsert = asignaturas.map((asignatura) => ({
              id_oferta: id_anuncio[0],
              nombre: asignatura,
            }));
          }
          return knex("asignatura")
            .insert(fieldsToInsert)
            .then(() => {
              let profesores = oferta.getProfesores();
              let fieldsToInsert2 = {
                id_profesor: profesores,
                id_oferta: id_anuncio[0],
              };
              if (Array.isArray(profesores)) {
                fieldsToInsert2 = profesores.map((profesor) => ({
                  id_profesor: profesor,
                  id_oferta: id_anuncio[0],
                }));
              }
              return knex("profesorinterno_oferta")
                .insert(fieldsToInsert2)
                .then(() => {
                  console.log(
                    "Se ha introducido la oferta con id ",
                    id_anuncio[0]
                  );
                });
            });
        })
        .catch((err) => {
          console.log(err);
          console.log(
            "Se ha producido un error al crear en la base de datos la oferta de servicio ",
            id_anuncio[0]
          );
          return knex("anuncio_servicio").where("id", id_anuncio[0]).del();
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al crear en la base de datos la oferta de servicio"
      );
    });
}

function crearDemanda(demanda) {
  return crearAnuncio(demanda)
    .then(function (id_anuncio) {
      return knex("demanda_servicio")
        .insert({
          id: id_anuncio[0],
          creador: demanda.getCreador(),
          ciudad: demanda.getCiudad(),
          finalidad: demanda.getFinalidad(),
          periodo_definicion_ini: demanda.getPeriodo_definicion_ini(),
          periodo_definicion_fin: demanda.getPeriodo_definicion_fin(),
          periodo_ejecucion_ini: demanda.getPeriodo_ejecucion_ini(),
          periodo_ejecucion_fin: demanda.getPeriodo_ejecucion_fin(),
          fecha_fin: demanda.getFecha_fin(),
          observaciones_temporales: demanda.getObservaciones_temporales(),
          necesidad_social: demanda.getNecesidad_social(),
          comunidad_beneficiaria: demanda.getComunidad_Beneficiaria()
        })
        .then(function () {
          let titulaciones = demanda.getTitulacionlocal_demandada();
          console.log("Las titulaciones a insertar son ", titulaciones);
          let fieldsToInsert = {
            id_titulacion: titulaciones,
            id_demanda: id_anuncio[0],
          };
          if (Array.isArray(titulaciones)) {
            console.log("Ahora se va a proceder a insertar el array de titulaciones ", titulaciones);
            fieldsToInsert = titulaciones.map((titulacion) => ({
              id_titulacion: titulacion,
              id_demanda: id_anuncio[0],
            }));
          }
          return knex("titulacionlocal_demanda")
            .insert(fieldsToInsert)
            .then(() => {
              console.log(
                "Se ha introducido la demanda con id ",
                id_anuncio[0]
              );
            });
        })
        .catch((err) => {
          console.log(err);
          console.log(
            "Se ha producido un error al crear en la base de datos la demanda de servicio ",
            id_anuncio[0]
          );
          return knex("anuncio_servicio").where("id", id_anuncio[0]).del();
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al crear en la base de datos la demanda de servicio con id ",
        demanda.getId()
      );
    });
}

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

//LEER UN ELEMENTO----------------------------------------------------------------------------------------------------
function obtenerAnuncioServicio(id_anuncio) {
  return knex("anuncio_servicio")
    .where({ id: id_anuncio })
    .select("*")
    .then((anuncio) => {
      return obtenerAreaServicio(id_anuncio).then((areas_servicio) => {
        areas = [];
        for (area of areas_servicio) {
          areas.push(area["nombre"]);
        }
        return new transferAnuncioServicio(
          id_anuncio,
          anuncio[0]["titulo"],
          anuncio[0]["descripcion"],
          anuncio[0]["imagen"],
          anuncio[0]["created_at"],
          anuncio[0]["updated_at"],
          areas,
          anuncio[0]["dummy"]
        );
      });
    });
}

// Devuelve la demanda que tenga el id = "id_demanda"
function obtenerDemandaServicio(id_demanda) {
  return obtenerAnuncioServicio(id_demanda)
    .then(function (anuncio) {
      return knex("demanda_servicio")
        .where({ id: id_demanda })
        .select("*")
        .then(function (demanda) {
          return knex("necesidad_social")
            .where({ id: demanda[0]["necesidad_social"] })
            .select("nombre")
            .then(function (necesidad_social) {
              return daoUsuario
                .obtenerSocioComunitario(demanda[0]["creador"])
                .then((socio) => {
                  return obtenerTitulacionLocal(id_demanda).then(function (
                    titulaciones
                  ) {
                    titulaciones_ref = [];
                    for (titulacion of titulaciones) {
                      titulaciones_ref.push(titulacion["nombre"]);
                    }
                    necesidad_social = necesidad_social[0]["nombre"];
                    return new transferDemandaServicio(
                      demanda[0]["id"],
                      anuncio.getTitulo(),
                      anuncio.getDescripcion(),
                      anuncio.getImagen(),
                      anuncio.getCreated_at(),
                      anuncio.getUpdated_at(),
                      socio.getNombreSocioComunitario(),
                      demanda[0]["ciudad"],
                      demanda[0]["finalidad"],
                      demanda[0]["periodo_definicion_ini"],
                      demanda[0]["periodo_definicion_fin"],
                      demanda[0]["periodo_ejecucion_ini"],
                      demanda[0]["periodo_ejecucion_fin"],
                      demanda[0]["fecha_fin"],
                      demanda[0]["observaciones_temporales"],
                      necesidad_social,
                      titulaciones_ref,
                      anuncio.getArea_servicio(),
                      anuncio.dummy
                    );
                  });
                });
            });
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener de la base de datos la demanda de servicio con id ",
        id_demanda
      );
    });
}

// Devuelve la oferta que tenga el id = "id_oferta"
function obtenerOfertaServicio(id_oferta) {
  return obtenerAnuncioServicio(id_oferta)
    .then(function (anuncio) {
      return knex("oferta_servicio")
        .where({ id: id_oferta })
        .select("*")
        .then(function (oferta) {
          return knex("profesorinterno_oferta")
            .where({ id_oferta: id_oferta })
            .select("id_profesor")
            .then((datos_profesores) => {
              let arrayProfesores = [];
              datos_profesores.forEach((profesor) => {
                arrayProfesores.push(profesor["id_profesor"]);
              });
              return daoUsuario
                .obtenerProfesorInterno(oferta[0]["creador"])
                .then((responsable) => {
                  return daoUsuario
                    .obtenerProfesoresInternos(arrayProfesores)
                    .then(function (profesores) {
                      return obtenerAsignaturaObjetivo(id_oferta).then(
                        (asignaturas) => {
                          asignaturas_ref = [];
                          for (asignatura of asignaturas) {
                            asignaturas_ref.push(asignatura["nombre"]);
                          }
                          return new transferOfertaServicio(
                            oferta[0]["id"],
                            anuncio.getTitulo(),
                            anuncio.getDescripcion(),
                            anuncio.getImagen(),
                            anuncio.getCreated_at(),
                            anuncio.getUpdated_at(),
                            asignaturas_ref,
                            oferta[0]["cuatrimestre"],
                            oferta[0]["anio_academico"],
                            oferta[0]["fecha_limite"],
                            oferta[0]["observaciones_temporales"],
                            { id: responsable.getId(), 
                              nombre: responsable.getNombre(), 
                              apellidos: responsable.getApellidos()
                            },
                            anuncio.getArea_servicio(),
                            profesores,
                            oferta[0]["dummy"]
                          );
                        }
                      );
                    });
                });
            });
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener de la base de datos la oferta de servicio con id ",
        id_oferta
      );
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

//LEER TODOS LOS ELEMENTOS------------------------------------------------------------------------------------------------
function obtenerTodasOfertasServicio() {
  return knex("anuncio_servicio")
    .join("oferta_servicio", "anuncio_servicio.id", "=", "oferta_servicio.id")
    .join(
      "profesor_interno",
      "oferta_servicio.creador",
      "=",
      "profesor_interno.id"
    )
    .join(
      "datos_personales_interno",
      "profesor_interno.datos_personales_Id",
      "=",
      "datos_personales_interno.id"
    )
    .select(
      "anuncio_servicio.id",
      "anuncio_servicio.titulo",
      "anuncio_servicio.descripcion",
      "anuncio_servicio.imagen",
      "anuncio_servicio.created_at",
      "anuncio_servicio.updated_at",
      "oferta_servicio.cuatrimestre",
      "oferta_servicio.anio_academico",
      "oferta_servicio.fecha_limite",
      "oferta_servicio.observaciones_temporales",
      "datos_personales_interno.nombre",
      "datos_personales_interno.apellidos"
    )
    .then((datos_ofertas) => {
      return knex("areaservicio_anuncioservicio")
        .join(
          "area_servicio",
          "areaservicio_anuncioservicio.id_area",
          "=",
          "area_servicio.id"
        )
        .select(
          "areaservicio_anuncioservicio.id_anuncio",
          "area_servicio.nombre as area"
        )
        .then((areas) => {
          return knex
            .select("*")
            .from("asignatura")
            .then((asignaturas) => {
              let transfer_ofertas = [];
              datos_ofertas.forEach((datos) => {
                let nombre = datos["nombre"];
                let apellidos = datos["apellidos"];
                let creador = { nombre, apellidos };
                let areas_servicio = [];
                areas.forEach((area) => {
                  if (area["id_anuncio"] === datos["id"]) {
                    areas_servicio.push(area["area"]);
                  }
                });
                let asignaturas_objetivo = [];
                asignaturas.forEach((asignatura) => {
                  if (datos["id"] === asignatura["id_oferta"]) {
                    asignaturas_objetivo.push(asignatura["nombre"]);
                  }
                });
                let transfer_oferta = new transferOfertaServicio(
                  datos["id"],
                  datos["titulo"],
                  datos["descripcion"],
                  datos["imagen"],
                  datos["created_at"],
                  datos["updated_at"],
                  asignaturas_objetivo,
                  datos["cuatrimestre"],
                  datos["anio_academico"],
                  datos["fecha_limite"],
                  datos["observaciones_temporales"],
                  creador,
                  areas_servicio
                );
                transfer_ofertas.push(transfer_oferta);
              });
              return transfer_ofertas;
            });
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener de la base de datos todas las ofertas de servicio "
      );
    });
}

function obtenerTodasDemandasServicio() {
  return knex("anuncio_servicio")
    .join("demanda_servicio", "anuncio_servicio.id", "=", "demanda_servicio.id")
    .join(
      "necesidad_social",
      "demanda_servicio.necesidad_social",
      "=",
      "necesidad_social.id"
    )
    .join("socio_comunitario", "demanda_servicio.creador", "=", "socio_comunitario.id")
    .join(
      "datos_personales_externo",
      "socio_comunitario.datos_personales_Id",
      "=",
      "datos_personales_externo.id"
    )
    .select(
      "anuncio_servicio.id",
      "anuncio_servicio.titulo",
      "anuncio_servicio.descripcion",
      "anuncio_servicio.imagen",
      "anuncio_servicio.created_at",
      "anuncio_servicio.updated_at",
      "demanda_servicio.ciudad",
      "demanda_servicio.finalidad",
      "demanda_servicio.fecha_fin",
      "demanda_servicio.observaciones_temporales",
      "demanda_servicio.periodo_definicion_ini",
      "demanda_servicio.periodo_definicion_fin",
      "demanda_servicio.periodo_ejecucion_ini",
      "demanda_servicio.periodo_ejecucion_fin",
      "necesidad_social.nombre as necesidad",
      "datos_personales_externo.nombre",
      "datos_personales_externo.apellidos"
    )
    .then((datos_demandas) => {
      return knex("areaservicio_anuncioservicio")
        .join(
          "area_servicio",
          "areaservicio_anuncioservicio.id_area",
          "=",
          "area_servicio.id"
        )
        .select(
          "areaservicio_anuncioservicio.id_anuncio",
          "area_servicio.nombre as area"
        )
        .then((areas) => {
          return knex("titulacionlocal_demanda")
            .join(
              "titulacion_local",
              "titulacionlocal_demanda.id_titulacion",
              "=",
              "titulacion_local.id"
            )
            .select(
              "titulacionlocal_demanda.id_demanda",
              "titulacion_local.nombre as titulacion"
            )
            .then((titulaciones) => {
              let transfer_demandas = [];
              datos_demandas.forEach((datos) => {
                let nombre = datos["nombre"];
                let apellidos = datos["apellidos"];
                let creador = { nombre, apellidos };
                let areas_servicio = [];
                areas.forEach((area) => {
                  if (area["id_anuncio"] === datos["id"]) {
                    areas_servicio.push(area["area"]);
                  }
                });
                let titulaciones_objetivo = [];
                titulaciones.forEach((titulacion) => {
                  if (titulacion["id_demanda"] === datos["id"]) {
                    titulaciones_objetivo.push(titulacion["titulacion"]);
                  }
                });
                let transfer_demanda = new transferDemandaServicio(
                  datos["id"],
                  datos["titulo"],
                  datos["descripcion"],
                  datos["imagen"],
                  datos["created_at"],
                  datos["updated_at"],
                  creador,
                  datos["ciudad"],
                  datos["finalidad"],
                  datos["periodo_definicion_ini"],
                  datos["periodo_definicion_fin"],
                  datos["periodo_ejecucion_ini"],
                  datos["periodo_ejecucion_fin"],
                  datos["fecha_fin"],
                  datos["observaciones_temporales"],
                  datos["necesidad"],
                  titulaciones_objetivo,
                  areas_servicio
                );
                transfer_demandas.push(transfer_demanda);
              });
              return transfer_demandas;
            });
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener de la base de datos todas las ofertas de servicio "
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

//ACTUALIZAR--------------------------------------------------------------------------------------------------
function actualizarAnuncio(anuncio) {
  return knex("anuncio_servicio")
    .where("id", anuncio.getId())
    .update({
      titulo: anuncio.getTitulo(),
      descripcion: anuncio.getDescripcion(),
      imagen: anuncio.getImagen(),
    })
    .then(() => {
      return knex("areaservicio_anuncioservicio")
        .where("id_anuncio", anuncio.getId())
        .del()
        .then(() => {
          let areasServicio = anuncio.getArea_servicio();
          let fieldsToInsert = {
            id_area: areasServicio,
            id_anuncio: anuncio.getId(),
          };
          if (Array.isArray(areasServicio)) {
            fieldsToInsert = areasServicio.map((area) => ({
              id_area: area,
              id_anuncio: anuncio.getId(),
            }));
          }
          return knex("areaservicio_anuncioservicio").insert(fieldsToInsert);
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar actualizar el anuncio con titulo ",
        titulo
      );
    });
}

function actualizarOfertaServicio(oferta) {
  return obtenerAnuncioServicio(oferta.getId()).then((copia_anuncio) => {
    return actualizarAnuncio(oferta)
      .then(function () {
        return knex("oferta_servicio")
          .where("id", oferta.getId())
          .update({
            cuatrimestre: oferta.getCuatrimestre(),
            anio_academico: oferta.getAnio_academico(),
            fecha_limite: oferta.getFecha_limite(),
            observaciones_temporales: oferta.getObservaciones_temporales(),
            creador: oferta.getCreador(),
          })
          .then(function (result) {
            return knex("asignatura")
              .where("id_oferta", oferta.getId())
              .del()
              .then(() => {
                asignaturas = oferta.getAsignatura_objetivo();
                let fieldsToInsert = {
                  id_oferta: oferta.getId(),
                  nombre: asignaturas,
                };
                if (Array.isArray(asignaturas)) {
                  fieldsToInsert = asignaturas.map((asignatura) => ({
                    id_oferta: oferta.getId(),
                    nombre: asignatura,
                  }));
                }
                return knex("asignatura")
                  .insert(fieldsToInsert)
                  .then(() => {
                    return knex("profesorinterno_oferta")
                      .where("id_oferta", oferta.getId())
                      .del()
                      .then(() => {
                        profesores = oferta.getProfesores();
                        let fieldsToInsert2 = {
                          id_profesor: profesores,
                          id_oferta: oferta.getId(),
                        };
                        if (Array.isArray(profesores)) {
                          fieldsToInsert2 = profesores.map((profesor) => ({
                            id_profesor: profesor,
                            id_oferta: oferta.getId(),
                          }));
                        }
                        return knex("profesorinterno_oferta")
                          .insert(fieldsToInsert2)
                          .then(() => {
                            console.log(
                              "Se ha actualizado la oferta con id ",
                              oferta.getId()
                            );
                          });
                      });
                  });
              });
          })
          .catch((err) => {
            console.log(err);
            let nombre_areas = copia_anuncio.getArea_servicio();
            return obtenerIdsAreas(nombre_areas).then((ids_areas) => {
              copia_anuncio.setArea_servicio(ids_areas);
              return actualizarAnuncio(copia_anuncio).then(() => {
                console.log(
                  "Se ha producido un error al intentar actualizar en la base de datos la oferta de servicio con id ",
                  oferta.getId()
                );
              });
            });
          });
      })
      .catch((err) => {
        console.log(err);
        console.log(
          "Se ha producido un error al intentar actualizar en la base de datos la oferta de servicio con id ",
          oferta.getId()
        );
      });
  });
}

function actualizarDemanda(demanda) {
  return obtenerAnuncioServicio(demanda.getId()).then((copia_anuncio) => {
    return actualizarAnuncio(demanda)
      .then(function (id_anuncio) {
        return knex("demanda_servicio")
          .where("id", demanda.getId())
          .update({
            creador: demanda.getCreador(),
            ciudad: demanda.getCiudad(),
            finalidad: demanda.getFinalidad(),
            periodo_definicion_ini: demanda.getPeriodo_definicion_ini(),
            periodo_definicion_fin: demanda.getPeriodo_definicion_fin(),
            periodo_ejecucion_ini: demanda.getPeriodo_ejecucion_ini(),
            periodo_ejecucion_fin: demanda.getPeriodo_ejecucion_fin(),
            fecha_fin: demanda.getFecha_fin(),
            observaciones_temporales: demanda.getObservaciones_temporales(),
            necesidad_social: demanda.getNecesidad_social(),
          })
          .then(function () {
            return knex("titulacionlocal_demanda")
              .where("id_demanda", demanda.getId())
              .del()
              .then(() => {
                let titulaciones = demanda.getTitulacionlocal_demandada();
                let fieldsToInsert = {
                  id_titulacion: titulaciones,
                  id_demanda: demanda.getId(),
                };
                if (Array.isArray(titulaciones)) {
                  fieldsToInsert = titulaciones.map((titulacion) => ({
                    id_titulacion: titulacion,
                    id_demanda: demanda.getId(),
                  }));
                }
                return knex("titulacionlocal_demanda")
                  .insert(fieldsToInsert)
                  .then(() => {
                    console.log(
                      "Se ha actualizado la demanda con id ",
                      demanda.getId()
                    );
                  });
              });
          })
          .catch((err) => {
            console.log(err);
            let nombre_areas = copia_anuncio.getArea_servicio();
            return obtenerIdsAreas(nombre_areas).then((ids_areas) => {
              copia_anuncio.setArea_servicio(ids_areas);
              return actualizarAnuncio(copia_anuncio).then(() => {
                console.log(
                  "Se ha producido un error al intentar actualizar en la base de datos la demanda de servicio con id ",
                  demanda.getId()
                );
              });
            });
          });
      })
      .catch((err) => {
        console.log(err);
        console.log(
          "Se ha producido un error al intentar actualizar en la base de datos la demanda de servicio con id ",
          demanda.getId()
        );
      });
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

//ELIMINAR UN ELEMENTO---------------------------------------------------------------------------------------------------
function eliminarAnuncio(id) {
  return knex("anuncio_servicio")
    .where("id", id)
    .del()
    .then((result) => {
      if (result > 0) {
        console.log(
          "Se ha eliminado de la base de datos el anuncio con id ",
          id
        );
      } else {
        console.log("No existe el anuncio de servicio con id ", id);
      }
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar eliminar de la base de datos el anuncio de servicio con id ",
        id
      );
    });
}

function eliminarOferta(id_oferta) {
  return knex("oferta_servicio")
    .where("id", id_oferta)
    .del()
    .then((result) => {
      return eliminarAnuncio(id_oferta).then(() => {
        if (result > 0) {
          console.log(
            "Se ha eliminado de la base de datos la oferta con id ",
            id_oferta
          );
        } else {
          console.log("No existe la oferta de servicio con id ", id_oferta);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar eliminar de la base de datos la oferta de servicio con id ",
        id_oferta
      );
    });
}

function eliminarDemanda(id_demanda) {
  return knex("demanda_servicio")
    .where("id", id_demanda)
    .del()
    .then((result) => {
      return eliminarAnuncio(id_demanda).then(() => {
        if (result > 0) {
          console.log(
            "Se ha eliminado de la base de datos la demanda con id ",
            id_demanda
          );
        } else {
          console.log("No existe la demanda de servicio con id ", id_demanda);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar eliminar de la base de datos la demanda de servicio con id ",
        id_demanda
      );
    });
}

function eliminarAnuncio(id) {
  return knex("anuncio_servicio")
    .where("id", id)
    .del()
    .then((result) => {
      if (result > 0) {
        console.log(
          "Se ha eliminado de la base de datos el anuncio con id ",
          id
        );
      } else {
        console.log("No existe el anuncio de servicio con id ", id);
      }
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar eliminar de la base de datos el anuncio de servicio con id ",
        id
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

// MÉTODOS AUXILIARES----------------------------------------------------------------------------------------------------
function obtenerAsignaturaObjetivo(id_oferta) {
  return knex("asignatura")
    .where({ id_oferta: id_oferta })
    .select("nombre")
    .catch((err) => {
      console.log(
        "No se ha encontrado la asignatura objetivo perteneciente a la oferta de servicio con id ",
        id_demanda
      );
      throw err;
    });
}

function obtenerTitulacionLocal(id_demanda) {
  return knex("titulacionlocal_demanda")
    .where({ id_demanda: id_demanda })
    .select("id_titulacion")
    .then(function (id_titulaciones) {
      titulaciones = [];
      for (id_titulacion of id_titulaciones) {
        titulaciones.push(id_titulacion["id_titulacion"]);
      }
      return knex
        .select("id")
        .select("nombre")
        .from("titulacion_local")
        .whereIn("id", titulaciones);
    })
    .catch((err) => {
      console.log(
        "No se ha encontrado titulación perteneciente a la demanda de servicio con id ",
        id_demanda
      );
      throw err;
    });
}

// Obtiene el area de servicio correspondiente al id de un anuncio de servicio
function obtenerAreaServicio(id_anuncio) {
  return knex("areaservicio_anuncioservicio")
    .where({ id_anuncio: id_anuncio })
    .select("id_area")
    .then(function (id_areas) {
      areas = [];
      for (id_area of id_areas) {
        areas.push(id_area["id_area"]);
      }
      return knex.select("*").from("area_servicio").whereIn("id", areas);
    })
    .catch((err) => {
      console.log(
        "No se ha encontrado el area de servicio perteneciente al anuncio de servicio con id ",
        id_anuncio
      );
      throw err;
    });
}

function obtenerListaAreasServicio() {
  return knex("area_servicio")
    .select("*")
    .then((areas) => {
      return areas;
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener todas las areas de servicio"
      );
    });
}

function obtenerListaTitulacionLocal() {
  return knex("titulacion_local")
    .select("*")
    .then((areas) => {
      return areas;
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener todas las titulaciones locales"
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

function obtenerIdsAreas(nombre_areas) {
  return knex("area_servicio")
    .whereIn("nombre", nombre_areas)
    .select("id")
    .then((ids) => {
      let ids_areas = [];
      ids.forEach((id) => {
        ids_areas.push(id["id"]);
      });
      return ids_areas;
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener las ids a partir de los nombres de area"
      );
    });
}

function obtenerAreasServicio(id_anuncio) {
  return knex("areaservicio_anuncioservicio")
    .join(
      "area_servicio",
      "areaservicio_anuncioservicio.id_area",
      "=",
      "area_servicio.id"
    )
    .where({ id_anuncio: id_anuncio })
    .select("area_servicio.nombre")
    .then((areas) => {
      var nombres_areas = [];
      areas.forEach((area) => {
        nombres_areas.push(area["nombre"]);
      });
      return nombres_areas;
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener el area de servicio del anuncio ",
        id_anuncio
      );
    });
}

function obtenerListaAreasServicio() {
  return knex("area_servicio")
    .select("id")
    .select("nombre")
    .then((areas) => {
      return areas;
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener todas las areas de servicio"
      );
    });
}

function obtenerCreadorOferta(id) {
  return knex("oferta_servicio")
    .where({ id: id })
    .select("creador")
    .then((creador) => {
      return creador[0]["creador"];
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener el creador de la oferta ",
        id
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

module.exports = {
  crearOferta,
  crearAnuncio,
  crearDemanda,
  crearIniciativa,
  crearMatch,
  actualizarDemanda,
  actualizarOfertaServicio,
  actualizarIniciativa,
  obtenerOfertaServicio,
  obtenerDemandaServicio,
  obtenerIniciativa,
  obtenerAreaServicioConocimientoPorArea,
  obtenerAreaServicioTitulacionPorArea,
  obtenerTodasOfertasServicio,
  obtenerTodasDemandasServicio,
  obtenerTodasIniciativas,
  obtenerAreasServicio,
  obtenerListaAreasServicio,
  obtenerTitulacionLocal,
  obtenerListaTitulacionLocal,
  obtenerListaNecesidadSocial,
  obtenerCreadorOferta,
  obtenerListaAreasServicio,
  eliminarOferta,
  eliminarDemanda,
  eliminarIniciativa,
};
