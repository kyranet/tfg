const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { crearUpload } = require("../helpers/subir-imagen");
const {
    readFileFromS3,
    uploadFileToS3,
    deleteFileFromS3,
} = require("../helpers/s3");
const Upload = require("./../models/upload.model");
const Usuario = require("./../models/usuario.model");
const Iniciativa = require("./../models/iniciativa.model");
const path = require("path");
const fs = require("fs");
const { ROL_GESTOR } = require("../models/rol.model");
const daoUsuario = require("./../database/services/daos/daoUsuario");

const ficheroPorDefecto = (res, default_type) => {
    if (default_type === "avatar") {
        return path.resolve("./server/uploads/defaults/avatar.png");
    }

    if (default_type === "iniciativa") {
        return path.resolve("./server/uploads/defaults/iniciativa.jpg");
    }

    return null;
};

const puedeObtenerFichero = (upload, peticionario) => {
    if (upload.tipo === "usuarios" && upload.campo === "avatar") {
        return true;
    }

    // revisar permisos
    if (upload.tipo === "iniciativas") {
        return true;
    }
    if (upload.tipo === "partenariados") {
        return true;
    }
    if (upload.tipo === "proyectos") {
        return true;
    }
    return false;
};

const obtenerFichero = async (req, res = response) => {
    const upload_id = req.params.upload_id;
    const fichero_por_defecto = ficheroPorDefecto(
        res,
        req.params.default_type || ""
    );

    // util por ejemplo para las fotos de avatares
    if (!upload_id) {
        return fichero_por_defecto
            ? res.sendFile(fichero_por_defecto)
            : res.status(400).json({
                  ok: false,
                  msg: "No existe el fichero",
              });
    }

    const upload = await Upload.findById(upload_id)
        .then((upload) => {
            return upload;
        })
        .catch((err) => {});

    if (!upload) {
        return fichero_por_defecto
            ? res.sendFile(fichero_por_defecto)
            : res.status(400).json({
                  ok: false,
                  msg: "No existe el fichero",
              });
    }

    // validar permisos de usuario
    if (
        !puedeObtenerFichero(
            upload,
            req.current_user ? req.current_user.uid : null
        )
    ) {
        return res.status(401).json({
            ok: false,
            msg: "No tienes permisos para ver este fichero",
        });
    }

    // comprobar si tengo que subir al s3
    if (process.env.FILE_STORAGE === "s3") {
        // si existe en local, lo sirvo primero (s3 tarda milisegundos en devolver algo recien subido y puede fallar)
        if (fs.existsSync(upload.path)) {
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + upload.client_name || upload.nombre
            );
            return res.sendFile(path.resolve(upload.path));
        }

        try {
            const response = await readFileFromS3(upload.path);
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + upload.client_name || upload.nombre
            );
            return res.send(response.Body);
        } catch (err) {
            console.log(err);
            return res.status(401).json({
                ok: false,
                msg: "No se ha podido obtener el fichero",
            });
        }
    }

    if (!fs.existsSync(upload.path)) {
        return fichero_por_defecto
            ? res.sendFile(fichero_por_defecto)
            : res.status(400).json({
                  ok: false,
                  msg: "No existe el fichero",
              });
    }

    return res.sendFile(path.resolve(upload.path));
};

const puedeSubirFichero = async (campo, tipo, tipo_id, creador) => {
    if (tipo === "usuarios" && campo === "avatar") {
        return tipo_id === creador.uid || creador.rol === ROL_GESTOR;
    }

    if (tipo === "iniciativas" && campo === "default") {
        const iniciativa = await Iniciativa.findById(tipo_id);
        return iniciativa.creador == creador.uid || creador.rol === ROL_GESTOR;
    }

    // revisar y definir permisos para archivos de partenariado
    if (tipo === "partenariados") {
        return true;
    }

    // revisar y definir permisos para archivos de partenariado
    if (tipo === "proyectos") {
        return true;
    }

    return false;
};

