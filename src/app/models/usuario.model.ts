import { environment } from '../../environments/environment';
 

const base_url = environment.base_url;


export class Usuario {

    constructor(
        public uid: string,
        public rol: string,
        public email: string,
        public nombre: string,
        public apellidos: string,
        public origin_login: string,
        public origin_img?: string,
        public universidad?: string,
        public titulacion?: string,
        public sector?: string,
        public facultad?: string,
        public areaConocimiento?: Array<Object>,
        public nombreSocioComunitario?:String,
        public terminos_aceptados?: boolean,
        public telefono?: Number,
        public url?: string,
        public mision?: string,
        public avatar?: string
    ) {}

    get imagenUrl() {

        if(!this.origin_img) {
            return `${ base_url }/upload/default/avatar`;
        }

        if(this.origin_img.includes('https')) {
            return this.origin_img;
        } 

        return `${ base_url }/photos/${ this.origin_img }`;
    }

    get additionalInfoArray() {

        let info = [];

        if(['ROL_ESTUDIANTE', 'ROL_PROFESOR', 'ROL_GESTOR'].includes(this.rol)) {
            if(this.universidad && this.universidad !== '') { info.push(this.universidad); }
            if(this.titulacion && this.titulacion !== '') { info.push(this.titulacion); }
        }

        if(['ROL_SOCIO_COMUNITARIO', 'ROL_GESTOR'].includes(this.rol)) {
            if(this.sector && this.sector !== '') { info.push(this.sector); }
            if(this.url && this.url !== '') { info.push(this.url); }
            if(this.mision && this.mision !== '') { info.push(this.mision); }
            if(this.nombreSocioComunitario && this.nombreSocioComunitario !== '') { info.push(this.nombreSocioComunitario); }
        }

        return info;
    }


    get additionalInfo() {
        return this.additionalInfoArray.join('<br>');
    }

    get additionalInfoPlain() {
        return this.additionalInfoArray.join(' ');
    }

    get displayRol() {
        switch (this.rol) {
            case 'ROL_ESTUDIANTE':
                return 'Estudiante';
            case 'ROL_PROFESOR':
                return 'Profesor';
            case 'ROL_SOCIO_COMUNITARIO':
                return 'Socio comunitario';
            case 'ROL_GESTOR':
                return 'Gestor';
            default:
                console.log('Usuario - Rol no definido', this);
                throw "Rol no definido";
        }
    }

    get esGestor() {
        return ['ROL_GESTOR'].includes(this.rol);
    }

    get esEstudiante() {
        return ['ROL_ESTUDIANTE'].includes(this.rol);
    }

    get esProfesor() {
        return ['ROL_PROFESOR'].includes(this.rol);
    }

    get esSocioComunitario() {
        return ['ROL_SOCIO_COMUNITARIO'].includes(this.rol);
    }
}
