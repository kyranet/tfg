var TUsuario =require("./TUsuario");
 class TEstudiante extends TUsuario{
    constructor(id,origin_login,origin_img,createdAt,updatedAt,terminos_aceptados){
    super(id,origin_login,origin_img,createdAt,updatedAt,terminos_aceptados);
    }

}

module.exports= TEstudiante;