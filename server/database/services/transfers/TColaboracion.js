class TColaboracion{
    id;
    titulo;
    descripcion;
    admite_externos;
    responsable;
    profesores;
    constructor(id, titulo, descripcion, admite_externos, responsable, profesores){
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.admite_externos = admite_externos;
        this.responsable = responsable;
        this.profesores = profesores;
    }
    getId(){
        return this.id;
    }
    setId(id_colab){
        this.id = id_colab;
    }
    getTitulo(){
        return this.titulo;
    }
    setTitulo(titulo_colab){
        this.titulo = titulo_colab;
    }
    getDescripcion(){
        return this.descripcion;
    }
    setDescripcion(descripcion_colab){
        this.descripcion = descripcion_colab;
    }
    getAdmite(){
        return this.admite_externos;
    }
    setAdmite(admite_colab){
        this.admite_externos = admite_colab;
    }
    getResponsable(){
        return this.responsable;
    }
    setResponsable(responsable_colab){
        this.responsable = responsable_colab;
    }
    getProfesores() {
        return this.profesores;
    }

    setProfesores(profesores) {
        this.profesores = profesores;
    }
    
}
module.exports = TColaboracion;