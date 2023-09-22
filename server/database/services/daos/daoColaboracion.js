const knex = require("../../config");
const transferColaboracion = require("../transfers/TColaboracion");
const transferPartenariado = require("../transfers/TPartenariado");
const transferProyecto = require("../transfers/TProyecto");
const TNotas = require("../transfers/TNotas");

// CREAR ---------------------------------------------------------------------------------------------------------
function crearColaboracion(colaboracion) {
  return knex("colaboracion")
    .insert({
      titulo: colaboracion.getTitulo(),
      descripcion: colaboracion.getDescripcion(),
      admite_externos: colaboracion.getAdmite(),
      responsable: colaboracion.getResponsable(),
    })
    .then((id_colab) => {
      let profesores = colaboracion.getProfesores();
      let fieldsToInsert = {
        id_profesor: profesores,
        id_colaboracion: id_colab,
      };
      if (Array.isArray(profesores)) {
        fieldsToInsert = profesores.map((profesor) => ({
          id_profesor: profesor,
          id_colaboracion: id_colab,
        }));
      }
      return knex("profesor_colaboracion")
        .insert(fieldsToInsert)
        .then(() => {
          return id_colab;
        });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al intentar crear la colaboracion");
    });
}

function crearPartenariado(partenariado) {
  return crearColaboracion(partenariado)
    .then((id) => {
      return knex("partenariado")
        .insert({
          id: id,
          id_demanda: partenariado.getId_Demanda(),
          id_oferta: partenariado.getId_Oferta(),
          estado: partenariado.getEstado(),
        })
        .then(() => {
          console.log("Se ha creado un partenariado con id ", id);
        })
        .catch((err) => {
          console.log(err);
          console.log(
            "Se ha producido un error al crear el partenariado que tiene id ",
            id
          );
          return knex("colaboracion").where("id", id).del();
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar crear un partenariado "
      );
    });
}

function crearProyecto(proyecto) {
  return crearColaboracion(proyecto).then((id) => {
    return knex("proyecto")
      .insert({
        id: id[0],
        id_partenariado: proyecto.getId_Partenariado(),
        estado: proyecto.getEstado(),
      })
      .then(() => {
        const fieldsToInsert = proyecto.getEstudiantes().map((estudiante) => ({
          id_estudiante: estudiante,
          id_proyecto: id[0],
        }));
        return knex("estudiante_proyecto")
          .insert(fieldsToInsert)
          .then(() => {
            return id[0];
          })
          .catch((err) => {
            eliminarColaboracion(id[0]);
            eliminarProyecto(id[0]);
            console.log(err);
            console.log(
              "Se ha producido un error al intentar crear el proyecto con id ",
              id[0]
            );
          });
      })
      .catch((err) => {
        eliminarColaboracion(id[0]);
        console.log(err);
        console.log(
          "Se ha producido un error al intentar crear el proyecto con id ",
          id[0]
        );
      });
  });
}

function crearNota(nota) {
  return knex("notas")
    .insert({
      id_estudiante: nota.getIdEstudiante(),
      nota: nota.getNota(),
      id_proyecto: nota.getIdProyecto(),
    })
    .select("id")
    .then((idF) => {
      return idF[0];
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al intentar crear la nota ");
    });
}

//LEER UNO---------------------------------------------------------------------------------------------------------------------------
function obtenerColaboracion(id_colab) {
  return knex("colaboracion")
    .where({
      id: id_colab,
    })
    .select("*")
    .then((colab) => {
      return knex("profesor_colaboracion")
        .where({
          id_colaboracion: id_colab,
        })
        .select("id_profesor")
        .then((profe) => {
          p = [];
          for (prof of profe) {
            p2 = Object.assign({}, prof);
            p.push(p2["id_profesor"]);
          }
          return new transferColaboracion(
            id_colab,
            colab[0]["titulo"],
            colab[0]["descripcion"],
            colab[0]["admite_externos"],
            colab[0]["responsable"],
            p
          );
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener los profesores que trabajan en la colaboracion  ",
        id_colab
      );
    });
}

function obtenerPartenariado(id) {
  return obtenerColaboracion(id)
    .then((colaboracion) => {
      return knex("partenariado")
        .where({ id: id })
        .select("*")
        .then((partenariado) => {
          return new transferPartenariado(
            (id = colaboracion.getId()),
            (titulo = colaboracion.getTitulo()),
            (descripcion = colaboracion.getDescripcion()),
            (admite_externos = colaboracion.getAdmite()),
            (responsable = colaboracion.getResponsable()),
            (profesores = colaboracion.getProfesores()),
            (id_demanda = partenariado[0]["id_demanda"]),
            (id_oferta = partenariado[0]["id_oferta"]),
            (estado = partenariado[0]["estado"])
          );
        })
        .catch((err) => {
          console.log(err);
          tconsole.log(
            "Se ha producido un error al intentar obtener el partenariado con id ",
            id
          );
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener la colaboración con id ",
        id
      );
    });
}

function obtenerProyecto(id) {
  return obtenerColaboracion(id).then((colaboracion) => {
    return knex("proyecto")
      .where({ id: id })
      .select("*")
      .then((proyecto) => {
        return knex("estudiante_proyecto")
          .where({
            id_proyecto: id,
          })
          .select("id_estudiante")
          .then((estudiante) => {
            p = [];
            for (est of estudiante) {
              p2 = Object.assign({}, est);
              p.push(p2["id_estudiante"]);
            }
            return new transferProyecto(
              (id = id),
              (titulo = colaboracion.getTitulo()),
              (descripcion = colaboracion.getDescripcion()),
              (admite_externos = colaboracion.getAdmite()),
              (responsable = colaboracion.getResponsable()),
              (profesores = colaboracion.getProfesores()),
              proyecto[0]["id_partenariado"],
              proyecto[0]["estado"],
              p
            );
          })
          .catch((err) => {
            console.log(err);
            console.log(
              "Se ha producido un error al intentar obtener los estudiante del proyecto  ",
              id
            );
          });
      })
      .catch((err) => {
        console.log(err);
        console.log(
          "Se ha producido un error al intentar obtener el proyecto con id ",
          id
        );
      });
  });
}

function obtenerNota(id) {
  return knex("notas")
    .where({ id: id })
    .select("*")
    .then(function (response) {
      return new TNotas(
        response[0]["id"],
        response[0]["id_estudiante"],
        response[0]["nota"],
        response[0]["id_proyecto"]
      );
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}
//CUANTOS HAY
function contarProyectos() {
  return knex("proyecto")
    .count("*")
    .then((result) => {
      return result[0]["count(*)"];
    })
    .catch((err) => {
      console.log(err);
    });
}

function contarProyectos() {
  return knex("proyecto")
    .count("*")
    .then((result) => {
      return result[0]["count(*)"];
    })
    .catch((err) => {
      console.log(err);
    });
}

function contarPartenariados() {
  return knex("partenariado")
    .count("*")
    .then((result) => {
      return result[0]["count(*)"];
    })
    .catch((err) => {
      console.log(err);
    });
}

function contarIniciativas() {
  return knex("iniciativa")
    .count("*")
    .then((result) => {
      return result[0]["count(*)"];
    })
    .catch((err) => {
      console.log(err);
    });
}
//ELIMINAR UNO---------------------------------------------------------------------------------------------------------------------------
function eliminarColaboracion(id_colab) {
  return knex("colaboracion")
    .where({
      id: id_colab,
    })
    .del()
    .then((result) => {
      if (result > 0) {
        console.log(
          "Se ha eliminado de la base de datos la colaboracion con id ",
          id_colab
        );
      } else {
        console.log("No existe la colaboracion con id ", id_colab);
      }
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar eliminar la colaboracion con id ",
        id_colab
      );
    });
}

function eliminarPartenariado(id) {
  return eliminarColaboracion(id)
    .then(() => {
      return knex("partenariado")
        .where("id", id)
        .del()
        .then(() => {
          console.log(
            "Se ha eliminado correctamente el partenariado con id ",
            id
          );
        })
        .catch((err) => {
          console.log(err);
          console.log(
            "Se ha producido un error al intentar eliminar el partenariado con id ",
            id
          );
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar eliminar la colaboracion con id ",
        id
      );
    });
}

function eliminarProyecto(id) {
  return obtenerColaboracion(id).then(function () {
    return eliminarColaboracion(id)
      .then(() => {
        return knex("proyecto")
          .where("id", id)
          .del()
          .then(function () {
            console.log(
              "Se ha eliminado correctamente el proyecto con id ",
              id
            );
          })
          .catch((err) => {
            console.log(err);
            console.log(
              "Se ha producido un error al intentar eliminar el proyecto con id ",
              id
            );
          });
      })
      .catch((err) => {
        console.log(err);
        console.log(
          "Se ha producido un error al intentar eliminar el proyecto con id ",
          id
        );
      });
  });
}

function eliminarNota(id) {
  return obtenerNota(id).then(function (result) {
    if (result["id"] >= 0) {
      return knex("notas")
        .del()
        .where({ id: id })
        .then(function (result) {
          return id;
        })
        .catch((err) => {
          console.log(err);
          console.log("Se ha producido un error");
        });
    }
  });
}

//ACTUALIZAR--------------------------------------------------------------------------------------------------------------------
function actualizarColaboracion(colaboracion) {
  return obtenerColaboracion(colaboracion.getId()).then((copia) => {
    return knex("colaboracion")
      .where("id", colaboracion.getId())
      .update({
        titulo: colaboracion.getTitulo(),
        descripcion: colaboracion.getDescripcion(),
        admite_externos: colaboracion.getAdmite(),
        responsable: colaboracion.getResponsable(),
      })
      .then(() => {
        return knex("profesor_colaboracion")
          .where("id_colaboracion", colaboracion.getId())
          .del()
          .then(() => {
            const fieldsToInsert = colaboracion
              .getProfesores()
              .map((profes) => ({
                id_profesor: profes,
                id_colaboracion: colaboracion.getId(),
              }));
            return knex("profesor_colaboracion")
              .insert(fieldsToInsert)
              .then(() => {});
          });
      })
      .catch((err) => {
        console.log(err);
        console.log(
          "Se ha producido un error al intentar actualizar la colaboracion con id ",
          colaboracion.getId()
        );
        actualizarColaboracion(copia);
        console.log(" se procederá a su restauracion");
      });
  });
}

function actualizarPartenariado(partenariado) {
  return obtenerColaboracion(partenariado.getId()).then(
    (copia_colaboracion) => {
      return actualizarColaboracion(partenariado)
        .then(() => {
          return knex("partenariado")
            .where("id", partenariado.getId())
            .update({
              id_demanda: partenariado.getId_Demanda(),
              id_oferta: partenariado.getId_Oferta(),
              estado: partenariado.getEstado(),
            })
            .then(() => {
              console.log(
                "Se ha actualizado correctamente el partenariado con id ",
                partenariado.getId()
              );
            })
            .catch((err) => {
              console.log(err);
              console.log(
                "Se ha producido un error al intentar actualizar el partenariado con id ",
                partenariado.getId()
              );
              // Restatura el estado original de la colaboración
              return actualizarColaboracion(copia_colaboracion).catch((err) => {
                console.log(err);
                console.log(
                  "Se ha producido un error al intentar restablecer la colaboracion con id ",
                  partenariado.getId()
                );
              });
            });
        })
        .catch((err) => {
          console.log(err);
          console.log(
            "Se ha producido un error al intentar actualizar la colaboracion con id ",
            partenariado.getId()
          );
        });
    }
  );
}

function actualizarProyecto(proyecto) {
  return obtenerColaboracion(proyecto.getId()).then((copia_colaboracion) => {
    return actualizarColaboracion(proyecto)
      .then(() => {
        if (copia_colaboracion["id"] >= 0) {
          return knex("proyecto")
            .where("id", proyecto.getId())
            .update({
              id_partenariado: proyecto.getId_Partenariado(),
              estado: proyecto.getEstado(),
            })
            .then(() => {
              return knex("estudiante_proyecto")
                .where("id_proyecto", proyecto.getId())
                .del()
                .then(() => {
                  const fieldsToInsert = proyecto
                    .getEstudiantes()
                    .map((estudiante) => ({
                      id_estudiante: estudiante,
                      id_proyecto: proyecto.getId(),
                    }));
                  return knex("estudiante_proyecto")
                    .insert(fieldsToInsert)
                    .then(() => {
                      return proyecto.getId();
                    })
                    .catch((err) => {
                      console.log(err);
                      console.log(
                        "Se ha producido un error al intentar actualizar el proyecto con id ",
                        proyecto.getId()
                      );
                      actualizarColaboracion(copia_colaboracion);
                    });
                });
            })
            .catch((err) => {
              console.log(err);
              console.log(
                "Se ha producido un error al intentar actualizar el proyecto con id ",
                proyecto.getId()
              );
              actualizarColaboracion(copia_colaboracion);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log(
          "Se ha producido un error al intentar actualizar el proyecto con id ",
          proyecto.getId()
        );
      });
  });
}

function actualizarNota(nota) {
  return obtenerNota(nota.getId()).then((result) => {
    if (result["id"] >= 0) {
      return knex("notas")
        .where("id", nota.getId())
        .update({
          nota: nota.getNota(),
        })
        .then(() => {
          return nota.getId();
        })
        .catch((err) => {
          console.log(err);
          console.log(
            "Se ha producido un error al intentar actualizar el usuario"
          );
        });
    } else {
      console.log("No se ha encontrado la nota");
    }
  });
}

// OBTENER TODOS LOS ELEMENTOS ----------------------------------------------------------------------
function obtenerTodosPartenariados() {
  return knex("colaboracion")
    .join("partenariado", "colaboracion.id", "=", "partenariado.id")
    .select("*")
    .then((datos) => {
      return knex("profesor_colaboracion")
        .select("*")
        .then((datos_profesores) => {
          let transfers = [];
          datos.forEach((partenariado) => {
            let profesores = [];
            datos_profesores.forEach((profesor) => {
              if (profesor["id_colaboracion"] === partenariado["id"]) {
                profesores.push(profesor["id_profesor"]);
              }
            });
            let transfer = new transferPartenariado(
              (id = partenariado["id"]),
              (titulo = partenariado["titulo"]),
              (descripcion = partenariado["descripcion"]),
              (admite_externos = partenariado["admite_externos"]),
              (responsable = partenariado["responsable"]),
              (profesores = profesores),
              (id_demanda = partenariado["id_demanda"]),
              (id_oferta = partenariado["id_oferta"]),
              (estado = partenariado["estado"])
            );
            transfers.push(transfer);
          });
          return transfers;
        })
        .catch((err) => {
          console.log(err);
          console.log(
            "Se ha producido un error al intentar obtener de la base de datos los profesores"
          );
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener todos los partenariados"
      );
    });
}
function crearPrevioPartenariado(
  id_demanda,
  id_oferta,
  completado_profesor,
  completado_socioComunitario
) {
  return knex("previo_partenariado")
    .insert({
      id_demanda: id_demanda,
      id_oferta: id_oferta,
      completado_profesor: completado_profesor,
      completado_socioComunitario: completado_socioComunitario,
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al crear el previo al partenariado"
      );
    });
}

function actualizarPrevioPartenariado(
  id_demanda,
  id_oferta,
  completado_profesor,
  completado_socioComunitario
) {
  return knex("previo_partenariado")
    .where({id_demanda: id_demanda, id_oferta:id_oferta})
    .update({
      id_demanda: id_demanda,
      id_oferta: id_oferta,
      completado_profesor: completado_profesor,
      completado_socioComunitario: completado_socioComunitario,
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al actualizar el previo al partenariado"
      );
    });
}

function obtenerIdPartenariado(id_demanda, id_oferta){
  return knex('partenariado').where({ id_demanda: id_demanda, id_oferta: id_oferta })
  .select('id')
  .catch((err) => {
    console.log(err);
    console.log("Se ha producido un error al intentar obtener de la base de datos");
  })
}

module.exports = {
  crearColaboracion,
  crearPartenariado,
  crearProyecto,
  crearNota,
  crearPrevioPartenariado,
  obtenerColaboracion,
  obtenerPartenariado,
  obtenerTodosPartenariados,
  obtenerIdPartenariado,
  obtenerProyecto,
  obtenerNota,
  actualizarColaboracion,
  actualizarPartenariado,
  actualizarProyecto,
  actualizarPrevioPartenariado,
  actualizarNota,
  eliminarColaboracion,
  eliminarPartenariado,
  eliminarProyecto,
  eliminarNota,
  contarProyectos,
  contarIniciativas,
  contarPartenariados,
};
