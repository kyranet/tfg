class TMensajes {
    id;
    texto;
    fecha;
    usuario;
    nombre_user;
    constructor(id, texto, fecha, usuario, nombre_user){
        this.id = id;
        this.texto = texto;
        this.fecha = fecha;
        this.usuario = usuario;
        this.nombre_user = nombre_user;
    }
    getId(){
        return this.id;
    }
    setId(id_mensaje){
        this.id = id_mensaje;
    }
    getTexto(){
        return this.texto;
    }
    setTexto(texto_mensaje){
        this.texto = texto_mensaje;
    }
    getFecha(){
        return this.fecha;
    }
    setFecha(fecha_mensaje){
        this.fecha = fecha_mensaje;
    }
    getUsuario(){
        return this.usuario;
    }
    setUsuario(usuario_mensaje){
        this.usuario = usuario_mensaje;
    }
    getNombreUser(){
        return this.nombre_user;
    }
    setNombreUser(Nombre_user){
        this.nombre_user = Nombre_user;
    }
}
module.exports = TMensajes