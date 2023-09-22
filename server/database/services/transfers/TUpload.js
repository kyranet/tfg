class TUpload{
    id;
    almacenamiento;
    campo;
    tipo;
    tipo_id;
    path;
    client_name;
    nombre;
    creador;
    createdAt;
    updatedAt;
    constructor(id, almacenamiento, campo, tipo, tipo_id, path, client_name, nombre, creador, createdAt, updatedAt){
        this.id = id;
        this.almacenamiento = almacenamiento;
        this.campo = campo;
        this.tipo = tipo;
        this.tipo_id = tipo_id;
        this.path = path;
        this.client_name = client_name;
        this.nombre = nombre;
        this.creador = creador;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getId(){
        return this.id;
    }
    setId(id_upload){
        this.id = id_upload;
    }
    getAlmacenamiento(){
        return this.almacenamiento;
    }
    setAlmacenamiento(almacenamiento_upload){
        this.almacenamiento = almacenamiento_upload;
    }
    getCampo(){
        return this.campo;
    }
    setCampo(campo_upload){
        this.campo = campo_upload;
    }
    getTipo(){
        return this.tipo;
    }
    setTipo(tipo_upload){
        this.tipo = tipo_upload;
    }
    getTipoId(){
        return this.tipo_id;
    }
    setTipoId(tipoId_upload){
        this.tipo_id = tipoId_upload;
    }
    getPath(){
        return this.path;
    }
    setPath(path_upload){
        this.path = path_upload;
    }
    getClientName(){
        return this.client_name;
    }
    setClientName(clientname_upload){
        this.client_name = clientname_upload;
    }
    getNombre(){
        return this.nombre;
    }
    setNombre(nombre_upload){
        this.nombre = nombre_upload;
    }
    getCreador(){
        return this.creador;
    }
    setCreador(creador_upload){
        this.creador = creador_upload;
    }
    getCreatedAt(){
        return this.createdAt;
    }
    setCreatedAt(createdat_upload){
        this.createdAt = createdat_upload;
    }
    getUpdatedAt(){
        return this.updatedAt;
    }
    setUpdatedAt(updatedat_upload){
        this.updatedAt = updatedat_upload;
    }
}
module.exports = TUpload;