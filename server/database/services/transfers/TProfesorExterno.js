var TProfesor=require("./TProfesor");
class TProfesorExterno extends TProfesor{

    constructor(id,correo,nombre,apellidos,password,origin_login,origin_img,createdAt,updatedAt,terminos_aceptados,nombreUniversidad,facultad,area_conocimiento,telefono){
        super(id,origin_login,origin_img,createdAt,updatedAt,terminos_aceptados);
        this.correo=correo;
        this.nombre=nombre;
        this.apellidos=apellidos;
        this.password=password;
        this.nombreUniversidad=nombreUniversidad;
        this.facultad=facultad;
        this.area_conocimiento=area_conocimiento;
        this.rol = "ROL_PROFESOR";
        this.telefono = telefono;
    }

    getTelefono(){
        return this.telefono;
     }
 
     setTelefono(telefono){
         this.telefono=telefono;
     }

    getAreaConocimiento(){
        return this.area_conocimiento;
     }

     getFacultad(){
         return this.facultad;
     }
 
    getnombreUniversidad(){
        return this.nombreUniversidad;
    }

    setnombreUniversidad(nombreUniversidad){
        this.nombreUniversidad=nombreUniversidad;
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
module.exports= TProfesorExterno;