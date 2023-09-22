import { Usuario } from './usuario.model';
import * as moment from 'moment';

export class Mail {
    constructor(
        public type: string,
        public mail_from: string,
        public mail_name: string,
        public to: string,
        public subject: string,
        public html: string,
        public usuario: Usuario,
        public createdAt: string,
    ) {}


    get parsedCreatedAt() {
        return moment(this.createdAt).format('YYYY-MM-DD HH:mm');
    }

    get displayUsuario() {

        if(!this.usuario) {
            return 'No logueado';
        }
        return `${ this.usuario.nombre } ${ this.usuario.apellidos } <${ this.usuario.email }>` ;
    }

    get displayUsuarioRol() {

        if(!this.usuario) {
            return '';
        }
        switch (this.usuario.rol) {
            case 'ROL_ESTUDIANTE':
                return 'Estudiante';
            case 'ROL_PROFESOR':
                return 'Profesor';
            case 'ROL_ENTIDAD':
                return 'Entidad';
            case 'ROL_GESTOR':
                return 'Gestor';
            default:
                throw "Rol no definido";
        }
    }
}


