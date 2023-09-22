const { getObjectId, generateRandomDocument } = require("../../helpers");

module.exports = [
    {
        _id: getObjectId('partenariado:Portal ApS en las universidades españolas'),
        estado: 'Acordado',
        titulo: 'Portal ApS en las universidades españolas',
        descripcion: 'Proyecto de creación de un portal para el ApS en las universidades españolas',
        rama: 'Arquitectura e Ingeniería',
        ciudad: 'Virtual',
        iniciativa: getObjectId('iniciativa:Portal ApS en las universidades españolas'),
        proyecto: getObjectId('proyecto:Portal ApS en las universidades españolas'),
        profesores: [getObjectId('profesor@uned.es')],
        entidades: [getObjectId('entidad@externo.es')],
        mensajes: [

        ],
        archivos: [],
        proponedor: getObjectId('entidad@externo.es'),
        creador: getObjectId('profesor@uned.es'),

        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        _id: getObjectId('partenariado:Español en vivo'),
        estado: 'En negociación',
        titulo: 'Español en vivo',
        descripcion: 'Español en vivo',
        rama: 'Artes y Humanidades',
        ciudad: 'Barcelona',
        iniciativa: getObjectId('iniciativa:Español en vivo'),
        profesores: [getObjectId('profesor@externo.es')],
        entidades: [getObjectId('entidad@externo.es')],
        mensajes: [
            {"texto":"Gracias por respaldar esta iniciativa. ¿Podríamos realizar una videollamada en la fecha que a usted más le convenga? \n\nUn saludo.","uid":"a6bbbd7a55ac6de8b11e0001","email":"entidad@externo.es","nombre":"Entidad","apellidos":"Externo","rol":"ROL_ENTIDAD","fecha":"2020-08-27T17:35:49.063Z"},
            {"texto":"Hola,\n\neste es el comienzo del partenariado. Mi nombre es Profesor Externo, y me gustaría plantear este proyecto conforme a unas directrices de mi asignatura.","uid":"fbc601b8152f4de85377985b","email":"profesor@externo.es","nombre":"Profesor","apellidos":"Externo","rol":"ROL_PROFESOR","fecha":"2020-08-27T17:34:52.733Z"},
        ],
        archivos: [],
        proponedor: getObjectId('profesor@externo.es'),
        creador: getObjectId('profesor@externo.es'),

        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        _id: getObjectId('partenariado:Acompañamiento de ancianos afectados por COVID-19'),
        estado: 'Acordado',
        titulo: 'Acompañamiento de ancianos afectados por COVID-19',
        descripcion: 'Acompañamiento de ancianos afectados por COVID-19',
        rama: 'Artes y Humanidades',
        ciudad: 'Valencia',
        iniciativa: getObjectId('iniciativa:Acompañamiento de ancianos afectados por COVID-19'),
        proyecto: getObjectId('proyecto:Acompañamiento de ancianos afectados por COVID-19'),
        profesores: [getObjectId('profesor@uned.es')],
        entidades: [getObjectId('entidad@uned.es')],
        mensajes: [
            {"texto":"¡Adelante! Muchas gracias a ambos, estamos deseosos de empezar este proyecto con ustedes.","uid":"7a2ee20a896bdea6c26d63d5","email":"entidad@uned.es","nombre":"Entidad","apellidos":"UNED","rol":"ROL_ENTIDAD","fecha":"2020-08-27T17:41:33.994Z"},
            {"texto":"Muchas gracias Gestor. Me parece muy interesante. Si a la Entidad le parece correcto, procedo a crear el proyecto desde este partenariado. Saludos.","uid":"54610501ecd753cee3aaaa08","email":"profesor@uned.es","nombre":"Profesor","apellidos":"UNED","rol":"ROL_PROFESOR","fecha":"2020-08-27T17:40:59.394Z"},
            {"texto":"Hola, soy el Gestor del Portal. He decidido respaldar la iniciativa por mi cuenta, y asignarles el proyecto a ambos, porque creo que la idea puede encajar tanto para la entidad como para el profesor. Espero que les sea de ayuda hablar de la iniciativa en este partenariado. Un saludo.","uid":"f1772f20f18aa97c1ba3617c","email":"gestor@uned.es","nombre":"Gestor","apellidos":"Portal","rol":"ROL_GESTOR","fecha":"2020-08-27T17:40:10.165Z"}
        ],
        archivos: [
            generateRandomDocument('partenariados', getObjectId('partenariado:Acompañamiento de ancianos afectados por COVID-19'), getObjectId('entidad@uned.es')),
            generateRandomDocument('partenariados', getObjectId('partenariado:Acompañamiento de ancianos afectados por COVID-19'), getObjectId('entidad@uned.es')),
        ],
        proponedor: getObjectId('profesor@uned.es'),
        creador: getObjectId('profesor@uned.es'),

        createdAt: new Date(),
        updatedAt: new Date(),
    },


]