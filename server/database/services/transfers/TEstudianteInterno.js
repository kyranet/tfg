const TEstudiante =require("./TEstudiante")
class TEstudianteInterno extends TEstudiante{

    constructor(id,correo,nombre,apellidos,password,origin_login,origin_img,createdAt,updatedAt,terminos_aceptados,titulacion_local,telefono){
        super(id,origin_login,origin_img,createdAt,updatedAt,terminos_aceptados);
        this.titulacion_local=titulacion_local;
        this.correo=correo;
        this.nombre=nombre;
        this.apellidos=apellidos;
        this.password=password;
        this.rol = "ROL_ESTUDIANTE";
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

    getTitulacionLocal(){
        return this.titulacion_local;
    }

    setTitulacionLocal(titulacion_local){
        this.titulacion_local=titulacion_local;
    }
}

module.exports= TEstudianteInterno;