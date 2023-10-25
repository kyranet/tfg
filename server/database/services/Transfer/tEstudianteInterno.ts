import TEstudiante from "./tEstudiante";

class TEstudianteInterno extends TEstudiante {
    private correo: string;
    private nombre: string;
    private apellidos: string;
    private password: string;
    private titulacion_local: string;
    private telefono: string;
    private rol: string;

    constructor(
        id: number,
        correo: string,
        nombre: string,
        apellidos: string,
        password: string,
        origin_login: string,
        origin_img: string,
        createdAt: Date,
        updatedAt: Date,
        terminos_aceptados: boolean,
        titulacion_local: string,
        telefono: string
    ) {
        super(id, origin_login, origin_img, createdAt, updatedAt, terminos_aceptados);
        this.titulacion_local = titulacion_local;
        this.correo = correo;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.password = password;
        this.rol = "ROL_ESTUDIANTE";
        this.telefono = telefono;
    }

    getTelefono(): string {
        return this.telefono;
    }

    setTelefono(telefono: string): void {
        this.telefono = telefono;
    }
    
    getNombre(): string {
        return this.nombre;
    }

    setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    getCorreo(): string {
        return this.correo;
    }

    setCorreo(correo: string): void {
        this.correo = correo;
    }

    getApellidos(): string {
        return this.apellidos;
    }

    setApellidos(apellidos: string): void {
        this.apellidos = apellidos;
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(password: string): void {
        this.password = password;
    }

    getTitulacionLocal(): string {
        return this.titulacion_local;
    }

    setTitulacionLocal(titulacion_local: string): void {
        this.titulacion_local = titulacion_local;
    }
}

export default TEstudianteInterno;
