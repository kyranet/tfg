const { getObjectId } = require("../../helpers");
const { generateRandomImage, generateRandomDocument } = require('./../../helpers');

module.exports = [
    {
        _id: getObjectId('iniciativa:Portal ApS en las universidades españolas'),
        estado: 'Abierta',
        titulo: 'Portal ApS en las universidades españolas',
        descripcion: 'Proyecto de creación de un portal para el ApS en las universidades españolas',
        imagen: generateRandomImage('iniciativas', getObjectId('iniciativa:Portal ApS en las universidades españolas'), getObjectId('gestor@uned.es')),
        rama: 'Arquitectura e Ingeniería',
        ciudad: 'Virtual',
        proponedor: getObjectId('entidad@externo.es'),
        creador: getObjectId('entidad@externo.es'),
        partenariados: [getObjectId('partenariado:Portal ApS en las universidades españolas')],
        archivos: [
            generateRandomDocument('iniciativas', getObjectId('iniciativa:Portal ApS en las universidades españolas'), getObjectId('gestor@uned.es')),
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        _id: getObjectId('iniciativa:Español en vivo'),
        estado: 'Abierta',
        titulo: 'Español en vivo',
        descripcion: 'Español en vivo',
        imagen: generateRandomImage('iniciativas', getObjectId('iniciativa:Español en vivo'), getObjectId('profesor@externo.es')),
        rama: 'Artes y Humanidades',
        ciudad: 'Barcelona',
        proponedor: getObjectId('profesor@externo.es'),
        creador: getObjectId('profesor@externo.es'),
        partenariados: [getObjectId('partenariado:Español en vivo')],
        archivos: [
            generateRandomDocument('iniciativas', getObjectId('iniciativa:Español en vivo'), getObjectId('profesor@externo.es')),
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        _id: getObjectId('iniciativa:Servicio de atención lingüística a personas sin hogar'),
        estado: 'Abierta',
        titulo: 'Servicio de atención lingüística a personas sin hogar',
        descripcion: 'Servicio de atención lingüística a personas sin hogar',
        imagen: generateRandomImage('iniciativas', getObjectId('iniciativa:Servicio de atención lingüística a personas sin hogar'), getObjectId('profesor@uned.es')),
        rama: 'Artes y Humanidades',
        ciudad: 'Cádiz',
        proponedor: getObjectId('profesor@uned.es'),
        creador: getObjectId('profesor@uned.es'),
        partenariados: [getObjectId('partenariado:Servicio de atención lingüística a personas sin hogar')],
        archivos: [
            generateRandomDocument('iniciativas', getObjectId('iniciativa:Servicio de atención lingüística a personas sin hogar'), getObjectId('profesor@uned.es')),
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        _id: getObjectId('iniciativa:Acompañamiento de ancianos afectados por COVID-19'),
        estado: 'Abierta',
        titulo: 'Acompañamiento de ancianos afectados por COVID-19',
        descripcion: 'Acompañamiento de ancianos afectados por COVID-19',
        imagen: generateRandomImage('iniciativas', getObjectId('iniciativa:Acompañamiento de ancianos afectados por COVID-19'), getObjectId('entidad@uned.es')),
        rama: 'Artes y Humanidades',
        ciudad: 'Valencia',
        proponedor: getObjectId('entidad@uned.es'),
        creador: getObjectId('entidad@uned.es'),
        partenariados: [getObjectId('partenariado:Acompañamiento de ancianos afectados por COVID-19')],
        archivos: [
            generateRandomDocument('iniciativas', getObjectId('iniciativa:Acompañamiento de ancianos afectados por COVID-19'), getObjectId('entidad@uned.es')),
            generateRandomDocument('iniciativas', getObjectId('iniciativa:Acompañamiento de ancianos afectados por COVID-19'), getObjectId('entidad@uned.es')),
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
    },



]