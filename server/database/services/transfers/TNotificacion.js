class TNotificacion{
    id;
    idDestino;
    leido;
    titulo;
    mensaje;
    fecha_fin;
    emailOrigen;
    idOferta;
    tituloOferta;
    idDemanda;
    tituloDemanda;
    pendiente;
    idPartenariado;
    idMatching;
    constructor(id, idDestino, leido, titulo, mensaje, fecha_fin, emailOrigen, idOferta, tituloOferta, pendiente, idPartenariado, idDemanda, tituloDemanda){
        this.id=id;
        this.idDestino=idDestino;
        this.leido=leido;
        this.titulo = titulo;
        this.mensaje= mensaje;
        this.fecha_fin = fecha_fin;
        this.emailOrigen = emailOrigen;
        this.idOferta = idOferta;
        this.tituloOferta = tituloOferta;
        this.idDemanda = idDemanda;
        this.tituloDemanda = tituloDemanda;
        this.pendiente = pendiente;
        this.idPartenariado = idPartenariado;
    }

    getId(){
        return this.id;
    }
    setId(id){
        this.id=id;
    }
    getIdDestino(){
        return this.idDestino;
    }
    setIdDestino(idDestino){
        this.idDestino = idDestino;
    }
    getLeido(){
        return this.leido;
    }
    setLeido(leido){
        this.leido = leido;
    }
}

module.exports = TNotificacion