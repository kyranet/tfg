const knex = require("../../config");



const daoUsuario = require("./daoUsuario");
const daoOferta = require("./daoOferta");
const daoDemanda = require("./daoDemanda");
const daoColaboracion = require("./daoColaboracion")
const transferNotificacion = require('../transfers/TNotificacion');
const { ConsoleReporter } = require("jasmine");
const { not } = require("@angular/compiler/src/output/output_ast");
const TNotificacion = require("../transfers/TNotificacion");

//Obtener toda las notificaciones

function obtenerNotificaciones(idUser){
    return knex('notificaciones')
    .where({idDestino: idUser})
    .select('*')
    .then((resultado)=>{
        notificaciones =[]
        for(n of resultado){
            n2 = Object.assign({}, n)
            console.log(n);
            n3 = new transferNotificacion(n2['id'], n2['idDestino'], n2['leido'],n2['titulo'], n2['mensaje'], n2['fecha_fin'], n2['pendiente'])
            notificaciones.push(n3);
        }
        return notificaciones;
    })
    .catch((err)=>{
        console.log(err)
        console.log('Se ha producido error al intentar obtener los notificaciones del usuario')
    })

}

function cargarNotificacion(idNotificacion){
    return obtenerOfertaAceptadaServicio(idNotificacion).then(result =>{
        if(result == undefined){
            return obtenerNotificacionAceptacionAceptada(idNotificacion).then(result =>{
                if(result == undefined){
                    return obtenerNotificacionAceptacionRechazada(idNotificacion).then(result =>{
                        if(result == undefined){
                            return obtenerNotificacionPartenariadoHecho(idNotificacion).then(result =>{
                                if(result == undefined){
                                    return obtenerNotificacionDemandaRespaldada(idNotificacion).then(result =>{
                                        if(result == undefined){
                                            return obtenerNotificacionMatching(idNotificacion);
                                        }
                                        return result;
                                    })
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
    })
}

function obtenerOfertaAceptadaServicio(idNotificacion){
    return knex('notificaciones').join("ofertaaceptada", "notificaciones.id","=", "ofertaaceptada.idNotificacion")
    .where({"ofertaaceptada.idNotificacion": idNotificacion})
    .select('*').then((resultado) => {
        if(resultado.length == 0) return;
        return daoUsuario.obtenerUsuarioSinRolPorId(resultado[0].idSocio)
        .then(Origen =>{
            return daoOferta.obtenerAnuncioServicio(resultado[0].idOferta).then(Anuncio =>{
                return new transferNotificacion(
                    resultado[0]["id"],
                    resultado[0]["idDestino"],
                    resultado[0]["leido"],
                    resultado[0]["titulo"],
                    resultado[0]["mensaje"],
                    resultado[0]["fecha_fin"],
                    Origen["correo"],
                    resultado[0].idOferta,
                    Anuncio.titulo, 
                    resultado[0]['pendiente'],
                    null
                );
            })
        })

    })
    .catch((err)=>{
        console.log(err)
        console.log("Se ha producido un error al intentar obtener de la base la notificacion con el id ", idNotificacion);
    })
}

function obtenerNotificacionAceptacionAceptada(idNotificacion){
    return knex('notificaciones').join("aceptacionaceptada", "notificaciones.id","=", "aceptacionaceptada.idNotificacion")
    .join('ofertaaceptada', 'aceptacionaceptada.idNotificacionAceptada', '=', 'ofertaaceptada.idNotificacion')
    .where({'aceptacionaceptada.idNotificacion': idNotificacion})
    .select('*').then((resultado) => {
        if(resultado.length == 0) return;
        return daoOferta.obtenerAnuncioServicio(resultado[0].idOferta).then(async Anuncio =>{
            let idCreador = await daoOferta.obtenerCreadorOferta(Anuncio.id);
            return daoUsuario.obtenerUsuarioSinRolPorId(idCreador)
            .then(Origen =>{
                return new transferNotificacion(
                    resultado[0]["id"],
                    resultado[0]["idDestino"],
                    resultado[0]["leido"],
                    resultado[0]["titulo"],
                    resultado[0]["mensaje"],
                    resultado[0]["fecha_fin"],
                    Origen["correo"],
                    resultado[0].idOferta,
                    Anuncio.titulo, 
                    resultado[0]['pendiente'],
                    resultado[0]['idPartenariado']
                );
            })
        })
        

    })
    .catch((err)=>{
        console.log(err)
        console.log("Se ha producido un error al intentar obtener de la base la notificacion con el id ", idNotificacion);
    })
}

function obtenerNotificacionAceptacionRechazada(idNotificacion){
    return knex('notificaciones').join("aceptacionrechazado", "notificaciones.id","=", "aceptacionrechazado.idNotificacion")
    .join('ofertaaceptada', 'aceptacionrechazado.idNotificacionOferta', '=', 'ofertaaceptada.idNotificacion')
    .where({'aceptacionrechazado.idNotificacion': idNotificacion})
    .select('*').then((resultado) => {
        if(resultado.length == 0) return;
        return daoOferta.obtenerAnuncioServicio(resultado[0].idOferta).then(Anuncio =>{
            return daoUsuario.obtenerUsuarioSinRolPorId(resultado[0].idSocio)
            .then(Origen =>{
                return new transferNotificacion(
                    resultado[0]["id"],
                    resultado[0]["idDestino"],
                    resultado[0]["leido"],
                    resultado[0]["titulo"],
                    resultado[0]["mensaje"],
                    resultado[0]["fecha_fin"],
                    Origen["correo"],
                    resultado[0].idOferta,
                    Anuncio.titulo, 
                    resultado[0]['pendiente'],
                    resultado[0]['idPartenariado']
                );
            })
        })
        

    })
    .catch((err)=>{
        console.log(err)
        console.log("Se ha producido un error al intentar obtener de la base la notificacion con el id ", idNotificacion);
    })
}


function obtenerNotificacionPartenariadoHecho(idnotificacion){
    return knex('notificaciones').join("partenariadorellenado", "notificaciones.id","=", "partenariadorellenado.idNotificacion")
    .where({idNotificacion: idnotificacion})
    .select('*').then(resultado =>{
        if(resultado.length == 0) return;
        console.log(resultado);
        return new transferNotificacion(
            resultado[0].id,
            resultado[0].idDestino,
            resultado[0].leido,
            resultado[0].titulo,
            resultado[0].mensaje,
            resultado[0].fecha_fin,
            null,
            null,
            null,
            resultado[0].pendiente,
            resultado[0].idPartenariado
        );
    })
    .catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta obtener notificacion de partenariadorellenado");
    })
}

function obtenerNotificacionDemandaRespaldada(idnotificacion){
    return knex('notificaciones').join("demandarespalda", "notificaciones.id","=", "demandarespalda.idNotificacion")
    .where({idNotificacion: idnotificacion})
    .select('*').then(resultado =>{
        if(resultado.length == 0) return;
        return daoColaboracion.obtenerColaboracion(resultado[0].idPartenariado).then(partenariado =>{
            return daoUsuario.obtenerUsuarioSinRolPorId(partenariado.responsable).then(origen =>{
                return new transferNotificacion(
                    resultado[0].id,
                    resultado[0].idDestino,
                    resultado[0].leido,
                    resultado[0].titulo,
                    resultado[0].mensaje,
                    resultado[0].fecha_fin,
                    origen["correo"],
                    null,
                    null,
                    resultado[0].pendiente,
                    resultado[0].idPartenariado
                );
            })
        })
    })
    .catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta obtener notificacion de partenariadorellenado");
    })
}

function crearNotificacion(notificacion){
    return knex('notificaciones')
        .insert({
            idDestino: notificacion.idDestino,
            titulo:notificacion.titulo,
            mensaje:notificacion.mensaje,
            pendiente: notificacion.pendiente
        }).then(idNotificacion => {
            return idNotificacion;
        })
    .catch(error =>{
            console.log(error)
            console.log("Se ha producido un error al intenta crear una notificacion en notificaciones ");
    })
}

function crearNotificacionOfertaAceptada(notificacion, idSocio){
    return daoOferta.obtenerOfertaServicio(notificacion.idOferta)
    .then(result =>{
        notificacion.idDestino = result.creador.id;
        console.log(notificacion);
        crearNotificacion(notificacion).then(idNotificacion =>{
            return knex('ofertaaceptada').insert({
                idNotificacion:idNotificacion,
                idOferta:notificacion.idOferta,
                idSocio:idSocio
            })}).catch(err=>{
                console.log(err);
                console.log("Intentando borrar notificacion creada");
                borrarNotificacion(idNotificacion);
                console.log("Borrado");
                console.log("Se ha producido un error al intenta notificar una notificacion de OfertaAceptada");
            })
    }).catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta crear una notificacion en ofertaaceptada");
    })
}

function obtenerNotificacionOfertaAceptada(idnotificacion){
    return knex('ofertaaceptada').select('*')
    .where({idNotificacion: idnotificacion}).catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta obtener notificacion de ofertaAceptada");
    })
}

function obtenerNotificacionAceptacionAceptadaPorIdPartenariado(idPartenariado){
    return knex('aceptacionaceptada').select('*')
    .where({idPartenariado:idPartenariado}).catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta obtener notificacion de aceptacionaceptada por idPartenariado");
    });
}

