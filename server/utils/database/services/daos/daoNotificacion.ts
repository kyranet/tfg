import Notificacion from '../Transfer/tNotificacion'
import daoUsuario from '../daos/daoUsuario'
import daoOferta from '../daos/daoOferta'
import daoDemanda from '../daos/daoDemanda'
import daoColaboracion from '../daos/daoColaboracion'
const knex = require("../../config");


async function obtenerNotificaciones(idUser: number): Promise <Notificacion[]> {
    try {
        const resultado = await knex('notificaciones')
            .where({ idDestino: idUser })
            .select('*');

        return resultado.map(n => {
            return {
                id: n.id,
                idDestino: n.idDestino,
                leido: n.leido,
                titulo: n.titulo,
                mensaje: n.mensaje,
                fecha_fin: n.fecha_fin,
                emailOrigen: n.emailOrigen,
                idOferta: n.idOferta,
                tituloOferta: n.tituloOferta,
                idDemanda: n.idDemanda,
                tituloDemanda: n.tituloDemanda,
                pendiente: n.pendiente,
                idPartenariado: n.idPartenariado,
                idMatching: n.idMatching
            };
        });
    } catch (err) {
        console.error('Error al obtener las notificaciones del usuario:', err);
        throw err;
    }
}

async function cargarNotificacion(idNotificacion: number): Promise<Notificacion | undefined> {
    try {
        let result = await obtenerOfertaAceptadaServicio(idNotificacion);
        if (!result) result = await obtenerNotificacionAceptacionAceptada(idNotificacion);
        if (!result) result = await obtenerNotificacionAceptacionRechazada(idNotificacion);
        if (!result) result = await obtenerNotificacionPartenariadoHecho(idNotificacion);
        if (!result) result = await obtenerNotificacionDemandaRespaldada(idNotificacion);
        if (!result) result = await obtenerNotificacionMatching(idNotificacion);

        return result;
    } catch (err) {
        console.error('Error al cargar notificación:', err);
        throw err;
    }
}

async function obtenerOfertaAceptadaServicio(idNotificacion: number): Promise<Notificacion | undefined> {
    try {
        const resultado = await knex('notificaciones').join("ofertaaceptada", "notificaciones.id","=", "ofertaaceptada.idNotificacion")
                             .where({"ofertaaceptada.idNotificacion": idNotificacion})
                             .select('*');
        if (resultado.length === 0) return undefined;
        const Origen = await daoUsuario.obtenerUsuarioSinRolPorId(resultado[0].idSocio);
        const Anuncio = await daoOferta.obtenerAnuncioServicio(resultado[0].idOferta);
        const notificacion: Notificacion={
            id: resultado[0]["id"],
            idDestino: resultado[0]["idDestino"],
            leido: resultado[0]["leido"],
            titulo: resultado[0]["titulo"],
            mensaje: resultado[0]["mensaje"],
            fecha_fin: resultado[0]["fecha_fin"],
            emailOrigen: Origen["correo"],
            idOferta: resultado[0].idOferta,
            tituloOferta: Anuncio.titulo,
            idDemanda: resultado[0]['idDemanda'],
            tituloDemanda: resultado[0]['tituloDemanda'],
            pendiente: resultado[0]['pendiente'],
            idPartenariado: resultado[0]['idPartenariado'],
            idMatching: resultado[0]['idMatching'],         
        };
            
        return notificacion;
    } catch (err) {
        console.error('Error al obtener oferta aceptada de servicio:', err);
        throw err;
    }
}

async function obtenerNotificacionAceptacionAceptada(idNotificacion: number): Promise<Notificacion | undefined> {
    try {
        const resultado = await knex('notificaciones')
            .join("aceptacionaceptada", "notificaciones.id", "=", "aceptacionaceptada.idNotificacion")
            .join('ofertaaceptada', 'aceptacionaceptada.idNotificacionAceptada', '=', 'ofertaaceptada.idNotificacion')
            .where({'aceptacionaceptada.idNotificacion': idNotificacion})
            .select('*');

        if (resultado.length === 0) return undefined;

        const Anuncio = await daoOferta.obtenerAnuncioServicio(resultado[0].idOferta);
        const idCreador = await daoOferta.obtenerCreadorOferta(Anuncio.id);
        const Origen = await daoUsuario.obtenerUsuarioSinRolPorId(idCreador);

        const notificacion: Notificacion= {
            id: resultado[0]["id"],
            idDestino: resultado[0]["idDestino"],
            leido: resultado[0]["leido"],
            titulo: resultado[0]["titulo"],
            mensaje: resultado[0]["mensaje"],
            fecha_fin: resultado[0]["fecha_fin"],
            emailOrigen: Origen["correo"],
            idOferta: resultado[0].idOferta,
            tituloOferta: Anuncio.titulo,
            idDemanda: resultado[0]['idDemanda'],
            tituloDemanda: resultado[0]['tituloDemanda'],
            pendiente: resultado[0]['pendiente'],
            idPartenariado: resultado[0]['idPartenariado'],
            idMatching: resultado[0]['idMatching'], 
        };
        return notificacion;
    } catch (err) {
        console.error("Se ha producido un error al intentar obtener de la base la notificación con el id", idNotificacion, err);
        throw err;
    }
}

