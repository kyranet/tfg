const knex = require("../../config");
const mysql = require("mysql");
var TAdmin = require("../transfers/TAdmin");
var TSocioComunitario = require("../transfers/TSocioComunitario");
var TUsuario = require("../transfers/TUsuario");
var TProfesor = require("../transfers/TProfesor");
var TOficinaAps = require("../transfers/TOficinaAps");
var TEstudiante = require("../transfers/TEstudiante");
var TProfesorExterno = require("../transfers/TProfesorExterno");
var TProfesorInterno = require("../transfers/TProfesorInterno");
var TEstudianteExterno = require("../transfers/TEstudianteExterno");
var TEstudianteInterno = require("../transfers/TEstudianteInterno");

//INSERTAR------------------------------------------------------------------------------------------------

//Inserta en la base de datos un nuevo usuario
function insertarUsuario(usuario) {
  return knex("usuario")
    .insert({
      origin_login: usuario.getOriginLogin(),
      origin_img: usuario.getOriginImg(),
      createdAt: usuario.getCreatedAt(),
      updatedAt: usuario.getUpdatedAt(),
      terminos_aceptados: usuario.getTermAcept(),
    })
    .select("id")
    .then(function (result) {
      return result;
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
      return -1;
    });
}

//Inserta en la base de datos un nuevo admin
function insertarAdmin(usuario) {
  return insertarUsuario(usuario).then(function (idF) {
    return knex("datos_personales_interno")
      .insert({
        correo: usuario.getCorreo(),
        password: usuario.getPassword(),
        apellidos: usuario.getApellidos(),
        nombre: usuario.getNombre(),
        telefono: usuario.getTelefono()
      })
      .select("id")
      .then(function (result) {
        return knex("admin")
          .insert({
            id: idF[0],
            datos_personales_Id: result[0],
          })
          .then(function (resultF) {
            return idF[0];
          })
          .catch((err) => {
            console.log(err);
            console.log("Se ha producido un error");
            borrarUsuario(idF[0]);
            borrarDatosPersonalesInternos(result[0]);
          });
      })
      .catch((err) => {
        console.log(err);
        console.log("Se ha producido un error");
        borrarUsuario(idF[0]);
      });
  });
}

//Inserta en la base de datos una nueva oficinaAPS
function insertarOficinaAps(usuario) {
  return insertarUsuario(usuario).then(function (idF) {
    return knex("datos_personales_interno")
      .insert({
        correo: usuario.getCorreo(),
        password: usuario.getPassword(),
        apellidos: usuario.getApellidos(),
        nombre: usuario.getNombre(),
        telefono: usuario.getTelefono()
      })
      .select("id")
      .then(function (result) {
        return knex("oficinaaps")
          .insert({ id: idF[0], datos_personales_Id: result[0] })
          .then(function () {
            return idF[0];
          })
          .catch((err) => {
            console.log(err);
            console.log("Se ha producido un error");
            borrarUsuario(idF[0]);
            borrarDatosPersonalesInternos(result[0]);
          });
      })
      .catch((err) => {
        console.log(err);
        console.log("Se ha producido un error");
        borrarUsuario(idF[0]);
      });
  });
}

//Inserta en la base de datos un nuevo estudiante
function insertarEstudiante(usuario) {
  return insertarUsuario(usuario).then(function (idF) {
    return knex("estudiante")
      .insert({ id: idF[0] })
      .then(function () {
        return idF[0];
      })
      .catch((err) => {
        console.log(err);
        console.log("Se ha producido un error");
        borrarUsuario(idF[0]);
        return -1;
      });
  });
}

//Inserta en la base de datos un nuevo estudiante interno
function insertarEstudianteInterno(usuario) {
  return insertarEstudiante(usuario).then(function (idF) {
    return knex("datos_personales_interno")
      .insert({
        correo: usuario.getCorreo(),
        password: usuario.getPassword(),
        apellidos: usuario.getApellidos(),
        nombre: usuario.getNombre(),
        telefono: usuario.getTelefono()
      })
      .select("id")
      .then(function (result) {
        return knex("estudiante_interno")
          .insert({
            id: idF,
            titulacion_local: usuario.getTitulacionLocal(),
            datos_personales_Id: result[0],
          })
          .then(function () {
            return idF;
          })
          .catch((err) => {
            console.log(err);
            console.log("Se ha producido un error");
            borrarUsuario(idF);
            borrarDatosPersonalesInternos(result[0]);
          });
      })
      .catch((err) => {
        console.log(err);
        console.log("Se ha producido un error");
        borrarUsuario(idF);
      });
  });
}

//Inserta en la base de datos un nuevo profesor
function insertarProfesor(usuario) {
  return insertarUsuario(usuario).then(function (id) {
    return knex("profesor")
      .insert({ id: id[0] })
      .select("id")
      .then(function () {
        return id;
      })
      .catch((err) => {
        console.log(err);
        console.log("Se ha producido un error");
        borrarUsuario[id[0]];
        return -1;
      });
  });
}

function insertarSocioComunitario(usuario) {
  return insertarUsuario(usuario).then(function (idF) {
    return knex("datos_personales_externo")
      .insert({
        correo: usuario.getCorreo(),
        password: usuario.getPassword(),
        apellidos: usuario.getApellidos(),
        nombre: usuario.getNombre(),
        telefono: usuario.getTelefono()
      })
      .select("id")
      .then(function (result) {
        return knex("socio_comunitario")
          .insert({
            id: idF[0],
            sector: usuario.getSector(),
            nombre_socioComunitario: usuario.getNombreSocioComunitario(),
            url: usuario.getUrl(),
            mision: usuario.getMision(),
            datos_personales_Id: result[0],
          })
          .then(function () {
            return idF[0];
          })
          .catch((err) => {
            console.log(err);
            console.log("Se ha producido un error");
            borrarUsuario(idF[0]);
            borrarDatosPersonalesExternos(result[0]);
            return -1;
          });
      })
      .catch((err) => {
        borrarUsuario(idF[0]);
        console.log(err);
        console.log("Se ha producido un error");
        return -1;
      });
  });
}