function obtenerNotificacionDemandaRespaldadaPorIdPartenariado(idPartenariado){
    return knex('demandarespalda').select('*')
    .where({idPartenariado:idPartenariado}).catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta obtener notificacion de demandaRespalda por idPartenariado");
    });
}

function obtenerNotificacionMatching(idnotificacion){
    return knex('notificaciones').join("notificacionmatching", "notificaciones.id","=", "notificacionmatching.idNotificacion")
    .where({idNotificacion: idnotificacion})
    .select('*').then(async resultado=>{
        if(resultado.length == 0) return;
        return new transferNotificacion(
            resultado[0].id,
            resultado[0].idDestino,
            resultado[0].leido,
            resultado[0].titulo,
            resultado[0].mensaje,
            resultado[0].fecha_fin,
            null,
            resultado[0].idOferta,
            await daoOferta.obtenerOfertaServicio(resultado[0].idOferta).then(result => result.getTitulo()),
            resultado[0].pendiente,
            null,
            resultado[0].idDemanda,
            await daoDemanda.obtenerDemandaServicio(resultado[0].idDemanda).then(result => result.getTitulo()),
        );

    })
}



function crearNotificacionAceptadacionRechazada(notificacion, idNotificacionOferta){
    return crearNotificacion(notificacion).then(idNotificacion =>{
        return knex('aceptacionrechazado').insert({
            idNotificacion:idNotificacion,
            idNotificacionOferta:idNotificacionOferta
        }).then(result =>{
            FinalizarPendienteNotificacion(idNotificacionOferta);
            return result;
        }).catch(err=>{
            console.log(err);
            console.log("Intentando borrar notificacion creada");
            borrarNotificacion(idNotificacion);
            console.log("Borrado");
            console.log("Se ha producido un error al intenta notificar una notificacion de AceptacionRechazada");
        })
    }).catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta crear una notificacion en aceptacionRechazada");
    })

}

