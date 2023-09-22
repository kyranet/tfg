import { environment } from '../../environments/environment';
import { Usuario } from './usuario.model';

import * as moment from 'moment';

const base_url = environment.base_url;

export class Notificacion{
    constructor(
        public id: string,
        public idDestino:string,
        public leido: string,
        public titulo:string,
        public mensaje:string,
        public fecha_fin:string,
        public emailOrigen:string,
        public idOferta:string,
        public tituloOferta:string,
        public pendiente:string,
        public idPartenariado:string,
        public idDemanda:string,
        public tituloDemanda:string,
    ){}

    get parsedDateCrear(){
        return moment(this.fecha_fin).format('DD-MM-YYYY');
    }

    
}