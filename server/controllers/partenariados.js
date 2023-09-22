const dao_colaboracion = require('./../database/services/daos/daoColaboracion');
const TPartenariado = require('./../database/services/transfers/TPartenariado');
const dao_tentativa = require('./../database/services/daos/daoTentativa');
const TOfertaServicio = require('./../database/services/transfers/TOfertaServicio');
const TDemandaServicio = require('./../database/services/transfers/TDemandaServicio');
const daoOferta = require('../database/services/daos/daoOferta');
const daoPartenariados = require('../database/services/daos/daoPartenariados');

// Common errors
const UNEXPECTED_ERROR = 'Error inesperado';

const NEGOTIATION_STATE = 'EN_NEGOCIACION';
const CREATION_STATE = 'EN_NEGOCIACION';

const crearPartenariadoProfesor = async (req, res = response) => {
    try {

        let data = req.body;
        let id_oferta = data.id_oferta;

        if (id_oferta == undefined) {
            //Caso: no existe oferta
            let areasServicio = [];
            data.ofertaAreaServicio.forEach((dato) => {
                areasServicio.push(dato.id);
            });
            let oferta = new TOfertaServicio(
                null,
                data.titulo,
                data.descripcion,
                data.imagen,
                null,
                null,
                data.asignaturaObjetivo,
                data.cuatrimestre,
                data.anioAcademico,
                data.fecha_limite,
                data.ofertaObservacionesTemporales,
                req.current_user.uid,
                areasServicio,
                req.current_user.uid,
                1
            );
            id_oferta = await dao_tentativa.crearOferta(oferta);
        }

        let profesores = [];
        data.profesores.forEach((dato) => {
            profesores.push(dato.id);
        });

        let partenariado = new TPartenariado(
            null,
            data.titulo,
            data.descripcion,
            data.externos,
            data.responsable,
            profesores,
            data.id_demanda,
            id_oferta,
            'EN_CREACION'
        );
        await dao_colaboracion.crearPartenariado(partenariado);
        dao_colaboracion.crearPrevioPartenariado(data.id_demanda, id_oferta, 1, 0);

        return res.status(200).json({
            ok: true,
            partenariado: partenariado
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const crearPartenariadoSocioComunitario = async (req, res = response) => {
    try {
        let data = req.body;
        let id_demanda = data.id_demanda;
        let estado = NEGOTIATION_STATE;

        if (id_demanda == undefined) { //Caso: no existe demanda
            estado = CREATION_STATE;

            let areasServicio = [];
            data.areasServicio.forEach((dato) => {
                areasServicio.push(dato.id);
            });

            let titulaciones = [];
            data.titulaciones.forEach((dato) => {
                titulaciones.push(dato.id);
            });

            let demanda = new TDemandaServicio(
                null,
                data.titulo,
                data.descripcion,
                data.imagen,
                null,
                null,
                req.current_user.uid,
                data.ciudad,
                data.finalidad,
                data.periodo_definicion_ini,
                data.periodo_definicion_fin,
                data.periodo_ejecucion_ini,
                data.periodo_ejecucion_fin,
                data.fecha_fin,
                data.observaciones_temporales,
                data.necesidad_social,
                titulaciones,
                areasServicio,
                1
            );
            id_demanda = await dao_tentativa.crearDemanda(demanda);

            let partenariado = new TPartenariado(
                null,
                data.titulo,
                data.descripcion,
                data.externos,
                data.responsable,
                profesores,
                data.id_demanda,
                id_oferta,
                estado
            );
            await dao_colaboracion.crearPartenariado(partenariado);

            dao_colaboracion.crearPrevioPartenariado(id_demanda, data.id_oferta, 0, 1);
        }

        let id_partenariado = dao_tentativa.obtenerIdPartenariado(id_demanda, id_oferta);
        let partenariado = new TPartenariado(
            id_partenariado,
            data.titulo,
            data.descripcion,
            data.externos,
            data.responsable,
            profesores,
            id_demanda,
            data.id_oferta,
            estado
        );
        await dao_colaboracion.actualizarPartenariado(partenariado);

        dao_colaboracion.actualizarPrevioPartenariado(id_demanda, data.id_oferta, 0, 1);

        return res.status(200).json({
            ok: true,
            partenariado: partenariado
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: UNEXPECTED_ERROR
        });
    }
};

const getPartenariados = async (req, res) => {
    try {
        let partenariados = await daoPartenariados.obtenerPartenariados(req.query.limit, req.query.skip, req.query.filtros);
        console.log("total de partenariados"); 
        return res.status(200).json({
            ok: true,
            partenariados,
            total: partenariados.length
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        })
    }
};

const getPartenariado = async (req, res) => {
    try {
        const partenariado = await dao_colaboracion.obtenerPartenariado(req.params.id);
        return res.status(200).json({
            ok: true,
            partenariado
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: UNEXPECTED_ERROR
        });
    }
};

const cambiarEstadoPartenariado = async (req, res) => {
    try {
        const id = req.params.id;
        const partenariado = await Partenariado.findById(id)
            .populate(
                'profesores',
                '_id nombre apellidos email sector universidad titulacion rol'
            )
            .populate(
                'entidades',
                '_id nombre apellidos email sector universidad titulacion rol'
            )
            .populate(
                'proponedor',
                '_id nombre apellidos email sector universidad titulacion rol'
            )
            .populate(
                'creador',
                '_id nombre apellidos email sector universidad titulacion rol'
            )
            .populate('archivos', '_id client_name');

        const estado = req.body.estado;

        if (!ESTADOS_PARTENARIADOS.includes(estado)) {
            return res.status(200).json({
                ok: false,
                msg: 'El estado ' + estado + ' no es un estado admitido'
            });
        }

        if (estado === 'En negociación' && !esGestor(req)) {
            return res.status(200).json({
                ok: false,
                msg: 'Solo el gestor puede volver a abrir el partenariado'
            });
        }

        partenariado.estado = estado;
        await partenariado.save();

        if (estado === 'Acordado') {
            // creamos el proyecto a partir del partenariado
            const proyecto = new Proyecto();

            proyecto.estado = 'Abierto';
            proyecto.titulo = partenariado.titulo;
            proyecto.descripcion = partenariado.descripcion;
            proyecto.rama = partenariado.rama;
            proyecto.ciudad = partenariado.ciudad;
            proyecto.partenariado = partenariado._id;
            proyecto.profesores = partenariado.profesores;
            proyecto.sociosComunitarios = partenariado.sociosComunitarios;
            proyecto.mensajes = [];
            proyecto.archivos = [];
            proyecto.proponedor = partenariado.proponedor;
            proyecto.creador = req.current_user.uid;

            await proyecto.save();

            // referencia cruzada
            partenariado.proyecto = proyecto._id;
            await partenariado.save();

            return res.status(200).json({
                ok: true,
                partenariado,
                proyecto
            });
        }

        return res.status(200).json({
            ok: true,
            partenariado
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: UNEXPECTED_ERROR
        });
    }
};

const enviarMensajePartenariado = async (req, res) => {
    try {
        const id = req.params.id;
        const texto = req.body.mensaje;
        const uid = req.current_user.uid;
        const email = req.current_user.email;
        const nombre = req.current_user.nombre;
        const apellidos = req.current_user.apellidos;
        const rol = req.current_user.rol;

        const partenariado = await Partenariado.findById(id);

        if (partenariado.estado !== 'En negociación') {
            return res.status(200).json({
                ok: false,
                msg: 'No se pueden enviar mensajes a un partenariado que no está en negociación'
            });
        }

        const mensaje = {
            texto,
            uid,
            email,
            nombre,
            apellidos,
            rol,
            fecha: new Date()
        };
        await Partenariado.updateOne(
            { _id: id },
            { $push: { mensajes: { $each: [mensaje], $position: 0 } } }
        );

        return res.status(200).json({
            ok: true,
            partenariado
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: UNEXPECTED_ERROR
        });
    }
};

module.exports = {
    getPartenariados,
    getPartenariado,
    cambiarEstadoPartenariado,
    enviarMensajePartenariado,
    crearPartenariadoProfesor,
    crearPartenariadoSocioComunitario
};
