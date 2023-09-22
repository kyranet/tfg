var TProfesor = require("./TProfesor");
class TProfesorInterno extends TProfesor {

    constructor(id, correo, nombre, apellidos, password, origin_login, origin_img, createdAt, updatedAt, terminos_aceptados, area_conocimiento, titulacion_local, telefono) {
        super(id, origin_login, origin_img, createdAt, updatedAt, terminos_aceptados);
        this.area_conocimiento = area_conocimiento;
        this.titulacion_local = titulacion_local;
        this.correo = correo;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.password = password;
        this.rol = "ROL_PROFESOR";
        this.telefono = telefono;
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
    getAreaConocimiento() {
        return this.area_conocimiento;
    }

    setPassword(area_conocimiento) {
        this.area_conocimiento = area_conocimiento;
    }
    getTitulacionLocal() {
        return this.titulacion_local;
    }

    setPassword(titulacion_local) {
        this.titulacion_local = titulacion_local;
    }
}

module.exports = TProfesorInterno;