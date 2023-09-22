const TColaboracion = require('./TColaboracion');
class TPartenariado extends TColaboracion {
    
    id_demanda;
    id_oferta;
    estado;

    constructor(id, titulo, descripcion, admite_externos, responsable, profesores, id_demanda, id_oferta, estado){
        super(id, titulo, descripcion, admite_externos, responsable, profesores);
        this.id_demanda = id_demanda;
        this.id_oferta = id_oferta;
        this.estado = estado;
    }
    getId_Demanda(){
        return this.id_demanda;
    }
    setId_Demanda(id_demanda_part){
        this.id_demanda = id_demanda_part;
    }
    getId_Oferta(){
        return this.id_oferta;
    }
    setId_Oferta(id_oferta_part){
        this.id_oferta = id_oferta_part;
    }
    getEstado(){
        return this.estado;
    }
    setEstado(estado_part){
        this.estado = estado_part;
    }
}
module.exports = TPartenariado;