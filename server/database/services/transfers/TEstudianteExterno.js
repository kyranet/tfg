const TEstudiante = require("./TEstudiante")
class TEstudianteExterno extends TEstudiante {
    constructor(id, correo, nombre, apellidos, password, origin_login, origin_img, createdAt, updatedAt,
        terminos_aceptados, titulacion, nombreUniversidad, telefono) {
        super(id, origin_login, origin_img, createdAt, updatedAt, terminos_aceptados);
        this.correo = correo;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.password = password;
        this.titulacion = titulacion;
        this.nombreUniversidad = nombreUniversidad;
        this.rol = "ROL_ESTUDIANTE";
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

    getTitulacion() {
        return this.titulacion;
    }

    setTitulacion(titulacion) {
        this.titulacion = titulacion;
    }

    getnombreUniversidad() {
        return this.nombreUniversidad;
    }

    setnombreUniversidad(nombreUniversidad) {
        this.nombreUniversidad = nombreUniversidad;
    }
}


module.exports = TEstudianteExterno;