async function obtenerNotificacionAceptacionRechazada(idNotificacion: number): Promise<Notificacion | undefined> {
    try {
        const resultados = await knex('notificaciones')
            .join("aceptacionrechazado", "notificaciones.id", "=", "aceptacionrechazado.idNotificacion")
            .join('ofertaaceptada', 'aceptacionrechazado.idNotificacionOferta', '=', 'ofertaaceptada.idNotificacion')
            .where({'aceptacionrechazado.idNotificacion': idNotificacion})
            .select('*');

        if (resultados.length === 0) return undefined;

        const anuncio = await daoOferta.obtenerAnuncioServicio(resultados[0].idOferta);
        const origen = await daoUsuario.obtenerUsuarioSinRolPorId(resultados[0].idSocio);

        const notificacion: Notificacion = {
            id: resultados[0].id,
            idDestino: resultados[0].idDestino,
            leido: resultados[0].leido,
            titulo: resultados[0].titulo,
            mensaje: resultados[0].mensaje,
            fecha_fin: resultados[0].fecha_fin,
            emailOrigen: origen.correo,
            idOferta: resultados[0].idOferta,
            tituloOferta: anuncio.titulo,
            idDemanda: resultados[0].idDemanda,
            tituloDemanda: resultados[0].tituloDemanda,
            pendiente: resultados[0].pendiente,
            idPartenariado: resultados[0].idPartenariado,
            idMatching: resultados[0].idMatching
        };

        return notificacion;
    } catch (err) {
        console.error("Se ha producido un error al intentar obtener de la base la notificación con el id", idNotificacion, err);
        throw err;
    }
}


//El retorno esta basado en el codigo original, revisar esos null.
async function obtenerNotificacionPartenariadoHecho(idNotificacion: number): Promise<Notificacion | undefined> {
    try {
        const resultados = await knex('notificaciones')
            .join("partenariadorellenado", "notificaciones.id", "=", "partenariadorellenado.idNotificacion")
            .where({ idNotificacion: idNotificacion })
            .select('*');

        if (resultados.length === 0) return undefined;

        const notificacion: Notificacion = {
            id: resultados[0].id,
            idDestino: resultados[0].idDestino,
            leido: resultados[0].leido,
            titulo: resultados[0].titulo,
            mensaje: resultados[0].mensaje,
            fecha_fin: resultados[0].fecha_fin,
            emailOrigen: null, 
            idOferta: null,    
            tituloOferta: null, 
            idDemanda: null,  
            tituloDemanda: null, 
            pendiente: resultados[0].pendiente,
            idPartenariado: resultados[0].idPartenariado,
            idMatching: null  
        };

        return notificacion;
    } catch (err) {
        console.error("Se ha producido un error al intentar obtener la notificación de partenariado rellenado con id", idNotificacion, err);
        throw err;
    }
}

//El retorno esta basado en el codigo original, revisar esos null.
async function obtenerNotificacionDemandaRespaldada(idNotificacion: number): Promise<Notificacion | undefined> {
    try {
        const resultados = await knex('notificaciones')
            .join("demandarespalda", "notificaciones.id", "=", "demandarespalda.idNotificacion")
            .where({ idNotificacion: idNotificacion })
            .select('*');

        if (resultados.length === 0) return undefined;

        const partenariado = await daoColaboracion.obtenerColaboracion(resultados[0].idPartenariado);
        const origen = await daoUsuario.obtenerUsuarioSinRolPorId(partenariado.responsable);

        const notificacion: Notificacion = {
            id: resultados[0].id,
            idDestino: resultados[0].idDestino,
            leido: resultados[0].leido,
            titulo: resultados[0].titulo,
            mensaje: resultados[0].mensaje,
            fecha_fin: resultados[0].fecha_fin,
            emailOrigen: origen.correo,
            idOferta: null,    
            tituloOferta: null, 
            idDemanda: null,  
            tituloDemanda: null, 
            pendiente: resultados[0].pendiente,
            idPartenariado: resultados[0].idPartenariado,
            idMatching: null  
        };

        return notificacion;
    } catch (err) {
        console.error("Se ha producido un error al intentar obtener la notificación de demanda respaldada con id", idNotificacion, err);
        throw err;
    }
}

