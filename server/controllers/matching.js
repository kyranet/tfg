let fs = require('fs');
const path = require("path");
const dao_tentativa = require("./../database/services/daos/daoTentativa");
const dao_usuario = require("./../database/services/daos/daoUsuario");
const daoNotificacion = require("./../database/services/daos/daoNotificacion");
const daoOferta = require("./../database/services/daos/daoOferta");
const daoDemanda = require("./../database/services/daos/daoDemanda");
const transferOfertaServicio = require("../database/services/transfers/TOfertaServicio");
const transferDemandaServicio = require("../database/services/transfers/TDemandaServicio");
const { date } = require('faker');
const { compare } = require('bcryptjs');
var TProfesorInterno = require("../database/services/transfers/TProfesorInterno");
const { ConsoleReporter } = require('jasmine');


String.prototype.removeStopWords = function () {

    var word, stop_word, regex_str, regex, string_clean = this.valueOf().replace(/['!"#$%&\\'()\*+,\-\.\/:;<=>?@\[\\\]\^_`{|}~']/g, ""), data, stop_words;
    // data = fs.readFileSync(path.resolve(__dirname, "/../../palabras.txt'utf-8');
    var palabras_path = "/../../palabras.txt";
    data = fs.readFileSync(__dirname + palabras_path, 'utf-8');
    stop_words = (data.split("\r\n"));

    // Divide todas las palabras individuales de la frase
    words = string_clean.match(/[^\s]+|\s+[^\s+]$/g)

    for (let v of words) {
        for (let w of stop_words) {

            word = v.replace(/\s+|[^a-z]+/ig, "");
            stop_word = w;

            if (word.toLowerCase() == stop_word) {

                regex_str = "^\\s*" + stop_word + "\\s*$";
                regex_str += "|^\\s*" + stop_word + "\\s+";
                regex_str += "|\\s+" + stop_word + "\\s*$";
                regex_str += "|\\s+" + stop_word + "\\s+";
                regex = new RegExp(regex_str, "ig");

                string_clean = string_clean.replace(regex, " ");
            }
        }
    }
    return string_clean.replace(/^\s+|\s+$/g, "");
}

function matchingPNLDescription(descriptionDemanda, descriptionOferta) {
    let arrayMatchWords = [];
    let keywordsDemanda = descriptionDemanda.removeStopWords().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    let keywordsOferta = descriptionOferta.removeStopWords().normalize('NFD').replace(/[\u0300-\u036f]/g, "");;
    let arraykeywordsDemanda = keywordsDemanda.split(" ");
    let arraykeywordsOferta = keywordsOferta.split(" ");
    let count = 0;

    for (let i of arraykeywordsDemanda) {
        for (let j of arraykeywordsOferta) {
            if (i.toLowerCase() === j || j.toLowerCase() == i) {
                let word = arrayMatchWords.indexOf(i.toLowerCase());
                if (word === -1) {
                    arrayMatchWords.push(i);
                }

            }
        }
    }
    if (arraykeywordsDemanda.length <= arraykeywordsOferta.length) {
        count = arraykeywordsDemanda.length;
    }
    else {
        count = arraykeywordsOferta.length;
    }
    return arrayMatchWords.length / count;

}


async function emparejar(oferta, demanda){
    var areasServicio_demanda = demanda.getArea_servicio();
    console.log("Las areas de servicio de la demanda son ", areasServicio_demanda);
    var areasServicio_oferta = oferta.getArea_servicio();
    console.log("Las areas de servicio de la oferta son ", areasServicio_oferta);
    console.log(oferta.getCreador(),"bb")
    var creador = await dao_usuario.obtenerProfesorInterno(oferta.getCreador().id);
    var areasConocimiento = creador.getAreaConocimiento();
    var titulaciones_profesor = creador.getTitulacionLocal();
    console.log(titulaciones_profesor)
    var titulaciones_demanda = demanda.getTitulacionlocal_demandada();
    console.log(titulaciones_demanda)

    // Cambiar el nombre de las variables
    var comprobacionAreasServicioConocimiento 
    = await comprobarAreaServicioConocimiento(areasServicio_demanda, areasConocimiento);
    console.log("comprobacionAreasServicioConocimiento ", comprobacionAreasServicioConocimiento);
    
    var comprobacion_AreasServicioDemanda_TitulacionesProfesor
    = await comprobarAreaServicioTitulaciones(areasServicio_demanda, titulaciones_profesor);
    console.log("comprobacionAreasServicioDemanda titulaciones ",comprobacion_AreasServicioDemanda_TitulacionesProfesor);

    var comprobacion_AreasServicioOferta_TitulacionesDemanda
    = await comprobarAreaServicioTitulaciones(areasServicio_oferta, titulaciones_demanda);
    console.log("comprobacionAreasServiciooferta titulaciones ", comprobacion_AreasServicioOferta_TitulacionesDemanda);
    
    return (comprobacionAreasServicioConocimiento + comprobacion_AreasServicioDemanda_TitulacionesProfesor + comprobacion_AreasServicioOferta_TitulacionesDemanda)/3;
}
/*
Compara todas las areas de servicio de la demanda y de la oferta, y devuelve el número de coincidencias.
*/
function comprobarAreasServicio(areasOferta, areasDemanda){
    var coincidencias = 0;
    areasOferta.forEach(area1 =>{
        var i=0;
        var encontrado = false;
        while(i < areasDemanda.length && !encontrado){
            if(area1 === areasDemanda[i]){
                coincidencias++;
                areasDemanda.splice(i, 1);
                encontrado = true;
            }
            i++;
        }
    });
    return coincidencias;
}

/*
Devuelve la cantidad de titulaciones que coinciden de la oferta y la demanda.
*/
function comprobarTitulaciones(titulacionesOferta, titulacionesDemanda){
    var coincidencias = 0;
    var i;
    var max = titulacionesDemanda.length;
    titulacionesOferta.forEach(titulacion1 =>{
        i=0;
        var encontrado = false;
        while(i < titulacionesDemanda.length && !encontrado){
            if(titulacion1 === titulacionesDemanda[i]){
                coincidencias++;
                titulacionesDemanda.splice(i, 1);
                encontrado = true;
            }
            i++;
        }
    });
    return coincidencias/max;
}

function comprobarAreaServicioConocimiento(areasServicio, areasConocimiento){
    return dao_tentativa.obtenerAreaServicioConocimientoPorArea(areasServicio).then((result) =>{
        var coincidencias = 0;
        result.forEach(datos => {
        if(areasConocimiento.find(element => element === datos['area_conocimiento']) != undefined ){
            coincidencias++;
        }
        });
        if(coincidencias/areasServicio.length <= 1){
            return coincidencias/areasServicio.length;
        }
        else{
            return 1;
        }
        
    })
    .catch((err) => {
        console.log(err);
        console.log("Se ha producido un error al comprobar las areas de servicio y las de conocimiento");
      });
}

function comprobarAreaServicioTitulaciones(areasServicio, titulaciones){
    return dao_tentativa.obtenerAreaServicioTitulacionPorArea(areasServicio).then((result) =>{
        var coincidencias = 0;
        result.forEach(datos => {
        if(titulaciones.find(element => element === datos['titulacion']) != undefined ){
            coincidencias++;
        }
        });
        if(coincidencias/areasServicio.length <=1){
            return coincidencias/areasServicio.length;
        }
        else{
            return 1;
        }
        
    })
    .catch((err) => {
        console.log(err);
        console.log("Se ha producido un error al comprobar las areas de servicio y las titulaciones");
      });

}


function negociaciones(oferta, demanda){
    definicion_demanda = demanda.getPeriodo_definicion_ini();
    definicion_oferta = oferta.getFecha_limite();
    anio_academico = oferta.getAnio_academico();
    if(definicion_demanda > definicion_oferta){
        console.log("tarde");
        return -1000;//para que el peso sea mucho mayor y asi directamente sea el anti-match
    }
    else{
        //aqui habria que ver el mes de la fecha de fin para ver a que cuatrimestre corresponde
        ejecucion_demanda_ini = demanda.getPeriodo_ejecucion_ini();
        ejecucion_demanda_fin = demanda.getPeriodo_ejecucion_fin();
        if((anio_academico != ejecucion_demanda_ini.getFullYear()) && (anio_academico + 1 != ejecucion_demanda_ini.getFullYear())){
            console.log("no coinciden los años");
            console.log("año academico de la oferta", anio_academico);
            console.log("año academico de la demanda ", ejecucion_demanda_ini.getFullYear());
            console.log("Segunda mitad del año académico de la oferta", anio_academico+1);
            return -1000;
        }
        else if((anio_academico != ejecucion_demanda_fin.getFullYear()) && (anio_academico + 1 != ejecucion_demanda_fin.getFullYear())){
            console.log("no coinciden los años");
            return -1000;
        }
        // console.log("El proyecto empezaría ", ejecucion_demanda_ini);
        // console.log("El proyecto acabaría ", ejecucion_demanda_fin);
        if(ejecucion_demanda_ini.getMonth() >= 6 && ejecucion_demanda_ini.getMonth() < 8){
            console.log("Es verano");
            return -1000;//partiendo del hecho de que en verano no hay clases
        }
        else if((ejecucion_demanda_ini.getMonth() >= 1 && ejecucion_demanda_ini.getMonth() < 6) && ejecucion_demanda_fin.getMonth() < 6){
            console.log("Segundo cuatrimestre");
            if(oferta.getCuatrimestre() == 2){
                console.log("cuadra todo");
                return 1;
            }
            else {
                console.log("cuatrimestres no coinciden");
                return -1000;//Devuelvo 0 porque no lo considero anti matching, sino que se podría renegociar durante la propia etapa de partenariado
            }
        }
        else if(ejecucion_demanda_ini.getMonth() >= 8 && ((ejecucion_demanda_fin.getMonth() <= 11 && ejecucion_demanda_fin.getMonth() >= 8) || ejecucion_demanda_fin.getMonth() == 0)){
            console.log("Primer cuatrimestre");
            if(oferta.getCuatrimestre() == 1){
                console.log("cuadra todo");
                return 1;
            }
            else {
                console.log("cuatrimestres no coinciden");
                return -1000;//Devuelvo 0 porque no lo considero anti matching, sino que se podría renegociar durante la propia etapa de partenariado
            }
        }
        else {
            console.log("Anual")
            if(oferta.getCuatrimestre() == 3){//he tomado anual como el 3 debido a que cuatrimestre es un int
                console.log("cuadra todo");
                return 1;
            }
            else {
                console.log("cuatrimestres no coinciden");
                return -1000;//Devuelvo 0 porque no lo considero anti matching, sino que se podría renegociar durante la propia etapa de partenariado
            }
        }
    }
}

function matchDefinitivo(oferta, demanda, pesoFechas, pesoTitulaciones, pesoAreaServicio, pesoDescripcion, pesoTemp){
    compatibilidad = 0.0;
    compatibilidad =  (negociaciones(oferta, demanda)*pesoFechas);//Aqui va un peso 
    console.log("compatibilidad despues de las negociaciones ", compatibilidad);
    titulacionesDemanda = demanda.getTitulacionlocal_demandada();
    profesoresOferta = oferta.getProfesores();
    titulacionesOferta = [];
    profesoresOferta.forEach(prof=>{
        for(let item of prof["titulacion_local"])
        titulacionesOferta.push(item);
    });
    compatibilidad += (comprobarTitulaciones(titulacionesOferta, titulacionesDemanda)*pesoTitulaciones);//Aqui va otro peso
    console.log("compatibilidad despues de las titulaciones ", compatibilidad);
    return emparejar(oferta, demanda).then(function(coincidencias){
        compatibilidad = compatibilidad+(coincidencias*pesoAreaServicio);//Aqui otro peso
        console.log("compatibilidad despues de las Areas de servicio ", compatibilidad);
        descripcion_oferta = oferta.getDescripcion();
        descripcion_demanda = demanda.getDescripcion();
        compatibilidad += (matchingPNLDescription(descripcion_demanda, descripcion_oferta)*pesoDescripcion);//aqui otro peso
        console.log("compatibilidad despues de las descripciones ", compatibilidad);
        temp_oferta = oferta.getObservaciones_temporales();
        temp_demanda = demanda.getObservaciones_temporales();
        compatibilidad += (matchingPNLDescription(temp_demanda, temp_oferta)*pesoTemp);//aqui otro peso
        return compatibilidad;
    });
    
}

function hacerMatch(fichero,oferta, demanda){
    fs.readFile(fichero, 'utf8', (err, data)=>{
        valores = [];
        if (err) {
          console.error(err);
          return -1;
        }
        datos = data.split("\r\n"); 
        for(d of datos){
          //console.log(d)
          d = d.split(" ");
          //console.log(d[2]);
          valores.push(d[2]);
        }
        console.log(valores);
        return matchDefinitivo(oferta, demanda, valores[0], valores[1], valores[2], valores[3], valores[4]).then(async function(res){
    
            if(res.toFixed(2) >= 0.5){
                
                await dao_tentativa.crearMatch(oferta.getId(), demanda.getId(), res.toFixed(2)); //hacer funcion en DAO para insertar en tabla matching
                return daoNotificacion.crearNotificacionMatching(oferta.getId(),oferta.getCreador().id, demanda.getId());
            }
            else {
                console.log("No es match");
                return dao_tentativa.crearMatch(oferta.getId(), demanda.getId(), res.toFixed(2));
            }
        }); 
      })
    
}


module.exports = {
    comprobarAreasServicio,
    comprobarTitulaciones,
    comprobarAreaServicioConocimiento,
    comprobarAreaServicioTitulaciones,
    emparejar,
    matchingPNLDescription,
    negociaciones,
    matchDefinitivo,
    hacerMatch
}