const subirFichero =  async (req, res = response) => {
    // ESTO SOLO SE ESTA UTILIZANDO PARA LA CARGA DE LA IMAGEN DE PROFILE

//     try {
//         const imagen = req.files.imagen;

//         fs.writeFile("path/to/file", data, function(err) {
//             if(err) {
//                 return console.log(err);
//             }
//             return res.status(200).json({
//                 ok: result ? true : false,
//             });
//         }); 

        
//         // result = await daoUsuario.updateAvatar(115, new Buffer(imagen.data).toString('base64'));

//         // return res.status(200).json({
//         //     ok: result ? true : false,
//         // });
//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             ok: false,
//             msg: "Error inesperado",
//         });
//     }
// };

try {
    const campo = req.params.campo;
    const tipo = req.params.tipo;
    const tipo_id = req.params.tipo_id;
    const creador = req.current_user;

    const tiposPermitidos = ['usuarios', 'iniciativas', 'partenariados', 'proyectos'];
    let extensionesPermitidas = [];

    if(campo == 'default') {
        extensionesPermitidas = ['gif','jpg','jpeg','png'];
    } else {

        switch (tipo) {
            case 'usuarios':
                extensionesPermitidas = ['gif','jpg','jpeg','png'];
                break;

            case 'iniciativas':
                extensionesPermitidas = ['pdf'];
                break;

            case 'partenariados':
                extensionesPermitidas = ['pdf'];
                break;

            case 'proyectos':
                extensionesPermitidas = ['pdf'];
                break;

            default:
                break;
        }
    }

    // validar permisos de usuario
    if( !puedeSubirFichero(campo, tipo, tipo_id, creador) ) {
        return res.status(400).json({
            ok: false,
            msg: 'No tienes permisos para subir este archivo',
        });
    }

    // validar tipo de subida
    if( !tiposPermitidos.includes(tipo) ) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo de subida no está admitido',
        });
    }

    // validar que se envie un archivo para subir
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se envió ningún archivo',
        });
    }

    // Procesar la imagen
    const imagen = req.files.imagen;
    const filename_array = imagen.name.split('.');
    const extension = filename_array[ filename_array.length - 1];

    if( !extensionesPermitidas.includes(extension)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo de archivo no está admitido',
        });
    }

    const client_name = imagen.name;
    const filename_uuid = `${ uuidv4() }.${ extension }`;
    const filename_path = `./server/uploads/${ tipo }/${ filename_uuid }`;

    // mover la imagen
    imagen.mv(filename_path, async function(err) {

        if(err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen',
            });
        }
        await daoUsuario.updateAvatar(creador.uid, filename_uuid);
        // comprobar si tengo que subir al s3
        // if(process.env.FILE_STORAGE === 's3') {
        //     uploadFileToS3(filename_path);
        // }

        // // generar upload en bbdd
        // crearUpload(campo, tipo, tipo_id, filename_path, filename_uuid, client_name, creador.uid).then(resp => {
        //     return res.status(200).json({
        //         ok: true,
        //         msg: 'Archivo subido',
        //         upload: resp
        //     });
        // });
        return res.status(200).json({
            ok: true,
            msg: 'Archivo subido' 
        });
    });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
        });
    }

}

const borrarFichero = async (req, res = response) => {
    try {
        const upload_id = req.params.upload_id;
        const upload = await Upload.findById(upload_id);

        // validar permisos de usuario
        if (
            upload.creador != req.current_user.uid &&
            req.current_user.rol !== ROL_GESTOR
        ) {
            return res.status(401).json({
                ok: false,
                msg: "No tiene permiso para borrar este fichero",
            });
        }

        if (upload.tipo === "usuarios" && upload.campo === "avatar") {
            await Usuario.findByIdAndUpdate(
                upload.tipo_id,
                { origin_img: "" },
                { new: true }
            );
        }

        if (upload.tipo === "iniciativas" && upload.campo === "default") {
            await Iniciativa.findByIdAndUpdate(
                upload.tipo_id,
                { imagen: "" },
                { new: true }
            );
        }

        if (fs.existsSync(upload.path)) {
            fs.unlinkSync(upload.path);
        }

        // comprobar si tengo que borrar del s3
        if (process.env.FILE_STORAGE === "s3") {
            deleteFileFromS3(upload.path);
        }

        await Upload.findByIdAndDelete(upload.id, function (err) {
            if (err) console.log(err);
        });

        return res.status(200).json({
            ok: true,
            msg: "Archivo borrado",
            upload: null,
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
    obtenerFichero,
    subirFichero,
    borrarFichero,
};
