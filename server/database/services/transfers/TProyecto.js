const TColaboracion = require('./TColaboracion');
class TProyecto extends TColaboracion {
    id;
    id_partenariado;
    estado;
    estudiantes;
    constructor(id, titulo, descripcion, admite_externos, responsable, profesores, id_partenariado, estado, estudiantes){
        super(id, titulo, descripcion, admite_externos, responsable, profesores);
        this.id = id;
        this.id_partenariado = id_partenariado;
        this.estado = estado;
        this.estudiantes = estudiantes;
    }

    getId(){
        return this.id;
    }

    getId_Partenariado(){
        return this.id_partenariado;
    }
    setId_Partenariado(id_partenariado_pro){
        this.id_partenariado = id_partenariado_pro;
    }
    getEstado(){
        return this.estado;
    }
    setEstado(estado_pro){
        this.estado = estado_pro;
    }
    
    getEstudiantes() {
        return this.estudiantes;
    }

    setEstudiantes(estudiantes) {
        this.estudiantes = estudiantes;
    }
}
module.exports = TProyecto;