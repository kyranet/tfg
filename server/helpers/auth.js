const { ROL_ESTUDIANTE, ROL_PROFESOR, ROL_SOCIO_COMUNITARIO, ROL_GESTOR } = require('./../models/rol.model');


const esGestor = (req) => {
    return req.current_user && req.current_user.rol === ROL_GESTOR;
}

const esSocioComunitario = (req) => {
    return req.current_user && req.current_user.rol === ROL_SOCIO_COMUNITARIO;
}

const esProfesor = (req) => {
    return req.current_user && req.current_user.rol === ROL_PROFESOR;
}

const esEstudiante = (req) => {
    return req.current_user && req.current_user.rol === ROL_ESTUDIANTE;
}

module.exports = {
    esGestor,
    esSocioComunitario,
    esProfesor,
    esEstudiante,
}