function insertarProfesorInterno(usuario) {
  return insertarProfesor(usuario).then(function (idF) {
    return knex("datos_personales_interno")
      .insert({
        correo: usuario.getCorreo(),
        password: usuario.getPassword(),
        apellidos: usuario.getApellidos(),
        nombre: usuario.getNombre(),
        telefono: usuario.getTelefono()
      })
      .select("id")
      .then(function (result) {
        return knex("profesor_interno")
          .insert({ id: idF[0], datos_personales_Id: result[0] })
          .then(function () {
            let idTitulaciones = usuario.getTitulacionLocal();
            const fieldsToInsert = idTitulaciones.map((field) => ({
              id_titulacion: field,
              id_profesor: idF[0],
            }));
            return knex("titulacionlocal_profesor")
              .insert(fieldsToInsert)
              .then(function () {
                let idAreasC = usuario.getAreaConocimiento();
                const fieldsToInsertArea = idAreasC.map((field) => ({
                  id_area: field,
                  id_profesor: idF[0],
                }));
                return knex("areaconocimiento_profesor")
                  .insert(fieldsToInsertArea)
                  .then(function () {
                    return idF[0];
                  })
                  .catch((err) => {
                    borrarUsuario(idF[0]);
                    borrarDatosPersonalesInternos(result[0]);
                    console.log(err);
                    console.log("Se ha producido un error");
                  });
              })
              .catch((err) => {
                borrarUsuario(idF[0]);
                borrarDatosPersonalesInternos(result[0]);
                console.log(err);
                console.log("Se ha producido un error");
              });
          })
          .catch((err) => {
            borrarUsuario(idF[0]);
            borrarDatosPersonalesInternos(result[0]);
            console.log(err);
            console.log("Se ha producido un error");
          });
      })
      .catch((err) => {
        borrarUsuario(idF[0]);
        console.log(err);
        console.log("Se ha producido un error");
      });
  });
}

function insertarEstudianteExterno(usuario) {
  return insertarEstudiante(usuario).then(function (idF) {
    return knex("datos_personales_externo")
      .insert({
        correo: usuario.getCorreo(),
        password: usuario.getPassword(),
        apellidos: usuario.getApellidos(),
        nombre: usuario.getNombre(),
        telefono: usuario.getTelefono()
      })
      .select("id")
      .then(function (result) {
        return knex("universidad")
          .select("id")
          .where("nombre", "like", `%${usuario.getnombreUniversidad()}%`)
          .then(function (values) {
            console.log(values[0]["id"]);
            return knex("estudiante_externo")
              .insert({
                id: idF,
                universidad: values[0]["id"],
                titulacion: usuario.getTitulacion(),
                datos_personales_Id: result[0],
              })
              .then(function () {
                return idF;
              })
              .catch((err) => {
                console.log(err);
                console.log("Se ha producido un error");
                borrarUsuario(idF);
                borrarDatosPersonalesInternos(result[0]);
                return -1;
              });
          })
          .catch((err) => {
            console.log(err);
            console.log("Se ha producido un error");
            borrarUsuario(idF);
            return -1;
          });
      });
  });
}

function insertarProfesorExterno(usuario) {
  return insertarProfesor(usuario).then(function (idF) {
    return knex("datos_personales_externo")
      .insert({
        correo: usuario.getCorreo(),
        password: usuario.getPassword(),
        apellidos: usuario.getApellidos(),
        nombre: usuario.getNombre(),
        telefono: usuario.getTelefono()
      })
      .select("id")
      .then(function (result) {
        const fieldsToInsert = usuario.getAreaConocimiento().map((area) => ({
          id_area: area.id,
          id_profesor: idF[0],
        }));
        console.log(fieldsToInsert);
        return knex("areaconocimiento_profesor")
          .insert(fieldsToInsert)
          .then(() => {
            return knex("universidad")
              .select("id")
              .where("nombre", "like", `%${usuario.getnombreUniversidad()}%`)
              .then(function (values) {
                return knex("profesor_externo")
                  .insert({
                    id: idF[0],
                    universidad: values[0]["id"],
                    datos_personales_Id: result[0],
                    facultad: usuario.getFacultad()
                  })
                  .then(function () {
                    return idF[0];
                  })
                  .catch((err) => {
                    console.log(err);
                    console.log("Se ha producido un error");
                    borrarUsuario(idF[0]);
                    borrarDatosPersonalesExternos(result[0]);
                    return -1;
                  });
              })
              .catch((err) => {
                borrarUsuario(idF[0]);
                borrarDatosPersonalesInternos(result[0]);
                console.log(err);
                console.log("Se ha producido un error");
                borrarUsuario(idF[0]);
                return -1;
              });
          })
      });
  });
}

//ELIMINAR UNO---------------------------------------------------------------------------------------------------

