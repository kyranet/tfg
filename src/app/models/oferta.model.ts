import { environment } from '../../environments/environment';
import { Usuario } from './usuario.model';
import { CUATRIMESTRE } from './cuatrimestre.model';

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
        public tags: string[]
    ) {
    }

    get parsedCreatedAt() {
        return moment(this.created_at).format('DD-MM-YYYY');
    }

    get parsedDateLimit() {
        return moment(this.fecha_limite).format('DD-MM-YYYY');
    }


    get imagenUrl() {

        if (!this.imagen) {
            return `${base_url}/upload/default/oferta`;
        }

        if (this.imagen.includes('https')) {
            return this.imagen;
        }

        return `${base_url}/upload/${this.imagen}/oferta`;
    }

    get displayProponedorTableInfo() {

        if (!this.creador) {
            return '';
        }

        let info = [];
        if (this.creador.nombre) {
            info.push(this.creador.nombre);
        }
        if (this.creador.apellidos) {
            info.push(this.creador.apellidos);
        }

        return info.join(' ');
    }

    get displayCreadorRol() {

        if (!this.creador) {
            return '';
        }

        return this.displayUsuarioRol(this.creador);
    }


    displayUsuarioRol(user: Usuario) {

        if (!user) {
            return '';
        }
        switch (user.rol) {
            case 'ROL_ESTUDIANTE':
                return 'Estudiante';
            case 'ROL_PROFESOR':
                return 'Profesor';
            case 'ROL_SOCIO_COMUNITARIO':
                return 'Socio comunitario';
            case 'ROL_GESTOR':
                return 'Gestor';
            default:
                console.log('oferta - Rol no definido', user);
                throw 'Rol no definido';
        }
    }

    get displayCuatrimestre(): string {
        return Number.parseInt(this.cuatrimestre, 0) <= CUATRIMESTRE.length ? CUATRIMESTRE[Number.parseInt(this.cuatrimestre, 0) - 1] : 'Anual';
    }
}
