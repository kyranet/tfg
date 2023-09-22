const dao_colaboracion = require("./../database/services/daos/daoColaboracion");
const TPartenariado = require("./../database/services/transfers/TPartenariado");
const dao_tentativa = require("./../database/services/daos/daoTentativa");
const TOfertaServicio = require("./../database/services/transfers/TOfertaServicio");
const TDemandaServicio = require("./../database/services/transfers/TDemandaServicio");

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
      "EN_CREACION"
    );
    await dao_colaboracion.crearPartenariado(partenariado);
    dao_colaboracion.crearPrevioPartenariado(data.id_demanda, id_oferta, 1, 0);

    return res.status(200).json({
      ok: true,
      partenariado: partenariado,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const crearPartenariadoSocioComunitario = async (req, res = response) => {
  try {
    let data = req.body;
    let id_demanda = data.id_demanda;
    let estado = "EN_NEGOCIACION";

    if (id_demanda == undefined) {//Caso: no existe demanda
      estado = "EN_CREACION";

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
      partenariado: partenariado,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const getPartenariados = async (req, res) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || Number.MAX_SAFE_INTEGER;

    const filtros = JSON.parse(req.query.filtros || "{}");

    let conditions = [];

    // filtro por texto (titulo)
    if (filtros.terminoBusqueda.trim() !== "") {
      conditions.push({
        titulo: new RegExp(filtros.terminoBusqueda.trim(), "i"),
      });
    }

    // filtro por rama
    let ramaFilter = [];
    Object.entries(filtros.ramas).forEach((entry) => {
      const [rama, selected] = entry;
      if (selected) {
        ramaFilter.push(rama);
      }
    });
    if (ramaFilter.length) {
      conditions.push({ rama: { $in: ramaFilter } });
    }

    // filtro por ciudad
    let ciudadFilter = [];
    Object.entries(filtros.ciudades).forEach((entry) => {
      const [ciudad, selected] = entry;
      if (selected) {
        ciudadFilter.push(ciudad);
      }
    });
    if (ciudadFilter.length) {
      conditions.push({ ciudad: { $in: ciudadFilter } });
    }

    // filtro por estado
    if (filtros.estado !== "") {
      conditions.push({ estado: filtros.estado });
    }

    // filtro por usuario creador, profesores o socios
    if (filtros.creador !== "") {
      conditions.push({
        $or: [
          { profesores: { $in: filtros.creador } },
          { sociosComunitarios: { $in: new ObjectId(filtros.creador) } },
          { creador: { $in: filtros.creador } },
        ],
      });
    }

    const [partenariados, filtradas, total] = await Promise.all([
      Partenariado.find(conditions.length ? { $and: conditions } : {})
        .sort("-createdAt")
        .skip(skip)
        .limit(limit)
        .populate(
          "profesores",
          "_id nombre apellidos email sector universidad titulacion rol"
        )
        .populate(
          "entidades",
          "_id nombre apellidos email sector universidad titulacion rol"
        ),

      Partenariado.find(
        conditions.length ? { $and: conditions } : {}
      ).countDocuments(),

      Partenariado.countDocuments(),
    ]);

    return res.status(200).json({
      ok: true,
      partenariados,
      filtradas: filtradas,
      total: total,
      filtros,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const getPartenariado = async (req, res) => {
  try {
    const id = req.params.id;
    const partenariado = await Partenariado.findById(id)
      .populate(
        "profesores",
        "_id nombre apellidos email sector universidad titulacion rol"
      )
      .populate(
        "entidades",
        "_id nombre apellidos email sector universidad titulacion rol"
      )
      .populate(
        "proponedor",
        "_id nombre apellidos email sector universidad titulacion rol"
      )
      .populate(
        "creador",
        "_id nombre apellidos email sector universidad titulacion rol"
      )
      .populate("archivos", "_id client_name");

    return res.status(200).json({
      ok: true,
      partenariado,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const cambiarEstadoPartenariado = async (req, res) => {
  try {
    const id = req.params.id;
    const partenariado = await Partenariado.findById(id)
      .populate(
        "profesores",
        "_id nombre apellidos email sector universidad titulacion rol"
      )
      .populate(
        "entidades",
        "_id nombre apellidos email sector universidad titulacion rol"
      )
      .populate(
        "proponedor",
        "_id nombre apellidos email sector universidad titulacion rol"
      )
      .populate(
        "creador",
        "_id nombre apellidos email sector universidad titulacion rol"
      )
      .populate("archivos", "_id client_name");

    const estado = req.body.estado;

    if (!ESTADOS_PARTENARIADOS.includes(estado)) {
      return res.status(200).json({
        ok: false,
        msg: "El estado " + estado + " no es un estado admitido",
      });
    }

    if (estado === "En negociación" && !esGestor(req)) {
      return res.status(200).json({
        ok: false,
        msg: "Solo el gestor puede volver a abrir el partenariado",
      });
    }

    partenariado.estado = estado;
    await partenariado.save();

    if (estado === "Acordado") {
      // creamos el proyecto a partir del partenariado
      const proyecto = new Proyecto();

      proyecto.estado = "Abierto";
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
        proyecto,
      });
    }

    return res.status(200).json({
      ok: true,
      partenariado,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      msg: "Error inesperado",
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

    if (partenariado.estado !== "En negociación") {
      return res.status(200).json({
        ok: false,
        msg:
          "No se pueden enviar mensajes a un partenariado que no está en negociación",
      });
    }

    const mensaje = {
      texto,
      uid,
      email,
      nombre,
      apellidos,
      rol,
      fecha: new Date(),
    };
    await Partenariado.updateOne(
      { _id: id },
      { $push: { mensajes: { $each: [mensaje], $position: 0 } } }
    );

    return res.status(200).json({
      ok: true,
      partenariado,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getPartenariados,
  getPartenariado,
  cambiarEstadoPartenariado,
  enviarMensajePartenariado,
  crearPartenariadoProfesor,
  crearPartenariadoSocioComunitario,
};