function borrarDatosPersonalesInternos(id) {
  return knex("datos_personales_interno")
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

function borrarDatosPersonalesExternos(id) {
  return knex("datos_personales_externo")
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

function borrarUsuario(id) {
  return knex("usuario")
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

function borrarEstudianteInterno(id) {
  return obtenerEstudianteInterno(id)
    .then(function (res) {
      const correoU = res["correo"];
      return borrarUsuario(id)
        .then(function (res2) {
          return knex("datos_personales_interno")
            .del()
            .where({ correo: correoU })
            .then(function (res3) {
              return id;
            })
            .catch((err) => {
              console.log(err);
              console.log("Se ha producido un error");
            });
        })
        .catch((err) => {
          console.log(err);
          console.log("Se ha producido un error");
        });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function borrarEstudianteExterno(id) {
  return obtenerEstudianteExterno(id)
    .then(function (res) {
      const correoU = res["correo"];
      return borrarUsuario(id)
        .then(function () {
          return knex("datos_personales_externo")
            .del()
            .where({ correo: correoU })
            .then(function () {
              return id;
            })
            .catch((err) => {
              console.log(err);
              console.log("Se ha producido un error");
            });
        })
        .catch((err) => {
          console.log(err);
          console.log("Se ha producido un error");
        });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function borrarProfesorExterno(id) {
  return obtenerProfesorExterno(id)
    .then(function (res) {
      const correoU = res["correo"];
      return borrarUsuario(id)
        .then(function (res2) {
          return knex("datos_personales_externo")
            .del()
            .where({ correo: correoU })
            .then(function (res3) {
              return id;
            })
            .catch((err) => {
              console.log(err);
              console.log("Se ha producido un error");
            });
        })
        .catch((err) => {
          console.log(err);
          console.log("Se ha producido un error");
        });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function borrarProfesorInterno(id) {
  return obtenerProfesorInterno(id)
    .then(function (res) {
      const correoU = res["correo"];
      return borrarUsuario(id)
        .then(function (res2) {
          return knex("datos_personales_interno")
            .del()
            .where({ correo: correoU })
            .then(function (res3) {
              return id;
            })
            .catch((err) => {
              console.log(err);
              console.log("Se ha producido un error");
            });
        })
        .catch((err) => {
          console.log(err);
          console.log("Se ha producido un error");
        });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function borrarAdmin(id) {
  return obtenerAdmin(id)
    .then(function (res) {
      const correoU = res["correo"];
      return borrarUsuario(id)
        .then(function (res2) {
          return knex("datos_personales_interno")
            .del()
            .where({ correo: correoU })
            .then(function (res3) {
              return id;
            })
            .catch((err) => {
              console.log(err);
              console.log("Se ha producido un error");
            });
        })
        .catch((err) => {
          console.log(err);
          console.log("Se ha producido un error");
        });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function borrarOficinaAPS(id) {
  return obtenerOficinaAps(id)
    .then(function (res) {
      const correoU = res["correo"];
      return borrarUsuario(id)
        .then(function (res2) {
          return knex("datos_personales_interno")
            .del()
            .where({ correo: correoU })
            .then(function (res3) {
              return id;
            })
            .catch((err) => {
              console.log(err);
              console.log("Se ha producido un error");
            });
        })
        .catch((err) => {
          console.log(err);
          console.log("Se ha producido un error");
        });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function borrarSocioComunitario(id) {
  return obtenerSocioComunitario(id)
    .then(function (res) {
      const correoU = res["correo"];
      return borrarUsuario(id)
        .then(function (res2) {
          return knex("datos_personales_externo")
            .del()
            .where({ correo: correoU })
            .then(function (res3) {
              return id;
            })
            .catch((err) => {
              console.log(err);
              console.log("Se ha producido un error");
            });
        })
        .catch((err) => {
          console.log(err);
          console.log("Se ha producido un error");
        });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

//LEER UNO----------------------------------------------------------------------------------------------------
function obtenerUsuarioSinRolPorEmail(email) {
  return knex("datos_personales_interno")
    .where({ correo: email })
    .select("id")
    .then((id_interno) => {
      if (id_interno.length == 0) {
        // externos
        return knex("datos_personales_externo")
          .where({ correo: email })
          .select("id")
          .then((id_externo) => {
            if (id_externo.length == 0) {
              // El usuario no existe
              console.log("No existe ningún usuario con ese correo");
              return 0;
            }
            id_externo = id_externo[0]["id"];
            return obtenerSocioComunitarioPorDatosPersonales(id_externo).then(
              (result) => {
                if (result == 0) {
                  return obtenerProfesorExternoPorDatosPersonales(
                    id_externo
                  ).then((result) => {
                    if (result == 0) {
                      return obtenerEstudianteExternoPorDatosPersonales(
                        id_externo
                      ).then((result) => {
                        if (result == 0) {
                          console.log(
                            "No se ha encontrado ningún usuario con el email ",
                            email
                          );
                          return 0;
                        }
                        return result;
                      });
                    }
                    return result;
                  });
                }
                return result;
              }
            );
          })
          .catch((err) => {
            console.log(err);
            console.log(
              "Se ha producido un error al intentar obtener de la base de datos el usuario con email",
              email
            );
          });
      } else {
        // internos
        id_interno = id_interno[0]["id"];
        return obtenerProfesorInternoPorDatosPersonales(id_interno)
          .then((result) => {
            if (result == 0) {
              return obtenerEstudianteInternoPorDatosPersonales(
                id_interno
              ).then((result) => {
                if (result == 0) {
                  return obtenerAdminPorDatosPersonales(id_interno).then(
                    (result) => {
                      if (result == 0) {
                        return obtenerOficinaApsPorDatosPersonales(
                          id_interno
                        ).then((result) => {
                          if (result == 0) {
                            console.log(
                              "No se ha encontrado ningún usuario con email ",
                              email
                            );
                            return 0;
                          }
                          return result;
                        });
                      }
                      return result;
                    }
                  );
                }
                return result;
              });
            }
            return result;
          })
          .catch((err) => {
            console.log(err);
            console.log(
              "Se ha producido un error al intentar obtener de la base de datos el usuario con email",
              email
            );
          });
      }
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener de la base de datos el usuario con email ",
        email
      );
    });
}

function obtenerUsuarioSinRolPorId(id) {
  // internos
  return obtenerProfesorInterno(id).then((result) => {
    if (result == 0) {
      return obtenerEstudianteInterno(id).then((result) => {
        if (result == 0) {
          return obtenerAdmin(id).then((result) => {
            if (result == 0) {
              return obtenerOficinaAps(id).then((result) => {
                if (result == 0) {
                  return obtenerSocioComunitario(id).then((result) => {
                    if (result == 0) {
                      return obtenerProfesorExterno(id).then((result) => {
                        if (result == 0) {
                          return obtenerEstudianteExterno(id).then((result) => {
                            if (result == 0) {
                              console.log(
                                "No se ha encontrado ningún usuario con el id ",
                                id
                              );
                            }
                            return result;
                          });
                        }
                        return result;
                      });
                    }
                    return result;
                  });
                }
                return result;
              });
            }
            return result;
          });
        }
        return result;
      });
    }
    return result;
  });
}

function obtenerUsuario(id) {
  return knex("usuario")
    .where({ id: id })
    .select("*")
    .then(function (response) {
      return response[0];
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerUniversidades() {
  return knex("universidad")
    .select("id")
    .select("nombre")
    .then(function (response) {
      return response;
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerAreasConocimientoUsuario(id) {
  return knex("areaconocimiento_profesor")
    .where({ id_profesor: id })
    .select("id_area")
    .then((id_areas) => {
      id_areas_array = [];
      for (id_area of id_areas) {
        id_areas_array.push(id_area["id_area"]);
      }
      return knex
        .select("nombre")
        .select("id")
        .from("area_conocimiento")
        .whereIn("id", id_areas_array)
        .then((areas_conocim) => {
          areas = [];
          for (area of areas_conocim) {
            areas.push({id: area["id"],nombre: area["nombre"]});
          }
          return areas;
        });
    });
}

function obtenerAreasConocimiento() {
  return knex("area_conocimiento")
    .select("id")
    .select("nombre")
    .then(function (response) {
      return response;
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerDatosPersonalesInterno(id) {
  return knex("datos_personales_interno")
    .where({ id: id })
    .select("*")
    .then(function (response) {
      return response[0];
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}
function obtenerDatosPersonalesExterno(id) {
  return knex("datos_personales_externo")
    .where({ id: id })
    .select("*")
    .then(function (response) {
      return response[0];
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerAdmin(id) {
  return knex("admin")
    .where({ id: id })
    .select("*")
    .then(function (admin) {
      if (admin.length == 0) {
        return 0;
      }
      return obtenerUsuario(id)
        .then(function (usuario) {
          return obtenerDatosPersonalesInterno(
            admin[0]["datos_personales_Id"]
          ).then(function (datos) {
            return new TAdmin(
              usuario["id"],
              datos["correo"],
              datos["nombre"],
              datos["apellidos"],
              datos["password"],
              usuario["origin_login"],
              usuario["origin_img"],
              usuario["createdAt"],
              usuario["updatedAt"],
              usuario["terminos_aceptados"],
              datos["telefono"]
            );
          });
        })
        .catch((err) => {
          console.log(err);
          console.log("Se ha producido un error");
        });
    });
}

function obtenerAdminPorDatosPersonales(id) {
  return knex("admin")
    .where({ datos_personales_Id: id })
    .select("*")
    .then(function (admin) {
      if (admin.length == 0) {
        return 0;
      }
      id = admin[0]["id"];
      return obtenerUsuario(id)
        .then(function (usuario) {
          return obtenerDatosPersonalesInterno(
            admin[0]["datos_personales_Id"]
          ).then(function (datos) {
            return new TAdmin(
              usuario["id"],
              datos["correo"],
              datos["nombre"],
              datos["apellidos"],
              datos["password"],
              usuario["origin_login"],
              usuario["origin_img"],
              usuario["createdAt"],
              usuario["updatedAt"],
              usuario["terminos_aceptados"],
              datos["telefono"]
            );
          });
        })
        .catch((err) => {
          console.log(err);
          console.log("Se ha producido un error");
        });
    });
}

function obtenerOficinaAps(id) {
  return knex("oficinaaps")
    .where({ id: id })
    .select("*")
    .then(function (admin) {
      if (admin.length == 0) {
        return 0;
      }
      return obtenerUsuario(id).then(function (usuario) {
        return obtenerDatosPersonalesInterno(
          admin[0]["datos_personales_Id"]
        ).then(function (datos) {
          return new TOficinaAps(
            usuario["id"],
            datos["correo"],
            datos["nombre"],
            datos["apellidos"],
            datos["password"],
            usuario["origin_login"],
            usuario["origin_img"],
            usuario["createdAt"],
            usuario["updatedAt"],
            usuario["terminos_aceptados"],
            datos["telefono"]
          );
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerOficinaApsPorDatosPersonales(id) {
  return knex("oficinaaps")
    .where({ datos_personales_Id: id })
    .select("*")
    .then(function (admin) {
      if (admin.length == 0) {
        return 0;
      }
      id = admin[0]["id"];
      return obtenerUsuario(id).then(function (usuario) {
        return obtenerDatosPersonalesInterno(
          admin[0]["datos_personales_Id"]
        ).then(function (datos) {
          return new TOficinaAps(
            usuario["id"],
            datos["correo"],
            datos["nombre"],
            datos["apellidos"],
            datos["password"],
            usuario["origin_login"],
            usuario["origin_img"],
            usuario["createdAt"],
            usuario["updatedAt"],
            usuario["terminos_aceptados"],
            datos["telefono"]
          );
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerSocioComunitarioPorDatosPersonales(id) {
  return knex("socio_comunitario")
    .where({ datos_personales_Id: id })
    .select("*")
    .then(function (socio) {
      if (socio.length == 0) {
        return 0;
      }
      id = socio[0]["id"];
      return obtenerUsuario(id).then(function (usuario) {
        return obtenerDatosPersonalesExterno(
          socio[0]["datos_personales_Id"]
        ).then(function (datos) {
          return new TSocioComunitario(
            usuario["id"],
            datos["correo"],
            datos["nombre"],
            datos["apellidos"],
            datos["password"],
            usuario["origin_login"],
            usuario["origin_img"],
            usuario["createdAt"],
            usuario["updatedAt"],
            usuario["terminos_aceptados"],
            socio[0]["sector"],
            socio[0]["nombre_socioComunitario"],
            datos["telefono"],
            socio[0]["url"],
            socio[0]["mision"],
          );
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerSocioComunitario(id) {
  return knex("socio_comunitario")
    .where({ id: id })
    .select("*")
    .then(function (socio) {
      if (socio.length == 0) {
        return 0;
      }
      return obtenerUsuario(id).then(function (usuario) {
        return obtenerDatosPersonalesExterno(
          socio[0]["datos_personales_Id"]
        ).then(function (datos) {
          return new TSocioComunitario(
            usuario["id"],
            datos["correo"],
            datos["nombre"],
            datos["apellidos"],
            datos["password"],
            usuario["origin_login"],
            usuario["origin_img"],
            usuario["createdAt"],
            usuario["updatedAt"],
            usuario["terminos_aceptados"],
            socio[0]["sector"],
            socio[0]["nombre_socioComunitario"],
            datos["telefono"],
            socio[0]["url"],
            socio[0]["mision"],
          );
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerProfesor(id) {
  return knex("profesor")
    .where({ id: id })
    .select("*")
    .then(function (profesor) {
      return profesor[0];
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerProfesores() {
  return knex("profesor_interno")
    .join(
      "datos_personales_interno",
      "profesor_interno.datos_personales_Id",
      "=",
      "datos_personales_interno.id"
    )
    .select("profesor_interno.id")
    .select("datos_personales_interno.nombre")
    .select("datos_personales_interno.apellidos")
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al obtener todos los profesores");
    });
}

function obtenerProfesorInterno(id) {
  return knex("profesor_interno")
    .where({ id: id })
    .select("*")
    .then(function (profesorInterno) {
      if (profesorInterno.length == 0) {
        return 0;
      }
      return obtenerProfesor(id).then(function (profesor) {
        return obtenerUsuario(id).then(function (usuario) {
          return obtenerDatosPersonalesInterno(
            profesorInterno[0]["datos_personales_Id"]
          ).then(function (datos) {
            return knex("areaconocimiento_profesor")
              .where({ id_profesor: id })
              .select("id_area")
              .then((id_areas) => {
                id_areas_array = [];
                for (id_area of id_areas) {
                  id_areas_array.push(id_area["id_area"]);
                }
                return knex
                  .select("nombre")
                  .from("area_conocimiento")
                  .whereIn("id", id_areas_array)
                  .then((areas_conocim) => {
                    areas = [];
                    for (area of areas_conocim) {
                      areas.push(area["nombre"]);
                    }
                    return knex("titulacionlocal_profesor")
                      .where({ id_profesor: id })
                      .select("id_titulacion")
                      .then((id_titulaciones) => {
                        id_titulaciones_array = [];
                        for (id_tit of id_titulaciones) {
                          id_titulaciones_array.push(id_tit["id_titulacion"]);
                        }
                        return knex
                          .select("nombre")
                          .from("titulacion_local")
                          .whereIn("id", id_titulaciones_array)
                          .then((titulaciones_locales) => {
                            titulac = [];
                            for (tit of titulaciones_locales) {
                              titulac.push(tit["nombre"]);
                            }
                            return new TProfesorInterno(
                              usuario["id"],
                              datos["correo"],
                              datos["nombre"],
                              datos["apellidos"],
                              datos["password"],
                              usuario["origin_login"],
                              usuario["origin_img"],
                              usuario["createdAt"],
                              usuario["updatedAt"],
                              usuario["terminos_aceptados"],
                              areas,
                              titulac,
                              datos["telefono"]
                            );
                          });
                      });
                  });
              });
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerProfesorInternoPorDatosPersonales(id) {
  return knex("profesor_interno")
    .where({ datos_personales_Id: id })
    .select("*")
    .then(function (profesorInterno) {
      if (profesorInterno.length == 0) {
        return 0;
      }
      id = profesorInterno[0]["id"];
      return obtenerProfesor(id).then(function (profesor) {
        return obtenerUsuario(id).then(function (usuario) {
          return obtenerDatosPersonalesInterno(
            profesorInterno[0]["datos_personales_Id"]
          ).then(function (datos) {
            return knex("areaconocimiento_profesor")
              .where({ id_profesor: id })
              .select("id_area")
              .then((id_areas) => {
                id_areas_array = [];
                for (id_area of id_areas) {
                  id_areas_array.push(id_area["id_area"]);
                }
                return knex
                  .select("nombre")
                  .from("area_conocimiento")
                  .whereIn("id", id_areas_array)
                  .then((areas_conocim) => {
                    areas = [];
                    for (area of areas_conocim) {
                      areas.push(area["nombre"]);
                    }
                    return knex("titulacionlocal_profesor")
                      .where({ id_profesor: id })
                      .select("id_titulacion")
                      .then((id_titulaciones) => {
                        id_titulaciones_array = [];
                        for (id_tit of id_titulaciones) {
                          id_titulaciones_array.push(id_tit["id_titulacion"]);
                        }
                        return knex
                          .select("nombre")
                          .from("titulacion_local")
                          .whereIn("id", id_titulaciones_array)
                          .then((titulaciones_locales) => {
                            titulac = [];
                            for (tit of titulaciones_locales) {
                              titulac.push(tit["nombre"]);
                            }
                            return new TProfesorInterno(
                              usuario["id"],
                              datos["correo"],
                              datos["nombre"],
                              datos["apellidos"],
                              datos["password"],
                              usuario["origin_login"],
                              usuario["origin_img"],
                              usuario["createdAt"],
                              usuario["updatedAt"],
                              usuario["terminos_aceptados"],
                              areas,
                              titulac,
                              datos["telefono"]
                            );
                          });
                      });
                  });
              });
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerProfesorExterno(id) {
  return knex("profesor_externo")
    .where({ id: id })
    .select("*")
    .then(function (profesorExterno) {
      if (profesorExterno.length == 0) {
        return 0;
      }
      return obtenerProfesor(id).then(function (profesor) {
        return obtenerUsuario(id).then(function (usuario) {
          return obtenerDatosPersonalesExterno(
            profesorExterno[0]["datos_personales_Id"]
          ).then(function (datos) {
            return knex("universidad")
              .where({ id: profesorExterno[0]["universidad"] })
              .select("*")
              .then(function (uni) {
                return new TProfesorExterno(
                  usuario["id"],
                  datos["correo"],
                  datos["nombre"],
                  datos["apellidos"],
                  datos["password"],
                  usuario["origin_login"],
                  usuario["origin_img"],
                  usuario["createdAt"],
                  usuario["updatedAt"],
                  usuario["terminos_aceptados"],
                  uni[0]["nombre"],
                  profesorExterno[0]["facultad"],
                  null,
                  datos["telefono"]
                );
              });
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerProfesorExternoPorDatosPersonales(id) {
  return knex("profesor_externo")
    .where({ datos_personales_Id: id })
    .select("*")
    .then(function (profesorExterno) {
      if (profesorExterno.length == 0) {
        return 0;
      }
      id = profesorExterno[0]["id"];
      return obtenerProfesor(id).then(function (profesor) {
        return obtenerUsuario(id).then(function (usuario) {
          return obtenerDatosPersonalesExterno(
            profesorExterno[0]["datos_personales_Id"]
          ).then(function (datos) {
            return knex("universidad")
              .where({ id: profesorExterno[0]["universidad"] })
              .select("*")
              .then(function (uni) {
                return new TProfesorExterno(
                  usuario["id"],
                  datos["correo"],
                  datos["nombre"],
                  datos["apellidos"],
                  datos["password"],
                  usuario["origin_login"],
                  usuario["origin_img"],
                  usuario["createdAt"],
                  usuario["updatedAt"],
                  usuario["terminos_aceptados"],
                  uni[0]["nombre"],
                  profesorExterno[0]["facultad"],
                  datos["telefono"]

                );
              });
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerEstudiante(id) {
  return knex("estudiante")
    .where({ id: id })
    .select("*")
    .then(function (estudiante) {
      return estudiante[0];
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerEstudianteInterno(id) {
  return knex("estudiante_interno")
    .where({ id: id })
    .select("*")
    .then(function (estudianteInterno) {
      if (estudianteInterno.length == 0) {
        return 0;
      }
      return obtenerEstudiante(id).then(function (profesor) {
        return obtenerUsuario(id).then(function (usuario) {
          return obtenerDatosPersonalesInterno(
            estudianteInterno[0]["datos_personales_Id"]
          ).then(function (datos) {
            return knex("titulacion_local")
              .where({ id: estudianteInterno[0]["titulacion_local"] })
              .select("*")
              .then(function (tit) {
                return new TEstudianteInterno(
                  usuario["id"],
                  datos["correo"],
                  datos["nombre"],
                  datos["apellidos"],
                  datos["password"],
                  usuario["origin_login"],
                  usuario["origin_img"],
                  usuario["createdAt"],
                  usuario["updatedAt"],
                  usuario["terminos_aceptados"],
                  tit[0]["id"],
                  datos["telefono"]
                );
              });
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerEstudianteInternoPorDatosPersonales(id) {
  return knex("estudiante_interno")
    .where({ datos_personales_Id: id })
    .select("*")
    .then(function (estudianteInterno) {
      if (estudianteInterno.length == 0) {
        return 0;
      }
      id = estudianteInterno[0]["id"];
      return obtenerEstudiante(id).then(function (profesor) {
        return obtenerUsuario(id).then(function (usuario) {
          return obtenerDatosPersonalesInterno(
            estudianteInterno[0]["datos_personales_Id"]
          ).then(function (datos) {
            return knex("titulacion_local")
              .where({ id: estudianteInterno[0]["titulacion_local"] })
              .select("*")
              .then(function (tit) {
                return new TEstudianteInterno(
                  usuario["id"],
                  datos["correo"],
                  datos["nombre"],
                  datos["apellidos"],
                  datos["password"],
                  usuario["origin_login"],
                  usuario["origin_img"],
                  usuario["createdAt"],
                  usuario["updatedAt"],
                  usuario["terminos_aceptados"],
                  tit[0]["id"],
                  datos["telefono"]
                );
              });
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerEstudianteExterno(id) {
  return knex("estudiante_externo")
    .where({ id: id })
    .select("*")
    .then(function (estudianteExterno) {
      if (estudianteExterno.length == 0) {
        return 0;
      }
      return obtenerEstudiante(id).then(function (profesor) {
        return obtenerUsuario(id).then(function (usuario) {
          return obtenerDatosPersonalesExterno(
            estudianteExterno[0]["datos_personales_Id"]
          ).then(function (datos) {
            return knex("universidad")
              .where({ id: estudianteExterno[0]["universidad"] })
              .select("*")
              .then(function (uni) {
                return new TEstudianteExterno(
                  usuario["id"],
                  datos["correo"],
                  datos["nombre"],
                  datos["apellidos"],
                  datos["password"],
                  usuario["origin_login"],
                  usuario["origin_img"],
                  usuario["createdAt"],
                  usuario["updatedAt"],
                  usuario["terminos_aceptados"],
                  estudianteExterno[0]["titulacion"],
                  uni[0]["nombre"],
                  datos["telefono"]
                );
              });
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

function obtenerEstudianteExternoPorDatosPersonales(id) {
  return knex("estudiante_externo")
    .where({ datos_personales_Id: id })
    .select("*")
    .then(function (estudianteExterno) {
      if (estudianteExterno.length == 0) {
        return 0;
      }
      id = estudianteExterno[0]["id"];
      return obtenerEstudiante(id).then(function (profesor) {
        return obtenerUsuario(id).then(function (usuario) {
          return obtenerDatosPersonalesExterno(
            estudianteExterno[0]["datos_personales_Id"]
          ).then(function (datos) {
            return knex("universidad")
              .where({ id: estudianteExterno[0]["universidad"] })
              .select("*")
              .then(function (uni) {
                return new TEstudianteExterno(
                  usuario["id"],
                  datos["correo"],
                  datos["nombre"],
                  datos["apellidos"],
                  datos["password"],
                  usuario["origin_login"],
                  usuario["origin_img"],
                  usuario["createdAt"],
                  usuario["updatedAt"],
                  usuario["terminos_aceptados"],
                  estudianteExterno[0]["titulacion"],
                  uni[0]["nombre"],
                  datos["telefono"]
                );
              });
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error");
    });
}

//ACTUALIZAR--------------------------------------------------------------------------------------------------

function actualizarUsuario(usuario) {
  return knex("usuario")
    .where("id", usuario.getId())
    .update({
      origin_login: usuario.getOriginLogin(),
      origin_img: usuario.getOriginImg(),
      createdAt: usuario.getCreatedAt(),
      updatedAt: usuario.getUpdatedAt(),
      terminos_aceptados: usuario.getTermAcept(),
    })
    .then(() => {
      return usuario.getId();
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al intentar actualizar el usuario");
    });
}

function actualizarAdmin(usuario) {
  return obtenerAdmin(usuario.getId())
    .then(function (ruser) {
      if (ruser["correo"] === usuario.getCorreo()) {
        return actualizarUsuario(usuario).then(function (res) {
          if (res > 0) {
            return knex("datos_personales_interno")
              .where("correo", ruser["correo"])
              .update({
                nombre: usuario.getNombre(),
                apellidos: usuario.getApellidos(),
                password: usuario.getPassword(),
                telefono: usuario.getTelefono()
              })
              .then((rel) => {
                if (rel > 0) {
                  return usuario.getId();
                } else {
                  actualizarUsuario(ruser);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log(
                  "Se ha producido un error al intentar actualizar el usuario"
                );
              });
          } else {
            console.log("Se ha producido un error");
          }
        });
      } else {
        console.log("Los correos no son iguales");
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al intentar actualizar el usuario");
    });
}

function actualizarOficinaAPS(usuario) {
  return obtenerOficinaAps(usuario.getId())
    .then(function (ruser) {
      if (ruser["correo"] === usuario.getCorreo()) {
        return actualizarUsuario(usuario).then(function (res) {
          if (res > 0) {
            return knex("datos_personales_interno")
              .where("correo", ruser["correo"])
              .update({
                nombre: usuario.getNombre(),
                apellidos: usuario.getApellidos(),
                password: usuario.getPassword(),
                telefono: usuario.getTelefono()
              })
              .then((rel) => {
                if (rel > 0) {
                  return usuario.getId();
                } else {
                  actualizarUsuario(ruser);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log(
                  "Se ha producido un error al intentar actualizar el usuario"
                );
              });
          } else {
            console.log("Se ha producido un error");
          }
        });
      } else {
        console.log("Los correos no son iguales");
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al intentar actualizar el usuario");
    });
}

function actualizarSocioComunitario(usuario) {
  return obtenerSocioComunitario(usuario.getId())
    .then(function (ruser) {
      if (ruser["correo"] === usuario.getCorreo()) {
        return actualizarUsuario(usuario).then(function (res) {
          if (res > 0) {
            return knex("datos_personales_externo")
              .where("correo", ruser["correo"])
              .update({
                nombre: usuario.getNombre(),
                apellidos: usuario.getApellidos(),
                password: usuario.getPassword(),
                telefono: usuario.getTelefono()
              })
              .then((rel) => {
                if (rel > 0) {
                  return knex("socio_comunitario")
                    .where("id", usuario.getId())
                    .update({
                      sector: usuario.getSector(),
                      nombre_socioComunitario: usuario.getNombreSocioComunitario(),
                      url: usuario.getUrl(),
                      mision: usuario.getMision()
                    })
                    .then((rel2) => {
                      if (rel2 > 0) {
                        return usuario.getId();
                      } else {
                        actualizarUsuario(ruser);
                        knex("datos_personales_externo")
                          .where("correo", ruser["correo"])
                          .update({
                            nombre: usuario.getNombre(),
                            apellidos: usuario.getApellidos(),
                            password: usuario.getPassword(),
                            telefono: usuario.getTelefono()
                          });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      console.log(
                        "Se ha producido un error al intentar actualizar el usuario"
                      );
                    });
                } else {
                  actualizarUsuario(ruser);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log(
                  "Se ha producido un error al intentar actualizar el usuario"
                );
              });
          } else {
            console.log("Se ha producido un error");
          }
        });
      } else {
        console.log("Los correos no son iguales");
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al intentar actualizar el usuario");
    });
}

function actualizarEstudiante(usuario) {
  return actualizarUsuario(usuario).then(function () {
    return knex("estudiante")
      .where("id", usuario.getId())
      .update({})
      .then(() => {
        return usuario.getId();
      })
      .catch((err) => {
        console.log(err);
        console.log(
          "Se ha producido un error al intentar actualizar el usuario"
        );
      });
  });
}

function actualizarProfesor(usuario) {
  return actualizarUsuario(usuario).then(function () {
    return knex("profesor")
      .where("id", usuario.getId())
      .update({})
      .then(() => {
        return usuario.getId();
      })
      .catch((err) => {
        console.log(err);
        console.log(
          "Se ha producido un error al intentar actualizar el usuario"
        );
      });
  });
}

function actualizarEstudianteExterno(usuario) {
  return obtenerEstudianteExterno(usuario.getId())
    .then(function (ruser) {
      if (ruser["correo"] === usuario.getCorreo()) {
        return actualizarUsuario(usuario).then(function (res) {
          if (res > 0) {
            return knex("datos_personales_externo")
              .where("correo", ruser["correo"])
              .update({
                nombre: usuario.getNombre(),
                apellidos: usuario.getApellidos(),
                password: usuario.getPassword(),
                telefono: usuario.getTelefono()
              })
              .then((rel) => {
                if (rel > 0) {
                  return knex("estudiante_externo")
                    .where("id", usuario.getId())
                    .update({
                      titulacion: usuario.getTitulacion(),
                      universidad: usuario.getUniversidad(),
                    })
                    .then((rel2) => {
                      if (rel2 > 0) {
                        return usuario.getId();
                      } else {
                        actualizarUsuario(ruser);
                        knex("datos_personales_externo")
                          .where("correo", ruser["correo"])
                          .update({
                            nombre: usuario.getNombre(),
                            apellidos: usuario.getApellidos(),
                            password: usuario.getPassword(),
                            telefono: usuario.getTelefono()
                          });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      console.log(
                        "Se ha producido un error al intentar actualizar el usuario"
                      );
                    });
                } else {
                  actualizarUsuario(ruser);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log(
                  "Se ha producido un error al intentar actualizar el usuario"
                );
              });
          } else {
            console.log("Se ha producido un error");
          }
        });
      } else {
        console.log("Los correos no son iguales");
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al intentar actualizar el usuario");
    });
}

function actualizarProfesorExterno(usuario) {
  return obtenerProfesorExterno(usuario.getId())
    .then(function (ruser) {
      if (ruser["correo"] === usuario.getCorreo()) {
        return actualizarUsuario(usuario).then(function (res) {
          if (res > 0) {
            return knex("datos_personales_externo")
              .where("correo", ruser["correo"])
              .update({
                nombre: usuario.getNombre(),
                apellidos: usuario.getApellidos(),
                password: usuario.getPassword(),
                telefono: usuario.getTelefono()
              })
              .then((rel) => {
                if (rel > 0) {
                  return knex("profesor_externo")
                    .where("id", usuario.getId())
                    .update({
                      universidad: usuario.getUniversidad(),
                    })
                    .then((rel2) => {
                      if (rel2 > 0) {
                        return usuario.getId();
                      } else {
                        actualizarUsuario(ruser);
                        knex("datos_personales_externo")
                          .where("correo", ruser["correo"])
                          .update({
                            nombre: usuario.getNombre(),
                            apellidos: usuario.getApellidos(),
                            password: usuario.getPassword(),
                            telefono: usuario.getTelefono()
                          });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      console.log(
                        "Se ha producido un error al intentar actualizar el usuario"
                      );
                    });
                } else {
                  actualizarUsuario(ruser);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log(
                  "Se ha producido un error al intentar actualizar el usuario"
                );
              });
          } else {
            console.log("Se ha producido un error");
          }
        });
      } else {
        console.log("Los correos no son iguales");
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al intentar actualizar el usuario");
    });
}

function actualizarProfesorInterno(usuario, areas, titulaciones) {
  return actualizarUsuario(usuario).then(function () {
    return knex("datos_personales_interno")
      .where("correo", usuario.getCorreo())
      .update({
        nombre: usuario.getNombre(),
        apellidos: usuario.getApellidos(),
        password: usuario.getPassword(),
        telefono: usuario.getTelefono()
      })
      .then(() => {
        return knex("areaconocimiento_profesor")
          .where("id_profesor", usuario.getId())
          .del()
          .then(() => {
            let areasconocimiento = areas;
            const fieldsToInsert = areasconocimiento.map((area) => ({
              id_area: area,
              id_profesor: usuario.getId(),
            }));
            return knex("areaconocimiento_profesor")
              .insert(fieldsToInsert)
              .then(() => {
                return knex("titulacionlocal_profesor")
                  .where("id_profesor", usuario.getId())
                  .del()
                  .then(() => {
                    let titlocal = titulaciones;
                    const fieldsToInsertT = titlocal.map((loc) => ({
                      id_titulacion: loc,
                      id_profesor: usuario.getId(),
                    }));
                    return knex("titulacionlocal_profesor")
                      .insert(fieldsToInsertT)
                      .then(() => {
                        return usuario.getId();
                      });
                  });
              });
          });
      })
      .catch((err) => {
        console.log(err);
        console.log(
          "Se ha producido un error al intentar actualizar el usuario"
        );
      });
  });
}

function actualizarEstudianteInterno(usuario) {
  return obtenerEstudianteInterno(usuario.getId())
    .then(function (ruser) {
      if (ruser["correo"] === usuario.getCorreo()) {
        return actualizarUsuario(usuario).then(function (res) {
          if (res > 0) {
            return knex("datos_personales_interno")
              .where("correo", ruser["correo"])
              .update({
                nombre: usuario.getNombre(),
                apellidos: usuario.getApellidos(),
                password: usuario.getPassword(),
                telefono: usuario.getTelefono()
              })
              .then((rel) => {
                if (rel > 0) {
                  return knex("estudiante_interno")
                    .where("id", usuario.getId())
                    .update({
                      titulacion_local: usuario.getTitulacionLocal(),
                    })
                    .then((rel2) => {
                      if (rel2 > 0) {
                        return usuario.getId();
                      } else {
                        actualizarUsuario(ruser);
                        knex("datos_personales_interno")
                          .where("correo", ruser["correo"])
                          .update({
                            nombre: usuario.getNombre(),
                            apellidos: usuario.getApellidos(),
                            password: usuario.getPassword(),
                            telefono: usuario.getTelefono()
                          });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      console.log(
                        "Se ha producido un error al intentar actualizar el usuario"
                      );
                    });
                } else {
                  actualizarUsuario(ruser);
                }
              })
              .catch((err) => {
                console.log(err);
                console.log(
                  "Se ha producido un error al intentar actualizar el usuario"
                );
              });
          } else {
            console.log("Se ha producido un error");
          }
        });
      } else {
        console.log("Los correos no son iguales");
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("Se ha producido un error al intentar actualizar el usuario");
    });
}

//AUXILIARES----------------------------------------------------------------------------------------------------

function obtenerProfesoresInternos(arrayProfesores) {
  return knex
    .raw(
      "select usuario.id,datos_personales_interno.correo,datos_personales_interno.apellidos,datos_personales_interno.nombre, datos_personales_interno.telefono,datos_personales_interno.password, usuario.origin_login,usuario.origin_img,usuario.createdAt,usuario.updatedAt,usuario.terminos_aceptados,area_conocimiento.nombre as area,titulacion_local.nombre as titulacion from usuario,profesor,profesor_interno,datos_personales_interno,area_conocimiento,areaconocimiento_profesor,titulacion_local,titulacionlocal_profesor where usuario.id = profesor.id AND usuario.id=profesor_interno.id AND profesor_interno.datos_personales_Id=datos_personales_interno.id AND usuario.id =areaconocimiento_profesor.id_profesor AND titulacionlocal_profesor.id_profesor=usuario.id AND titulacionlocal_profesor.id_titulacion=titulacion_local.id AND area_conocimiento.id = areaconocimiento_profesor.id_area AND usuario.id in (" +
      arrayProfesores.map((_) => "?").join(",") +
      ")",
      [...arrayProfesores]
    )
    .then(function (result) {
      let resultadoF = [],
        aux;
      let setF = new Set();
      result[0].forEach((element) => {
        let conocimientos = new Set(),
          titulaciones = new Set();
        result[0].forEach((element2) => {
          if (element.id === element2.id) {
            conocimientos.add(element2.area);
            titulaciones.add(element2.titulacion);
          }
        });
        if (!setF.has(element.id)) {
          setF.add(element.id);
          aux = {
            id: element["id"],
            correo: element["correo"],
            apellidos: element["apellidos"],
            nombre: element["nombre"],
            password: element["password"],
            origin_login: element["origin_login"],
            origin_img: element["origin_img"],
            createdAt: element["createdAt"],
            updatedAt: element["updatedAt"],
            terminos_aceptados: element["terminos_aceptados"],
            area_conocimiento: conocimientos,
            titulacion_local: titulaciones,
            telefono: element["telefono"],
          };
          resultadoF.push(aux);
        }
      });
      return resultadoF;
    });
}

function obtenerTitulacionesProfesorInterno(id) {
  return knex("titulacionlocal_profesor")
    .join(
      "titulacion_local",
      "titulacionlocal_profesor.id_titulacion",
      "=",
      "titulacion_local.id"
    )
    .where({ id_profesor: id })
    .select("titulacion_local.nombre")
    .then((titulaciones) => {
      var nombres_titulaciones = [];
      titulaciones.forEach((titulacion) => {
        nombres_titulaciones.push(titulacion["nombre"]);
      });
      return nombres_titulaciones;
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "Se ha producido un error al intentar obtener las titulaciones del profesor ",
        id
      );
    });
}
module.exports = {
  obtenerUsuario,
  obtenerUsuarioSinRolPorId,
  obtenerEstudianteExterno,
  obtenerProfesorExterno,
  obtenerEstudianteInterno,
  obtenerTitulacionesProfesorInterno,
  obtenerAdmin,
  insertarProfesorExterno,
  insertarEstudianteExterno,
  insertarProfesorInterno,
  insertarSocioComunitario,
  insertarProfesor,
  insertarEstudiante,
  insertarEstudianteInterno,
  insertarOficinaAps,
  insertarUsuario,
  borrarUsuario,
  obtenerUsuarioSinRolPorEmail,
  obtenerUsuarioSinRolPorId,
  obtenerProfesoresInternos,
  obtenerOficinaAps,
  obtenerProfesor,
  obtenerProfesores,
  obtenerSocioComunitario,
  obtenerAdmin,
  obtenerAreasConocimientoUsuario,
  actualizarAdmin,
  actualizarSocioComunitario,
  actualizarEstudiante,
  actualizarEstudianteExterno,
  actualizarEstudianteInterno,
  actualizarOficinaAPS,
  actualizarProfesor,
  actualizarProfesorExterno,
  actualizarProfesorInterno,
  insertarAdmin,
  obtenerProfesorInterno,
  borrarEstudianteInterno,
  borrarProfesorInterno,
  borrarAdmin,
  borrarSocioComunitario,
  borrarOficinaAPS,
  borrarProfesorExterno,
  borrarEstudianteExterno,
  borrarUsuario,
  actualizarUsuario,
  obtenerUniversidades,
  obtenerAreasConocimiento,
  knex,
};
