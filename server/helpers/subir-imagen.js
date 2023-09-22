const Upload = require('./../models/upload.model');
const Usuario = require('./../models/usuario.model');
const Iniciativa = require('./../models/iniciativa.model');
const Partenariado = require('./../models/partenariado.model');
const Proyecto = require('./../models/proyecto.model');
const { deleteFileFromS3 } = require('./s3');
const fs = require('fs');


const soloSePermiteUnFichero = (campo, tipo) => {
    if(tipo === 'usuarios' && campo === 'avatar') { return true; }
    if(tipo === 'iniciativas' && campo === 'default') { return true; }
    return false;
}

const limpiarFicherosAntiguos = async (campo, tipo, tipo_id) => {

    // borrado de imagenes si solo acepta una
    if(!soloSePermiteUnFichero(campo, tipo)) {
        return true;
    }

    // buscar y limpiar viejos ficheros
    await Upload.find({campo, tipo, tipo_id}).then((uploads) => {

        uploads.forEach(async(upload) => {

            // borrar fichero
            if( fs.existsSync(upload.path)) { fs.unlinkSync(upload.path); }

            // comprobar si tengo que borrar del s3
            if(upload.almacenamiento === 's3') {
                deleteFileFromS3(upload.path);
            }

            // borrar upload
            await Upload.findByIdAndDelete(upload.id, function (err) {
                if(err) console.log(err);
            });

        });

    // error del promise Upload.find
    }).catch((err) => {
        console.log(err);
    });


    return true;
}


const crearUpload = async (campo, tipo, tipo_id, path, nombre, client_name, creador) => {

    await limpiarFicherosAntiguos(campo, tipo, tipo_id);

    // guardar socio upload
    const upload = new Upload({almacenamiento: process.env.FILE_STORAGE, campo, tipo, tipo_id, path, nombre, client_name, creador });

    if(tipo === 'usuarios' && campo === 'avatar') {
        await Usuario.findByIdAndUpdate(tipo_id, {origin_img: upload._id}, { new: true });
    }

    if(tipo === 'iniciativas' && campo === 'default') {
        await Iniciativa.findByIdAndUpdate(tipo_id, {imagen: upload._id}, { new: true });
    }

    if(tipo === 'iniciativas' && campo === 'archivos') {
        await Iniciativa.findByIdAndUpdate(tipo_id, { $addToSet: { archivos: [upload._id] } }, { new: true });
    }

    if(tipo === 'partenariados' && campo === 'archivos') {
        await Partenariado.findByIdAndUpdate(tipo_id, { $addToSet: { archivos: [upload._id] } }, { new: true });
    }

    if(tipo === 'proyectos' && campo === 'archivos') {
        await Proyecto.findByIdAndUpdate(tipo_id, { $addToSet: { archivos: [upload._id] } }, { new: true });
    }


    upload.save();

    return upload;
}

module.exports = {
    crearUpload,
}