function crearNotificacionAceptadacionAceptada(notificacion, idNotificacionOferta, idPartenariado){
    return crearNotificacion(notificacion).then(idNotificacion =>{
        return knex('aceptacionaceptada').insert({
            idNotificacion:idNotificacion,
            idPartenariado:idPartenariado,
            idNotificacionAceptada:idNotificacionOferta
        }).then(result=>{
            FinalizarPendienteNotificacion(idNotificacionOferta);
            return result;
        }).catch(err=>{
            console.log(err);
            console.log("Intentando borrar notificacion creada");
            borrarNotificacion(idNotificacion);
            console.log("Borrado");
            console.log("Se ha producido un error al intenta notificar una notificacion de AceptacionAceptada");
        })
    })
    .catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta crear una notificacion en aceptacionAceptacion");
    })

}

function crearNotificacionPartenariadoHecho(notificacion){
    return crearNotificacion(notificacion).then(idNotificacion =>{
        return knex('partenariadorellenado').insert({
            idNotificacion: idNotificacion,
            idPartenariado: notificacion.idPartenariado
        }).then(result => {
            //Suponiendo que No importa por que ruta va creando un partenariado para cada notificacion 
            return result;
        }).catch(err=>{
            console.log(err);
            console.log("Intentando borrar notificacion creada");
            borrarNotificacion(idNotificacion);
            console.log("Borrado");
            console.log("Se ha producido un error al intenta notificar una notificacion de PartenariadoHecho");
        })
    })
}

