const jwt = require('jsonwebtoken');
const { esEstudiante, esProfesor, esSocioComunitario, esGestor } = require('../helpers/auth');

const validarJWT = (req, res, next) => {
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Acceso no permitido, token no existente',
        });
    }

    try {
        const { current_user } = jwt.verify(token, process.env.JWT_SECRET);
        req.current_user = current_user;

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Acceso no permitido, token incorrecto',
        });
    }
}

const opcionalJWT = (req, res, next) => {
    const token = req.header('x-token');

    try {
        if(!req.current_user && token) {
            const { current_user } = jwt.verify(token, process.env.JWT_SECRET);
            req.current_user = current_user;
        }
    } catch (error) {

    }

    next();
}


// validar rol directo
const validarEsGestor = (req, res, next) => {

    if( !esGestor(req) ) {
        return res.status(401).json({
            ok: false,
            msg: 'Acceso no permitido, solo gestores',
        });
    }

    next();
}

// combinacion de dos
const validarEsEstudianteOrEsGestor = (req, res, next) => {

    if( !esEstudiante(req) && !esGestor(req) ) {
        return res.status(401).json({
            ok: false,
            msg: 'Acceso no permitido, solo estudiantes',
        });
    }

    next();
}

const validarEsProfesor = (req, res, next) => {

    if( !esProfesor(req)) {
        return res.status(401).json({
            ok: false,
            msg: 'Acceso no permitido, solo profesores',
        });
    }

    next();
}

const validarEsProfesorOrEsGestor = (req, res, next) => {

    if( !esProfesor(req) && !esGestor(req) ) {
        return res.status(401).json({
            ok: false,
            msg: 'Acceso no permitido, solo profesores',
        });
    }

    next();
}

const validarEsSocioComunitarioOrEsGestor = (req, res, next) => {

    if( !esSocioComunitario(req) && !esGestor(req) ) {
        return res.status(401).json({
            ok: false,
            msg: 'Acceso no permitido, solo socios comunitarios',
        });
    }

    next();
}

const validarEsSocioComunitario = (req, res, next) => {

    if( !esSocioComunitario(req) ) {
        return res.status(401).json({
            ok: false,
            msg: 'Acceso no permitido, solo socios comunitarios',
        });
    }

    next();
}

// combinacion de tres
const validarEsProfesorOrSocioComunitarioOrEsGestor = (req, res, next) => {

    if( !esProfesor(req) && !esSocioComunitario(req) && !esGestor(req) ) {
        return res.status(401).json({
            ok: false,
            msg: 'Acceso no permitido, solo gestores, profesores o socios comunitarios',
        });
    }

    next();
}




module.exports = {
    validarJWT,
    opcionalJWT,

    validarEsGestor,
    validarEsSocioComunitario,
    validarEsEstudianteOrEsGestor,
    validarEsProfesorOrEsGestor,
    validarEsSocioComunitarioOrEsGestor,
    validarEsProfesor,
    validarEsProfesorOrSocioComunitarioOrEsGestor,
}