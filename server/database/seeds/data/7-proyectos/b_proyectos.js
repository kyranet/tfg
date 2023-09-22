const { getObjectId, generateRandomDocument, generateMessages, sortMessages } = require("../../helpers");

module.exports = [
    {
        _id: getObjectId('proyecto:Portal ApS en las universidades españolas'),
        estado: 'Abierto',
        titulo: 'Portal ApS en las universidades españolas',
        descripcion: 'Proyecto de creación de un portal para el ApS en las universidades españolas',
        rama: 'Arquitectura e Ingeniería',
        ciudad: 'Virtual',
        partenariado: getObjectId('partenariado:Portal ApS en las universidades españolas'),
        profesores: [getObjectId('profesor@uned.es')],
        entidades: [getObjectId('entidad@externo.es')],
        estudiantes: [],
        mensajes: [
            {"texto":"Hola Entidad, estamos a la espera de estudiantes. En cuanto un estudiante se apunte, comenzamos el proyecto.","uid":"54610501ecd753cee3aaaa08","email":"profesor@uned.es","nombre":"Profesor","apellidos":"UNED","rol":"ROL_PROFESOR","fecha":"2020-08-27T17:46:54.708Z"},
        ],
        archivos: [
            generateRandomDocument('proyectos', getObjectId('proyecto:Portal ApS en las universidades españolas'), getObjectId('entidad@uned.es')),
        ],
        proponedor: getObjectId('entidad@externo.es'),
        creador: getObjectId('profesor@uned.es'),

        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        _id: getObjectId('proyecto:Acompañamiento de ancianos afectados por COVID-19'),
        estado: 'En curso',
        titulo: 'Acompañamiento de ancianos afectados por COVID-19',
        descripcion: 'Acompañamiento de ancianos afectados por COVID-19',
        rama: 'Artes y Humanidades',
        ciudad: 'Valencia',
        partenariado: getObjectId('partenariado:Acompañamiento de ancianos afectados por COVID-19'),
        profesores: [getObjectId('profesor@uned.es')],
        entidades: [getObjectId('entidad@uned.es')],
        estudiantes: [getObjectId('alumno@uned.es')],
        mensajes: sortMessages([
            {"texto":"Hola Alumno y Profesor. ¿Cuándo os vendría bien realizar una videollamada para ver cómo arrancamos con el proyecto?","uid":"7a2ee20a896bdea6c26d63d5","email":"entidad@uned.es","nombre":"Entidad","apellidos":"UNED","rol":"ROL_ENTIDAD","fecha":"2020-08-27T17:43:34.655Z"},
            {"texto":"Gracias","uid":"24fdccde65b20086aecca9ac","email":"alumno@uned.es","nombre":"Alumno","apellidos":"UNED","rol":"ROL_ESTUDIANTE","fecha":"2020-08-26T03:01:04.887Z"},
            {"texto":"Bienvenidos!","uid":"54610501ecd753cee3aaaa08","email":"profesor@uned.es","nombre":"Profesor","apellidos":"UNED","rol":"ROL_PROFESOR","fecha":"2020-08-25T15:57:19.420Z"},
        ]),
        archivos: [
            generateRandomDocument('proyectos', getObjectId('proyecto:Acompañamiento de ancianos afectados por COVID-19'), getObjectId('entidad@uned.es')),
        ],
        proponedor: getObjectId('profesor@uned.es'),
        creador: getObjectId('profesor@uned.es'),

        createdAt: new Date(),
        updatedAt: new Date(),
    },

]