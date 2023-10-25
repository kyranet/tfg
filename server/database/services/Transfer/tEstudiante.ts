import TUsuario from "./tUsuario";

class tEstudiante extends TUsuario{
    constructor(
        id: number,
        origin_login: string,
        origin_img: string,
        createdAt: Date,
        updatedAt: Date,
        terminos_aceptados: boolean
    ) {
        super(id, origin_login, origin_img, createdAt, updatedAt, terminos_aceptados);
    }
}

export default tEstudiante;
