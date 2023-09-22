class TUsuario{
   
    constructor(id,origin_login,origin_img,createdAt,updatedAt,terminos_aceptados){
        this.id=id;
        this.origin_login=origin_login;
        this.origin_img=origin_img;
        this.createdAt=createdAt;
        this.updatedAt=updatedAt;
        this.terminos_aceptados=terminos_aceptados;
    }
    displayRol(){
        return "Profesor";
    }
    getId(){
        return this.id;
     }
 
     setId(id){
         this.id=id;
     }

  
     getOriginLogin(){
        return this.origin_login;
     }
 
     setOriginLogin(originL){
         this.origin_login=originL;
     }

     getOriginImg(){
        return this.origin_img;
     }
 
     setOriginImg(origin_img){
         this.origin_img=origin_img;
     }

     
     getCreatedAt(){
        return this.createdAt;
     }
 
     setCreatedAt(createdAt){
         this.createdAt=createdAt;
     }

     getUpdatedAt(){
     return this.updatedAt;
    }

    setUpdateAt(updatedAt){
        this.updatedAt=updatedAt;
    }

    getTermAcept(){
        return this.terminos_aceptados;
       }
   
    setTermAcept(term){
           this.terminos_aceptados=term;
     }
}

module.exports= TUsuario;