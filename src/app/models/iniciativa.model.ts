import { environment } from '../../environments/environment';
import { Usuario } from './usuario.model';
import { Upload } from './upload.model';
import * as moment from 'moment';

const base_url = environment.base_url;

export class Iniciativa {

    constructor(
        public _id: string,
        public estado: string,
        public titulo: string,
        public descripcion: string,
        public imagen: string,
        public rama: string,
        public ciudad: string,
        public partenariados: string[],
        public archivos: Upload[],
        public proponedor: Usuario,
        public creador: Usuario,
        public createdAt: string,
    ) {}

    get parsedCreatedAt() {
        return moment(this.createdAt).format('DD-MM-YYYY');
    }


    get imagenUrl() {

        if(!this.imagen) {
            return `${ base_url }/upload/default/iniciativa`;
        }

        if(this.imagen.includes('https')) {
            return this.imagen;
        }

        return `${ base_url }/upload/${ this.imagen }/iniciativa`;
    }

    get displayCreadorRol() {

        if(!this.creador) {
            return '';
        }

        return this.displayUsuarioRol(this.creador);
    }

    get displayProponedorTableInfo() {

        if(!this.proponedor) {
            return '';
        }

        let info = [];
        if(this.proponedor.nombre) { info.push(this.proponedor.nombre); }
        if(this.proponedor.apellidos) { info.push(this.proponedor.apellidos); }

        return info.join(' ');
    }

    get displayProponedorRol() {

        if(!this.proponedor) {
            return '';
        }

        return this.displayUsuarioRol(this.proponedor);
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
                console.log('Iniciativa - Rol no definido', user);
                throw "Rol no definido";
                break;
        }
    }
}