function crearNotificacionDemandaRespalda(notificacion){
    return crearNotificacion(notificacion).then(idNotificacion =>{
        return knex('demandarespalda').insert({
            idNotificacion: idNotificacion,
            idPartenariado: notificacion.idPartenariado
        }).then(result =>{
            return result;
        }).catch(err=>{
            console.log(err);
            console.log("Intentando borrar notificacion creada");
            borrarNotificacion(idNotificacion);
            console.log("Borrado");
            console.log("Se ha producido un error al intenta notificar una notificacion de DemandaRespaldada");
        })
    })
    .catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta crear una notificacion en demandaRespalda");
    })

}

function crearNotificacionMatching(idOferta, iddestinatario, idDemanda){
    let Notificacion = new TNotificacion(
        "",
        iddestinatario,
        "",
        "Se ha producido matching!!",
        "Enhorabuena, se ha producido un matching",
        "",
        "",
        idDemanda,
        "",
        1,
        "",""
    )
    return crearNotificacion(Notificacion).then(idNotificacion =>{
        return knex('notificacionmatching').insert({
            idNotificacion: idNotificacion,
            idOferta: idOferta,
            idDemanda: idDemanda
        }).then(result =>{
            return result;
        }).catch(err=>{
            console.log(err);
            console.log("Intentando borrar notificacion creada");
            borrarNotificacion(idNotificacion);
            console.log("Borrado");
            console.log("Se ha producido un error al intenta notificar una notificacion de matching");
        });
    })
}
function FinalizarPendienteNotificacion(idNotificacion){
    return knex('notificaciones').where({
        id:idNotificacion
    }).update({
        pendiente:'0'
    }).catch(err=>{
        console.log(err)
        console.log("Se ha producido un error al intenta finalizar una notificacion");
    })
}

function notificarPartenariadoRellenado(notificacion){
    return daoColaboracion.obtenerPartenariado(notificacion.idPartenariado).then(partenariado =>{
        return daoOferta.obtenerOfertaServicio(partenariado.id_oferta).then(oferta =>{
            notificacion.idDestino = oferta.creador.id;
            return crearNotificacionPartenariadoHecho(notificacion).then((idNotificacion)=>{
                return daoDemanda.obtenerDemandaServicio(partenariado.id_demanda).then(demanda =>{
                    notificacion.idDestino = demanda.creador.id;
                    return crearNotificacionPartenariadoHecho(notificacion).then(idNotificacion =>{
                        //Suponiendo que No importa por que ruta va creando un partenariado para cada notificacion 
                        return obtenerNotificacionAceptacionAceptadaPorIdPartenariado(notificacion.idPartenariado).then(notificacionFinalizado=>{
                            console.log(notificacionFinalizado);
                            if(notificacionFinalizado.length == 0){
                                return obtenerNotificacionDemandaRespaldadaPorIdPartenariado(notificacion.idPartenariado).then(notificacionFinalizado=>{
                                    return FinalizarPendienteNotificacion(notificacionFinalizado[0].idNotificacion);
                                });
                            }
                            return FinalizarPendienteNotificacion(notificacionFinalizado[0].idNotificacion);
                        }).catch(err=>{
                            console.log(err);
                            console.log("Intentando borrar notificacion creada");
                            borrarNotificacion(idNotificacion);
                            console.log("Borrado");
                            console.log("Se ha producido un error al intenta notificar una notificacion de partenariadoRellenado");
                        });

                    });
                }).catch(err=>{
                    console.log(err);
                    console.log("Intentando borrar notificacion creada");
                    borrarNotificacion(idNotificacion);
                    console.log("Borrado");
                    console.log("Se ha producido un error al intenta notificar una notificacion de partenariadoRellenado");
                });
            });


        });
    })
    .catch(err=>{
        console.log(err)
        console.log("Se ha producido un error al intenta notificar una notificacion de partenariadoRellenado");
    })

}

function borrarNotificacion(idNotificacion){
    return knex('notificaciones').where({"id":idNotificacion}).delete()
    .catch(err=>{
        console.log(err)
        console.log("Se ha producido un error al intenta borrar un notificacion");

    })
}




module.exports ={
    obtenerNotificaciones,
    cargarNotificacion,
    obtenerOfertaAceptadaServicio,
    crearNotificacionOfertaAceptada,
    obtenerNotificacionOfertaAceptada,
    crearNotificacionAceptadacionRechazada,
    crearNotificacionAceptadacionAceptada,
    notificarPartenariadoRellenado,
    crearNotificacionDemandaRespalda,
    crearNotificacionMatching
    

}