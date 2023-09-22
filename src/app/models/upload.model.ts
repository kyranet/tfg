import { environment } from '../../environments/environment';
import { Usuario } from './usuario.model';
import * as moment from 'moment';

const base_url = environment.base_url;

export class Upload {
    constructor(
        public _id: string,
        public almacenamiento: string,
        public campo: string,
        public tipo: string,
        public tipo_id: string,
        public path: string,
        public nombre: string,
        public client_name: string,
        public creador: Usuario,
        public createdAt: string,
    ) {}

    get parsedCreatedAt() {
        return moment(this.createdAt).format('YYYY-MM-DD HH:mm');
    }

    get url() {
        return `${ base_url }/upload/${ this._id }`;
    }

    get displayUsuario() {

        if(!this.creador) {
            return 'No logueado';
        }
        return `${ this.creador.nombre } ${ this.creador.apellidos } <${ this.creador.email }>` ;
    }
}


