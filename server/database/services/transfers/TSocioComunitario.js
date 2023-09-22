var TUsuario = require("./TUsuario");

class TSocioComunitario extends TUsuario {

    constructor(id, correo, nombre, apellidos, password, origin_login, origin_img, createdAt, updatedAt, terminos_aceptados, sector, nombre_socioComunitario,telefono, url, mision) {
        super(id, origin_login, origin_img, createdAt, updatedAt, terminos_aceptados);
        this.correo = correo;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.password = password;
        this.sector = sector;
        this.nombre_socioComunitario = nombre_socioComunitario;
        this.rol = "ROL_SOCIO_COMUNITARIO";
        this.telefono = telefono;
        this.url = url;
        this.mision = mision;
    }

    getUrl() {
        return this.url;
    }

    setUrl(url) {
        this.url = url;
    }

    getMision() {
        return this.mision;
    }

    setMision(mision) {
        this.mision = mision;
    }

    getTelefono() {
        return this.telefono;
    }

    setTelefono(telefono) {
        this.telefono = telefono;
    }
    getNombre() {
        return this.nombre;
    }

    setNombre(nombre) {
        this.nombre = nombre;
    }

    getCorreo() {
        return this.correo;
    }

    setCorreo(correo) {
        this.correo = correo;
    }

    getApellidos() {
        return this.apellidos;
    }

    setApellidos(apellidos) {
        this.apellidos = apellidos;
    }
    getPassword() {
        return this.password;
    }

    setPassword(password) {
        this.password = password;
    }

    getSector() {
        return this.sector;
    }

    setSector(sector) {
        this.sector = sector;
    }

    getNombreSocioComunitario() {
        return this.nombre_socioComunitario;
    }

    setNombreSocioComunitario(nombre_socioComunitario) {
        this.nombre_socioComunitario = nombre_socioComunitario;
    }
}


module.exports = TSocioComunitario;
