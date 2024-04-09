import type { Profesor } from './Profesor';

export interface ProfesorInterno extends Profesor {
	id: number;
	correo: string;
	nombre: string;
	apellidos: string;
	password: string;
	telefono: string;
	origin_login: string;
	origin_img: string;
	createdAt: Date;
	updatedAt: Date;
	terminos_aceptados: boolean;
	rol: string;
	area_conocimiento: string[];
	titulacion_local: string[];
}
