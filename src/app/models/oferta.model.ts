import { environment } from '../../environments/environment';
import { Usuario } from './usuario.model';
import { Upload } from './upload.model';
import * as moment from 'moment';

const base_url = environment.base_url;

export class Oferta {

    constructor(
        public id: string,
        public titulo: string,
        public descripcion: string,
        public imagen: string,
        public created_at: string,
        public updated_at: string,
        public cuatrimestre: string,
        public anio_academico: string,
        public fecha_limite: string,
        public observaciones: string,
        public creador: Usuario,
        public area_servicio: string[],
        public asignatura_objetivo: string[],
        public profesores: string[],
    ) {}

    get parsedCreatedAt() {
        return moment(this.created_at).format('DD-MM-YYYY');
    }


    get imagenUrl() {

        if(!this.imagen) {
            return `${ base_url }/upload/default/oferta`;
        }

        if(this.imagen.includes('https')) {
            return this.imagen;
        }

        return `${ base_url }/upload/${ this.imagen }/oferta`;
    }

    get displayProponedorTableInfo() {

        if(!this.creador) {
            return '';
        }

        let info = [];
        if(this.creador.nombre) { info.push(this.creador.nombre); }
        if(this.creador.apellidos) { info.push(this.creador.apellidos); }

        return info.join(' ');
    }

    get displayCreadorRol() {

        if(!this.creador) {
            return '';
        }

        return this.displayUsuarioRol(this.creador);
    }



    displayUsuarioRol(user: Usuario) {

        if(!user) {
            return '';
        }
        switch (user.rol) {
            case 'ROL_ESTUDIANTE':
                return 'Estudiante';
                break;

            case 'ROL_PROFESOR':
                return 'Profesor';
                break;

            case 'ROL_SOCIO_COMUNITARIO':
                return 'Socio comunitario';
                break;

            case 'ROL_GESTOR':
                return 'Gestor';
                break;

            default:
                console.log('oferta - Rol no definido', user);
                throw "Rol no definido";
                break;
        }
    }
}
