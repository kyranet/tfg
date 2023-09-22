const knex = require("../../config");
const daoUsuario = require("./daoUsuario");
const daoTags = require("./daoTags");
const transferOfertaServicio = require("../transfers/TOfertaServicio");
const transferAnuncioServicio = require("../transfers/TAnuncioServicio");

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
            let fieldsToInsert = {
                id_area: areasServicio,
                id_anuncio: id_anuncio,
            };
            if (Array.isArray(areasServicio)) {
                console.log(
                    "Se va a proceder a insertar las areas de servicio"
                );
                fieldsToInsert = areasServicio.map((area) => ({
                    id_area: area,
                    id_anuncio: id_anuncio,
                }));
                return knex("areaservicio_anuncioservicio")
                    .insert(fieldsToInsert)
                    .then(() => {
                        console.log("Se han insertado las areas de servicio");
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
                    observaciones_temporales:
                        oferta.getObservaciones_temporales(),
                    creador: oferta.getCreador(),
                })
                .then(function (oferta_id) {
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
                                fieldsToInsert2 = profesores.map(
                                    (profesor) => ({
                                        id_profesor: profesor,
                                        id_oferta: id_anuncio[0],
                                    })
                                );
                            }
                            return knex("profesorinterno_oferta")
                                .insert(fieldsToInsert2)
                                .then(() => {
                                    console.log(
                                        "Se ha introducido la oferta con id ",
                                        id_anuncio[0]
                                    );
                                    //regresa el id de la oferta
                                    return id_anuncio;
                                });
                        });
                })
                .catch((err) => {
                    console.log(err);
                    console.log(
                        "Se ha producido un error al crear en la base de datos la oferta de servicio ",
                        id_anuncio[0]
                    );
                    return knex("anuncio_servicio")
                        .where("id", id_anuncio[0])
                        .del();
                });
        })
        .catch((err) => {
            console.log(err);
            console.log(
                "Se ha producido un error al crear en la base de datos la oferta de servicio"
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
                                        .obtenerProfesoresInternos(
                                            arrayProfesores
                                        )
                                        .then(function (profesores) {
                                            return obtenerAsignaturaObjetivo(
                                                id_oferta
                                            ).then((asignaturas) => {
                                                return daoTags
                                                    .readByOferta(id_oferta)
                                                    .then((tags) => {
                                                        //SELECT * FROM `oferta_demanda_tags` WHERE object_id=126
                                                        asignaturas_ref = [];
                                                        for (asignatura of asignaturas) {
                                                            asignaturas_ref.push(
                                                                asignatura[
                                                                    "nombre"
                                                                ]
                                                            );
                                                        }
                                                        //tomo los tags asociados y los paso
                                                        tags_ref = [];
                                                        for (tag of tags) {
                                                            tags_ref.push(
                                                                tag["nombre"]
                                                            );
                                                        }
                                                        return new transferOfertaServicio(
                                                            oferta[0]["id"],
                                                            anuncio.getTitulo(),
                                                            anuncio.getDescripcion(),
                                                            anuncio.getImagen(),
                                                            anuncio.getCreated_at(),
                                                            anuncio.getUpdated_at(),
                                                            asignaturas_ref,
                                                            oferta[0][
                                                                "cuatrimestre"
                                                            ],
                                                            oferta[0][
                                                                "anio_academico"
                                                            ],
                                                            oferta[0][
                                                                "fecha_limite"
                                                            ],
                                                            oferta[0][
                                                                "observaciones_temporales"
                                                            ],
                                                            {
                                                                id: responsable.getId(),
                                                                nombre: responsable.getNombre(),
                                                                apellidos:
                                                                    responsable.getApellidos(),
                                                            },
                                                            anuncio.getArea_servicio(),
                                                            profesores,
                                                            oferta[0]["dummy"],
                                                            tags_ref
                                                        );
                                                    });
                                            });
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

function contarTodasOfertasServicio() {
    return knex("anuncio_servicio")
        .count("id as COUNT")
        .then((total) => {
            return total[0].COUNT;
        });
}

function obtenerTodasOfertasServicio(limit, offset, filters) {
    let fil = JSON.parse(filters);
    let creator_id = fil.creador || true;
    let tag_filter = fil.tags.length ? fil.tags : []; // tomamos los tags name para buscarlo en la tabla de relaciones si esta vacio este array entonces lo que vot hacer es usar un pivote de -1 para conseguir un true en la parte dekl condcional
    

    return knex("anuncio_servicio")
        .join(
            "oferta_servicio",
            "anuncio_servicio.id",
            "=",
            "oferta_servicio.id"
        )
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
        // .join('oferta_demanda_tags','oferta_demanda_tags.object_id','=','oferta_servicio.id')
        // .join('tags','tags.id','=','oferta_demanda_tags.tag_id')
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
        .whereIn("cuatrimestre", fil.cuatrimestre)
        .where("titulo", "like", "%" + fil.terminoBusqueda + "%") 
        .modify(function(queryBuilder) {
            if (fil.creador) {
                queryBuilder.where('creador', fil.creador);
            }
        }) 
        .where(tag_filter.length, "=", 0)
        .orWhere(0,'<', function() {
            this.count('*')
            .from('oferta_demanda_tags')
            .join('tags','tags.id','=','oferta_demanda_tags.tag_id')
            .whereRaw(`oferta_demanda_tags.object_id = oferta_servicio.id`)
            .whereIn('tags.nombre', tag_filter)
        }) 
        .limit(limit)
        .offset(offset)
        .modify(function(queryBuilder) {
            if (fil.creador) {
                var sd =" ;";
            }
        })
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
                            return daoTags
                                .readByOfertaIDs(datos_ofertas.map((x) => x.id)) // tomamos solo los tags que nos interesa dependiendo de las ofetas
                                .then((tags) => {
                                    let transfer_ofertas = [];

                                    datos_ofertas.forEach((datos) => {
                                        let nombre = datos["nombre"];
                                        let apellidos = datos["apellidos"];
                                        let creador = {
                                            nombre,
                                            apellidos,
                                        };
                                        let areas_servicio = [];
                                        areas.forEach((area) => {
                                            if (
                                                area["id_anuncio"] ===
                                                datos["id"]
                                            ) {
                                                areas_servicio.push(
                                                    area["area"]
                                                );
                                            }
                                        });
                                        let asignaturas_objetivo = [];
                                        asignaturas.forEach((asignatura) => {
                                            if (
                                                datos["id"] ===
                                                asignatura["id_oferta"]
                                            ) {
                                                asignaturas_objetivo.push(
                                                    asignatura["nombre"]
                                                );
                                            }
                                        });
                                        //tomo lo
                                        let transfer_oferta =
                                            new transferOfertaServicio(
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
                                                datos[
                                                    "observaciones_temporales"
                                                ],
                                                creador,
                                                areas_servicio,
                                                undefined,
                                                undefined,
                                                undefined//map_tags[datos["id"]]
                                            );
                                        transfer_ofertas.push(transfer_oferta);
                                    });
                                    return transfer_ofertas;
                                });
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
                        observaciones_temporales:
                            oferta.getObservaciones_temporales(),
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
                                    fieldsToInsert = asignaturas.map(
                                        (asignatura) => ({
                                            id_oferta: oferta.getId(),
                                            nombre: asignatura,
                                        })
                                    );
                                }
                                return knex("asignatura")
                                    .insert(fieldsToInsert)
                                    .then(() => {
                                        return knex("profesorinterno_oferta")
                                            .where("id_oferta", oferta.getId())
                                            .del()
                                            .then(() => {
                                                profesores =
                                                    oferta.getProfesores();
                                                let fieldsToInsert2 = {
                                                    id_profesor: profesores,
                                                    id_oferta: oferta.getId(),
                                                };
                                                if (Array.isArray(profesores)) {
                                                    fieldsToInsert2 =
                                                        profesores.map(
                                                            (profesor) => ({
                                                                id_profesor:
                                                                    profesor,
                                                                id_oferta:
                                                                    oferta.getId(),
                                                            })
                                                        );
                                                }
                                                return knex(
                                                    "profesorinterno_oferta"
                                                )
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
                        return obtenerIdsAreas(nombre_areas).then(
                            (ids_areas) => {
                                copia_anuncio.setArea_servicio(ids_areas);
                                return actualizarAnuncio(copia_anuncio).then(
                                    () => {
                                        console.log(
                                            "Se ha producido un error al intentar actualizar en la base de datos la oferta de servicio con id ",
                                            oferta.getId()
                                        );
                                    }
                                );
                            }
                        );
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
                    console.log(
                        "No existe la oferta de servicio con id ",
                        id_oferta
                    );
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
                    return knex("areaservicio_anuncioservicio").insert(
                        fieldsToInsert
                    );
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
            return knex.select("*").from("anuncio_servicio").whereIn("id", areas);
        })
        .catch((err) => {
            console.log(
                "No se ha encontrado el area de servicio perteneciente al anuncio de servicio con id ",
                id_anuncio
            );
            throw err;
        });
}

/*****/
function obtenerAnuncioPorAreaServicio(id_areaServicio){
    return knex("areaservicio_anuncioservicio")
        .where({id_area: id_areaServicio})
        .select("id_anuncio")
        .then(function(id_anuncios){
            anuncios = [];
            for (id_anuncio of id_anuncios){
                anuncios.push(id_anuncio["id_anuncio"]);
            }
            return knex.select("*").from("anuncio_servicio").whereIn("id", anuncios);
        })
        .catch((err) => {
            console.log("No se han encontrado los anuncios con el area de servicio con id ", id_areaServicio);
            throw err;
        });
}
/***************/
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
    crearAnuncio,
    crearOferta,
    obtenerOfertaServicio,
    obtenerTodasOfertasServicio,
    obtenerAnuncioServicio,
    obtenerListaAreasServicio,
    actualizarOfertaServicio,
    eliminarOferta,
    actualizarAnuncio,
    eliminarAnuncio,
    contarTodasOfertasServicio,
    obtenerAnuncioPorAreaServicio,
};