async function crearNotificacion(notificacion: Notificacion): Promise<number | void> {
    try {
        const idNotificacion = await knex('notificaciones').insert({
            idDestino: notificacion.idDestino,
            titulo: notificacion.titulo,
            mensaje: notificacion.mensaje,
            pendiente: notificacion.pendiente
        });

        return idNotificacion[0]; // Retorna el ID de la notificación insertada
    } catch (error) {
        console.error("Se ha producido un error al intentar crear una notificación en notificaciones", error);
    }
}

//En la funcion original no retorna nada, se decide cambiar al id.
//Cambiado tipado id a any por getQuery.
export async function crearNotificacionOfertaAceptada(notificacion: Notificacion, idSocio: any): Promise<number> {
    try {
        const result = await daoOferta.obtenerOfertaServicio(notificacion.idOferta);
        notificacion.idDestino = result.creador.id;
        console.log(notificacion);

        const idNotificacion = await crearNotificacion(notificacion);
        await knex('ofertaaceptada').insert({
            idNotificacion: idNotificacion,
            idOferta: notificacion.idOferta,
            idSocio: idSocio
        });
        return idNotificacion[0]; // Retorna el ID de la notificación oferta aceptada insertada
    } catch (err) {
        console.error("Error al crear notificación de Oferta Aceptada", err);
        // Manejar la lógica de eliminación de la notificación si es necesario
    }
}
//Cambiado tipado id
export async function obtenerNotificacionOfertaAceptada(idnotificacion: any): Promise<Notificacion> {
    try {
        const resultado = await knex('ofertaaceptada')
            .select('*')
            .where({ idNotificacion: idnotificacion });

        return resultado;
    } catch (err) {
        console.error("Error al obtener notificación de oferta aceptada", err);
        // Puedes decidir devolver un valor por defecto o propagar el error.
    }
}

async function obtenerNotificacionAceptacionAceptadaPorIdPartenariado(idPartenariado: number): Promise<Notificacion> {
    try {
        const resultado = await knex('aceptacionaceptada')
            .select('*')
            .where({ idPartenariado: idPartenariado });
        return resultado;
    } catch (err) {
        console.error("Error al obtener notificación de aceptación aceptada por idPartenariado", err);
    }
}

async function obtenerNotificacionDemandaRespaldadaPorIdPartenariado(idPartenariado: number): Promise<Notificacion[]> {
    try {
        const resultado = await knex('demandarespalda')
            .select('*')
            .where({ idPartenariado: idPartenariado });
        return resultado;
    } catch (err) {
        console.error("Error al obtener notificación de demanda respaldada por idPartenariado", err);
    }
}

async function obtenerNotificacionMatching(idnotificacion: number): Promise<Notificacion | undefined> {
    try {
        const resultado = await knex('notificaciones')
            .join("notificacionmatching", "notificaciones.id", "=", "notificacionmatching.idNotificacion")
            .where({ idNotificacion: idnotificacion })
            .select('*');

        if (resultado.length === 0) {
            return undefined;
        }

        const tituloOferta = await daoOferta.obtenerOfertaServicio(resultado[0].idOferta).then(res => res.getTitulo());
        const tituloDemanda = await daoDemanda.obtenerDemandaServicio(resultado[0].idDemanda).then(res => res.getTitulo());

        const notificacion: Notificacion = {
            id: resultado[0].id,
            idDestino: resultado[0].idDestino,
            leido: resultado[0].leido,
            titulo: resultado[0].titulo,
            mensaje: resultado[0].mensaje,
            fecha_fin: resultado[0].fecha_fin,
            emailOrigen: null,
            idOferta: resultado[0].idOferta,  
           //tituloOferta: await daoOferta.obtenerOfertaServicio(resultado[0].idOferta).then(result => result.getTitulo()),  
            tituloOferta: resultado[0].tituloOferta, 
            idDemanda:resultado[0].idDemanda,
            //tituloDemanda: await daoDemanda.obtenerDemandaServicio(resultado[0].idDemanda).then(result => result.getTitulo()),  
            tituloDemanda: resultado[0].tituloDemanda, 
            pendiente: resultado[0].pendiente,
            idPartenariado:null,
            idMatching: null  
        };

        return notificacion;
    } catch (err) {
        console.error("Error al obtener notificación matching", err);
    }
}

//Utilidad?
async function FinalizarPendienteNotificacion(idNotificacion: number): Promise<void> {
    try {
        await knex('notificaciones')
            .where({ id: idNotificacion })
            .update({ pendiente: false }); // Se usa bool en lugar de 0 
    } catch (err) {
        console.error("Error al finalizar la notificación con id:", idNotificacion, err);
    }
}

//Borrado directamente en vez de logico???
async function borrarNotificacion(idNotificacion: number): Promise<void> {
    try {
        await knex('notificaciones')
            .where({ id: idNotificacion })
            .delete();
    } catch (err) {
        console.error("Error al intentar borrar la notificación con id:", idNotificacion, err);
    }
}

