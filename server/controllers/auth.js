const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('./../models/usuario.model');
const { generarJWT, verificarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { ROL_ESTUDIANTE } = require('../models/rol.model');
const dao_usuario = require("./../database/services/daos/daoUsuario");
const tUsuario = require("./../database/services/transfers/TUsuario");
const tAdmin = require("./../database/services/transfers/TAdmin");
const tOficinaAps = require("./../database/services/transfers/TOficinaAps");
const TEstudiante = require("./../database/services/transfers/TEstudiante");
const tEstInterno = require("./../database/services/transfers/TEstudianteInterno");
const tProfesor = require("./../database/services/transfers/TProfesor");
const tSocioComunitario = require("./../database/services/transfers/TSocioComunitario");
const tProfesorInterno = require("./../database/services/transfers/TProfesorInterno");
const tEstudianteExterno = require("./../database/services/transfers/TEstudianteExterno");
const tProfesorExterno = require("./../database/services/transfers/TProfesorExterno");

const login = async(req, res) => {

    const { email, password } = req.body;

    try {
        // user
        const usuario_bd = await dao_usuario.obtenerUsuarioSinRolPorEmail(email);
        let user = {
            uid: usuario_bd.id,
            email: usuario_bd.correo,
            rol: usuario_bd.rol,
            password: usuario_bd.password,
            password_2: usuario_bd.password,
            nombre: usuario_bd.nombre,
            apellidos: usuario_bd.apellidos,
            universidad: usuario_bd.nombreUniversidad,
            facultad: usuario_bd.facultad,
            areaConocimiento: usuario_bd.area_conocimiento,
            sector:usuario_bd.sector,
            nombreSocioComunitario: usuario_bd.nombre_socioComunitario,
            origin_img: usuario_bd.origin_img,
            origin_login: usuario_bd.origin_login,
            terminos_aceptados: usuario_bd.terminos_aceptados,
            telefono: usuario_bd.telefono,
            url: usuario_bd.url,
            mision: usuario_bd.mision
        }
        if(!usuario_bd) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún usuario con dichas credenciales.',
            });
        }
        pass = usuario_bd.getPassword();
        const passwordOk = bcrypt.compareSync( password, pass );
        if(!passwordOk) {
             return res.status(404).json({
                 ok: false,
                 msg: 'No existe ningún usuario con dichas credenciales.',
             });
        }
        origin = usuario_bd.getOriginLogin();

        // comprobar origen de registro
         if(origin !== 'Portal ApS') {
             res.status(401).json({
                 ok: false,
                 msg: 'Este usuario está registrado utilizando el acceso "' + usuario.origin_login + '". Por favor, utilice dicho sistema de entrada.',
             });
         }

        // generar token
        const token = await generarJWT(user);
        return res.status(200).json({
            ok: true,
            token,
            usuario: user,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }
}

const loginUNED = async(req, res) => {

    const { email, password } = req.body;

    try {
        // user
        const usuario = await Usuario.findOne({ email });
        if(!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún usuario con dichas credenciales.',
            });
        }

        // pass
        const passwordOk = bcrypt.compareSync( password, usuario.password );
        if(!passwordOk) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún usuario con dichas credenciales.',
            });
        }

        // comprobar origen de registro
        if(usuario.origin_login !== 'UNED') {
            res.status(401).json({
                ok: false,
                msg: 'Este usuario está registrado utilizando el acceso "' + usuario.origin_login + '". Por favor, utilice dicho sistema de entrada.',
            });
        }

        // generar token
        const token = await generarJWT(usuario);

        return res.status(200).json({
            ok: true,
            token,
            usuario,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }


}

const loginGoogle = async(req, res) => {

    const tokenGoogle = req.body.token;

    try {

        const { given_name, family_name, email, picture } = await googleVerify(tokenGoogle);

        // comprobar si existe user, y si no lo creamos
        const usuarioExistente = await Usuario.findOne({ email });

        let usuario = usuarioExistente;

        if(!usuarioExistente) {
            usuario = new Usuario({
                rol: ROL_ESTUDIANTE,
                email,
                nombre: given_name,
                apellidos: family_name,
                password: '<disabled>',
                origin_login: 'google',
                origin_img: picture,
                // universidad: '',
                titulacion: '',
                sector: '',
                nombreSocioComunitario: '',
                terminos_aceptados: true,
                telefono:'',
                url: '',
                mision: ''
            });
        }

        // comprobar origen de registro
        if(usuario.origin_login !== 'google') {
            res.status(401).json({
                ok: false,
                msg: 'Este usuario ya está registrado en el sistema con un método de acceso distinto al SSO de Google.',
            });
        }

        // actualizo datos que pueden haber sido modificados el el servicio de google original
        usuario.nombre = given_name;
        usuario.apellidos = family_name;

        // la imagen solo si el usuario no la ha cambiado ya él mismo
        if(!usuario.origin_img || usuario.origin_img.includes('https')) {
            usuario.origin_img = picture;
        }

        await usuario.save();

        // generar token
        const token = await generarJWT(usuario);

        return res.status(200).json({
            ok: true,
            token,
            usuario,
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'El token no es correcto',
        });
    }


}

const renewToken = async(req, res = response) => {

    const tokenPrevio =  req.headers['x-token'];
    const verificacionToken = verificarJWT(tokenPrevio);
    const { ok, usuario } = verificacionToken;
    if(!ok) {
        res.status(401).json({
            ok: false,
            msg: 'El token no es correcto',
        });
    }

   //Este valor se usara en detalle cuando se cambiara la interfaz
    const usuario_bd = await dao_usuario.obtenerUsuarioSinRolPorId(usuario.uid);

     let user = {
        uid: usuario_bd.id,
        email: usuario_bd.correo,
        rol: usuario_bd.rol,
        password: usuario_bd.password,
        password_2: usuario_bd.password,
        nombre: usuario_bd.nombre,
        apellidos: usuario_bd.apellidos,
        universidad: usuario_bd.nombreUniversidad,
        titulacion: usuario_bd.titulacion,
        facultad: usuario_bd.facultad,
        areaConocimiento: usuario_bd.area_conocimiento,
        sector:usuario_bd.sector,
        nombreSocioComunitario: usuario_bd.nombre_socioComunitario,
        origin_img: usuario_bd.origin_img,
        origin_login: usuario_bd.origin_login,
        terminos_aceptados: usuario_bd.terminos_aceptados,
        titulacion: usuario_bd.titulacion,
        telefono: usuario_bd.telefono,
        url: usuario_bd.url,
        mision: usuario_bd.mision

    } 
    const token = await generarJWT(user);

    return res.status(200).json({
        ok: true,
        token,
        usuario: user,
    });
}

module.exports = {
    login,
    loginUNED,
    loginGoogle,
    renewToken,
}