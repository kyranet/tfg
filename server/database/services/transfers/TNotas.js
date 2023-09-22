class TNotas{
   
    constructor(id,id_estudiante,nota,id_proyecto){
        this.id=id;
        this.id_estudiante=id_estudiante;
        this.nota=nota;
        this.id_proyecto=id_proyecto
    }

    getId(){
        return this.id;
    }
 
     setId(id){
         this.id=id;
    }

    getIdEstudiante(){
        return this.id_estudiante;
    }
 
     setIdEstudiante(id_estudiante){
         this.id_estudiante=id_estudiante;
    }

    getNota(){
        return this.nota;
    }
 
     setId(nota){
         this.nota=nota;
    }

    getIdProyecto(){
        return this.id_proyecto;
    }
 
     setIdProyecto(id_proyecto){
         this.id_proyecto=id_proyecto;
    }

}

module.exports= TNotas;