//Cambiado tipado de Id a any para coincidir con getQuery. Alternativas?
export async function crearNotificacionAceptadacionRechazada(notificacion: Notificacion, idNotificacionOferta: any): Promise<any> {
    let idNotificacion;
    try {
         idNotificacion = await crearNotificacion(notificacion);
        await knex('aceptacionrechazado').insert({
            idNotificacion,
            idNotificacionOferta
        });
        await FinalizarPendienteNotificacion(idNotificacionOferta);
    } catch (err) {
        console.error("Error al crear notificación de Aceptación Rechazada", err);
        console.log("Intentando borrar notificacion creada");
        borrarNotificacion(idNotificacion);
    }
}

export async function crearNotificacionAceptadacionAceptada(notificacion: Notificacion, idNotificacionOferta: any, idPartenariado: any): Promise<any> {
    let idNotificacion;
    try {
        idNotificacion = await crearNotificacion(notificacion);
        await knex('aceptacionaceptada').insert({
            idNotificacion,
            idPartenariado,
            idNotificacionAceptada: idNotificacionOferta
        });
        await FinalizarPendienteNotificacion(idNotificacionOferta);
    } catch (err) {
        console.error("Error al crear notificación de Aceptación Aceptada", err);
        console.log("Intentando borrar notificacion creada");
        borrarNotificacion(idNotificacion);
    }
}

async function crearNotificacionPartenariadoHecho(notificacion: Notificacion): Promise<any> {
    let idNotificacion;
    try {
         idNotificacion = await crearNotificacion(notificacion);
        await knex('partenariadorellenado').insert({
            idNotificacion,
            idPartenariado: notificacion.idPartenariado
        });
    } catch (err) {
        console.error("Error al crear notificación de Partenariado Hecho", err);
        console.log("Intentando borrar notificacion creada");
        borrarNotificacion(idNotificacion);
}
}

export async function crearNotificacionDemandaRespalda(notificacion: Notificacion): Promise<any> {
    let idNotificacion;
    try {
         idNotificacion = await crearNotificacion(notificacion);
        await knex('demandarespalda').insert({
            idNotificacion,
            idPartenariado: notificacion.idPartenariado
        });
    } catch (err) {
        console.error("Error al crear notificación de Demanda Respaldada", err);
        console.log("Intentando borrar notificacion creada");
        borrarNotificacion(idNotificacion);
    }
}

async function crearNotificacionMatching(idOferta: number, iddestinatario: number, idDemanda: number): Promise<any> {
    let idNotificacion;
    try {
        const notificacion: Notificacion = {
            id: null, // Asumiendo que 0 o un valor similar es el valor por defecto
            idDestino: iddestinatario,
            leido: false,
            titulo: "Se ha producido matching!!",
            mensaje: "Enhorabuena, se ha producido un matching",
            fecha_fin: new Date(), 
            emailOrigen: null,
            idOferta: idOferta,
            tituloOferta: null,
            idDemanda: idDemanda,
            tituloDemanda: null,
            pendiente: true,
            idPartenariado: null,
            idMatching: null
        };

        idNotificacion = await crearNotificacion(notificacion);
        await knex('notificacionmatching').insert({
            idNotificacion,
            idOferta,
            idDemanda
        });
    } catch (err) {
        console.error("Error al crear notificación de Matching", err);
        borrarNotificacion(idNotificacion);
    }
}

export async function notificarPartenariadoRellenado(notificacion: Notificacion): Promise<void> {
    let idNotificacionOferta;
    let idNotificacionDemanda;
    try {
        const partenariado = await daoColaboracion.obtenerPartenariado(notificacion.idPartenariado);
        const oferta = await daoOferta.obtenerOfertaServicio(partenariado.id_oferta);
        
        notificacion.idDestino = oferta.creador.id;
        idNotificacionOferta = await crearNotificacionPartenariadoHecho(notificacion);

        const demanda = await daoDemanda.obtenerDemandaServicio(partenariado.id_demanda);
        notificacion.idDestino = demanda.creador.id;
        idNotificacionDemanda = await crearNotificacionPartenariadoHecho(notificacion);

        const notificacionFinalizado = await obtenerNotificacionAceptacionAceptadaPorIdPartenariado(notificacion.idPartenariado)
            .catch(() => obtenerNotificacionDemandaRespaldadaPorIdPartenariado(notificacion.idPartenariado));

        if (notificacionFinalizado) {
            await FinalizarPendienteNotificacion(notificacionFinalizado[0].idNotificacion);
        }
    } catch (err) {
        console.error("Error al notificar partenariado rellenado", err);
        borrarNotificacion(idNotificacionOferta);
        borrarNotificacion(idNotificacionDemanda);
    }
}
