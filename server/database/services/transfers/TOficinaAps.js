var TUsuario =require("./TUsuario");
class TOficinaAps extends TUsuario{

    constructor(id,correo,nombre,apellidos,password,origin_login,origin_img,createdAt,updatedAt,terminos_aceptados, telefono){
     super(id,origin_login,origin_img,createdAt,updatedAt,terminos_aceptados);
      this.correo=correo;
      this.nombre=nombre;
      this.apellidos=apellidos;
      this.password=password;
      this.telefono = telefono;
    }

    getTelefono(){
        return this.telefono;
     }
 
     setTelefono(telefono){
         this.telefono=telefono;
     }

     getNombre(){
       return this.nombre;
    }

    setNombre(nombre){
        this.nombre=nombre;
    }

    getCorreo(){
        return this.correo;
     }
 
     setCorreo(correo){
         this.correo=correo;
     }

     getApellidos(){
        return this.apellidos;
     }
   
     setApellidos(apellidos){
         this.apellidos=apellidos;
     }
     getPassword(){
        return this.password;
     }
 
     setPassword(password){
         this.password=password;
     } 

}

module.exports= TOficinaAps;