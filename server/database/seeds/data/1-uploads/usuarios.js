const { getObjectId } = require("../../helpers");


function generateAvatars(files) {

    let uploads = [];

    Object.entries(files).forEach(file => {
        const [key, value] = file;

        uploads.push({
            _id: getObjectId('avatar:' + key),
            almacenamiento: 's3',
            campo: 'avatar',
            tipo: 'usuarios',
            tipo_id: getObjectId(key).toHexString(),
            path: './server/uploads/usuarios/' + value,
            nombre: value,
            creador: getObjectId(key),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    });

    return uploads;
}

module.exports = generateAvatars({
    'gestor@uned.es': 'logo-uned.jpg',
    'socio@uned.es': 'socio-uned.png',
    'profesor@uned.es': 'profesor-uned.png',
    'alumno@uned.es': 'alumno-uned.png',
    'socio@externo.es': 'socio-externo.png',
    'profesor@externo.es': 'profesor-externo.png',
    'alumno@externo.es': 'alumno-externo.png',
});